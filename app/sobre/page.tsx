import type { Metadata } from "next";
import { SectionPlaceholder } from "@/components/sections/SectionPlaceholder";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: `Sobre · ${site.brand.name}` };

export default function SobrePage() {
  return (
    <SectionPlaceholder
      eyebrow="bio · trajetória · manifesto"
      title="Sobre"
      blurb="Quem é, de onde veio, como pensa a música e onde quer chegar."
      comingSoon={[
        "Bio completa em pt-BR + EN",
        "Linha do tempo de 10 anos (2016 → hoje)",
        "Frases e manifesto curatorial",
        "Galeria de fotos de bastidores",
      ]}
    />
  );
}
