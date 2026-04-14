
import { DayItinerary, FAQItem } from "./types";

export const dayByDayItinerary: DayItinerary[] = [
  {
    day: 1,
    title: "Arrival in Tunis",
    activities: [
      "Transfer from Tunis-Carthage International Airport",
      "Hotel check-in and welcome briefing",
      "Evening walk in La Marsa beach",
      "Welcome dinner at a traditional restaurant"
    ],
    description: "Begin your journey in the vibrant capital city of Tunisia. After settling in, enjoy the Mediterranean atmosphere with a seaside stroll.",
    additionalInfo: "La Marsa is one of Tunis' most upscale suburbs, known for its beautiful beach and seaside promenade.",
    image: "/uploads/f66ee597-e8d7-44b5-834e-d0eb1266a0ba.png",
    color: "blue"
  },
  {
    day: 2,
    title: "Carthage & Sidi Bou Said",
    activities: [
      "Visit to Carthage archaeological site",
      "Tour of Antonine Baths",
      "Explore Byrsa Hill",
      "Afternoon in Sidi Bou Said",
      "Sunset at Café des Délices"
    ],
    description: "Discover the ancient ruins of Carthage and the picturesque blue and white village of Sidi Bou Said.",
    additionalInfo: "Carthage was the center of the ancient Carthaginian civilization and is now a UNESCO World Heritage site.",
    image: "/uploads/67603b3f-7233-4442-a28f-cb07d0b628bc.png",
    color: "amber"
  },
  {
    day: 3,
    title: "Medina of Tunis",
    activities: [
      "Explore the Medina of Tunis",
      "Visit Ez-Zitouna Mosque",
      "Traditional souks tour",
      "Bardo Museum visit",
      "Traditional hammam experience"
    ],
    description: "Walk through the winding streets of the medina, exploring its rich history and vibrant market life.",
    additionalInfo: "The Medina of Tunis is a UNESCO World Heritage site featuring over 700 monuments.",
    image: "/uploads/18062777-c533-46bf-9135-48f839209443.png",
    color: "green"
  },
  {
    day: 4,
    title: "Kairouan & El Jem",
    activities: [
      "Great Mosque of Kairouan",
      "Medina of Kairouan exploration",
      "Visit to carpet workshops",
      "El Jem Amphitheatre tour",
      "El Jem Museum visit"
    ],
    description: "Visit the holy city of Kairouan and marvel at the Roman amphitheater of El Jem.",
    additionalInfo: "Kairouan is famous for its religious monuments while El Jem amphitheater is one of the best-preserved Roman ruins in the world.",
    image: "/uploads/3caaa473-8150-4b29-88b4-e2e9c696bf1d.png",
    color: "orange"
  },
  {
    day: 5,
    title: "Sfax & Matmata",
    activities: [
      "Explore Sfax's well-preserved medina",
      "Traditional seafood lunch",
      "Drive to Matmata",
      "Visit troglodyte dwellings",
      "Star Wars filming locations tour"
    ],
    description: "Discover Tunisia's second-largest city and the unique underground homes of Matmata.",
    additionalInfo: "Matmata's cave homes provided filming locations for Star Wars' planet Tatooine.",
    image: "/uploads/4494507c-a2f0-4f76-883d-3d753283567a.png",
    color: "yellow"
  },
  {
    day: 6,
    title: "Djerba & Tataouine",
    activities: [
      "Ferry to Djerba Island",
      "Explore El Ghriba Synagogue",
      "Djerba Heritage Museum",
      "Drive to Tataouine",
      "Berber village exploration"
    ],
    description: "Experience the cultural diversity of Djerba island and the otherworldly landscapes of Tataouine.",
    additionalInfo: "Tataouine's desert landscapes inspired the name of Luke Skywalker's home planet in Star Wars.",
    image: "/uploads/f6049873-1977-41a3-8e74-0815988c84a9.png",
    color: "purple"
  },
  {
    day: 7,
    title: "Desert Adventure",
    activities: [
      "Visit Ksar Ouled Debbab fortress",
      "Desert picnic lunch",
      "Ksar Ghilane oasis and hot springs",
      "Camel trek in the sand dunes",
      "Overnight desert camping"
    ],
    description: "Journey through the ancient Berber fortresses and relax in the desert oasis of Ksar Ghilane.",
    additionalInfo: "Ksar Ghilane is a beautiful oasis at the edge of the Grand Erg Oriental, featuring natural hot springs surrounded by sand dunes.",
    image: "/uploads/16f46703-2934-4d65-9162-b8824a40c64f.png",
    color: "red"
  },
  {
    day: 8,
    title: "Douz & Departure",
    activities: [
      "Morning visit to Douz market",
      "Desert Museum exploration",
      "Transfer to Djerba or Tunis airport",
      "Departure assistance"
    ],
    description: "Experience the 'Gateway to the Sahara' before heading home with wonderful memories of Tunisia.",
    additionalInfo: "Douz is famous for its annual International Festival of the Sahara celebrating desert culture.",
    image: "/uploads/2714f2c3-4465-4a55-8369-5484aa8f3b28.png",
    color: "indigo"
  }
];

export const faqItems: FAQItem[] = [
  {
    question: "What kind of transportation is frequently used in Tunisia?",
    answer: "In Tunisia, transportation is diverse and includes public and private options. Shared minibuses called louages are widely used for intercity travel, while buses and the Metro Léger serve urban commuters, especially in Tunis. The TGM train connects the capital to coastal suburbs, and the SNCFT railway links major cities. Taxis, both regular and shared, are common for shorter trips, while car rentals, motorcycles, and bicycles offer more flexibility."
  },
  {
    question: "What is the best time of year to visit Tunisia?",
    answer: "The best time to visit Tunisia is during spring (April to June) and fall (September to October) when temperatures are pleasant and crowds are smaller. Summer (July-August) offers perfect beach weather but can be very hot inland. Winter (November-March) is mild along the coast but can be cold in the mountains and desert regions, with occasional rain."
  },
  {
    question: "Do I need a visa to visit Tunisia?",
    answer: "Many nationalities including those from the EU, USA, Canada, UK, Japan, and Australia can enter Tunisia without a visa for stays up to 90 days. However, visa requirements change frequently, so it's essential to check the latest requirements with the Tunisian embassy or consulate in your country before traveling."
  },
  {
    question: "What currency is used in Tunisia and can I use credit cards?",
    answer: "The Tunisian Dinar (TND) is the official currency. It's a closed currency, meaning you can only obtain it within Tunisia and should exchange it back before leaving. Credit cards are accepted in major hotels, restaurants, and larger shops in tourist areas, but cash is preferred in smaller establishments and rural areas. ATMs are widely available in cities and tourist zones."
  },
  {
    question: "Is Tunisia safe for tourists?",
    answer: "Tunisia is generally safe for tourists, especially in established tourist areas. Like any destination, normal precautions should be taken regarding personal belongings and avoiding isolated areas at night. The Tunisian government places a high priority on tourist safety with increased security at major attractions and resorts. It's advisable to check your government's travel advisories before visiting."
  }
];
