import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MapPin, Users, Calendar, Heart } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { TranslateText } from "@/components/translation/TranslateText";
import { getProximityBasedRecommendations, groupRecommendationsByRegion, AccommodationWithProximity } from "@/utils/proximityRecommendations";
import { calculatePureDistance as calculateDistance } from "@/services/geographicalService";
import { useActivities } from "@/hooks/useActivities";
import { useHotels } from "@/hooks/useHotels";
import { useGuestHouses } from "@/hooks/useGuestHouses";
import { Activity } from "@/data/activities";

interface SmartAccommodationRecommendationsProps {
  selectedActivities: string[];
  selectedDays: number;
  onAccommodationSelect: (accommodationId: string, type: 'hotel' | 'guesthouse') => void;
}

const SmartAccommodationRecommendations: React.FC<SmartAccommodationRecommendationsProps> = ({
  selectedActivities,
  selectedDays,
  onAccommodationSelect
}) => {
  const [recommendations, setRecommendations] = useState<AccommodationWithProximity[]>([]);
  const [groupedRecommendations, setGroupedRecommendations] = useState<Record<string, AccommodationWithProximity[]>>({});
  const [selectedAccommodations, setSelectedAccommodations] = useState<Set<string>>(new Set());
  const { currentLanguage } = useTranslation();

  // Fetch data hooks
  const { activities: dbActivities } = useActivities();
  const { hotels: dbHotels } = useHotels();
  const { guestHouses: dbGuestHouses } = useGuestHouses();

  useEffect(() => {
    if (selectedActivities.length > 0 && dbActivities.length > 0) {
      // Convert selectedActivities IDs to Activity objects
      const activitiesData = dbActivities
        .filter(activity => selectedActivities.includes(activity.id.toString()))
        .map(activity => ({
          id: activity.id.toString(),
          name: activity.title,
          location: activity.location,
          description: activity.description || '',
          image: activity.images?.[0] || activity.image || '',
          coordinates: activity.latitude && activity.longitude ? {
            lat: Number(activity.latitude),
            lng: Number(activity.longitude)
          } : undefined
        }) as Activity)
        .filter(activity => activity.coordinates);

      // Pre-filter accommodations based on proximity to selected activities
      const MAX_DISTANCE_KM = 100;
      const closeHotelIds: string[] = [];
      const closeGuestHouseIds: string[] = [];

      console.log('=== DÉBUT DU FILTRAGE DES HÉBERGEMENTS ===');
      console.log(`Activités sélectionnées:`, activitiesData.map(a => ({ name: a.name, coords: a.coordinates })));
      console.log(`Distance maximale autorisée: ${MAX_DISTANCE_KM} km`);

      activitiesData.forEach(activity => {
        if (!activity.coordinates) return;

        console.log(`\n--- Calcul pour l'activité: ${activity.name} (${activity.coordinates.lat}, ${activity.coordinates.lng}) ---`);

        // Filter hotels within MAX_DISTANCE_KM
        dbHotels.forEach(hotel => {
          if (hotel.latitude && hotel.longitude) {
            const distance = calculateDistance(
              activity.coordinates!.lat,
              activity.coordinates!.lng,
              Number(hotel.latitude),
              Number(hotel.longitude)
            );

            console.log(`Hôtel ${hotel.name} (${hotel.latitude}, ${hotel.longitude}): distance = ${distance.toFixed(1)} km`);

            if (distance <= MAX_DISTANCE_KM) {
              if (!closeHotelIds.includes(hotel.id.toString())) {
                closeHotelIds.push(hotel.id.toString());
                console.log(`✅ Hôtel ${hotel.name} AJOUTÉ (${distance.toFixed(1)} km ≤ ${MAX_DISTANCE_KM} km)`);
              } else {
                console.log(`✅ Hôtel ${hotel.name} déjà dans la liste`);
              }
            } else {
              console.log(`❌ Hôtel ${hotel.name} REJETÉ (${distance.toFixed(1)} km > ${MAX_DISTANCE_KM} km)`);
            }
          } else {
            console.log(`❌ Hôtel ${hotel.name} REJETÉ (coordonnées manquantes)`);
          }
        });

        // Filter guest houses within MAX_DISTANCE_KM
        dbGuestHouses.forEach(guestHouse => {
          if (guestHouse.latitude && guestHouse.longitude) {
            const distance = calculateDistance(
              activity.coordinates!.lat,
              activity.coordinates!.lng,
              Number(guestHouse.latitude),
              Number(guestHouse.longitude)
            );

            console.log(`Guest House ${guestHouse.name} (${guestHouse.latitude}, ${guestHouse.longitude}): distance = ${distance.toFixed(1)} km`);

            if (distance <= MAX_DISTANCE_KM) {
              if (!closeGuestHouseIds.includes(guestHouse.id.toString())) {
                closeGuestHouseIds.push(guestHouse.id.toString());
                console.log(`✅ Guest House ${guestHouse.name} AJOUTÉ (${distance.toFixed(1)} km ≤ ${MAX_DISTANCE_KM} km)`);
              } else {
                console.log(`✅ Guest House ${guestHouse.name} déjà dans la liste`);
              }
            } else {
              console.log(`❌ Guest House ${guestHouse.name} REJETÉ (${distance.toFixed(1)} km > ${MAX_DISTANCE_KM} km)`);
            }
          } else {
            console.log(`❌ Guest House ${guestHouse.name} REJETÉ (coordonnées manquantes)`);
          }
        });
      });

      console.log(`Filtered accommodations: ${closeHotelIds.length} hotels, ${closeGuestHouseIds.length} guest houses within ${MAX_DISTANCE_KM}km`);

      const proximityRecommendations = getProximityBasedRecommendations(
        activitiesData,
        dbHotels,
        dbGuestHouses,
        closeHotelIds,
        closeGuestHouseIds
      );

      const grouped = groupRecommendationsByRegion(proximityRecommendations);

      setRecommendations(proximityRecommendations);
      setGroupedRecommendations(grouped);
    } else {
      setRecommendations([]);
      setGroupedRecommendations({});
    }
  }, [selectedActivities, selectedDays, dbActivities, dbHotels, dbGuestHouses]);

  const handleAccommodationToggle = (recommendation: AccommodationWithProximity) => {
    const accommodationId = recommendation.id;
    const isSelected = selectedAccommodations.has(accommodationId);

    if (isSelected) {
      selectedAccommodations.delete(accommodationId);
    } else {
      selectedAccommodations.add(accommodationId);
    }

    setSelectedAccommodations(new Set(selectedAccommodations));
    onAccommodationSelect(accommodationId, recommendation.type);
  };

  if (selectedActivities.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          <TranslateText text="No Activities Selected" language={currentLanguage} />
        </h3>
        <p className="text-muted-foreground">
          <TranslateText text="Please select some activities first to get personalized accommodation recommendations." language={currentLanguage} />
        </p>
      </div>
    );
  }

  // Filter recommendations by type
  const hotelRecommendations = recommendations.filter(rec => rec.type === 'hotel');
  const guesthouseRecommendations = recommendations.filter(rec => rec.type === 'guesthouse');

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {/* Trip Summary Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">
              <TranslateText text="Smart Accommodation Recommendations" language={currentLanguage} />
            </h2>
            <Badge variant="secondary" className="px-3 py-1">
              {selectedActivities.length} <TranslateText text="activities selected" language={currentLanguage} />
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{selectedDays} <TranslateText text="days trip" language={currentLanguage} /></span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{Object.keys(groupedRecommendations).length} <TranslateText text="regions to explore" language={currentLanguage} /></span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>{recommendations.length} <TranslateText text="accommodations recommended" language={currentLanguage} /></span>
            </div>
          </div>
        </div>

        {/* Accommodation Recommendations */}
        <Tabs defaultValue="hotels" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="hotels" className="text-center">
              <TranslateText text={`Hotels (${hotelRecommendations.length})`} language={currentLanguage} />
            </TabsTrigger>
            <TabsTrigger value="guesthouses" className="text-center">
              <TranslateText text={`Guest Houses (${guesthouseRecommendations.length})`} language={currentLanguage} />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hotels" className="space-y-6">
            {hotelRecommendations.length > 0 ? (
              Object.entries(groupedRecommendations).map(([region, regionRecs]) => {
                const regionHotels = regionRecs.filter(rec => rec.type === 'hotel');
                if (regionHotels.length === 0) return null;

                return (
                  <div key={region} className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                      <TranslateText text={`Hotels in ${region}`} language={currentLanguage} />
                    </h3>
                    {regionHotels.map((recommendation) => (
                      <ProximityAccommodationCard
                        key={recommendation.id}
                        recommendation={recommendation}
                        isSelected={selectedAccommodations.has(recommendation.id)}
                        onToggle={() => handleAccommodationToggle(recommendation)}
                        currentLanguage={currentLanguage}
                      />
                    ))}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <TranslateText text="No hotel recommendations found for your selected activities." language={currentLanguage} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="guesthouses" className="space-y-6">
            {guesthouseRecommendations.length > 0 ? (
              Object.entries(groupedRecommendations).map(([region, regionRecs]) => {
                const regionGuestHouses = regionRecs.filter(rec => rec.type === 'guesthouse');
                if (regionGuestHouses.length === 0) return null;

                return (
                  <div key={region} className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                      <TranslateText text={`Guest Houses in ${region}`} language={currentLanguage} />
                    </h3>
                    {regionGuestHouses.map((recommendation) => (
                      <ProximityAccommodationCard
                        key={recommendation.id}
                        recommendation={recommendation}
                        isSelected={selectedAccommodations.has(recommendation.id)}
                        onToggle={() => handleAccommodationToggle(recommendation)}
                        currentLanguage={currentLanguage}
                      />
                    ))}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <TranslateText text="No guesthouse recommendations found for your selected activities." language={currentLanguage} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Proximity-based Accommodation Card Component
interface ProximityAccommodationCardProps {
  recommendation: AccommodationWithProximity;
  isSelected: boolean;
  onToggle: () => void;
  currentLanguage: string;
}

const ProximityAccommodationCard: React.FC<ProximityAccommodationCardProps> = ({
  recommendation,
  isSelected,
  onToggle,
  currentLanguage
}) => {
  const { name, type, distance, nearbyActivities, reasons } = recommendation;

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-foreground">{name}</h3>
              <Badge variant="outline" className="text-xs">
                {type === 'hotel' ? 'Hotel' : 'Guest House'}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {distance.toFixed(1)} km
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{recommendation.region}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{nearbyActivities.length} <TranslateText text="nearby activities" language={currentLanguage} /></span>
              </div>
            </div>
          </div>

          <Button
            variant={isSelected ? "default" : "outline"}
            onClick={onToggle}
            className="ml-4"
          >
            {isSelected ? (
              <>
                <Heart className="h-4 w-4 mr-2 fill-current" />
                <TranslateText text="Selected" language={currentLanguage} />
              </>
            ) : (
              <TranslateText text="Select" language={currentLanguage} />
            )}
          </Button>
        </div>

        {/* Reasons for recommendation */}
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-foreground mb-2">
              <TranslateText text="Why we recommend this:" language={currentLanguage} />
            </h4>
            <div className="space-y-1">
              {reasons.slice(0, 3).map((reason, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby activities count */}
          {nearbyActivities.length > 0 && (
            <div>
              <h4 className="font-medium text-foreground mb-2">
                <TranslateText text="Close to your selected activities:" language={currentLanguage} />
              </h4>
              <Badge variant="outline" className="text-sm">
                {nearbyActivities.length} {nearbyActivities.length === 1 ? 'activity' : 'activities'}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { SmartAccommodationRecommendations };