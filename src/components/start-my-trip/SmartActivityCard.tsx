import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Hotel, Star, Plus, Check } from 'lucide-react';
import { Activity } from '@/data/activities';
import { Hotel as HotelType } from '@/data/hotels';
import { GuestHouse } from '@/data/guestHouses';
import { findNearbyAccommodations, calculatePureDistance as calculateDistance } from '@/services/geographicalService';
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface SmartActivityCardProps {
  activity: Activity;
  isSelected: boolean;
  onToggle: (activityId: string) => void;
  allHotels: HotelType[];
  allGuestHouses: GuestHouse[];
  selectedHotels: string[];
  selectedGuestHouses: string[];
  onHotelSelect: (hotelId: string) => void;
  onGuestHouseSelect: (guestHouseId: string) => void;
}

export function SmartActivityCard({
  activity,
  isSelected,
  onToggle,
  allHotels,
  allGuestHouses,
  selectedHotels,
  selectedGuestHouses,
  onHotelSelect,
  onGuestHouseSelect
}: SmartActivityCardProps) {
  const [showAccommodations, setShowAccommodations] = useState(false);
  const { currentLanguage } = useTranslation();

  // Find nearby accommodations
  const { hotels: nearbyHotels, guestHouses: nearbyGuestHouses } = findNearbyAccommodations(
    activity,
    allHotels,
    allGuestHouses,
    25 // 25km radius
  );

  const handleActivityToggle = () => {
    onToggle(activity.id);
    if (!isSelected && (nearbyHotels.length > 0 || nearbyGuestHouses.length > 0)) {
      setShowAccommodations(true);
    }
  };

  const getDistanceText = (accommodationCoords: { lat: number; lng: number }) => {
    if (!activity.coordinates) return '';
    const distance = calculateDistance(
      activity.coordinates.lat,
      activity.coordinates.lng,
      accommodationCoords.lat,
      accommodationCoords.lng
    );
    return `${distance.toFixed(1)} km`;
  };

  return (
    <div className="space-y-3">
      {/* Activity Card */}
      <Card
        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
          }`}
        onClick={handleActivityToggle}
      >
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative">
              <img
                src={activity.image}
                alt={activity.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center ${isSelected ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                {isSelected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base mb-1 truncate">
                <TranslateText text={activity.name} language={currentLanguage} />
              </h3>
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{activity.location}</span>
              </div>
              <p className="text-sm text-gray-700 line-clamp-2">
                <TranslateText text={activity.description || ''} language={currentLanguage} />
              </p>

              {isSelected && (nearbyHotels.length > 0 || nearbyGuestHouses.length > 0) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAccommodations(!showAccommodations);
                  }}
                >
                  <Hotel className="h-3 w-3 mr-1" />
                  <TranslateText
                    text={`${nearbyHotels.length + nearbyGuestHouses.length} hébergements proches`}
                    language={currentLanguage}
                  />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nearby Accommodations */}
      {isSelected && showAccommodations && (nearbyHotels.length > 0 || nearbyGuestHouses.length > 0) && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-3 flex items-center gap-2">
              <Hotel className="h-4 w-4" />
              <TranslateText text="Hébergements recommandés à proximité" language={currentLanguage} />
            </h4>

            <div className="space-y-3">
              {/* Hotels */}
              {nearbyHotels.slice(0, 2).map(hotel => (
                <div
                  key={hotel.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedHotels.includes(hotel.id)
                      ? 'bg-green-100 border-green-300'
                      : 'bg-white border-gray-200 hover:border-blue-300'
                    }`}
                  onClick={() => onHotelSelect(hotel.id)}
                >
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-medium truncate">{hotel.name}</h5>
                      <Badge variant="secondary" className="text-xs">
                        {hotel.coordinates && getDistanceText(hotel.coordinates)}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 truncate">{hotel.location}</p>
                    {hotel.breakfast && (
                      <Badge variant="outline" className="text-xs">
                        Petit-déjeuner inclus
                      </Badge>
                    )}
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedHotels.includes(hotel.id)
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300'
                    }`}>
                    {selectedHotels.includes(hotel.id) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                </div>
              ))}

              {/* Guest Houses */}
              {nearbyGuestHouses.slice(0, 2).map(guestHouse => (
                <div
                  key={guestHouse.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedGuestHouses.includes(guestHouse.id)
                      ? 'bg-green-100 border-green-300'
                      : 'bg-white border-gray-200 hover:border-blue-300'
                    }`}
                  onClick={() => onGuestHouseSelect(guestHouse.id)}
                >
                  <img
                    src={guestHouse.image}
                    alt={guestHouse.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-medium truncate">{guestHouse.name}</h5>
                      <Badge variant="outline" className="text-xs">Maison d'hôtes</Badge>
                      <Badge variant="secondary" className="text-xs">
                        {guestHouse.coordinates && getDistanceText(guestHouse.coordinates)}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 truncate">{guestHouse.location}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedGuestHouses.includes(guestHouse.id)
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300'
                    }`}>
                    {selectedGuestHouses.includes(guestHouse.id) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}