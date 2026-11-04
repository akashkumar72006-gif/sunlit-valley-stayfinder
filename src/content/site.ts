// All editable website content lives here.
// Every block below is a labelled placeholder — rewrite the text in place.
// Anything inside [square brackets] is still to be filled in with your real details.
import hero from "@/assets/hero.jpg";
import room1 from "@/assets/room1.jpg";
import room2 from "@/assets/room2.jpg";
import village from "@/assets/village.jpg";

export const site = {
  name: "Sunlit Valley Homestay",
  location: "Saree Village, Uttarakhand, India",

  // ---------------------------------------------------------------- CONTACT
  // These are used by every call / WhatsApp button on the site.
  phoneDisplay: "+91 87917 63547",
  phoneTel: "+918791763547",
  whatsapp: "918791763547",
  whatsappMessage: "Hello! I want to inquire about booking at Sunlit Valley Homestay.",
  whatsappChatUrl:
    "https://wa.me/918791763547?text=Hello!%20I%20want%20to%20inquire%20about%20booking%20at%20Sunlit%20Valley%20Homestay.",
  mapsLink: "https://maps.app.goo.gl/TGRJPpnK6mFrC2nJA",
  mapsEmbed: "https://www.google.com/maps?q=Saree+Village,+Uttarakhand&output=embed",
  // Paste your Google Form link here later; the enquiry button will open it.
  googleFormUrl: "",

  images: { hero, village },

  // ---------------------------------------------------------------- ABOUT US
  about: {
    eyebrow: "About Us",
    heading: "A peaceful stay in the heart of Saree Village",
    intro:
      "Tucked into the quiet terraces of Saree Village, Sunlit Valley Homestay is a family-run home where mornings begin with mountain light and evenings end under a sky full of stars. Come slow down, breathe the clean Himalayan air and experience village life the way it's meant to be lived.",
    paragraphs: [
      "[Our story — when this home came to be, who runs it, and what guests usually feel when they arrive. Write 2–3 sentences.]",
      "[A day here — morning tea on the deck, a walk through the village, dinner cooked at home. Write 2–3 sentences.]",
      "[Why you host guests — what you want people to take home with them. Write 2–3 sentences.]",
    ],
    hostNote: {
      label: "A note from your host",
      text: "[A personal welcome line, signed with your name — for example: 'We keep our doors open the way we would like to be received at ours.' — Akash Kumar]",
    },
    quickFacts: [
      { label: "Rooms", value: "[2 rooms]" },
      { label: "Check-in", value: "[2:00 PM]" },
      { label: "Check-out", value: "[11:00 AM]" },
      { label: "Best months", value: "[Mar–Jun, Sep–Nov]" },
    ],
  },

  // ---------------------------------------------------------------- FACILITIES
  // Keep only the lines you can confirm; delete anything you don't actually offer.
  facilities: {
    eyebrow: "Facilities",
    heading: "What we offer",
    note: "Only keep the lines you can confirm — delete anything you don't actually provide.",
    groups: [
      {
        title: "In the rooms",
        items: ["[Bedding and warm blankets]", "[Attached bathroom]", "[Hot water at set hours]", "[Wi-Fi, or write 'No Wi-Fi']"],
      },
      {
        title: "Meals",
        items: ["[Home-cooked breakfast]", "[Dinner on request]", "[Tea and snacks anytime]", "[Meal timings: ...]"],
      },
      {
        title: "Around the house",
        items: ["[Sunrise deck]", "[Parking space]", "[Bonfire on request]", "[Games or books available]"],
      },
      {
        title: "Help we offer",
        items: ["[Village walks led by us]", "[Trek and route guidance]", "[Local transport help]", "[Airport / station pickup]"],
      },
    ],
  },

  // ---------------------------------------------------------------- ROOMS & TARIFF
  rooms: {
    eyebrow: "Rooms & Tariff",
    heading: "Rooms & Tariff",
    note: "[Add or delete rooms below, and fill the tariff lines with your real rates — the page shows them exactly as written.]",
    list: [
      {
        name: "Valley View Room",
        image: room1,
        description: "A warm, wood-finished room with a window that opens to the mountains.",
        sleeps: "[Sleeps 2]",
        features: ["[Mountain-facing window]", "[Attached bathroom]", "[Hot water]", "[Warm blankets]"],
        tariff: [
          { label: "Night tariff", value: "[₹ ___ per night]" },
          { label: "Extra mattress", value: "[₹ ___]" },
          { label: "Meals", value: "[Breakfast ₹ ___ / Dinner ₹ ___]" },
        ],
      },
      {
        name: "Family Room",
        image: room2,
        description: "A spacious room with room for the whole family to rest after a day outdoors.",
        sleeps: "[Sleeps 4]",
        features: ["[Two beds + mattress space]", "[Attached bathroom]", "[Hot water]", "[Extra seating]"],
        tariff: [
          { label: "Night tariff", value: "[₹ ___ per night]" },
          { label: "Extra mattress", value: "[₹ ___]" },
          { label: "Meals", value: "[Breakfast ₹ ___ / Dinner ₹ ___]" },
        ],
      },
    ],
    tariffNotes: [
      "[Tariff is per room per night and includes ...]",
      "[Advance payment and cancellation policy]",
      "[Weekend, holiday or peak-season rates]",
    ],
  },

  // ---------------------------------------------------------------- CONTACT
  contact: {
    eyebrow: "Contact Us",
    heading: "We'd love to host you",
    intro:
      "[Tell guests how to reach you and what to mention in the first message — your dates, number of guests, and arrival time.]",
    blocks: [
      { label: "Phone", value: "+91 87917 63547", hint: "[Call any time, 8 AM – 10 PM]", link: "phone" },
      { label: "WhatsApp", value: "+91 87917 63547", hint: "[Fastest reply — send your dates]", link: "whatsapp" },
      { label: "Email", value: "[your@email.com]", hint: "[For longer enquiries]", link: "email" },
      { label: "Address", value: "Saree Village, Uttarakhand, India", hint: "[Nearest landmark]", link: "maps" },
    ],
    directions:
      "[How to reach us — nearest town and distance, bus or taxi route, the last stretch on foot or by local vehicle, and a landmark to look for.]",
    bestTime:
      "[Best time to reach us — for example: 'Call between 9 AM and 9 PM. If you are arriving late, please message us on WhatsApp first.']",
  },

  // ---------------------------------------------------------------- GALLERY & EXPLORE
  gallery: [hero, room1, village, room2, village, hero],
  explore: [
    { title: "Village life", text: "Stone houses, terraced fields and a slower rhythm of days." },
    { title: "Himalayan views", text: "Snow peaks rise over the valley on clear mornings." },
    { title: "Forest trails", text: "Walk through pine and deodar forests around the village." },
  ],
};

// Direct WhatsApp chat with the pre-filled enquiry message.
export const whatsappUrl = site.whatsappChatUrl;
export const telUrl = `tel:${site.phoneTel}`;
