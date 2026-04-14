
export interface Activity {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const activities: Activity[] = [
  {
    id: "1",
    name: "Desert Safari & Camel Riding",
    location: "Sahara Desert, Douz",
    description: "Experience the magic of the Sahara Desert on a camel trek across golden dunes.",
    image: "/uploads/a2d95c89-23fc-48b3-b72b-742bdd9b0076.png",
    coordinates: { lat: 33.4667, lng: 9.0167 }
  },
  {
    id: "2", 
    name: "Explore Ancient Carthage",
    location: "Carthage, near Tunis",
    description: "Walk through the legendary ruins of Carthage, once the center of a powerful ancient civilization.",
    image: "/uploads/59785105-2ab9-4ee5-9e99-65d6f4634e73.png",
    coordinates: { lat: 36.8531, lng: 10.3256 }
  },
  {
    id: "3",
    name: "Wander Through Sidi Bou Said", 
    location: "Sidi Bou Said, near Tunis",
    description: "Get lost in the picturesque blue and white village of Sidi Bou Said.",
    image: "/uploads/2714f2c3-4465-4a55-8369-5484aa8f3b28.png",
    coordinates: { lat: 36.8706, lng: 10.3472 }
  },
  {
    id: "4",
    name: "Visit the El Jem Amphitheatre",
    location: "El Jem", 
    description: "Marvel at one of the world's best-preserved Roman amphitheaters.",
    image: "/uploads/b1054a66-c723-4e47-b4d5-345f2c611881.png",
    coordinates: { lat: 35.2983, lng: 10.7067 }
  },
  {
    id: "5",
    name: "Monuments of Dougga",
    location: "Dougga, Zaghouan",
    description: "Explore the best-preserved Roman town in North Africa, a UNESCO World Heritage site.",
    image: "/uploads/b1054a66-c723-4e47-b4d5-345f2c611881.png",
    coordinates: { lat: 36.4225, lng: 9.2189 }
  },
  {
    id: "6",
    name: "Shop in Traditional Souks",
    location: "Medinas across Tunisia",
    description: "Immerse yourself in the vibrant atmosphere of Tunisia's traditional markets.",
    image: "/uploads/17d3abc2-7548-4528-9546-2db58e5b2029.png",
    coordinates: { lat: 36.7981, lng: 10.1731 }
  },
  {
    id: "7",
    name: "Bardo Museum",
    location: "Bardo, near Tunis",
    description: "Discover the world's finest collection of Roman mosaics and Tunisian artifacts.",
    image: "/uploads/59785105-2ab9-4ee5-9e99-65d6f4634e73.png",
    coordinates: { lat: 36.8119, lng: 10.1353 }
  },
  {
    id: "9", 
    name: "Star Wars Film Locations Tour",
    location: "Southern Tunisia",
    description: "Visit the otherworldly landscapes that served as Tatooine in the Star Wars films.",
    image: "/uploads/9eb876d7-b767-4dea-a400-0ee661b1abdc.png",
    coordinates: { lat: 33.9197, lng: 8.1335 }
  }
];
