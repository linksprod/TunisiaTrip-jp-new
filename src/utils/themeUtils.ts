import { Activity } from "@/data/activities";

export interface ThemeInfo {
  id: string;
  name: string;
  description: string;
  image: string;
  color: string;
  keywords: string[];
}

export const THEME_KEYWORDS = {
  historical: ["carthage", "museum", "heritage", "ancient", "archaeological", "dougga", "el jem", "bardo", "sbeitla", "chemtou"],
  cultural: ["medina", "souk", "traditional", "market", "sidi bou said", "tunis", "cultural", "kairouan"],
  sahara: ["desert", "sahara", "tozeur", "douz", "matmata", "star wars", "oasis", "chebika", "tamarza", "tataouine"],
  mixed: []
};

export function getThemeImageFromActivities(themeId: string, activities: any[]): string {
  const keywords = THEME_KEYWORDS[themeId as keyof typeof THEME_KEYWORDS] || [];
  
  if (themeId === "mixed") {
    // For mixed, get first available image from any activity
    const activityWithImage = activities.find(activity => 
      activity.images?.[0] || activity.image
    );
    return activityWithImage?.images?.[0] || activityWithImage?.image || "/uploads/549c131b-140c-4a2b-a663-3d920f194f91.png";
  }
  
  // Find activity that matches theme keywords and has an image
  const matchingActivity = activities.find(activity => {
    const hasImage = activity.images?.[0] || activity.image;
    if (!hasImage) return false;
    
    return keywords.some(keyword => 
      activity.title?.toLowerCase().includes(keyword) || 
      activity.location?.toLowerCase().includes(keyword) ||
      activity.tags?.some((tag: string) => tag.toLowerCase().includes(keyword))
    );
  });
  
  if (matchingActivity) {
    return matchingActivity.images?.[0] || matchingActivity.image;
  }
  
  // Fallback to default image
  return "/uploads/549c131b-140c-4a2b-a663-3d920f194f91.png";
}

export function getThemeActivities(themeId: string, activities: any[]): string[] {
  const keywords = THEME_KEYWORDS[themeId as keyof typeof THEME_KEYWORDS] || [];
  
  if (themeId === "mixed") {
    // Return a balanced selection from all categories
    const historicalIds = activities.filter(activity => 
      THEME_KEYWORDS.historical.some(keyword => 
        activity.title?.toLowerCase().includes(keyword) || 
        activity.location?.toLowerCase().includes(keyword) ||
        activity.tags?.some((tag: string) => tag.toLowerCase().includes(keyword))
      )
    ).slice(0, 2).map(a => a.id);

    const culturalIds = activities.filter(activity => 
      THEME_KEYWORDS.cultural.some(keyword => 
        activity.title?.toLowerCase().includes(keyword) || 
        activity.location?.toLowerCase().includes(keyword) ||
        activity.tags?.some((tag: string) => tag.toLowerCase().includes(keyword))
      )
    ).slice(0, 2).map(a => a.id);

    const saharaIds = activities.filter(activity => 
      THEME_KEYWORDS.sahara.some(keyword => 
        activity.title?.toLowerCase().includes(keyword) || 
        activity.location?.toLowerCase().includes(keyword) ||
        activity.tags?.some((tag: string) => tag.toLowerCase().includes(keyword))
      )
    ).slice(0, 2).map(a => a.id);

    return [...historicalIds, ...culturalIds, ...saharaIds];
  }

  return activities.filter(activity => 
    keywords.some(keyword => 
      activity.title?.toLowerCase().includes(keyword) || 
      activity.location?.toLowerCase().includes(keyword) ||
      activity.tags?.some((tag: string) => tag.toLowerCase().includes(keyword))
    )
  ).map(a => a.id);
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function getRecommendedAccommodationsForTheme(
  themeId: string, 
  activities: any[], 
  hotels: any[], 
  guestHouses: any[]
): { hotels: any[], guestHouses: any[] } {
  const themeActivityIds = getThemeActivities(themeId, activities);
  const themeActivities = activities.filter(activity => themeActivityIds.includes(activity.id));
  
  if (themeActivities.length === 0) {
    // Return closest accommodations to Tunis if no theme activities
    const tunisLat = 36.8065;
    const tunisLng = 10.1815;
    
    const sortedHotels = hotels
      .filter(hotel => hotel.latitude && hotel.longitude)
      .sort((a, b) => {
        const distA = calculateDistance(tunisLat, tunisLng, a.latitude, a.longitude);
        const distB = calculateDistance(tunisLat, tunisLng, b.latitude, b.longitude);
        return distA - distB;
      })
      .slice(0, 2);
      
    const sortedGuestHouses = guestHouses
      .filter(gh => gh.latitude && gh.longitude)
      .sort((a, b) => {
        const distA = calculateDistance(tunisLat, tunisLng, a.latitude, a.longitude);
        const distB = calculateDistance(tunisLat, tunisLng, b.latitude, b.longitude);
        return distA - distB;
      })
      .slice(0, 1);
      
    return { hotels: sortedHotels, guestHouses: sortedGuestHouses };
  }
  
  // Calculate average center of theme activities
  const centerLat = themeActivities.reduce((sum, activity) => sum + (activity.latitude || 0), 0) / themeActivities.length;
  const centerLng = themeActivities.reduce((sum, activity) => sum + (activity.longitude || 0), 0) / themeActivities.length;
  
  // Find hotels within 50km of theme activities
  const nearbyHotels = hotels.filter(hotel => {
    if (!hotel.latitude || !hotel.longitude) return false;
    
    return themeActivities.some(activity => {
      if (!activity.latitude || !activity.longitude) return false;
      const distance = calculateDistance(activity.latitude, activity.longitude, hotel.latitude, hotel.longitude);
      return distance <= 50;
    });
  });
  
  const nearbyGuestHouses = guestHouses.filter(guestHouse => {
    if (!guestHouse.latitude || !guestHouse.longitude) return false;
    
    return themeActivities.some(activity => {
      if (!activity.latitude || !activity.longitude) return false;
      const distance = calculateDistance(activity.latitude, activity.longitude, guestHouse.latitude, guestHouse.longitude);
      return distance <= 50;
    });
  });
  
  // If no nearby accommodations found, get closest ones to the center
  if (nearbyHotels.length === 0 && nearbyGuestHouses.length === 0) {
    const sortedHotels = hotels
      .filter(hotel => hotel.latitude && hotel.longitude)
      .sort((a, b) => {
        const distA = calculateDistance(centerLat, centerLng, a.latitude, a.longitude);
        const distB = calculateDistance(centerLat, centerLng, b.latitude, b.longitude);
        return distA - distB;
      })
      .slice(0, 2);
      
    const sortedGuestHouses = guestHouses
      .filter(gh => gh.latitude && gh.longitude)
      .sort((a, b) => {
        const distA = calculateDistance(centerLat, centerLng, a.latitude, a.longitude);
        const distB = calculateDistance(centerLat, centerLng, b.latitude, b.longitude);
        return distA - distB;
      })
      .slice(0, 1);
      
    return { hotels: sortedHotels, guestHouses: sortedGuestHouses };
  }
  
  return { 
    hotels: nearbyHotels.slice(0, 2), 
    guestHouses: nearbyGuestHouses.slice(0, 1) 
  };
}

export function getAccommodationImage(accommodation: any): string {
  // Prioritize images array from Supabase, fallback to single image
  if (accommodation.images && accommodation.images.length > 0) {
    return accommodation.images[0];
  }
  return accommodation.image || "/uploads/549c131b-140c-4a2b-a663-3d920f194f91.png";
}