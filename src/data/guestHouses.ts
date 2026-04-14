
export interface GuestHouse {
  id: string;
  name: string;
  location: string;
  image: string;
  description: string;
  amenities: string[];
  breakfast: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const guestHouses: GuestHouse[] = [
  {
    id: "1",
    name: "Dar Ben Gacem",
    location: "Medina of Tunis, Tunisia",
    image: "/uploads/549c131b-140c-4a2b-a663-3d920f194f91.png",
    description: "Traditional guesthouse in the heart of Tunis Medina",
    amenities: ["Traditional architecture", "Courtyard", "Local cuisine", "Cultural tours"],
    breakfast: true,
    coordinates: { lat: 36.7981, lng: 10.1731 }
  },
  {
    id: "2",
    name: "Dar Fatma",
    location: "Sidi Bou Said, Tunis, Tunisia",
    image: "/uploads/cbd7751a-e460-45c8-847d-849a5ca51bcc.png",
    description: "Charming guesthouse with sea views",
    amenities: ["Sea view", "Traditional decor", "Terrace", "Local guide services"],
    breakfast: true,
    coordinates: { lat: 36.8706, lng: 10.3472 }
  },
  {
    id: "3",
    name: "Dar Ellama",
    location: "Bizerte, Tunisia",
    image: "/uploads/549c131b-140c-4a2b-a663-3d920f194f91.png",
    description: "Historic guesthouse with cultural immersion",
    amenities: ["Historic building", "Local cuisine", "Cultural immersion"],
    breakfast: true,
    coordinates: { lat: 37.2744, lng: 9.8739 }
  }
];
