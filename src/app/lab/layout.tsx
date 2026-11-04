import type { Metadata } from "next";

/**
 * `/lab` is the ink engine's testbed, not part of the reading experience.
 * Keep it reachable for development, but out of search results.
 */
export const metadata: Metadata = {
  title: "Ink lab",
  robots: { index: false, follow: false },
};

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return children;
}
