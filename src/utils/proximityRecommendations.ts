import { calculatePureDistance as calculateDistance, getActivityRegion } from '../services/geographicalService';
import { Activity } from '@/data/activities';

export interface AccommodationWithProximity {
  id: string;
  name: string;
  type: 'hotel' | 'guesthouse';
  coordinates: { lat: number; lng: number };
  distance: number;
  nearbyActivities: string[];
  region: string;
  reasons: string[];
}

interface AccommodationData {
  id?: string;
  name: string;
  coordinates?: { lat: number; lng: number };
  location?: string;
  latitude?: number;
  longitude?: number;
}

// Get proximity-based accommodation recommendations
export function getProximityBasedRecommendations(
  selectedActivities: Activity[],
  allHotels: AccommodationData[],
  allGuestHouses: AccommodationData[],
  selectedHotelIds: string[],
  selectedGuestHouseIds: string[]
): AccommodationWithProximity[] {
  if (selectedActivities.length === 0) return [];

  const MAX_DISTANCE_KM = 100; // Distance maximale acceptée pour une recommandation
  const allCombinedAccommodations: AccommodationWithProximity[] = [];

  // For each activity, calculate distances to all selected accommodations
  selectedActivities.forEach(activity => {
    if (!activity.coordinates) return;

    const activityRegion = getActivityRegion(activity);

    // Process hotels
    allHotels
      .filter(hotel => hotel.id && selectedHotelIds.includes(hotel.id.toString()))
      .forEach(hotel => {
        const hotelCoords = hotel.coordinates ||
          (hotel.latitude && hotel.longitude ? { lat: hotel.latitude, lng: hotel.longitude } : null);

        if (!hotelCoords) return;

        const distance = calculateDistance(
          activity.coordinates!.lat,
          activity.coordinates!.lng,
          hotelCoords.lat,
          hotelCoords.lng
        );

        // Ne pas ajouter les hébergements trop éloignés
        if (distance > MAX_DISTANCE_KM) {
          console.log(`Hotel ${hotel.name} rejeté: trop loin (${distance.toFixed(1)} km > ${MAX_DISTANCE_KM} km)`);
          return;
        }

        const reasons = [];
        if (distance <= 10) reasons.push(`Very close to ${activity.name}`);
        else if (distance <= 25) reasons.push(`Close to ${activity.name}`);
        else reasons.push(`Accessible from ${activity.name}`);

        console.log(`Hotel ${hotel.name} accepté: ${distance.toFixed(1)} km de ${activity.name}`);

        allCombinedAccommodations.push({
          id: hotel.id!.toString(),
          name: hotel.name,
          type: 'hotel' as const,
          coordinates: hotelCoords,
          distance,
          nearbyActivities: [activity.id],
          region: activityRegion,
          reasons
        });
      });

    // Process guest houses
    allGuestHouses
      .filter(guestHouse => guestHouse.id && selectedGuestHouseIds.includes(guestHouse.id.toString()))
      .forEach(guestHouse => {
        const guestHouseCoords = guestHouse.coordinates ||
          (guestHouse.latitude && guestHouse.longitude ? { lat: guestHouse.latitude, lng: guestHouse.longitude } : null);

        if (!guestHouseCoords) return;

        const distance = calculateDistance(
          activity.coordinates!.lat,
          activity.coordinates!.lng,
          guestHouseCoords.lat,
          guestHouseCoords.lng
        );

        // Ne pas ajouter les hébergements trop éloignés
        if (distance > MAX_DISTANCE_KM) {
          console.log(`Guest house ${guestHouse.name} rejeté: trop loin (${distance.toFixed(1)} km > ${MAX_DISTANCE_KM} km)`);
          return;
        }

        const reasons = [];
        if (distance <= 5) reasons.push(`Walking distance from ${activity.name}`);
        else if (distance <= 15) reasons.push(`Very close to ${activity.name}`);
        else reasons.push(`Near ${activity.name}`);

        console.log(`Guest house ${guestHouse.name} accepté: ${distance.toFixed(1)} km de ${activity.name}`);

        allCombinedAccommodations.push({
          id: guestHouse.id!.toString(),
          name: guestHouse.name,
          type: 'guesthouse' as const,
          coordinates: guestHouseCoords,
          distance,
          nearbyActivities: [activity.id],
          region: activityRegion,
          reasons
        });
      });
  });

  // Merge recommendations for accommodations that are near multiple activities
  const mergedRecommendations = new Map<string, AccommodationWithProximity>();

  allCombinedAccommodations.forEach(rec => {
    const existing = mergedRecommendations.get(rec.id);
    if (existing) {
      existing.nearbyActivities.push(...rec.nearbyActivities);
      existing.reasons.push(...rec.reasons);
      existing.distance = Math.min(existing.distance, rec.distance); // Use minimum distance
    } else {
      mergedRecommendations.set(rec.id, {
        ...rec,
        nearbyActivities: [...rec.nearbyActivities],
        reasons: [...rec.reasons]
      });
    }
  });

  // Remove duplicates from nearbyActivities and reasons
  Array.from(mergedRecommendations.values()).forEach(rec => {
    rec.nearbyActivities = [...new Set(rec.nearbyActivities)];
    rec.reasons = [...new Set(rec.reasons)];
  });

  // Convert to array and sort by distance (closest first)
  const allRecommendations = Array.from(mergedRecommendations.values())
    .sort((a, b) => a.distance - b.distance);

  console.log('All accommodations before filtering:', allRecommendations.map(acc => ({
    name: acc.name,
    type: acc.type,
    distance: acc.distance
  })));

  // Apply the 30km rule: only keep closest accommodation + others within 30km of the closest
  const filteredRecommendations = [];
  if (allRecommendations.length > 0) {
    const closestAccommodation = allRecommendations[0];
    filteredRecommendations.push(closestAccommodation);

    console.log('Closest accommodation:', closestAccommodation.name, 'at', closestAccommodation.distance, 'km');

    // Add additional accommodations only if they're within 30km of the closest one
    for (let i = 1; i < allRecommendations.length; i++) {
      const distanceBetweenAccommodations = calculateDistance(
        closestAccommodation.coordinates.lat,
        closestAccommodation.coordinates.lng,
        allRecommendations[i].coordinates.lat,
        allRecommendations[i].coordinates.lng
      );

      console.log(`Distance between ${closestAccommodation.name} and ${allRecommendations[i].name}: ${distanceBetweenAccommodations} km`);

      if (distanceBetweenAccommodations <= 30) {
        filteredRecommendations.push(allRecommendations[i]);
        console.log(`Added ${allRecommendations[i].name} (within 30km)`);
      } else {
        console.log(`Rejected ${allRecommendations[i].name} (too far: ${distanceBetweenAccommodations} km)`);
      }
    }
  }

  console.log('Final filtered recommendations:', filteredRecommendations.map(acc => ({
    name: acc.name,
    type: acc.type,
    distance: acc.distance
  })));

  return filteredRecommendations;
}

// Group accommodations by region for better organization
export function groupRecommendationsByRegion(
  recommendations: AccommodationWithProximity[]
): Record<string, AccommodationWithProximity[]> {
  return recommendations.reduce((groups, rec) => {
    if (!groups[rec.region]) {
      groups[rec.region] = [];
    }
    groups[rec.region].push(rec);
    return groups;
  }, {} as Record<string, AccommodationWithProximity[]>);
}