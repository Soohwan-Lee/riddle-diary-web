"use client";

import Link from "next/link";
import { Header } from "@/components/chrome/Header";
import { ArrowLeftIcon } from "@/components/icons";
import { aboutContent } from "@/lib/i18n/about";
import { useI18n } from "@/lib/i18n/provider";

export function AboutArticle() {
  const { locale } = useI18n();
  const content = aboutContent[locale];

  return (
    <div className="relative z-10 flex min-h-dvh flex-col">
      <Header />

      {/* Prose, not paper: this one keeps a reading measure rather than
          following `.ink-sheet` out to the wider column. */}
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pt-12 pb-24 sm:px-8 sm:pt-14">
        <Link
          href="/"
          className="mb-12 inline-flex items-center gap-1.5 text-[0.72rem] text-muted transition-colors hover:text-ink-user"
        >
          <ArrowLeftIcon className="size-3.5" />
          {content.back}
        </Link>

        <article>
          <h1 className="font-hand-ai text-4xl leading-tight text-ink-ai sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-6 text-[1.05rem] leading-[1.75] text-muted-strong">
            {content.lede}
          </p>

          <div className="mt-14 space-y-12">
            {content.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="mb-3 text-[0.74rem] font-medium tracking-[0.1em] text-muted uppercase">
                  {section.heading}
                </h2>
                <div className="space-y-4">
                  {section.body.map((paragraph, index) => (
                    <p key={index} className="leading-[1.85] text-ink-user">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-16 border-t border-hairline pt-8">
            <h2 className="mb-3 text-[0.74rem] font-medium tracking-[0.1em] text-muted uppercase">
              {content.referencesHeading}
            </h2>
            <ul className="space-y-2 text-[0.82rem] leading-relaxed text-muted">
              {content.references.map((reference) => (
                <li key={reference.text}>{reference.text}</li>
              ))}
            </ul>
          </section>
        </article>
      </main>
    </div>
  );
}
