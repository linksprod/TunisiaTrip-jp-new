import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useActivities } from "@/hooks/useActivities";
import { useHotels } from "@/hooks/useHotels";
import { calculatePureDistance as calculateDistance, getActivityRegion } from "@/services/geographicalService";
import { GuestHouse, guestHouses } from "@/data/guestHouses";
import { Activity } from "@/data/activities";
import { Hotel } from "@/data/hotels";
import { findClosestHotel, findNearbyAccommodations } from "@/services/geographicalService";

interface SelectableActivitiesProps {
  selectedActivities: string[];
  setSelectedActivities: (activities: string[]) => void;
  selectedHotels: string[];
  setSelectedHotels: (hotels: string[]) => void;
  selectedGuestHouses: string[];
  setSelectedGuestHouses: (guestHouses: string[]) => void;
}

export function SelectableActivities({
  selectedActivities,
  setSelectedActivities,
  selectedHotels,
  setSelectedHotels,
  selectedGuestHouses,
  setSelectedGuestHouses
}: SelectableActivitiesProps) {
  const { activities, isLoading } = useActivities();
  const { hotels } = useHotels();

  // Convert database activities to our Activity type
  const convertedActivities = useMemo(() =>
    activities
      .filter(activity => activity.show_in_start_my_trip === true)
      .map(activity => ({
        id: activity.id.toString(),
        name: activity.title,
        location: activity.location,
        description: activity.description || '',
        image: activity.images && activity.images.length > 0 ? activity.images[0] : activity.image || '',
        coordinates: activity.latitude && activity.longitude
          ? { lat: Number(activity.latitude), lng: Number(activity.longitude) }
          : undefined
      } as Activity)),
    [activities]
  );

  // Convert database hotels to our Hotel type
  const convertedHotels = useMemo(() =>
    hotels.map(hotel => ({
      id: hotel.id.toString(),
      name: hotel.name,
      location: hotel.location,
      image: hotel.images && hotel.images.length > 0 ? hotel.images[0] : hotel.image || '',
      description: hotel.description || '',
      amenities: hotel.amenities || [],
      breakfast: hotel.breakfast || false,
      coordinates: hotel.latitude && hotel.longitude
        ? { lat: Number(hotel.latitude), lng: Number(hotel.longitude) }
        : undefined
    } as Hotel)),
    [hotels]
  );

  const handleActivityToggle = (activityId: string) => {
    if (selectedActivities.includes(activityId)) {
      setSelectedActivities(selectedActivities.filter(id => id !== activityId));
    } else {
      setSelectedActivities([...selectedActivities, activityId]);
    }
  };

  const handleAccommodationSelect = (accommodationId: string, type: 'hotel' | 'guestHouse') => {
    if (type === 'hotel') {
      if (selectedHotels.includes(accommodationId)) {
        setSelectedHotels(selectedHotels.filter(id => id !== accommodationId));
      } else {
        setSelectedHotels([...selectedHotels, accommodationId]);
      }
    } else {
      if (selectedGuestHouses.includes(accommodationId)) {
        setSelectedGuestHouses(selectedGuestHouses.filter(id => id !== accommodationId));
      } else {
        setSelectedGuestHouses([...selectedGuestHouses, accommodationId]);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-16">
        <div className="text-gray-500">Loading activities...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {convertedActivities.map((activity) => {
          const closestHotel = activity.coordinates ? findClosestHotel(activity, convertedHotels) : null;
          const nearbyAccommodations = activity.coordinates
            ? findNearbyAccommodations(activity, convertedHotels, guestHouses, 25)
            : { hotels: [], guestHouses: [] };

          return (
            <Card key={activity.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                {activity.image && (
                  <img
                    src={activity.image}
                    alt={activity.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="absolute top-3 left-3">
                  <Checkbox
                    checked={selectedActivities.includes(activity.id)}
                    onCheckedChange={() => handleActivityToggle(activity.id)}
                    className="bg-white border-2 border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{activity.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    📍 {activity.location}
                  </p>
                </div>

                {activity.description && (
                  <p className="text-sm text-gray-700 line-clamp-2">{activity.description}</p>
                )}

              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
