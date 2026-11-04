// All editable website content lives here. Replace text, prices and images freely.
import hero from "@/assets/hero.jpg";
import room1 from "@/assets/room1.jpg";
import room2 from "@/assets/room2.jpg";
import village from "@/assets/village.jpg";

export const site = {
  name: "Sunlit Valley Homestay",
  location: "Saree Village, Uttarakhand, India",
  phoneDisplay: "+91 87917 63547",
  phoneTel: "+918791763547",
  whatsapp: "918791763547",
  mapsLink: "https://maps.app.goo.gl/TGRJPpnK6mFrC2nJA",
  mapsEmbed: "https://www.google.com/maps?q=Saree+Village,+Uttarakhand&output=embed",
  // Paste your Google Form link here later; the enquiry button will open it.
  googleFormUrl: "",
  images: { hero, village },
  about:
    "Tucked into the quiet terraces of Saree Village, Sunlit Valley Homestay is a family-run home where mornings begin with mountain light and evenings end under a sky full of stars. Come slow down, breathe the clean Himalayan air and experience village life the way it's meant to be lived.",
  rooms: [
    { name: "Valley View Room", image: room1, description: "A warm, wood-finished room with a window that opens to the mountains.", price: "Price on request" },
    { name: "Family Room", image: room2, description: "A spacious room with room for the whole family to rest after a day outdoors.", price: "Price on request" },
  ],
  // Only list facilities you can confirm.
  facilities: [
    { title: "Home-style stay", text: "Edit this to describe your hospitality." },
    { title: "Mountain views", text: "Edit this to describe the views from the property." },
    { title: "Local guidance", text: "Edit this with help you offer guests." },
    { title: "Add facility", text: "Replace with a confirmed facility." },
  ],
  gallery: [hero, room1, village, room2, village, hero],
  explore: [
    { title: "Village life", text: "Stone houses, terraced fields and a slower rhythm of days." },
    { title: "Himalayan views", text: "Snow peaks rise over the valley on clear mornings." },
    { title: "Forest trails", text: "Walk through pine and deodar forests around the village." },
  ],
};
