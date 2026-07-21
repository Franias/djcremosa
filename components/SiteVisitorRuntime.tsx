"use client";

import { useVisitorStats } from "@/lib/visitorStats";

/** Starts the site-wide realtime visitor session on every route. */
export function SiteVisitorRuntime() {
  useVisitorStats();
  return null;
}
