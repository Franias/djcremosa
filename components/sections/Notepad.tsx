/**
 * Notepad — vintage Windows-Notepad window chrome used on page 3 of the
 * Midia Kit 2026. Wraps bio / manifesto copy in cream body, pixelated
 * title bar, and File/Edit/Format/View/Helo menu.
 *
 *   <Notepad title="sobre - Notepad"> ...body copy... </Notepad>
 *   <Notepad title="contato - Notepad" menu={["File","Edit","Format","View","Help"]}>
 */

interface NotepadProps {
  /** Title-bar label, e.g. "sobre - Notepad". */
  title: string;
  /** Menu items. Default matches the kit. */
  menu?: string[];
  /** Optional class passthrough (width, rotation, etc). */
  className?: string;
  /** Body content. Plain text or arbitrary nodes. */
  children: React.ReactNode;
}

const DEFAULT_MENU = ["File", "Edit", "Format", "View", "Help"];

export function Notepad({
  title,
  menu = DEFAULT_MENU,
  className,
  children,
}: NotepadProps) {
  return (
    <div className={["notepad", className].filter(Boolean).join(" ")}>
      <div className="notepad-title">
        <span>{title}</span>
        <span className="notepad-controls" aria-hidden>
          <span>─</span>
          <span>□</span>
          <span className="close">×</span>
        </span>
      </div>
      <div className="notepad-menu" aria-hidden>
        {menu.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
      <div className="notepad-body">{children}</div>
    </div>
  );
}