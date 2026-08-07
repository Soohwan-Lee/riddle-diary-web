import type { Metadata } from "next";
import { AboutArticle } from "@/components/page/AboutArticle";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why a diary that writes back should also let go: slow technology, critical design, and what a disappearing interface owes the people using it.",
};

export default function AboutPage() {
  return <AboutArticle />;
}
