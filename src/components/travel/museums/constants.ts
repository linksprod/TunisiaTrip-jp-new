
import { Museum, MuseumCategory } from "./types";

export const MUSEUM_CATEGORIES: MuseumCategory[] = [
  { id: "mosaic-masterpieces", name: "Mosaic Masterpieces" },
  { id: "punic-heritage", name: "Punic Heritage" },
  { id: "islamic-art", name: "Islamic Art" },
  { id: "roman-archaeology", name: "Roman Archaeology" },
  { id: "presidential-history", name: "Presidential History" },
  { id: "traditional-architecture", name: "Traditional Architecture" }
];

export const MUSEUMS: Museum[] = [
  {
    id: 1,
    name: "Bardo National Museum",
    location: "Tunis",
    description: "Located in a magnificent 19th-century palace, the Bardo National Museum is one of the most important museums in the Mediterranean region. It houses an extraordinary collection of Roman mosaics, artifacts from Carthaginian and Roman periods, and showcases Tunisia's rich historical and cultural heritage across several millennia.",
    image: "/uploads/2eda5fb0-3665-471f-8dfc-851c260325e2.png",
    category: ["mosaic-masterpieces"]
  },
  {
    id: 2,
    name: "Carthage Archaeological Museum",
    location: "Carthage",
    description: "The Carthage Museum houses a collection of Carthaginian artifacts from the Punic and Roman periods. The museum is located on Byrsa Hill, an important archaeological site with remains of Punic and Roman buildings.",
    image: "/uploads/621dc158-70b9-4359-8ba2-2829315f4f67.png",
    category: ["punic-heritage", "roman-archaeology"]
  },
  {
    id: 3,
    name: "Dar Ben Abdallah Museum",
    location: "Tunis Medina",
    description: "A traditional palace in the heart of the Tunis Medina that has been transformed into a museum of popular arts and traditions. It showcases traditional clothing, furniture and daily life items from the 18th and 19th centuries.",
    image: "/uploads/5144e6c5-9e06-4333-b32b-9513133ea2fe.png",
    category: ["traditional-architecture"]
  },
  {
    id: 4,
    name: "Dar el Bey Museum",
    location: "Tunis",
    description: "A historic palace that showcases traditional Tunisian architecture and craftsmanship from the 18th century. The museum displays traditional furniture, clothing, and artifacts that represent Tunisian cultural heritage.",
    image: "/uploads/6057f9fd-77ff-4411-9dc9-c71434affa72.png",
    category: ["islamic-art", "traditional-architecture"]
  },
  {
    id: 5,
    name: "El Djem Archaeological Museum",
    location: "El Djem",
    description: "Located near the famous amphitheater, this museum contains an impressive collection of Roman mosaics discovered in the ancient city of Thysdrus (modern El Djem) and surrounding areas.",
    image: "/uploads/74125e5f-76c0-4d70-9934-12ecf1ee706a.png",
    category: ["mosaic-masterpieces"]
  },
  {
    id: 6,
    name: "Sousse Archaeological Museum",
    location: "Sousse",
    description: "Housed in the Kasbah of Sousse, this museum displays one of the richest collections of mosaics in Tunisia, most of which come from the excavations of the nearby ancient city of Hadrumetum.",
    image: "/uploads/e3a61093-d8d0-45fa-90b3-eccd8ef03764.png",
    category: ["roman-archaeology"]
  },
  {
    id: 7,
    name: "Habib Bourguiba Memorial",
    location: "Monastir",
    description: "This memorial is dedicated to Tunisia's first president, Habib Bourguiba. It includes his mausoleum, a museum displaying his personal belongings, gifts received from world leaders, and documents related to the independence struggle.",
    image: "/uploads/96ea48b4-dc5d-44be-9e82-5616bb86a58b.png",
    category: ["presidential-history"]
  },
  {
    id: 8,
    name: "Dar Essid Museum",
    location: "Sousse Medina",
    description: "An art museum located in a historic palace that retraces the daily city life in Sousse during the 18th and 19th centuries. The edifice belonged to a family of aristocrats, offering a glimpse into the rich cultural heritage of Sousse.",
    image: "/uploads/3547623a-b624-461b-bef8-a3451e3cb6f4.png",
    category: ["traditional-architecture"]
  }
];
