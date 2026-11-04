import type { Metadata } from "next";
import { Diary } from "@/components/page/Diary";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <Diary />;
}
