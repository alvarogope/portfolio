import type { Project } from "../schema";
import { moonKnight } from "./moon-knight";
import { breakIn } from "./break-in";
import { shatteredSkies } from "./shattered-skies";
import { seedsOfTomorrow } from "./seeds-of-tomorrow";

/* The ordered list of games for the homepage grid.
   Moon-Knight, Break-In, Shattered Skies are the three co-equal
   pillars; Seeds of Tomorrow is the fourth card. */
export const games: Project[] = [
  moonKnight,
  breakIn,
  shatteredSkies,
  seedsOfTomorrow,
];