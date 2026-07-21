"use client";

import { useEffect, useState } from "react";
import type { PageDataChannel, PlayHTMLComponents } from "playhtml";

export const SITE_ROOM = "dj-cremosa-site";
export const VISITOR_COUNT_CHANNEL = "site-visitor-count";
export const VISITOR_PRESENCE_CHANNEL = "site-visitor-presence";

const VISITOR_RECORDED_AT_KEY = "cremosa-visit-recorded-at";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

type VisitorCount = { total: number };

let playhtmlPromise: Promise<PlayHTMLComponents | null> | null = null;
let visitRecordedThisLoad = false;

/** Load playhtml only in the browser: its runtime intentionally uses document. */
function loadPlayhtml(): Promise<PlayHTMLComponents | null> {
  if (!playhtmlPromise) {
    playhtmlPromise = import("playhtml")
      .then(async ({ playhtml }) => {
        await playhtml.init({
          room: SITE_ROOM,
          onError: () => {
            console.warn("[cremosa] realtime visitor service unavailable");
          },
        });
        return playhtml;
      })
      .catch(() => null);
  }
  return playhtmlPromise;
}

function recordVisitor(channel: PageDataChannel<VisitorCount>): void {
  if (visitRecordedThisLoad) return;
  visitRecordedThisLoad = true;

  try {
    const lastRecordedAt = Number(
      window.localStorage.getItem(VISITOR_RECORDED_AT_KEY) ?? 0,
    );
    if (lastRecordedAt && Date.now() - lastRecordedAt <= ONE_DAY_MS) return;

    channel.setData((draft) => {
      draft.total += 1;
    });
    window.localStorage.setItem(VISITOR_RECORDED_AT_KEY, String(Date.now()));
  } catch {
    // Private browsing can block storage. The shared update still works.
  }
}

/**
 * Shared site visitor stats backed by playhtml's persistent page data and
 * ephemeral presence layer. Any route can mount this hook; the singleton
 * connection and once-per-load guard prevent duplicate increments.
 */
export function useVisitorStats(): {
  count: number;
  online: number;
  ready: boolean;
} {
  const [stats, setStats] = useState({ count: 0, online: 0, ready: false });

  useEffect(() => {
    let cancelled = false;
    let channel: PageDataChannel<VisitorCount> | null = null;
    let unsubscribeData: (() => void) | null = null;
    let unsubscribePresence: (() => void) | null = null;

    void loadPlayhtml().then((client) => {
      if (!client || cancelled) return;

      channel = client.createPageData<VisitorCount>(
        VISITOR_COUNT_CHANNEL,
        { total: 0 },
      );
      const updateData = (data: VisitorCount) => {
        if (!cancelled) {
          setStats((current) => ({ ...current, count: data.total }));
        }
      };
      updateData(channel.getData());
      unsubscribeData = channel.onUpdate(updateData);

      const updatePresence = (presences: Map<string, unknown>) => {
        if (!cancelled) {
          setStats((current) => ({ ...current, online: presences.size }));
        }
      };
      unsubscribePresence = client.presence.onPresenceChange(
        VISITOR_PRESENCE_CHANNEL,
        updatePresence,
      );
      client.presence.setMyPresence(VISITOR_PRESENCE_CHANNEL, { active: true });
      recordVisitor(channel);

      setStats((current) => ({ ...current, ready: true }));
    });

    return () => {
      cancelled = true;
      unsubscribeData?.();
      unsubscribePresence?.();
      channel?.destroy();
    };
  }, []);

  return stats;
}
