import type { Metadata } from "next";
import { SectionPlaceholder } from "@/components/sections/SectionPlaceholder";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: `Vídeos · ${site.brand.name}` };

export default function VideosPage() {
  return (
    <SectionPlaceholder
      eyebrow="lives · aftermovies · entrevistas"
      title="Vídeos"
      blurb="Lives, aftermovies de festival e entrevistas. Hospedagem no YouTube pra não pesar a página."
      comingSoon={[
        "Embeds YouTube/Vimeo com poster otimizado",
        "Filtro por tipo (live, aftermovie, entrevista)",
        "Vídeo em destaque no hero da home",
        "Shorts verticais pra mobile (Reels, Shorts)",
      ]}
    />
  );
}
