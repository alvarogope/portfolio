import { OG_CONTENT_TYPE, OG_SIZE, projectCard, projectCardAlt } from "@/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = projectCardAlt("shattered-skies");

export default function Image() {
  return projectCard("shattered-skies");
}
