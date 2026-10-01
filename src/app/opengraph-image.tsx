import { OG_CONTENT_TYPE, OG_SIZE, siteCard, siteCardAlt } from "@/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = siteCardAlt;

export default function Image() {
  return siteCard();
}
