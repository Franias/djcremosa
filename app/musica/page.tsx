import type { Metadata } from "next";
import { SectionPlaceholder } from "@/components/sections/SectionPlaceholder";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: `Música · ${site.brand.name}` };

export default function MusicaPage() {
  return (
    <SectionPlaceholder
      eyebrow="sets · podcasts · tracks"
      title="Música"
      blurb="Todos os sets, lives e contribuições em um só lugar — com player embutido."
      comingSoon={[
        "Embeds SoundCloud / Mixcloud (último set em destaque)",
        "Lista de sets com tracklists",
        "Filtro por gênero (funk, amapiano, house, R&B…)",
        "Player fixo no rodapé para escutar enquanto navega",
      ]}
    />
  );
}
