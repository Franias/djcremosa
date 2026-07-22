"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { loadPlayhtml } from "@/lib/playhtml";
import {
  composShareStoryImage,
  drawGraffitiStroke,
  EMPTY_GRAFFITI_DATA,
  generateGraffitiAuthorId,
  GRAFFITI_AUTHOR_KEY,
  GRAFFITI_COLORS,
  GRAFFITI_DATA_CHANNEL,
  GRAFFITI_PRESENCE_CHANNEL,
  GRAFFITI_SIZE_DEFAULT,
  GRAFFITI_SIZE_MAX,
  GRAFFITI_SIZE_MIN,
  GRAFFITI_SIZE_STEP,
  MAX_GRAFFITI_POINTS,
  MAX_GRAFFITI_PREVIEW_POINTS,
  MAX_GRAFFITI_STROKES,
  MAX_STROKES_PER_MINUTE,
  sanitizeGraffitiData,
  sanitizeGraffitiPreview,
  type GraffitiDataChannel,
  type GraffitiPoint,
  type GraffitiPreview,
  type GraffitiStroke,
} from "@/lib/graffiti";

const POINTER_HINT_OFFSET = 18;
const POINTER_HINT_BOTTOM_GUTTER = 96;
const PRESENCE_THROTTLE_MS = 60;

type PointerPosition = { x: number; y: number };

function readAuthorId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    const existing = window.localStorage.getItem(GRAFFITI_AUTHOR_KEY);
    if (existing && existing.length >= 6) return existing;
    const next = generateGraffitiAuthorId();
    window.localStorage.setItem(GRAFFITI_AUTHOR_KEY, next);
    return next;
  } catch {
    return "anon";
  }
}

function clampUnit(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function toNormalizedPoint(clientX: number, clientY: number): GraffitiPoint {
  return [
    clampUnit(clientX / Math.max(1, window.innerWidth)),
    clampUnit(clientY / Math.max(1, window.innerHeight)),
  ];
}

function mergeStrokes(
  current: GraffitiStroke[],
  incoming: GraffitiStroke[],
): GraffitiStroke[] {
  const byId = new Map(current.map((stroke) => [stroke.id, stroke]));
  incoming.forEach((stroke) => byId.set(stroke.id, stroke));
  return [...byId.values()]
    .sort((left, right) => left.createdAt - right.createdAt)
    .slice(-MAX_GRAFFITI_STROKES);
}

function isEditableTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    Boolean(
      target.closest(
        "input, textarea, select, [contenteditable=\"true\"], [role=\"textbox\"]",
      ),
    )
  );
}

function makeStroke(
  point: GraffitiPoint,
  color: string,
  size: number,
  author: string,
): GraffitiStroke {
  return {
    id: `graffiti-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    author,
    points: [point],
    color,
    size,
    seed: Math.floor(Math.random() * 2_147_483_647),
    createdAt: Date.now(),
  };
}

export function GraffitiRuntime() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataChannelRef = useRef<GraffitiDataChannel | null>(null);
  const clientRef = useRef<Awaited<ReturnType<typeof loadPlayhtml>>>(null);
  const modeRef = useRef(false);
  const currentStrokeRef = useRef<GraffitiStroke | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const lastPresenceAtRef = useRef(0);
  const strokeTimesRef = useRef<number[]>([]);
  // Read the persistent per-browser author id during module init and
  // mirror it through a ref so callbacks (which run outside render) see
  // the same value without an extra effect. The visible `authorId` state
  // exists so eraser-related UI can react to manual identity resets.
  const authorIdRef = useRef<string>(readAuthorId());
  const strokeIdRef = useRef<number>(0);

  const [mode, setMode] = useState(false);
  const [strokes, setStrokes] = useState<GraffitiStroke[]>([]);
  const [activeStroke, setActiveStroke] = useState<GraffitiStroke | null>(null);
  const [remotePreviews, setRemotePreviews] = useState<GraffitiPreview[]>([]);
  const [color, setColor] = useState<string>(GRAFFITI_COLORS[1]);
  const [size, setSize] = useState<number>(GRAFFITI_SIZE_DEFAULT);
  const [authorId] = useState<string>(() => readAuthorId());
  const [pointer, setPointer] = useState<PointerPosition>({ x: 0, y: 0 });
  const [pointerReady, setPointerReady] = useState(false);
  const [realtimeReady, setRealtimeReady] = useState(false);
  const [canvasResizeVersion, setCanvasResizeVersion] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);

  const toggleMode = useCallback(() => {
    if (modeRef.current) {
      currentStrokeRef.current = null;
      activePointerIdRef.current = null;
      setActiveStroke(null);
    }
    setMode((current) => !current);
  }, []);

  // Keep the keyboard shortcut global, but never hijack a user's text input.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() !== "g" ||
        event.repeat ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isEditableTarget(event.target)
      ) {
        return;
      }
      event.preventDefault();
      toggleMode();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleMode]);

  // BE NICE! reminder: shown while graffiti mode is active, hidden when
  // the user exits. Sits inside the same Win95 toolbar aesthetic so it
  // reads as a chrome label rather than a celebratory overlay.
  useEffect(() => {
    if (mode) {
      // Defer one frame to keep React happy with non-synchronous
      // setState inside an effect body.
      const showTimer = window.setTimeout(() => {
        setNotice("BE NICE!");
      }, 0);
      return () => window.clearTimeout(showTimer);
    }
    const hideTimer = window.setTimeout(() => {
      setNotice((current) => (current === "BE NICE!" ? null : current));
    }, 0);
    return () => window.clearTimeout(hideTimer);
  }, [mode]);

  // The label follows the pointer so the shortcut reads like a cursor hint.
  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      setPointer({ x: event.clientX, y: event.clientY });
      setPointerReady(true);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  // Stable unique prefix reused per stroke id within this session. We
  // snapshot Date.now() once via lazy state initializer so the value
  // is stable for the lifetime of the component; combining it with a
  // per-stroke counter guarantees collision-free ids without leaking
  // authorship into the id string.
  const [strokeIdPrefix] = useState<string>(
    () => `${authorId}-${Date.now().toString(36)}`,
  );

  // Reflect the mode in the body for the custom spray-can cursor and CSS.
  useEffect(() => {
    modeRef.current = mode;
    if (mode) {
      document.body.setAttribute("data-graffiti-mode", "true");
    } else {
      document.body.removeAttribute("data-graffiti-mode");
      currentStrokeRef.current = null;
      activePointerIdRef.current = null;
    }

    return () => document.body.removeAttribute("data-graffiti-mode");
  }, [mode]);

  // Subscribe once to the shared persistent mural and ephemeral live strokes.
  useEffect(() => {
    let cancelled = false;
    let unsubscribeData: (() => void) | null = null;
    let unsubscribePresence: (() => void) | null = null;

    void loadPlayhtml().then((client) => {
      if (!client || cancelled) return;
      clientRef.current = client;

      const channel = client.createPageData(
        GRAFFITI_DATA_CHANNEL,
        EMPTY_GRAFFITI_DATA,
      ) as GraffitiDataChannel;
      dataChannelRef.current = channel;

      const updateData = (data: unknown) => {
        if (cancelled) return;
        setStrokes(sanitizeGraffitiData(data).strokes);
      };
      updateData(channel.getData());
      unsubscribeData = channel.onUpdate(updateData);

      unsubscribePresence = client.presence.onPresenceChange(
        GRAFFITI_PRESENCE_CHANNEL,
        (presences) => {
          if (cancelled) return;
          const next = [...presences.values()]
            .map((presence) => sanitizeGraffitiPreview(presence))
            .filter((preview): preview is GraffitiPreview => preview !== null);
          const currentId = currentStrokeRef.current?.id;
          setRemotePreviews(
            next.filter((preview) => preview.id !== currentId),
          );
        },
      );
      client.presence.setMyPresence(GRAFFITI_PRESENCE_CHANNEL, null);
      setRealtimeReady(true);
    });

    return () => {
      cancelled = true;
      try {
        clientRef.current?.presence.setMyPresence(
          GRAFFITI_PRESENCE_CHANNEL,
          null,
        );
      } catch {
        // A closed websocket is already the desired cleanup state.
      }
      unsubscribeData?.();
      unsubscribePresence?.();
      dataChannelRef.current?.destroy();
      dataChannelRef.current = null;
      clientRef.current = null;
    };
  }, []);

  // Resize at the device pixel ratio, but cap it so mobile spray remains cheap.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = (requestRedraw: boolean) => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, window.innerWidth);
      const height = Math.max(1, window.innerHeight);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.dataset.pixelRatio = String(ratio);
      if (requestRedraw) {
        setCanvasResizeVersion((version) => version + 1);
      }
    };

    const onResize = () => resize(true);
    resize(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Draw both the durable mural and all live spray tails after each update.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const ratio = Number(canvas.dataset.pixelRatio ?? 1);
    const width = window.innerWidth;
    const height = window.innerHeight;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    strokes.forEach((stroke) =>
      drawGraffitiStroke(context, stroke, width, height),
    );
    remotePreviews.forEach((preview) =>
      drawGraffitiStroke(context, preview, width, height),
    );
    if (activeStroke) {
      drawGraffitiStroke(context, activeStroke, width, height);
    }
  }, [activeStroke, canvasResizeVersion, remotePreviews, strokes]);

  const publishPreview = useCallback((stroke: GraffitiStroke) => {
    const now = Date.now();
    if (now - lastPresenceAtRef.current < PRESENCE_THROTTLE_MS) return;
    lastPresenceAtRef.current = now;

    try {
      clientRef.current?.presence.setMyPresence(GRAFFITI_PRESENCE_CHANNEL, {
        id: stroke.id,
        active: true,
        author: stroke.author,
        points: stroke.points.slice(-MAX_GRAFFITI_PREVIEW_POINTS),
        color: stroke.color,
        size: stroke.size,
        seed: stroke.seed,
      });
    } catch {
      // Local painting remains useful when the realtime service is offline.
    }
  }, []);

  const finishStroke = useCallback((stroke: GraffitiStroke) => {
    const now = Date.now();
    strokeTimesRef.current = strokeTimesRef.current.filter(
      (timestamp) => now - timestamp < 60_000,
    );
    if (strokeTimesRef.current.length >= MAX_STROKES_PER_MINUTE) {
      setNotice("limite local atingido · tente de novo em instantes");
      return;
    }
    strokeTimesRef.current.push(now);

    setStrokes((current) => mergeStrokes(current, [stroke]));
    try {
      dataChannelRef.current?.setData((draft) => {
        draft.strokes.push(stroke);
        while (draft.strokes.length > MAX_GRAFFITI_STROKES) {
          draft.strokes.shift();
        }
      });
      clientRef.current?.presence.setMyPresence(
        GRAFFITI_PRESENCE_CHANNEL,
        null,
      );
    } catch {
      setNotice("mural local · conexão em pausa");
    }
  }, []);

  // Shared download + native share helper used by both the SHARE
  // (landscape) and STORY (9:16 portrait) exports.
  const deliverBlob = useCallback(async (blob: Blob, filename: string, dataUrl: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setNotice(`PNG salvo · ${filename}`);
    const file = new File([blob], filename, { type: "image/png" });
    const nav = navigator as Navigator & {
      canShare?: (data?: ShareData) => boolean;
      share?: (data?: ShareData) => Promise<void>;
    };
    if (typeof nav.canShare === "function" && nav.canShare({ files: [file] })) {
      try {
        await nav.share({
          files: [file],
          title: "Cremosa · graffiti",
          text: dataUrl,
        });
      } catch {
        // User dismissed the share sheet — nothing to do.
      }
    }
  }, []);

  // Share the current mural as a Win95-styled PNG in Instagram Story
  // format (9:16 portrait). The single SHARE button always produces the
  // Story composition so the exported file is drop-in ready for Stories
  // *and* downloads to disk via a hidden <a download> element and
  // (when available) hands the file to the OS-level share sheet so
  // mobile users can drop it straight into Instagram Stories / Snapchat.
  const sharePng = useCallback(async () => {
    const source = canvasRef.current;
    if (!source) {
      setNotice("canvas ainda não está pronto");
      return;
    }
    try {
      const { blob, filename, dataUrl } = await composShareStoryImage(source, {
        title: "graffiti.exe · CREMOSA",
      });
      await deliverBlob(blob, filename, dataUrl);
    } catch (error) {
      console.warn("[cremosa] share failed", error);
      setNotice("falha ao gerar PNG · tente de novo");
    }
  }, [deliverBlob]);

  // Per-user eraser: removes only the strokes painted by the current
  // browser. Other visitors' graffiti stays untouched.
  const eraseOwnStrokes = useCallback(() => {
    const author = authorIdRef.current;
    let removed = 0;
    setStrokes((current) => {
      const next = current.filter((stroke) => stroke.author !== author);
      removed = current.length - next.length;
      return next;
    });
    try {
      // Mutator form is what playhtml's SyncedStore supports; we splice
      // entries from the tail so the underlying Y.Array indices stay
      // stable across collaborators while we walk backwards.
      dataChannelRef.current?.setData((draft) => {
        for (let index = draft.strokes.length - 1; index >= 0; index -= 1) {
          const stroke = draft.strokes[index];
          if (stroke && stroke.author === author) {
            draft.strokes.splice(index, 1);
            removed += 1;
          }
        }
      });
      setNotice(
        removed > 0
          ? `${removed} traço${removed === 1 ? "" : "s"} apagado${removed === 1 ? "" : "s"}`
          : "nada pra apagar",
      );
    } catch {
      setNotice("apagamento local · conexão em pausa");
    }
  }, []);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>) => {
      if (!modeRef.current || activePointerIdRef.current !== null) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      event.preventDefault();

      strokeIdRef.current += 1;
      const id = `graffiti-${strokeIdPrefix}-${strokeIdRef.current.toString(36)}`;
      const stroke: GraffitiStroke = {
        ...makeStroke(
          toNormalizedPoint(event.clientX, event.clientY),
          color,
          size,
          authorIdRef.current,
        ),
        id,
      };
      activePointerIdRef.current = event.pointerId;
      currentStrokeRef.current = stroke;
      setActiveStroke(stroke);
      publishPreview(stroke);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [color, publishPreview, size, strokeIdPrefix],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>) => {
      const current = currentStrokeRef.current;
      if (
        !current ||
        activePointerIdRef.current !== event.pointerId ||
        !event.currentTarget.hasPointerCapture(event.pointerId)
      ) {
        return;
      }
      event.preventDefault();

      const points = [
        ...current.points,
        toNormalizedPoint(event.clientX, event.clientY),
      ].slice(-MAX_GRAFFITI_POINTS);
      const next = { ...current, points };
      currentStrokeRef.current = next;
      setActiveStroke(next);
      publishPreview(next);
    },
    [publishPreview],
  );

  const endPointer = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>, commit: boolean) => {
      if (activePointerIdRef.current !== event.pointerId) return;
      const current = currentStrokeRef.current;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      activePointerIdRef.current = null;
      currentStrokeRef.current = null;
      setActiveStroke(null);
      if (commit && current) finishStroke(current);
      try {
        clientRef.current?.presence.setMyPresence(
          GRAFFITI_PRESENCE_CHANNEL,
          null,
        );
      } catch {
        // The shared connection may have closed while the stroke ended.
      }
    },
    [finishStroke],
  );

  const hintStyle = pointerReady
    ? {
        left: Math.min(
          Math.max(8, pointer.x + POINTER_HINT_OFFSET),
          Math.max(8, window.innerWidth - 240),
        ),
        top: Math.min(
          Math.max(8, pointer.y + POINTER_HINT_OFFSET),
          Math.max(8, window.innerHeight - POINTER_HINT_BOTTOM_GUTTER),
        ),
      }
    : undefined;

  return (
    <>
      <canvas
        ref={canvasRef}
        data-testid="graffiti-canvas"
        aria-label="Mural colaborativo de graffiti"
        className={`graffiti-canvas ${mode ? "graffiti-canvas-active" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(event) => endPointer(event, true)}
        onPointerCancel={(event) => endPointer(event, false)}
      />

      {pointerReady && (
        <div
          className={`graffiti-cursor-hint ${mode ? "graffiti-cursor-hint-active" : ""}`}
          style={hintStyle}
          aria-hidden="true"
        >
          {mode ? "G PARA SAIR · ARRASTE PARA PULVERIZAR" : "PRESSIONE G PARA GRAFITAR"}
        </div>
      )}

      <button
        type="button"
        data-testid="graffiti-toggle"
        aria-label={mode ? "Sair do modo graffiti" : "Ativar modo graffiti"}
        aria-pressed={mode}
        className={`graffiti-toggle ${mode ? "graffiti-toggle-active" : ""}`}
        onClick={toggleMode}
      >
        <span aria-hidden="true">▰</span>
        <span>{mode ? "G · SAIR" : "G · GRAFFITI"}</span>
      </button>

      {mode && (
        <div
          className="graffiti-toolbar"
          data-testid="graffiti-toolbar"
          role="toolbar"
          aria-label="Controles do graffiti"
        >
          <span className="graffiti-toolbar-label">SPRAY</span>
          <div className="graffiti-color-list" aria-label="Cor do spray">
            {GRAFFITI_COLORS.map((swatch) => (
              <button
                key={swatch}
                type="button"
                aria-label={`Usar cor ${swatch}`}
                aria-pressed={color === swatch}
                className="graffiti-color"
                style={{ backgroundColor: swatch }}
                onClick={() => setColor(swatch)}
              />
            ))}
          </div>
          <div className="graffiti-size-control" aria-label="Tamanho do spray">
            <input
              type="range"
              data-testid="graffiti-size-slider"
              min={GRAFFITI_SIZE_MIN}
              max={GRAFFITI_SIZE_MAX}
              step={GRAFFITI_SIZE_STEP}
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
              aria-label="Ajustar tamanho do spray"
              className="graffiti-size-slider"
            />
            <span
              className="graffiti-size-readout"
              aria-live="polite"
              data-testid="graffiti-size-readout"
            >
              {size}px
            </span>
          </div>
          <button
            type="button"
            data-testid="graffiti-share"
            className="graffiti-share"
            onClick={sharePng}
            aria-label="Compartilhar pintura como PNG (formato Story + download)"
          >
            SHARE
          </button>
          <button
            type="button"
            data-testid="graffiti-eraser"
            className="graffiti-eraser"
            onClick={eraseOwnStrokes}
            aria-label="Apagar traços pintados neste navegador"
          >
            APAGAR
          </button>
          <span className="graffiti-live-status" aria-live="polite">
            {realtimeReady ? "LIVE" : "LOCAL"}
          </span>
        </div>
      )}

      {notice && (
        <div
          role="status"
          aria-live="polite"
          data-testid="graffiti-notice"
          className={`graffiti-notice${notice === "BE NICE!" ? " graffiti-notice-be-nice" : ""}`}
        >
          {notice === "BE NICE!" ? (
            <span className="graffiti-notice-title">BE NICE!</span>
          ) : (
            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="Fechar aviso do graffiti"
            >
              {notice} · fechar
            </button>
          )}
        </div>
      )}
    </>
  );
}
