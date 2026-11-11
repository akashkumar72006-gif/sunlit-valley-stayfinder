// All editable website content lives here.
// Rewrite the text in place — the page shows it exactly as written.
import heroAsset from "@/assets/snow-peak-valley.jpg.asset.json";
import room1Asset from "@/assets/mountain-view-room.jpg.asset.json";
import room2Asset from "@/assets/balcony-corridor.jpg.asset.json";
import villageAsset from "@/assets/village-terraces.png.asset.json";
import valleyAsset from "@/assets/valley-view.jpg.asset.json";

const hero = heroAsset.url;
const room1 = room1Asset.url;
const room2 = room2Asset.url;
const village = villageAsset.url;
const valley = valleyAsset.url;

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
      { label: "Check-in", value: "5:00 PM" },
      { label: "Check-out", value: "11:00 AM" },
      { label: "Rooms", value: "Mountain View" },
      { label: "Price", value: "₹900 onwards" },
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

  // ---------------------------------------------------------------- ROOMS & PRICE
  rooms: {
    eyebrow: "Rooms & Price",
    heading: "Rooms & Price",
    list: [
      {
        name: "Mountain View Room",
        image: room1,
        description:
          "A warm, wood-finished room whose window and balcony open straight onto the mountains. The double-and-single bed setup gives extra comfort to families and groups traveling together.",
        sleeps: "3 to 4 Sleeps",
        capacityNote: "Ideal for 3 adults or a family of 4 with a child",
        beds: ["1 Double Bed", "1 Single Bed"],
        features: ["Mountain view balcony", "Attached bathroom", "Geyser", "Heater"],
        price: { from: "Starting at", amount: "₹900", unit: "per person per night" },
      },
    ],
    priceNotes: ["Price is per person per night.", "Power backup keeps the lights on through the night."],
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
      "Check-in is from 5:00 PM and check-out is by 11:00 AM. Message us on WhatsApp before you set off so we can have everything ready when you arrive.",
  },

  // ---------------------------------------------------------------- GUEST FAQ
  faq: [
    { q: "What are the check-in and check-out times?", a: "Check-in is from 5:00 PM and check-out is by 11:00 AM." },
    { q: "How much does a stay cost?", a: "Mountain View Rooms start at ₹900 per person per night." },
    { q: "Is there Wi-Fi and power backup?", a: "Yes — free Wi-Fi and power backup are available for all guests." },
    { q: "Will I stay warm in the cold months?", a: "Rooms have a heater and geyser, and we light a bonfire in the evenings." },
    { q: "Can I bring my car or bike?", a: "Yes, parking is available at the homestay." },
    { q: "How do I book?", a: "Message us on WhatsApp or call +91 87917 63547 with your dates and number of guests." },
  ],
  extras: {
    heading: "Need something extra?",
    text: "Planning a bike or scooty ride, a taxi pickup, meals or a local trek? Ask us on WhatsApp and we'll tell you what we can arrange for your dates.",
  },

  // ---------------------------------------------------------------- GALLERY & EXPLORE
  gallery: [hero, room1, room2, village, valley],
  explore: [
    { title: "Village life", text: "Stone houses, terraced fields and a slower rhythm of days." },
    { title: "Himalayan views", text: "Snow peaks rise over the valley on clear mornings." },
    { title: "Forest trails", text: "Walk through pine and deodar forests around the village." },
  ],
};

// Direct WhatsApp chat with the pre-filled enquiry message.
export const whatsappUrl = site.whatsappChatUrl;
export const telUrl = `tel:${site.phoneTel}`;
