import { Link } from "@tanstack/react-router";
import { Mountain } from "lucide-react";

export type PolicySection = {
  heading: string;
  paragraphs: string[];
};

export function PolicyPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: PolicySection[];
}) {
  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-3 font-display text-2xl font-medium"
          >
            <Mountain className="h-7 w-7" strokeWidth={1} />
            <span>
              Sunlit Valley
              <span className="block font-sans text-[10px] leading-4">HOMESTAY</span>
            </span>
          </Link>
          <Link
            to="/"
            className="text-sm font-semibold text-primary underline decoration-accent decoration-2 underline-offset-4 transition hover:text-accent"
          >
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-14">
        <p className="text-xs font-semibold uppercase tracking-normal text-accent">Legal</p>
        <h1 className="mt-2 font-display text-4xl font-medium leading-tight md:text-5xl">
          {title}
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">Last updated: {updated}</p>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{intro}</p>

        <div className="mt-10 space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-2xl">{section.heading}</h2>
              <div className="mt-3 space-y-3">
                {section.paragraphs.map((paragraph, i) => (
                  <p key={i} className="leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-lg border bg-secondary p-6">
          <p className="font-semibold">Questions about this policy?</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Call or WhatsApp us at +91 87917 63547, or write to us at Saree Village, Uttarakhand,
            India — we're happy to help.
          </p>
        </div>
      </main>

      <footer className="border-t bg-secondary">
        <p className="mx-auto max-w-4xl px-5 py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Sunlit Valley Homestay · Saree Village, Uttarakhand, India
        </p>
      </footer>
    </div>
  );
}
