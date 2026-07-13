import type { Metadata } from "next";
import { GaleriaGrid } from "@/components/sections/GaleriaGrid";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Galeria · ${site.brand.name}`,
  description: `Fotos de pista, bastidores e retratos de ${site.brand.name}. ${site.brand.location}.`,
};

/**
 * Server wrapper — exports the page metadata and defers all interaction
 * (filter / lightbox) to <GaleriaGrid />. Required because Next.js 16
 * forbids exporting `metadata` from a `"use client"` file.
 */
export default function GaleriaPage() {
  return <GaleriaGrid />;
}