import { breakIn } from "@/content/games/break-in";

/**
 * Break-In — lights up the four role names wherever they appear in prose.
 *
 * The page's argument is that nobody wins alone, and the copy already carries
 * it: the Hacker's card names the Vaultsnatcher, the Lockpicker's card names
 * the Hacker. Colouring those cross-references in the page's amber makes the
 * dependency visible without adding a single word.
 *
 * The names are read from `breakIn.roles` rather than hard-coded, so renaming
 * a role in the content file keeps the highlighting in sync. The leading
 * article is stripped — content says "The Hacker", prose says "the Hacker".
 *
 * Styling lives with the page, not here: `.role-term` is defined once in the
 * Break-In route's <style> block, because this renders dozens of times per
 * page and each instance emitting its own rules would be waste. It is
 * Break-In-only by design — the constraint, not an oversight.
 *
 * Purely decorative colour. No interaction, no ARIA: the words read exactly
 * the same to a screen reader as they did before.
 */

/** "The Hacker" -> "Hacker". Cross-references rarely repeat the article. */
const bare = (name: string) => name.replace(/^the\s+/i, "").trim();

/* Longest first, so a shorter name can never shadow a longer one that starts
   with it. None of the current four overlap, but a future role might. */
const ROLE_NAMES = (breakIn.roles ?? [])
  .map((role) => bare(role.name))
  .filter(Boolean)
  .sort((a, b) => b.length - a.length);

/* Whole words only, any casing, optional plural.
   - \b at both ends keeps "hack" and "hacked" out of it, and stops a name
     from matching inside a longer word.
   - `s?` before the closing \b catches "Hackers" while still allowing
     "Hacker's" to match the name alone and leave the possessive outside. */
const ROLE_PATTERN = ROLE_NAMES.length
  ? new RegExp(`\\b(?:${ROLE_NAMES.join("|")})s?\\b`, "gi")
  : null;

export default function RoleTerms({ text }: { text: string }) {
  if (!ROLE_PATTERN) return <>{text}</>;

  const parts: React.ReactNode[] = [];
  let cursor = 0;

  /* matchAll clones the regex internally, so the shared /g pattern above
     carries no lastIndex between calls. */
  for (const match of text.matchAll(ROLE_PATTERN)) {
    const at = match.index;
    if (at === undefined) continue;
    if (at > cursor) parts.push(text.slice(cursor, at));
    /* match[0], not the canonical name — the original casing is preserved. */
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
