import { Header } from "@/components/chrome/Header";

export default function HomePage() {
  return (
    <div className="relative z-10 flex min-h-dvh flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-6">
        <p className="font-hand-ai text-3xl text-ink-ai">the page is being prepared</p>
      </main>
    </div>
  );
}
