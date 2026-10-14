export interface HeroSlide {
  src: string;
  alt: string;
  project: string;
  position: string;
  shade: number;
}

export const heroSlides: HeroSlide[] = [
  {
    src: "/images/moon-knight/sublime_meadow.png",
    alt: "Moon-Knight: an armoured knight with a sword stands in tall grass under a full moon and a starfield, between two kneeling statues raising horns.",
    project: "Moon-Knight",
    position: "60% 40%",
    shade: 0.18,
  },
  {
    src: "/images/hero/hub-planet-wall-crop.jpg",
    alt: "Shattered Skies: the player's ship, engines glowing cyan, in front of a wall of planets against a purple nebula.",
    project: "Shattered Skies",
    position: "50% 55%",
    shade: 0.1,
  },
  {
    src: "/images/seeds-of-tomorrow/snow-level-combat.png",
    alt: "Seeds of Tomorrow: the player fights a corrupted creature in a snowy, ruined street at sunset.",
    project: "Seeds of Tomorrow",
    position: "50% 50%",
    shade: 0.38,
  },
  {
    src: "/images/hero/sk-hyperspace-crop.jpg",
    alt: "Shattered Skies: the ship's hull and cyan engine close up, streaking through purple hyperspace.",
    project: "Shattered Skies",
    position: "45% 50%",
    shade: 0.1,
  },
  {
    src: "/images/moon-knight/environment.png",
    alt: "Moon-Knight: a narrow forest path at night, a statue half-hidden in the trees and a strip of stars overhead.",
    project: "Moon-Knight",
    position: "50% 45%",
    shade: 0.12,
  },
  {
    src: "/images/shattered-skies/ship-interior.png",
    alt: "Shattered Skies: the astronaut crossing a dark ship hold lined with glowing red and purple crates.",
    project: "Shattered Skies",
    position: "45% 40%",
    shade: 0,
  },
];