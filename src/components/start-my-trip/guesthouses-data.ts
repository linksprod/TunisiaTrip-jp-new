
export interface GuestHouse {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  region: string;
  style: 'traditional' | 'modern' | 'boutique';
  priceRange: '$' | '$$';
  amenities: string[];
  nearbyActivities: string[];
  japaneseFeatures: string[];
  culturalExperience: string[];
}

export const guestHouses: GuestHouse[] = [
  {
    id: "1",
    name: "Dar Ben Gacem",
    location: "Medina of Tunis, Tunisia",
    image: "/uploads/549c131b-140c-4a2b-a663-3d920f194f91.png",
    rating: 5,
    coordinates: { lat: 36.7981, lng: 10.1731 },
    region: "Tunis",
    style: "traditional",
    priceRange: "$$",
    amenities: ["Traditional architecture", "Courtyard", "Local cuisine", "Cultural tours"],
    nearbyActivities: ["6"], // Souks
    japaneseFeatures: ["Authentic experience", "Respectful hospitality", "Clean traditional rooms"],
    culturalExperience: ["Traditional Tunisian breakfast", "Local family interaction", "Medina navigation help"]
  },
  {
    id: "2",
    name: "Dar Fatma",
    location: "Sidi Bou Said, Tunis, Tunisia",
    image: "/uploads/cbd7751a-e460-45c8-847d-849a5ca51bcc.png",
    rating: 5,
    coordinates: { lat: 36.8706, lng: 10.3472 },
    region: "Tunis",
    style: "traditional",
    priceRange: "$$",
    amenities: ["Sea view", "Traditional decor", "Terrace", "Local guide services"],
    nearbyActivities: ["3"], // Sidi Bou Said
    japaneseFeatures: ["Peaceful atmosphere", "Attention to detail", "Beautiful views"],
    culturalExperience: ["Blue and white architecture", "Local art workshops", "Traditional tea ceremony"]
  },
  {
    id: "3",
    name: "Dar Ellama",
    location: "Bizerte, Tunisia",
    image: "/uploads/549c131b-140c-4a2b-a663-3d920f194f91.png",
    rating: 5,
    coordinates: { lat: 37.2744, lng: 9.8739 },
    region: "North",
    style: "traditional",
    priceRange: "$",
    amenities: ["Historic building", "Local cuisine", "Cultural immersion"],
    nearbyActivities: [],
    japaneseFeatures: ["Quiet location", "Personal service", "Cultural learning"],
    culturalExperience: ["Traditional crafts", "Local customs", "Regional cuisine"]
  }
];
