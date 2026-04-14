import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Star } from 'lucide-react';
import { groupActivitiesByZones, GeographicalZone } from "@/services/geographicalService";
import { SmartActivityCard } from './SmartActivityCard';
import { Hotel } from '@/data/hotels';
import { GuestHouse } from '@/data/guestHouses';
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface GeographicalZonesProps {
  zones: GeographicalZone[];
  selectedActivities: string[];
  selectedHotels: string[];
  selectedGuestHouses: string[];
  allHotels: Hotel[];
  allGuestHouses: GuestHouse[];
  onActivityToggle: (activityId: string) => void;
  onHotelSelect: (hotelId: string) => void;
  onGuestHouseSelect: (guestHouseId: string) => void;
}

export function GeographicalZones({
  zones,
  selectedActivities,
  selectedHotels,
  selectedGuestHouses,
  allHotels,
  allGuestHouses,
  onActivityToggle,
  onHotelSelect,
  onGuestHouseSelect
}: GeographicalZonesProps) {
  const [expandedZones, setExpandedZones] = useState<Set<string>>(new Set());
  const { currentLanguage } = useTranslation();

  const toggleZone = (zoneId: string) => {
    const newExpanded = new Set(expandedZones);
    if (newExpanded.has(zoneId)) {
      newExpanded.delete(zoneId);
    } else {
      newExpanded.add(zoneId);
    }
    setExpandedZones(newExpanded);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">
          <TranslateText text="Activités groupées par zones géographiques" language={currentLanguage} />
        </h2>
        <p className="text-gray-600 text-sm">
          <TranslateText text="Sélectionnez vos activités et découvrez les hébergements recommandés à proximité" language={currentLanguage} />
        </p>
      </div>

      {zones.map(zone => {
        const isExpanded = expandedZones.has(zone.id);
        const selectedActivitiesInZone = zone.activities.filter(activity =>
          selectedActivities.includes(activity.id)
        ).length;

        return (
          <Card key={zone.id} className="overflow-hidden">
            <CardHeader
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleZone(zone.id)}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="text-lg">{zone.name}</span>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {zone.activities.length} activités
                  </Badge>
                  {selectedActivitiesInZone > 0 && (
                    <Badge className="bg-green-500">
                      {selectedActivitiesInZone} sélectionnée{selectedActivitiesInZone > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {zone.nearbyHotels.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {zone.nearbyHotels.length + zone.nearbyGuestHouses.length} hébergements
                    </Badge>
                  )}
                  <Star className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </CardTitle>
            </CardHeader>

            {isExpanded && (
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {zone.activities.map(activity => (
                    <SmartActivityCard
                      key={activity.id}
                      activity={activity}
                      isSelected={selectedActivities.includes(activity.id)}
                      onToggle={onActivityToggle}
                      allHotels={allHotels}
                      allGuestHouses={allGuestHouses}
                      selectedHotels={selectedHotels}
                      selectedGuestHouses={selectedGuestHouses}
                      onHotelSelect={onHotelSelect}
                      onGuestHouseSelect={onGuestHouseSelect}
                    />
                  ))}
                </div>

                {/* Zone Summary */}
                {(zone.nearbyHotels.length > 0 || zone.nearbyGuestHouses.length > 0) && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">
                      <TranslateText text="Hébergements disponibles dans cette zone" language={currentLanguage} />
                    </h4>
                    <div className="flex gap-4 text-sm text-blue-700">
                      {zone.nearbyHotels.length > 0 && (
                        <span>{zone.nearbyHotels.length} hôtel{zone.nearbyHotels.length > 1 ? 's' : ''}</span>
                      )}
                      {zone.nearbyGuestHouses.length > 0 && (
                        <span>{zone.nearbyGuestHouses.length} maison{zone.nearbyGuestHouses.length > 1 ? 's' : ''} d'hôtes</span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}