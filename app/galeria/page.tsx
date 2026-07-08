import type { Metadata } from "next";
import { SectionPlaceholder } from "@/components/sections/SectionPlaceholder";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: `Galeria · ${site.brand.name}` };

export default function GaleriaPage() {
  return (
    <SectionPlaceholder
      eyebrow="bastidores · pista · portraits"
      title="Galeria"
      blurb="Mosaico das fotos de pista, retrato e bastidor — Cloudinary pra carregar rápido."
      comingSoon={[
        "Grid masonry responsivo com lazy loading",
        "Filtro por evento (vinculado à agenda)",
        "Lightbox fullscreen com setas",
        "Download de fotos de imprensa (apenas credenciados)",
      ]}
    />
  );
}
