import {
  Caveat,
  Gaegu,
  Geist,
  Hi_Melody,
  Kalam,
  Nanum_Brush_Script,
  Nanum_Pen_Script,
  Patrick_Hand,
  Shadows_Into_Light,
} from "next/font/google";

/** Interface chrome: labels, settings, the about page. */
export const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Four hands, each a Latin face paired with a Hangul one. Latin comes first in
 * the stack; Hangul falls through by unicode-range, which lets a single line
 * mix both without a seam.
 *
 * The Korean faces declare only a `latin` subset, but Google ships their
 * Hangul coverage as ~90 numbered unicode-range chunks inside that same
 * request, so `["latin"]` really does get you 가–힣. Preloading all of those
 * chunks would stall the first paint for nothing, hence `preload: false` —
 * the browser fetches only the ranges a page actually uses, and only for the
 * hand a reader has actually chosen.
 */

// pen — a ballpoint in a hurry
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

// quill — a thin nib, the page's own hand
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

// brush — wetter, and the strokes have a direction
export const kalam = Kalam({
  variable: "--font-kalam",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const nanumBrushScript = Nanum_Brush_Script({
  variable: "--font-nanum-brush",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

// print — someone taking care to be read
export const patrickHand = Patrick_Hand({
  variable: "--font-patrick",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const hiMelody = Hi_Melody({
  variable: "--font-hi-melody",
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
  kalam.variable,
  nanumBrushScript.variable,
  patrickHand.variable,
  hiMelody.variable,
].join(" ");
