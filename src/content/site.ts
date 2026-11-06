// All editable website content lives here.
// Rewrite the text in place — the page shows it exactly as written.
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
    quickFacts: [
      { label: "Check-in", value: "5:00 AM" },
      { label: "Check-out", value: "11:00 AM" },
      { label: "Rooms", value: "Mountain View" },
      { label: "Tariff", value: "₹900 onwards" },
    ],
  },

  // ---------------------------------------------------------------- FACILITIES
  facilities: {
    eyebrow: "Facilities",
    heading: "What we offer",
    groups: [
      {
        title: "In the rooms",
        items: ["Free Wi-Fi", "Geyser", "Heater", "Power backup"],
      },
      {
        title: "Around the house",
        items: ["Mountain view balcony", "Bonfire", "Parking"],
      },
    ],
  },

  // ---------------------------------------------------------------- ROOMS & TARIFF
  rooms: {
    eyebrow: "Rooms & Tariff",
    heading: "Rooms & Tariff",
    list: [
      {
        name: "Mountain View Room",
        image: room1,
        description: "A warm, wood-finished room whose window and balcony open straight onto the mountains.",
        sleeps: "Sleeps 2",
        features: ["Mountain view balcony", "Attached bathroom", "Geyser", "Heater"],
        tariff: [{ label: "Tariff", value: "₹900 per person per night" }],
      },
      {
        name: "Mountain View Family Room",
        image: room2,
        description: "A spacious mountain-view room with room for the whole family to rest after a day outdoors.",
        sleeps: "Sleeps 4",
        features: ["Mountain view balcony", "Attached bathroom", "Geyser", "Heater", "Extra seating"],
        tariff: [{ label: "Tariff", value: "₹900 per person per night" }],
      },
    ],
    tariffNotes: ["Tariff is per person per night.", "Power backup keeps the lights on through the night."],
  },

  // ---------------------------------------------------------------- CONTACT
  contact: {
    eyebrow: "Contact Us",
    heading: "We'd love to host you",
    intro:
      "Call or message us on WhatsApp with your dates, the number of guests and your arrival time — we'll confirm the rooms for you.",
    blocks: [
      { label: "Phone", value: "+91 87917 63547", hint: "Call us directly", link: "phone" },
      { label: "WhatsApp", value: "+91 87917 63547", hint: "Fastest reply — send your dates", link: "whatsapp" },
      { label: "Address", value: "Saree Village, Uttarakhand, India", hint: "Open the map for directions", link: "maps" },
    ],
    bestTime:
      "Check-in is from 5:00 AM and check-out is by 11:00 AM. Message us on WhatsApp before you set off so we can have everything ready when you arrive.",
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
