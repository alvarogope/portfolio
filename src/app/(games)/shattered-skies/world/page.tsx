import type { Metadata } from "next";
import Section from "@/components/layout/Section";
import SectionHeading from "@/components/layout/SectionHeading";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Reveal from "@/components/layout/Reveal";
import ProjectNav from "@/components/layout/ProjectNav";
import { shatteredSkiesNavItems } from "@/content/games";
import CtaPanel from "@/components/project/CtaPanel";
import PlateGrid from "@/components/project/PlateGrid";
import NarrativeMap from "@/components/project/NarrativeMap";
import ShatterstormWorld from "@/components/project/ShatterstormWorld";
import ShatteredSkiesMechanics from "@/components/project/ShatteredSkiesMechanics";
import ShatteredSkiesCoop from "@/components/project/ShatteredSkiesCoop";
import { deepDiveAnchors, mainHref, mainPath } from "@/content/shattered-skies-deep-dive";

export const metadata: Metadata = {
  title: "The World & the Story | Shattered Skies",
  description:
    "The deep dive: Shattered Skies' full narrative and its three endings, the world of Shatterstorm, and the design reasoning behind every system that keeps two players from understanding each other.",
};

export default function ShatteredSkiesWorldPage() {
  return (
    <Section>
      <Breadcrumb
        items={[
          { label: "Shattered Skies", href: mainPath },
          { label: "The deep dive" },
        ]}
      />

      <Reveal>
        <header style={{ marginTop: "1.5rem", maxWidth: "40rem" }}>
          <p
            className="mono"
            style={{ fontSize: "0.72rem", color: "var(--color-silver)", marginBottom: "1rem" }}
          >
            SHATTERED SKIES · STORY, WORLD & REASONING
          </p>
          <h1
            style={{
              fontSize: "var(--text-hero)",
              margin: 0,
              lineHeight: 1.05,
              fontFamily: "var(--font-hero)",
            }}
          >
            The World & the Story
          </h1>
          <p style={{ fontSize: "var(--text-lg)", color: "var(--color-mist)", marginTop: "1rem" }}>
            The other half of this project. It covers the whole story, with the three endings, and the 
            choices to get to them. 
          </p>
          <p
            className="mono"
            style={{
              fontSize: "0.74rem",
              lineHeight: 1.7,
              color: "var(--color-mist)",
              marginTop: "1.25rem",
            }}
          >
            Team of 5 · my role: Systems &amp; World Designer.{" "}
            <a href={mainHref("theGame", "deep")} style={{ color: "var(--color-silver)" }}>
              What my contribution and what was the team&rsquo;s
            </a>
          </p>
        </header>
      </Reveal>

      {/* ═══ 01 · THE STORY ═══ */}
      <Reveal>
        <div style={{ marginTop: "5rem" }} id={deepDiveAnchors.story}>
          <SectionHeading kicker="The Story" title="Narrative Design and The Endings" />
          <div style={{ marginTop: "2rem" }}>
            <NarrativeMap variant="deep" />
          </div>
        </div>
      </Reveal>

      {/* ═══ 02 · THE WORLD ═══ */}
      <Reveal>
        <div style={{ marginTop: "5rem" }} id={deepDiveAnchors.world}>
          <SectionHeading kicker="02 · World Design" title="The World of Shatterstorm" />
          <div style={{ marginTop: "2rem" }}>
            <ShatterstormWorld variant="deep" />
          </div>
        </div>
      </Reveal>

      {/* ═══ 03 · THE LANGUAGE ═══ */}
      <Reveal>
        <div style={{ marginTop: "5rem" }} id={deepDiveAnchors.language}>
          <SectionHeading kicker="Core Mechanics" title="The Communication Mechanics" />
          <p
            style={{
              color: "var(--color-mist)",
              maxWidth: "35rem",
              marginTop: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            The design decisions for the communication mechanics. The four main elements that makes
            it work, why taking out the voice chat and how it worked with players.
          </p>
          <ShatteredSkiesMechanics variant="deep" block="language" />
        </div>
      </Reveal>

      {/* ═══ 04 · THE SHIP ═══ */}
      <Reveal>
        <div style={{ marginTop: "5rem" }} id={deepDiveAnchors.ship}>
          <SectionHeading kicker="The Core Mechanics" title="Creating Cooperation" />
          <p
            style={{
              color: "var(--color-mist)",
              maxWidth: "35rem",
              marginTop: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            The reasoning behind the design decisions of the spaceship controls and how an assymetric system like
            the traversal mechanics, works within the players as cooperation.
          </p>
          <ShatteredSkiesMechanics variant="deep" block="ship" />
        </div>
      </Reveal>

      {/* ═══ 05 · THE THREE REPAIRS ═══ */}
      <Reveal>
        <div style={{ marginTop: "5rem" }} id={deepDiveAnchors.repairs}>
          <SectionHeading kicker="05 · Co-op Design" title="The Three Repairs, In Full" />
          <ShatteredSkiesCoop variant="deep" block="repairs" />
        </div>
      </Reveal>

      {/* ═══ 06 · THE PLANETSIDE PATTERN ═══ */}
      <Reveal>
        <div style={{ marginTop: "5rem" }} id={deepDiveAnchors.pattern}>
          <SectionHeading kicker="Co-op Design" title="The Puzzles" />
          <ShatteredSkiesCoop variant="deep" block="pattern" />
        </div>
      </Reveal>

      {/* ═══ 07 · THE DESIGN DOCUMENT ═══ */}
      <Reveal>
        <div style={{ marginTop: "5rem" }} id={deepDiveAnchors.document}>
          <SectionHeading kicker="07 · From the Desk" title="The Design Document" />
          <div style={{ marginTop: "2rem", maxWidth: "50rem" }}>
            <PlateGrid
              minWidth="100%"
              items={[
                {
                  src: "/images/shattered-skies/shattered-skies-gameplay-1.jpg.jpeg",
                  label: "The narrative sheet, uncropped",
                  alt: "The full narrative design document: a Backstories column, the Character Arc and Story Beats spine with five written beats, an Ending column listing Unity, Betrayal and Extinction, and a left-hand Current Weakness column criticising the backstory for being too black-and-white.",
                  caption:
                    "The working sheet the structure was authored on. The main page shows the diagram band across the top; this is the whole thing, including the column on the left where the backstory is marked down for being too black-and-white — the note that led to both species being written as convinced they are in the right.",
                },
              ]}
            />
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div style={{ marginTop: "5rem", maxWidth: "34rem" }}>
          <CtaPanel
            kicker="Back to the project"
            title="Shattered Skies"
            body="The built work: the game running, the team's premise, the five-world orbital system you can operate, the curriculum each planet teaches, and the three systems that force two players who cannot speak to depend on each other."
            href={mainPath}
            linkLabel="Back to Shattered Skies"
            accent="silver"
          />
        </div>
      </Reveal>

      <Reveal>
        <ProjectNav
          items={shatteredSkiesNavItems}
          currentSlug="shattered-skies-world"
          kicker="Where to next"
        />
      </Reveal>
    </Section>
  );
}
