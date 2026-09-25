import { codeToHtml, bundledLanguages, type BundledLanguage } from "shiki";

const THEME = "github-dark-default";
const THEME_BG = "#0d1117";
const SURFACE = "#0A0D12";

function resolveLang(language: string): BundledLanguage | "text" {
  return language in bundledLanguages ? (language as BundledLanguage) : "text";
}

export default async function CodeBlock({
  filename,
  language = "cpp",
  code,
}: {
  filename?: string;
  language?: string;
  code: string;
}) {
  const html = await codeToHtml(code, {
    lang: resolveLang(language),
    theme: THEME,
    colorReplacements: { [THEME_BG]: SURFACE },
    transformers: [
      {
        pre(node) {
          node.properties.style =
            `${node.properties.style ?? ""};margin:0;padding:1.1rem 1.25rem;` +
        `overflow-x:auto;font-size:0.73rem;line-height:1.6;` +
            `font-family:var(--font-mono)`;
        },
        code(node) {
          node.properties.style = "font-family:inherit";
        },
      },
    ],
  });

  return (
    <div
      style={{
        background: SURFACE,
        border: "1px solid color-mix(in srgb, var(--color-mist) 22%, transparent)",
        borderRadius: "3px",
        overflow: "hidden",
        fontFamily: "var(--font-mono)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.6rem 1rem",
          borderBottom: "1px solid color-mix(in srgb, var(--color-mist) 18%, transparent)",
          background: "color-mix(in srgb, var(--color-nightfall) 60%, transparent)",
        }}
      >
        <span style={{ fontSize: "0.72rem", color: "var(--color-mist)", letterSpacing: "0.05em" }}>
          {filename ?? "code"}
        </span>
        <span
          style={{
            fontSize: "0.70rem",
            color: "var(--color-silver)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          {language}
        </span>
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
