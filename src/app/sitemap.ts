import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/site";

/* Built from the app directory itself, so a new page lands in the sitemap
   without anyone remembering to list it. Runs once at build (the route is
   static). Route groups like (games) add no URL segment; dynamic, private
   and parallel segments are skipped — the site has none that are public. */
const APP_DIR = path.join(process.cwd(), "src", "app");

function collectRoutes(dir: string, segments: string[]): string[] {
  const routes: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name === "page.tsx") {
      routes.push("/" + segments.join("/"));
    } else if (entry.isDirectory()) {
      const name = entry.name;
      if (/^[[_@]/.test(name)) continue;
      const isGroup = name.startsWith("(") && name.endsWith(")");
      routes.push(...collectRoutes(path.join(dir, name), isGroup ? segments : [...segments, name]));
    }
  }
  return routes;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return collectRoutes(APP_DIR, [])
    .sort()
    .map((route) => ({
      url: route === "/" ? SITE_URL : SITE_URL + route,
      priority: route === "/" ? 1 : 0.8,
    }));
}
