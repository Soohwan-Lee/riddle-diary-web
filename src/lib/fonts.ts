import {
  Caveat,
  Gaegu,
  Geist,
  Nanum_Pen_Script,
  Shadows_Into_Light,
} from "next/font/google";

/** Interface chrome: labels, settings, the about page. */
export const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Two hands, so the voices are distinguishable without relying on colour.
 * Latin faces come first in the CSS stack; Hangul falls through to the
 * Korean face by unicode-range, which lets a single line mix both.
 *
 * The Korean faces declare only a `latin` subset, but Google ships their
 * Hangul coverage as ~90 numbered unicode-range chunks inside that same
 * request, so `["latin"]` really does get you 가–힣. Preloading all of those
 * chunks would stall the first paint for nothing, hence `preload: false` —
 * the browser fetches only the ranges a page actually uses.
 */
export const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

export const gaegu = Gaegu({
  variable: "--font-gaegu",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const shadowsIntoLight = Shadows_Into_Light({
  variable: "--font-shadows",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const nanumPenScript = Nanum_Pen_Script({
  variable: "--font-nanum-pen",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const fontVariables = [
  geist.variable,
  caveat.variable,
  gaegu.variable,
  shadowsIntoLight.variable,
  nanumPenScript.variable,
].join(" ");
