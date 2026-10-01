import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { acts } from "@/components/home/acts";
import { about } from "@/content/about";
import { SITE_URL } from "@/site";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const VOID = "#07080b";
const MOONLIGHT = "#e8ecf2";
const MIST = "#a3acb9";
const HOME_ACCENT = "#b8c4d4";
const SIGNATURE = `${about.name} · ${about.role}`;

async function dataUri(publicPath: string) {
  const file = await readFile(path.join(process.cwd(), "public", publicPath));
  return `data:image/png;base64,${file.toString("base64")}`;
}

function getAct(slug: string) {
  const act = acts.find((a) => a.project.slug === slug);
  if (!act) throw new Error(`No project with slug "${slug}"`);
  return act;
}

async function card({
  eyebrow,
  title,
  tagline,
  accent,
  posters,
  footer,
}: {
  eyebrow: string;
  title: string;
  tagline: string;
  accent: string;
  posters: string[];
  footer: string;
}) {
  const images = await Promise.all(posters.map(dataUri));
  const grid = images.length > 1;
  const tile = grid
    ? { width: OG_SIZE.height / 2, height: OG_SIZE.height / 2 }
    : { width: 560, height: OG_SIZE.height };

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: VOID,
          color: MOONLIGHT,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            padding: "60px 56px",
            borderLeft: `10px solid ${accent}`,
          }}
        >
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 3, color: accent }}>
            {eyebrow}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 80, fontWeight: 700, lineHeight: 1 }}>
              {title}
            </div>
            <div style={{ display: "flex", marginTop: 28, fontSize: 30, lineHeight: 1.35, color: MIST }}>
              {tagline}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 24, color: MIST }}>{footer}</div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: grid ? tile.width * 2 : tile.width,
            height: OG_SIZE.height,
          }}
        >
          {images.map((src) => (
            <img
              key={src.slice(-32)}
              src={src}
              alt=""
              width={tile.width}
              height={tile.height}
              style={{ objectFit: "cover" }}
            />
          ))}
        </div>
      </div>
    ),
    OG_SIZE
  );
}

export function siteCard() {
  return card({
    eyebrow: about.role.toUpperCase(),
    title: about.name,
    tagline: "I design game systems and build them myself.",
    accent: HOME_ACCENT,
    posters: acts.map((a) => a.poster),
    footer: new URL(SITE_URL).host,
  });
}

export const siteCardAlt = `${about.name}, ${about.role}. Key art from ${acts
  .map((a) => a.project.title)
  .join(", ")}.`;

export function projectCard(slug: string) {
  const { project, accent, poster } = getAct(slug);
  return card({
    eyebrow: project.eyebrow,
    title: project.title,
    tagline: project.tagline,
    accent,
    posters: [poster],
    footer: SIGNATURE,
  });
}

export function projectCardAlt(slug: string) {
  const { project } = getAct(slug);
  return `${project.title}: ${project.tagline}`;
}
