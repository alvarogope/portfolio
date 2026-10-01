import { OG_CONTENT_TYPE, OG_SIZE, projectCard, projectCardAlt } from "@/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = projectCardAlt("seeds-of-tomorrow");

export default function Image() {
  return projectCard("seeds-of-tomorrow");
}
