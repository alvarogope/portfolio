import type { Metadata } from "next";
import { gameEngineering as g } from "@/content/moon-knight-game-engineering";
import Section from "@/components/layout/Section";
import SectionHeading from "@/components/layout/SectionHeading";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CodeBlock from "@/components/project/CodeBlock";
import CtaPanel from "@/components/project/CtaPanel";
import ScreenshotSlots from "@/components/project/ScreenshotSlots";
import Reveal from "@/components/layout/Reveal";
import ProjectNav from "@/components/layout/ProjectNav";
import { moonKnightNavItems } from "@/content/games";

export const metadata: Metadata = {
  title: "Programming Moon-Knight | Álvaro Gómez",
  description: g.tagline,
};

const ACCENT: Record<string, string> = {
  gold: "var(--color-gold)",
  scarlet: "var(--color-scarlet)",
  emerald: "var(--color-emerald)",
};

const HAIRLINE = "1px solid color-mix(in srgb, var(--color-mist) 20%, transparent)";

export default function GameEngineeringPage() {
  return (
    <Section>
      <Breadcrumb
        items={[
          { label: "Moon-Knight", href: "/moon-knight" },
          { label: "Game engineering" },
        ]}
      />

      {/* 1 · Hero and thesis --------------------------------------- */}
      <Reveal>
        <header style={{ marginTop: "1.5rem", maxWidth: "38rem" }}>
          <p
            className="mono"
            style={{ fontSize: "0.72rem", color: "var(--color-silver)", marginBottom: "1rem" }}
          >
            {g.eyebrow}
          </p>
          <h1
            style={{
              fontSize: "var(--text-hero)",
              margin: 0,
              lineHeight: 1.05,
              fontFamily: "var(--font-hero)",
            }}
          >
            {g.title}
          </h1>
          <p style={{ fontSize: "var(--text-lg)", color: "var(--color-mist)", marginTop: "1rem" }}>
            {g.tagline}
          </p>
        </header>
      </Reveal>

      <Reveal>
        <p
          className="panel"
          style={{
            marginTop: "2.5rem",
            maxWidth: "38rem",
            padding: "clamp(1.5rem, 4vw, 2.25rem)",
            border: HAIRLINE,
            borderLeft: "3px solid var(--color-gold)",
            fontFamily: "var(--font-hero)",
            fontSize: "clamp(1.25rem, 1rem + 1.4vw, 1.9rem)",
            lineHeight: 1.35,
            color: "var(--color-moonlight)",
          }}
        >
          {g.thesis}
        </p>
      </Reveal>

      <Reveal>
        <p style={{ marginTop: "2rem", maxWidth: "38rem", lineHeight: 1.75 }}>{g.intro}</p>
      </Reveal>

      {/* Stack + repo */}
      <Reveal>
        <div style={{ marginTop: "2rem", maxWidth: "38rem" }}>
          <h2 className="sr-only">Technology</h2>
          <ul
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {g.stack.map((item) => (
              <li
                key={item}
                className="mono"
                style={{
                  fontSize: "0.68rem",
                  letterSpacing: "0.08em",
                  color: "var(--color-silver)",
                  border: HAIRLINE,
                  padding: "0.35rem 0.7rem",
                }}
              >
                {item}
              </li>
            ))}
          </ul>
          <a
            href={g.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="mono"
            style={{
              display: "inline-block",
              marginTop: "1.5rem",
              fontSize: "0.75rem",
              color: "var(--color-gold)",
              borderBottom: "1px solid color-mix(in srgb, var(--color-gold) 50%, transparent)",
              paddingBottom: "2px",
            }}
          >
            {g.repoLabel} ↗
          </a>
        </div>
      </Reveal>

      {/* 2 · The split --------------------------------------------- */}
      <Reveal>
        <div style={{ marginTop: "4.5rem" }}>
          <SectionHeading kicker={`${g.split.kicker}`} title={g.split.title} />
          <p style={{ marginTop: "1rem", maxWidth: "38rem", lineHeight: 1.75 }}>
            {g.split.intro}
          </p>

          <div
            role="region"
            aria-label="Blueprint and C++ system split"
            tabIndex={0}
            style={{ marginTop: "1.75rem", overflowX: "auto", border: HAIRLINE }}
            className="panel"
          >
            <table
              style={{
                width: "100%",
                minWidth: "38rem",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <caption className="sr-only">
                Which Moon-Knight systems are implemented in Blueprint and which in C++, and the
                class or asset that owns each.
              </caption>
              <thead>
                <tr>
                  {["System", "Managed in", "Owner"].map((label) => (
                    <th
                      key={label}
                      scope="col"
                      className="mono"
                      style={{
                        padding: "0.9rem 1.25rem",
                        fontSize: "0.71rem",
                        fontWeight: 400,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "var(--color-silver)",
                        borderBottom: HAIRLINE,
                      }}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {g.split.rows.map((r, i) => (
                  <tr key={r.system}>
                    <th
                      scope="row"
                      style={{
                        padding: "1rem 1.25rem",
                        fontWeight: 400,
                        borderTop: i === 0 ? "none" : HAIRLINE,
                        verticalAlign: "top",
                      }}
                    >
                      <span style={{ display: "block", color: "var(--color-moonlight)" }}>
                        {r.system}
                      </span>
                      <span
                        style={{
                          display: "block",
                          marginTop: "0.3rem",
                          fontSize: "0.85rem",
                          color: "var(--color-mist)",
                          lineHeight: 1.55,
                        }}
                      >
                        {r.detail}
                      </span>
                    </th>
                    <td
                      style={{
                        padding: "1rem 1.25rem",
                        borderTop: i === 0 ? "none" : HAIRLINE,
                        verticalAlign: "top",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span
                        className="mono"
                        style={{
                          fontSize: "0.68rem",
                          letterSpacing: "0.08em",
                          padding: "0.3rem 0.6rem",
                          border: `1px solid color-mix(in srgb, ${
                            r.home === "C++" ? "var(--color-gold)" : "var(--color-silver)"
                          } 55%, transparent)`,
                          color:
                            r.home === "C++" ? "var(--color-gold)" : "var(--color-silver)",
                        }}
                      >
                        {r.home}
                      </span>
                    </td>
                    <td
                      className="mono"
                      style={{
                        padding: "1rem 1.25rem",
                        borderTop: i === 0 ? "none" : HAIRLINE,
                        verticalAlign: "top",
                        fontSize: "0.8rem",
                        color: "var(--color-silver)",
                      }}
                    >
                      {r.owner}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      {/* 03 · The coding choices ------------------------------------ */}
      <Reveal>
        <div style={{ marginTop: "5rem" }}>
          <SectionHeading kicker={`${g.choicesKicker}`} title={g.choicesTitle} />
          <p style={{ marginTop: "1rem", maxWidth: "38rem", lineHeight: 1.75 }}>
          </p>
        </div>
      </Reveal>

      {g.choices.map((c, i) => (
        <Reveal key={c.id}>
          <article id={c.id} style={{ marginTop: "2rem" }}>
            <p
              className="mono"
              style={{
                margin: 0,
                fontSize: "0.71rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--color-silver)",
              }}
            >
              {String.fromCharCode(97 + i)} · {c.kicker}
            </p>
            <h3
              style={{
                margin: "0.6rem 0 0",
                fontSize: "var(--text-lg)",
                fontFamily: "var(--font-display)",
                lineHeight: 1.2,
              }}
            >
              {c.title}
            </h3>

            <div
              style={{
                marginTop: "1.25rem",
                maxWidth: "38rem",
                borderLeft: "2px solid var(--color-gold)",
                paddingLeft: "1.1rem",
              }}
            >
              <span
                className="mono"
                style={{
                  fontSize: "0.70rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--color-gold)",
                }}
              >
                Decision
              </span>
              <p
                style={{
                  margin: "0.4rem 0 0",
                  lineHeight: 1.7,
                  color: "var(--color-moonlight)",
                }}
              >
                {c.decision}
              </p>
            </div>

            <div style={{ marginTop: "1.5rem", maxWidth: "38rem" }}>
              <span
                className="mono"
                style={{
                  fontSize: "0.70rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--color-mist)",
                }}
              >
                Why
              </span>
              <ul
                style={{
                  margin: "0.6rem 0 0",
                  padding: 0,
                  listStyle: "none",
                  display: "grid",
                  gap: "0.9rem",
                }}
              >
                {c.why.map((reason) => (
                  <li
                    key={reason.slice(0, 40)}
                    style={{
                      lineHeight: 1.75,
                      paddingLeft: "1.1rem",
                      borderLeft: HAIRLINE,
                      color: "var(--color-silver)",
                    }}
                  >
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: "1.75rem" }}>
              <CodeBlock
                filename={c.code.filename}
                language={c.code.language}
                code={c.code.code}
              />
            </div>
          </article>
        </Reveal>
      ))}

      {/* 4 · Combat state machine ---------------------------------- */}
      <Reveal>
        <div style={{ marginTop: "5rem" }}>
          <SectionHeading kicker={`${g.combat.kicker}`} title={g.combat.title} />
          <p style={{ marginTop: "1rem", maxWidth: "38rem", lineHeight: 1.75 }}>
            {g.combat.intro}
          </p>

          <ul
            style={{
              marginTop: "2rem",
              padding: 0,
              listStyle: "none",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 17rem), 1fr))",
              gap: "1rem",
            }}
          >
            {g.combat.states.map((s) => {
              const accent = s.accent ? ACCENT[s.accent] : "var(--color-silver)";
              return (
                <li
                  key={s.name}
                  className="panel"
                  style={{
                    padding: "1.15rem 1.25rem",
                    border: HAIRLINE,
                    borderTop: `2px solid ${accent}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    className="mono"
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--color-moonlight)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {s.name}
                  </span>
                  <span
                    style={{ fontSize: "0.9rem", color: "var(--color-mist)", lineHeight: 1.6 }}
                  >
                    {s.detail}
                  </span>
                  <span
                    className="mono"
                    style={{
                      marginTop: "auto",
                      paddingTop: "0.6rem",
                      borderTop: HAIRLINE,
                      fontSize: "0.71rem",
                      color: "var(--color-silver)",
                      lineHeight: 1.5,
                    }}
                  >
                    <span aria-hidden>→ </span>
                    <span className="sr-only">Transitions to: </span>
                    {s.exits}
                  </span>
                </li>
              );
            })}
          </ul>

          <div style={{ marginTop: "1.75rem" }}>
            <CodeBlock
              filename={g.combat.code.filename}
              language={g.combat.code.language}
              code={g.combat.code.code}
            />
          </div>
        </div>
      </Reveal>

      {/* 04 · Editor captures */}
      <Reveal>
        <div style={{ marginTop: "5rem" }}>
          <SectionHeading kicker={`${g.screenshots.kicker}`} title={g.screenshots.title} />
          <p
            style={{
              marginTop: "1rem",
              maxWidth: "38rem",
              lineHeight: 1.75,
              marginBottom: "1.75rem",
            }}
          >
            {g.screenshots.intro}
          </p>
          <ScreenshotSlots items={g.screenshots.items} />
        </div>
      </Reveal>

      {/* 06 · Where to go next */}
      <Reveal>
        <div
          style={{
            marginTop: "5rem",
            display: "grid",
            gap: "1.5rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 20rem), 1fr))",
            alignItems: "start",
          }}
        >
          <CtaPanel
            kicker={g.quantumCta.kicker}
            title={g.quantumCta.title}
            body={g.quantumCta.body}
            href={g.quantumCta.href}
            linkLabel={g.quantumCta.linkLabel}
          />
          <CtaPanel
            kicker="Back to the design project"
            title="Moon-Knight"
            body= "The design project: video gameplays, the five quantum abilities, the type of enemies, the control scheme, the world of Kaelum and the beat chart the game was planned with."
            href="/moon-knight"
            linkLabel="Back to Moon-Knight"
            accent="silver"
          />
        </div>
      </Reveal>

      <Reveal>
        <ProjectNav
          items={moonKnightNavItems}
          currentSlug="moon-knight-engineering"
          kicker="Where to next"
        />
      </Reveal>
    </Section>
  );
}
