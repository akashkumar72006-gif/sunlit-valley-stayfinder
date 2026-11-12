import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BedDouble,
  BedSingle,
  CalendarDays,
  Clock3,
  Flame,
  MapPin,
  Menu,
  Mountain,
  Navigation,
  ParkingCircle,
  PlugZap,
  Route as RouteIcon,
  Thermometer,
  Users,
  Waves,
  Wifi,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingSection } from "@/components/booking-section";
import { InteractiveLocationMap } from "@/components/interactive-location-map";
import { useStayMotion } from "@/hooks/use-stay-motion";
import { site, telUrl, whatsappUrl } from "@/content/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sunlit Valley Homestay — Saree Village, Uttarakhand" },
      {
        name: "description",
        content:
          "A peaceful Himalayan homestay in Saree Village, Uttarakhand. Enquire to book your mountain stay.",
      },
      { property: "og:title", content: "Sunlit Valley Homestay — Saree Village, Uttarakhand" },
      {
        property: "og:description",
        content: "A peaceful Himalayan homestay in Saree Village, Uttarakhand.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const nav = [
  ["About", "about"],
  ["Rooms & price ", "rooms"],
  ["Facilities", "facilities"],
  ["Gallery", "gallery"],
  ["Explore", "explore"],
  ["FAQ", "faq"],
  ["Location", "location"],
  ["Contact", "contact"],
  ["Book", "enquiry"],
] as const;

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-normal text-accent">{children}</p>
  );
}
function H2({ children }: { children: string }) {
  return (
    <h2 className="font-display text-4xl font-medium leading-tight md:text-5xl">{children}</h2>
  );
}
const btn = "luxury-cta h-auto min-h-12 rounded-lg px-7 py-3 text-sm font-semibold";

function FacilityIcon({ name }: { name: string }) {
  const Icon = name.toLowerCase().includes("wi-fi")
    ? Wifi
    : name.toLowerCase().includes("balcony")
      ? Mountain
      : name.toLowerCase().includes("backup")
        ? PlugZap
        : name.toLowerCase().includes("bonfire")
          ? Flame
          : name.toLowerCase().includes("parking")
            ? ParkingCircle
            : name.toLowerCase().includes("geyser")
              ? Waves
              : Thermometer;
  return (
    <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} />
  );
}

function BedIcon({ name }: { name: string }) {
  const Icon = name.toLowerCase().includes("double") ? BedDouble : BedSingle;
  return <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} />;
}

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
    <div className="floating-actions fixed bottom-4 right-4 z-40 flex gap-2 md:bottom-6 md:right-6">
      <Button
        asChild
        variant="stay"
        className="luxury-cta h-12 rounded-lg bg-foreground px-4 text-background shadow-soft md:h-14 md:px-5"
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Book Now — enquire on WhatsApp"
        >
          <CalendarDays />
          <span>Book Now</span>
        </a>
      </Button>
      <Button
        asChild
        variant="stay"
        className="luxury-cta h-12 rounded-lg bg-whatsapp px-4 text-whatsapp-foreground shadow-soft md:h-14 md:px-5"
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with Sunlit Valley Homestay on WhatsApp"
        >
          <WhatsAppIcon />
          <span>WhatsApp Enquire</span>
        </a>
      </Button>
      <Button
        asChild
        variant="stay"
        size="icon"
        className="luxury-cta h-12 w-12 rounded-lg bg-primary text-primary-foreground shadow-soft md:h-14 md:w-14"
      >
        <a
          href={telUrl}
          aria-label={`Call Sunlit Valley Homestay on ${site.phoneDisplay}`}
          title="Call Sunlit Valley Homestay"
        >
          <PhoneIcon />
        </a>
      </Button>
    </div>
  );
}

export function Index() {
  const heroRef = useStayMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeHighlightId, setActiveHighlightId] = useState(site.locationGuide.highlights[0].id);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const solid = scrolled || open;
  const activeHighlight =
    site.locationGuide.highlights.find((highlight) => highlight.id === activeHighlightId) ??
    site.locationGuide.highlights[0];
  return (
    <div className="font-sans">
      <header
        className={`luxury-nav fixed inset-x-0 top-0 z-50 border-b transition duration-500 ${solid ? "border-border bg-background/85 text-foreground shadow-sm" : "border-on-image/20 bg-foreground/20 text-on-image"}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a
            href="#home"
            className="brand-link flex shrink-0 items-center gap-3 font-display text-2xl font-medium"
          >
            <Mountain className="h-7 w-7" strokeWidth={1} />
            <span>
              Sunlit Valley<span className="block font-sans text-[10px] leading-4">HOMESTAY</span>
            </span>
          </a>
          <nav className="hidden items-center gap-4 text-xs xl:gap-5 lg:flex">
            {nav.map(([l, id]) => (
              <a key={id} href={`#${id}`} className="opacity-90 hover:text-accent">
                {l}
              </a>
            ))}
            <a href={telUrl} className="opacity-90 hover:text-accent">
              Call
            </a>
            <Button asChild variant="stay">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className={`${btn} bg-accent py-2 text-accent-foreground`}
              >
                Enquire Now
              </a>
            </Button>
          </nav>
          <Button
            variant="ghost"
            size="icon"
            aria-label={open ? "Close menu" : "Menu"}
            aria-expanded={open}
            className="lg:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
        {open && (
          <nav className="flex flex-col gap-1 border-t px-5 pb-5 lg:hidden">
            {[...nav].map(([l, id]) => (
              <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="py-2">
                {l}
              </a>
            ))}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="py-2 font-semibold text-accent"
            >
              WhatsApp: {site.phoneDisplay}
            </a>
            <a href={telUrl} onClick={() => setOpen(false)} className="py-2 font-semibold">
              Call: {site.phoneDisplay}
            </a>
          </nav>
        )}
      </header>

      <section
        id="home"
        className="relative flex min-h-[92svh] items-end overflow-hidden text-on-image"
      >
        <img
          ref={heroRef}
          src={site.images.hero}
          alt="Mountain valley and terraced village in Saree"
          width={1536}
          height={1024}
          fetchPriority="high"
          decoding="async"
          className="hero-parallax absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-28 pt-36 md:pb-28">
          <p className="animate-rise mb-4 text-xs font-semibold uppercase tracking-normal text-accent">
            {site.location}
          </p>
          <h1 className="animate-rise font-display max-w-4xl text-5xl font-medium leading-[1.05] [animation-delay:.15s] md:text-7xl lg:text-8xl">
            {site.name}
          </h1>
          <p className="animate-rise mt-5 max-w-xl text-lg opacity-90 [animation-delay:.3s]">
            Wake up to golden Himalayan mornings in a quiet mountain village.
          </p>
          <div className="animate-rise mt-8 flex flex-wrap gap-3 pr-16 [animation-delay:.45s] md:pr-0">
            <Button asChild variant="stay">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className={`${btn} bg-accent text-accent-foreground`}
              >
                Enquire Now
              </a>
            </Button>
            <Button asChild variant="stay">
              <a href="#rooms" className={`${btn} border border-on-image/60 hover:bg-on-image/10`}>
                View Rooms
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ABOUT US ---------------------------------------------------------- */}
      <section
        id="about"
        className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:grid-cols-2 md:items-start"
      >
        <div className="reveal">
          <Eyebrow>{site.about.eyebrow}</Eyebrow>
          <H2>{site.about.heading}</H2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{site.about.intro}</p>
          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border">
            {site.about.quickFacts.map((f) => (
              <div key={f.label} className="bg-card p-5">
                <dt className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                  {f.label}
                </dt>
                <dd className="mt-1 font-display text-2xl">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="reveal amenity-card rounded-lg border bg-card p-8 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-normal text-accent">
            What's waiting for you
          </p>
          <ul className="mt-5 space-y-3">
            {site.facilities.groups
              .flatMap((g) => g.items)
              .map((it) => (
                <li key={it} className="flex gap-3 text-lg text-muted-foreground">
                  <FacilityIcon name={it} />
                  <span>{it}</span>
                </li>
              ))}
          </ul>
        </div>
      </section>

      {/* ROOMS & PRICE ----------------------------------------------------- */}
      <section id="rooms" className="bg-secondary py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="reveal mb-12">
            <Eyebrow>{site.rooms.eyebrow}</Eyebrow>
            <H2>{site.rooms.heading}</H2>
          </div>
          <div className="grid gap-8">
            {site.rooms.list.map((r) => (
              <article
                key={r.name}
                className="reveal room-card group overflow-hidden rounded-2xl border bg-card shadow-soft md:grid md:grid-cols-2"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={r.image}
                    alt={r.name}
                    loading="lazy"
                    width={1536}
                    height={1024}
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover object-center transition duration-700 group-hover:scale-105 md:aspect-auto md:h-full md:min-h-96"
                  />
                  <span className="absolute left-5 top-5 rounded-full border border-on-image/30 bg-foreground/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-normal text-on-image backdrop-blur-md">
                    {r.sleeps}
                  </span>
                </div>
                <div className="flex flex-col p-7 md:p-10">
                  <h3 className="font-display text-3xl md:text-4xl">{r.name}</h3>
                  <p className="mt-3 text-muted-foreground md:text-lg">{r.description}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border bg-secondary/60 px-4 py-3">
                    {r.beds.map((b) => (
                      <span key={b} className="flex items-center gap-2 text-sm font-semibold">
                        <BedIcon name={b} />
                        <span>{b}</span>
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <Users
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-accent"
                      strokeWidth={1.5}
                    />
                    <span>{r.capacityNote}</span>
                  </p>
                  <ul className="mt-5 grid gap-1.5 text-sm text-muted-foreground sm:grid-cols-2">
                    {r.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <span className="text-accent">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-7">
                    <div className="rounded-lg border bg-secondary/60 px-5 py-4">
                      <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                        {r.price.from}
                      </p>
                      <p className="mt-1 font-display text-4xl leading-none text-primary">
                        {r.price.amount}{" "}
                        <span className="font-sans text-sm font-semibold text-primary">
                          {r.price.unit}
                        </span>
                      </p>
                    </div>
                    <Button asChild variant="stay">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`${btn} bg-accent text-accent-foreground`}
                      >
                        Enquire about this room
                      </a>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="reveal mt-10 border-t pt-6">
            <p className="text-sm font-semibold uppercase tracking-normal text-muted-foreground">
              Price notes
            </p>
            <ul className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
              {site.rooms.priceNotes.map((n, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FACILITIES -------------------------------------------------------- */}
      <section id="facilities" className="mx-auto max-w-7xl px-5 py-24">
        <div className="reveal mb-12">
          <Eyebrow>{site.facilities.eyebrow}</Eyebrow>
          <H2>{site.facilities.heading}</H2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {site.facilities.groups.map((g) => (
            <div
              key={g.title}
              className="reveal amenity-card rounded-lg border bg-card p-8 shadow-soft"
            >
              <h3 className="font-display text-2xl">{g.title}</h3>
              <ul className="mt-5 grid gap-3 text-base text-muted-foreground sm:grid-cols-2">
                {g.items.map((it) => (
                  <li key={it} className="flex gap-2">
                    <FacilityIcon name={it} />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="gallery" className="bg-secondary py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="reveal mb-12">
            <Eyebrow>Gallery</Eyebrow>
            <H2>Moments from the valley</H2>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-12 md:auto-rows-[14rem] md:gap-4">
            {site.gallery.map((photo, i) => (
              <figure
                key={photo.src}
                className={`reveal gallery-tile group relative overflow-hidden rounded-lg shadow-soft ${
                  i === 0
                    ? "col-span-2 md:col-span-7 md:row-span-2"
                    : i === 1 || i === 2
                      ? "md:col-span-5"
                      : i === 3
                        ? "md:col-span-4"
                        : "md:col-span-8"
                }`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="h-full min-h-48 w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                  style={{ animationDelay: `${i * 90}ms` }}
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 via-foreground/35 to-transparent px-4 pb-4 pt-10 text-sm font-semibold text-on-image opacity-100 transition duration-500 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:px-5 md:pb-5">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="explore" className="relative overflow-hidden py-28 text-on-image">
        <img
          src={site.images.village}
          alt="Green village terraces below the Himalayan mountains"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto max-w-7xl px-5">
          <div className="reveal max-w-2xl">
            <Eyebrow>Explore Saree Village</Eyebrow>
            <H2>Where the Himalayas feel close enough to touch</H2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {site.explore.map((e) => (
              <div
                key={e.title}
                className="reveal rounded-lg border border-on-image/25 bg-on-image/10 p-7 backdrop-blur-md"
              >
                <h3 className="font-display text-2xl">{e.title}</h3>
                <p className="mt-2 opacity-85">{e.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-4xl px-5 py-24">
        <div className="reveal mb-10">
          <Eyebrow>Guest FAQ</Eyebrow>
          <H2>Good to know before you come</H2>
        </div>
        <div className="divide-y rounded-lg border bg-card">
          {site.faq.map((f) => (
            <details key={f.q} className="reveal group p-6 transition-colors hover:bg-secondary/60">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl">
                {f.q}
                <span className="text-accent transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="location" className="bg-secondary py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="reveal max-w-2xl">
            <Eyebrow>{site.locationGuide.eyebrow}</Eyebrow>
            <H2>{site.locationGuide.heading}</H2>
            <p className="mt-4 text-lg text-muted-foreground">{site.locationGuide.intro}</p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[.78fr_1.22fr] lg:items-stretch">
            <div className="reveal rounded-2xl border bg-card p-4 shadow-soft sm:p-6">
              <div className="flex items-start gap-3 border-b pb-5">
                <span className="rounded-full bg-accent/20 p-2 text-accent">
                  <MapPin aria-hidden="true" className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-2xl">{site.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{site.location}</p>
                </div>
              </div>
              <div className="mt-5 space-y-2">
                {site.locationGuide.highlights.map((highlight) => {
                  const selected = highlight.id === activeHighlight.id;
                  return (
                    <button
                      key={highlight.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setActiveHighlightId(highlight.id)}
                      className={`w-full rounded-xl border p-4 text-left transition duration-300 ${selected ? "border-accent bg-accent/10 shadow-sm" : "border-transparent hover:border-border hover:bg-secondary"}`}
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span className="flex items-start gap-3">
                          <MapPin
                            aria-hidden="true"
                            className={`mt-0.5 h-4 w-4 shrink-0 ${selected ? "text-accent" : "text-muted-foreground"}`}
                          />
                          <span>
                            <span className="block font-semibold">{highlight.name}</span>
                            <span className="mt-1 block text-xs uppercase tracking-[.12em] text-muted-foreground">
                              {highlight.label}
                            </span>
                          </span>
                        </span>
                        <Navigation
                          aria-hidden="true"
                          className={`mt-0.5 h-4 w-4 shrink-0 transition ${selected ? "rotate-45 text-accent" : "text-muted-foreground/50"}`}
                        />
                      </span>
                    </button>
                  );
                })}
              </div>
              <Button asChild variant="stay" className="mt-5 w-full">
                <a
                  href={site.mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className={`${btn} w-full bg-primary text-primary-foreground`}
                >
                  <Navigation aria-hidden="true" />
                  Get directions
                </a>
              </Button>
            </div>

            <div className="reveal overflow-hidden rounded-2xl border bg-card shadow-soft">
              <div className="relative h-80 md:h-[29rem]">
                <InteractiveLocationMap
                  highlights={site.locationGuide.highlights}
                  activeHighlightId={activeHighlight.id}
                  onSelect={setActiveHighlightId}
                />
                <div className="pointer-events-none absolute left-4 top-4 rounded-lg border border-on-image/20 bg-foreground/75 px-4 py-3 text-on-image shadow-soft backdrop-blur-md">
                  <p className="text-xs font-semibold uppercase tracking-[.14em] text-accent">
                    Selected place
                  </p>
                  <p className="mt-1 font-display text-xl">{activeHighlight.name}</p>
                </div>
              </div>
              <div className="grid gap-4 border-t p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
                <div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {activeHighlight.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-[.1em] text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <RouteIcon aria-hidden="true" className="h-4 w-4 text-accent" />
                      {activeHighlight.distance}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock3 aria-hidden="true" className="h-4 w-4 text-accent" />
                      {activeHighlight.travelTime}
                    </span>
                  </div>
                </div>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${activeHighlight.coordinates[0]}&mlon=${activeHighlight.coordinates[1]}#map=15/${activeHighlight.coordinates[0]}/${activeHighlight.coordinates[1]}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-primary underline decoration-accent decoration-2 underline-offset-4 transition hover:text-accent"
                >
                  Open in OpenStreetMap
                </a>
              </div>
            </div>
          </div>

          <div className="reveal mt-6 grid gap-px overflow-hidden rounded-2xl border bg-border md:grid-cols-3">
            {site.locationGuide.directions.map((direction) => (
              <div key={direction.step} className="bg-card p-6 md:p-7">
                <p className="text-xs font-semibold tracking-[.16em] text-accent">
                  {direction.step}
                </p>
                <h3 className="mt-3 font-display text-2xl">{direction.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {direction.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT ----------------------------------------------------------- */}
      <section id="contact" className="bg-primary py-24 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5">
          <div className="reveal text-center">
            <Eyebrow>{site.contact.eyebrow}</Eyebrow>
            <H2>{site.contact.heading}</H2>
            <p className="mx-auto mt-4 max-w-xl opacity-85">{site.contact.intro}</p>
          </div>

          <div className="reveal mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {site.contact.blocks.map((b) => {
              const href =
                b.link === "phone"
                  ? telUrl
                  : b.link === "whatsapp"
                    ? whatsappUrl
                    : b.link === "maps"
                      ? site.mapsLink
                      : b.link === "email" && !b.value.startsWith("[")
                        ? `mailto:${b.value}`
                        : undefined;
              const external = b.link === "whatsapp" || b.link === "maps";
              const card =
                "rounded-lg border border-primary-foreground/25 bg-primary-foreground/10 p-5";
              const body = (
                <>
                  <p className="text-xs font-semibold uppercase tracking-normal text-accent">
                    {b.label}
                  </p>
                  <p className="mt-2 font-display text-xl">{b.value}</p>
                  <p className="mt-1 text-xs opacity-75">{b.hint}</p>
                </>
              );
              return href ? (
                <a
                  key={b.label}
                  href={href}
                  {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className={`${card} transition hover:-translate-y-0.5`}
                >
                  {body}
                </a>
              ) : (
                <div key={b.label} className={card}>
                  {body}
                </div>
              );
            })}
          </div>

          <div className="reveal mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild variant="stay">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className={`${btn} bg-accent text-accent-foreground`}
              >
                Enquire on WhatsApp
              </a>
            </Button>
            <Button asChild variant="stay">
              <a href={telUrl} className={`${btn} border border-primary-foreground/40`}>
                Call Now
              </a>
            </Button>
          </div>

          <div className="reveal mt-12 rounded-lg border border-primary-foreground/25 bg-primary-foreground/10 p-6">
            <p className="text-xs font-semibold uppercase tracking-normal text-accent">
              Before you arrive
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed opacity-90">
              {site.contact.bestTime}
            </p>
          </div>
        </div>
      </section>

      <section id="enquiry" className="mx-auto max-w-7xl px-5 py-24">
        <div className="reveal mb-10 text-center">
          <Eyebrow>Book Your Stay</Eyebrow>
          <H2>Plan your mountain stay</H2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Pick your dates and guests to see the total. Confirm directly — no online payment, you
            pay at the homestay when you arrive.
          </p>
        </div>
        <div className="reveal">
          <BookingSection />
        </div>
      </section>

      <footer className="border-t bg-secondary pb-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl">{site.name}</p>
            <p className="mt-2 text-sm text-muted-foreground">{site.location}</p>
          </div>
          <div className="text-sm">
            <p className="font-semibold">Contact</p>
            <a href={telUrl} className="mt-2 block text-muted-foreground hover:text-accent">
              Call {site.phoneDisplay}
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="block text-muted-foreground hover:text-accent"
            >
              WhatsApp {site.phoneDisplay}
            </a>
            <a
              href={site.mapsLink}
              target="_blank"
              rel="noreferrer"
              className="block text-muted-foreground hover:text-accent"
            >
              Google Maps
            </a>
          </div>
          <nav className="grid grid-cols-2 gap-1 text-sm">
            {nav.map(([l, id]) => (
              <a key={id} href={`#${id}`} className="text-muted-foreground hover:text-accent">
                {l}
              </a>
            ))}
          </nav>
        </div>
        <p className="pb-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {site.name}
        </p>
      </footer>

      <FloatingActions />
    </div>
  );
}
