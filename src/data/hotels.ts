
export interface Hotel {
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

export const hotels: Hotel[] = [
  {
    id: "1",
    name: "Four Seasons Hotel",
    location: "Tunis, Tunisia",
    image: "/uploads/31fa750b-9618-4556-9aa2-c9b62cf3b480.png",
    description: "Luxury hotel in the heart of Tunis",
    amenities: ["Spa", "Pool", "Restaurant", "Business Center", "Concierge"],
    breakfast: true,
    coordinates: { lat: 36.8065, lng: 10.1815 }
  },
  {
    id: "2",
    name: "Anantara Tozeur",
    location: "Tozeur, Tunisia", 
    image: "/uploads/7848de0b-5463-4416-ae56-7922714a447b.png",
    description: "Desert luxury resort with stunning views",
    amenities: ["Desert views", "Spa", "Pool", "Desert excursions"],
    breakfast: true,
    coordinates: { lat: 33.9197, lng: 8.1335 }
  },
  {
    id: "3",
    name: "Movenpick Sousse",
    location: "Sousse, Tunisia",
    image: "/uploads/d5b362eb-773a-485d-aa39-67eff2ccf55e.png", 
    description: "Beachfront luxury hotel",
    amenities: ["Beach access", "Pool", "Spa", "Restaurant"],
    breakfast: true,
    coordinates: { lat: 35.8256, lng: 10.6411 }
  },
  {
    id: "4",
    name: "The Residence Tunis",
    location: "Tunis, Tunisia",
    image: "/uploads/4de6ef16-ca24-431b-899d-e5c7cf11c73c.png",
    description: "Premium resort with golf course",
    amenities: ["Golf course", "Spa", "Multiple restaurants", "Beach club"],
    breakfast: true,
    coordinates: { lat: 36.8625, lng: 10.3064 }
  },
  {
    id: "5", 
    name: "Le Kasbah Kairouan",
    location: "Kairouan, Tunisia",
    image: "/uploads/4fdc3022-820b-4653-8401-6d31df53747b.png",
    description: "Boutique hotel with traditional architecture",
    amenities: ["Traditional architecture", "Cultural tours", "Restaurant"],
    breakfast: true,
    coordinates: { lat: 35.6781, lng: 10.0963 }
  },
  {
    id: "6",
    name: "Pansy KSAR Ghilene", 
    location: "Ghilene, Tunisia",
    image: "/uploads/53341fca-0b8d-47ff-a07c-7a30290c0170.png",
    description: "Desert camp experience",
    amenities: ["Desert camp", "Traditional meals", "Camel trekking"],
    breakfast: true,
    coordinates: { lat: 33.0167, lng: 9.8167 }
  }
];
