"use client";

/**
 * AgendaInstructions — small client wrapper around the agenda
 * page's "instructions" dialog. The two buttons (`Imprimir`,
 * `OK`) need browser APIs to function so they live in a client
 * component.
 */
import { Win95Button, Win95Window } from "@/components/ui/win95";

export function AgendaInstructions() {
  function handlePrint() {
    if (typeof window !== "undefined") window.print();
  }

  function handleOk() {
    if (typeof window !== "undefined") {
      // Smooth-scroll back up to the filter row so the user can
      // immediately engage with the next-view.
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <Win95Window title="agenda — instruções" controls>
      <div className="p-4 sm:p-5 bg-win-face text-win-ink flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <p className="win-body-sm">
          Próximos shows, festivais e residências. Ingressos pelo link de cada
          data — quando disponível. Usa os filtros acima pra navegar entre
          próximas, histórico ou tudo.
        </p>
        <div className="flex gap-2 shrink-0">
          <Win95Button onClick={handlePrint}>Imprimir</Win95Button>
          <Win95Button onClick={handleOk} focused>
            OK
          </Win95Button>
        </div>
      </div>
    </Win95Window>
  );
}
