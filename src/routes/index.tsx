import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { site } from "@/content/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sunlit Valley Homestay — Saree Village, Uttarakhand" },
      { name: "description", content: "A peaceful Himalayan homestay in Saree Village, Uttarakhand. Enquire to book your mountain stay." },
      { property: "og:title", content: "Sunlit Valley Homestay — Saree Village, Uttarakhand" },
      { property: "og:description", content: "A peaceful Himalayan homestay in Saree Village, Uttarakhand." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const nav = [
  ["About", "about"], ["Rooms", "rooms"], ["Facilities", "facilities"], ["Gallery", "gallery"],
  ["Explore", "explore"], ["Location", "location"], ["Contact", "contact"],
] as const;

const wa = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hello, I'd like to enquire about a stay at ${site.name}.`)}`;
const enquireHref = site.googleFormUrl || wa;

function Eyebrow({ children }: { children: string }) {
  return <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">{children}</p>;
}
function H2({ children }: { children: string }) {
  return <h2 className="font-display text-4xl font-medium leading-tight md:text-5xl">{children}</h2>;
}
const btn = "inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold tracking-wide transition hover:-translate-y-0.5";

function Index() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);
  const solid = scrolled || open;

  return (
    <div className="font-sans">
      <header className={`fixed inset-x-0 top-0 z-50 transition ${solid ? "bg-background/95 text-foreground shadow-sm backdrop-blur" : "text-on-image"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#home" className="font-display text-2xl font-semibold">Sunlit Valley</a>
          <nav className="hidden items-center gap-7 text-sm lg:flex">
            {nav.map(([l, id]) => <a key={id} href={`#${id}`} className="opacity-90 hover:text-accent">{l}</a>)}
            <a href="#enquiry" className={`${btn} bg-accent py-2 text-accent-foreground`}>Enquire Now</a>
          </nav>
          <button aria-label="Menu" className="lg:hidden" onClick={() => setOpen(!open)}>
            <div className="space-y-1.5"><span className="block h-0.5 w-6 bg-current" /><span className="block h-0.5 w-6 bg-current" /><span className="block h-0.5 w-6 bg-current" /></div>
          </button>
        </div>
        {open && (
          <nav className="flex flex-col gap-1 border-t px-5 pb-5 lg:hidden">
            {[...nav, ["Booking Enquiry", "enquiry"] as const].map(([l, id]) => (
              <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="py-2">{l}</a>
            ))}
          </nav>
        )}
      </header>

      <section id="home" className="relative flex min-h-[100svh] items-end overflow-hidden text-on-image">
        <img src={site.images.hero} alt="Himalayan peaks at sunrise over Saree Village" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover object-[70%_center]" />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 md:pb-28">
          <p className="animate-rise mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-accent">{site.location}</p>
          <h1 className="animate-rise font-display text-5xl font-medium leading-[1.05] [animation-delay:.15s] md:text-7xl lg:text-8xl">{site.name}</h1>
          <p className="animate-rise mt-5 max-w-xl text-lg opacity-90 [animation-delay:.3s]">Wake up to golden Himalayan mornings in a quiet mountain village.</p>
          <div className="animate-rise mt-8 flex flex-wrap gap-3 [animation-delay:.45s]">
            <a href="#enquiry" className={`${btn} bg-accent text-accent-foreground`}>Enquire Now</a>
            <a href="#rooms" className={`${btn} border border-on-image/60 hover:bg-on-image/10`}>View Rooms</a>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:grid-cols-2 md:items-center">
        <div className="reveal"><Eyebrow>About Us</Eyebrow><H2>A peaceful stay in the heart of Saree Village</H2></div>
        <p className="reveal text-lg leading-relaxed text-muted-foreground">{site.about}</p>
      </section>

      <section id="rooms" className="bg-secondary py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="reveal mb-12"><Eyebrow>Our Rooms</Eyebrow><H2>Rest in comfort</H2></div>
          <div className="grid gap-8 md:grid-cols-2">
            {site.rooms.map((r) => (
              <article key={r.name} className="reveal overflow-hidden rounded-xl bg-card shadow-soft">
                <div className="overflow-hidden"><img src={r.image} alt={r.name} loading="lazy" width={1024} height={1024} className="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-105" /></div>
                <div className="p-7">
                  <h3 className="font-display text-3xl">{r.name}</h3>
                  <p className="mt-2 text-muted-foreground">{r.description}</p>
                  <div className="mt-6 flex items-center justify-between border-t pt-5">
                    <span className="text-sm font-semibold text-primary">{r.price}</span>
                    <a href="#enquiry" className="text-sm font-semibold text-accent hover:underline">Enquire →</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="facilities" className="mx-auto max-w-7xl px-5 py-24">
        <div className="reveal mb-12"><Eyebrow>Facilities</Eyebrow><H2>What we offer</H2></div>
        <div className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {site.facilities.map((f, i) => (
            <div key={i} className="reveal bg-card p-8">
              <span className="font-display text-4xl text-accent">0{i + 1}</span>
              <h3 className="mt-4 font-display text-2xl">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="gallery" className="bg-secondary py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="reveal mb-12"><Eyebrow>Gallery</Eyebrow><H2>Moments from the valley</H2></div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {site.gallery.map((src, i) => (
              <div key={i} className={`reveal overflow-hidden rounded-lg ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
                <img src={src} alt={`Sunlit Valley gallery photo ${i + 1}`} loading="lazy" className="h-full min-h-40 w-full object-cover transition duration-700 hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="explore" className="relative overflow-hidden py-28 text-on-image">
        <img src={site.images.village} alt="Saree Village with Himalayan peaks" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto max-w-7xl px-5">
          <div className="reveal max-w-2xl"><Eyebrow>Explore Saree Village</Eyebrow><H2>Where the Himalayas feel close enough to touch</H2></div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {site.explore.map((e) => (
              <div key={e.title} className="reveal rounded-xl border border-on-image/25 bg-on-image/10 p-7 backdrop-blur-md">
                <h3 className="font-display text-2xl">{e.title}</h3><p className="mt-2 opacity-85">{e.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="location" className="mx-auto grid max-w-7xl gap-10 px-5 py-24 md:grid-cols-5 md:items-center">
        <div className="reveal md:col-span-2">
          <Eyebrow>Location</Eyebrow><H2>Find us</H2>
          <p className="mt-4 text-lg text-muted-foreground">{site.name}<br />{site.location}</p>
          <a href={site.mapsLink} target="_blank" rel="noreferrer" className={`${btn} mt-8 bg-primary text-primary-foreground`}>Open in Google Maps</a>
        </div>
        <iframe title="Map" src={site.mapsEmbed} loading="lazy" className="reveal h-80 w-full rounded-xl border shadow-soft md:col-span-3 md:h-96" />
      </section>

      <section id="contact" className="bg-primary py-24 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 text-center">
          <div className="reveal"><Eyebrow>Contact Us</Eyebrow><H2>We'd love to host you</H2></div>
          <a href={`tel:${site.phoneTel}`} className="reveal mt-6 block font-display text-4xl hover:text-accent md:text-5xl">{site.phoneDisplay}</a>
          <div className="reveal mt-8 flex flex-wrap justify-center gap-3">
            <a href={wa} target="_blank" rel="noreferrer" className={`${btn} bg-accent text-accent-foreground`}>Enquire on WhatsApp</a>
            <a href={`tel:${site.phoneTel}`} className={`${btn} border border-primary-foreground/40`}>Call Now</a>
          </div>
        </div>
      </section>

      <section id="enquiry" className="mx-auto max-w-4xl px-5 py-24">
        <div className="reveal rounded-2xl border bg-card p-10 text-center shadow-soft md:p-16">
          <Eyebrow>Booking Enquiry</Eyebrow><H2>Plan your mountain stay</H2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">Share your dates and number of guests, and we'll get back to you personally.</p>
          <a href={enquireHref} target="_blank" rel="noreferrer" className={`${btn} mt-8 bg-accent text-accent-foreground`}>Send Booking Enquiry</a>
        </div>
      </section>

      <footer className="border-t bg-secondary">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-3">
          <div><p className="font-display text-2xl">{site.name}</p><p className="mt-2 text-sm text-muted-foreground">{site.location}</p></div>
          <div className="text-sm"><p className="font-semibold">Contact</p><a href={`tel:${site.phoneTel}`} className="mt-2 block text-muted-foreground hover:text-accent">{site.phoneDisplay}</a><a href={wa} target="_blank" rel="noreferrer" className="block text-muted-foreground hover:text-accent">WhatsApp</a><a href={site.mapsLink} target="_blank" rel="noreferrer" className="block text-muted-foreground hover:text-accent">Google Maps</a></div>
          <nav className="grid grid-cols-2 gap-1 text-sm">{nav.map(([l, id]) => <a key={id} href={`#${id}`} className="text-muted-foreground hover:text-accent">{l}</a>)}</nav>
        </div>
        <p className="pb-8 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} {site.name}</p>
      </footer>
    </div>
  );
}
