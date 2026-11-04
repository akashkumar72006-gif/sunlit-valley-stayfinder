import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { site, telUrl, whatsappUrl } from "@/content/site";

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

// Google Form (if added later) wins; otherwise every enquiry goes straight to WhatsApp.
const enquireHref = site.googleFormUrl || whatsappUrl;

function Eyebrow({ children }: { children: string }) {
  return <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">{children}</p>;
}
function H2({ children }: { children: string }) {
  return <h2 className="font-display text-4xl font-medium leading-tight md:text-5xl">{children}</h2>;
}
const btn = "inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold tracking-wide transition hover:-translate-y-0.5";

function WhatsAppIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
function PhoneIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M6.62 10.79a15.15 15.15 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.36 11.36 0 003.57.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.57 1 1 0 01-.25 1.02l-2.2 2.2Z" />
    </svg>
  );
}

function FloatingActions() {
  return (
    <div className="fixed bottom-4 right-3 z-50 flex flex-col items-end gap-2.5 md:bottom-8 md:right-6">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Sunlit Valley Homestay on WhatsApp"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-soft transition hover:-translate-y-0.5 md:h-16 md:w-16"
      >
        <WhatsAppIcon className="h-6 w-6 md:h-8 md:w-8" />
      </a>
      <a
        href={telUrl}
        aria-label={`Call Sunlit Valley Homestay on ${site.phoneDisplay}`}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft transition hover:-translate-y-0.5 md:h-16 md:w-16"
      >
        <PhoneIcon className="h-6 w-6 md:h-8 md:w-8" />
      </a>
    </div>
  );
}

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
            <a href={telUrl} className="opacity-90 hover:text-accent">Call</a>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className={`${btn} bg-accent py-2 text-accent-foreground`}>Enquire Now</a>
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
            <a href={whatsappUrl} target="_blank" rel="noreferrer" onClick={() => setOpen(false)} className="py-2 font-semibold text-accent">WhatsApp: {site.phoneDisplay}</a>
            <a href={telUrl} onClick={() => setOpen(false)} className="py-2 font-semibold">Call: {site.phoneDisplay}</a>
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
          <div className="animate-rise mt-8 flex flex-wrap gap-3 pr-16 [animation-delay:.45s] md:pr-0">
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className={`${btn} bg-accent text-accent-foreground`}>Enquire Now</a>
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
                    <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-accent hover:underline">Enquire →</a>
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
          <a href={telUrl} className="reveal mt-6 block font-display text-4xl hover:text-accent md:text-5xl">{site.phoneDisplay}</a>
          <p className="reveal mt-2 text-sm opacity-80">Phone &amp; WhatsApp</p>
          <div className="reveal mt-8 flex flex-wrap justify-center gap-3">
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className={`${btn} bg-accent text-accent-foreground`}>Enquire on WhatsApp</a>
            <a href={telUrl} className={`${btn} border border-primary-foreground/40`}>Call Now</a>
          </div>
        </div>
      </section>

      <section id="enquiry" className="mx-auto max-w-4xl px-5 py-24">
        <div className="reveal rounded-2xl border bg-card p-10 text-center shadow-soft md:p-16">
          <Eyebrow>Booking Enquiry</Eyebrow><H2>Plan your mountain stay</H2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">Share your dates and number of guests, and we'll get back to you personally.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={enquireHref} target="_blank" rel="noreferrer" className={`${btn} bg-accent text-accent-foreground`}>Send Booking Enquiry</a>
            <a href={telUrl} className={`${btn} border border-border`}>Call {site.phoneDisplay}</a>
          </div>
        </div>
      </section>

      <footer className="border-t bg-secondary">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-3">
          <div><p className="font-display text-2xl">{site.name}</p><p className="mt-2 text-sm text-muted-foreground">{site.location}</p></div>
          <div className="text-sm">
            <p className="font-semibold">Contact</p>
            <a href={telUrl} className="mt-2 block text-muted-foreground hover:text-accent">Call {site.phoneDisplay}</a>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="block text-muted-foreground hover:text-accent">WhatsApp {site.phoneDisplay}</a>
            <a href={site.mapsLink} target="_blank" rel="noreferrer" className="block text-muted-foreground hover:text-accent">Google Maps</a>
          </div>
          <nav className="grid grid-cols-2 gap-1 text-sm">{nav.map(([l, id]) => <a key={id} href={`#${id}`} className="text-muted-foreground hover:text-accent">{l}</a>)}</nav>
        </div>
        <p className="pb-8 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} {site.name}</p>
      </footer>

      <FloatingActions />
    </div>
  );
}
