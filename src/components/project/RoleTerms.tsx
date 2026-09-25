import { breakIn } from "@/content/games/break-in";

const bare = (name: string) => name.replace(/^the\s+/i, "").trim();

const ROLE_NAMES = (breakIn.roles ?? [])
  .map((role) => bare(role.name))
  .filter(Boolean)
  .sort((a, b) => b.length - a.length);

const ROLE_PATTERN = ROLE_NAMES.length
  ? new RegExp(`\\b(?:${ROLE_NAMES.join("|")})s?\\b`, "gi")
  : null;

export default function RoleTerms({ text }: { text: string }) {
  if (!ROLE_PATTERN) return <>{text}</>;

  const parts: React.ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(ROLE_PATTERN)) {
    const at = match.index;
    if (at === undefined) continue;
    if (at > cursor) parts.push(text.slice(cursor, at));
    parts.push(
      <span key={at} className="role-term">
        {match[0]}
      </span>
    );
    cursor = at + match[0].length;
  }

  if (cursor === 0) return <>{text}</>;
  if (cursor < text.length) parts.push(text.slice(cursor));

  return <>{parts}</>;
}
