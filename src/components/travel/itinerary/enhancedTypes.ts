
export interface AccommodationDetails {
  id: string;
  name: string;
  type: 'hotel' | 'guesthouse';
  description: string;
  image: string;
  amenities: string[];
  breakfast: boolean;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface ScheduleItem {
  time: string;
  activity: string;
  location: string;
  duration: string;
  transport?: string;
  distance?: string;
  type: 'breakfast' | 'activity' | 'lunch' | 'dinner' | 'departure' | 'arrival' | 'free-time';
  image?: string; // Image de l'activité
  description?: string;
}

export interface EnhancedDayItinerary {
  day: number;
  title: string;
  accommodation: AccommodationDetails | null;
  schedule: ScheduleItem[];
  description: string;
  additionalInfo: string;
  image: string;
  color: string;
  culturalTips: string[];
  weatherAlternatives: string[];
  totalDistance: number;
}
