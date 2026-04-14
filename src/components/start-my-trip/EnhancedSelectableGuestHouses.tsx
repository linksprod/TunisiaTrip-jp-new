import React, { useMemo } from "react";
import { Home, Star, MapPin, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useGuestHouses } from "@/hooks/useGuestHouses";
import { useActivities } from "@/hooks/useActivities";

import { calculatePureDistance as calculateDistance } from "@/services/geographicalService";

interface EnhancedSelectableGuestHousesProps {
  selectedGuestHouses: string[];
  setSelectedGuestHouses: (guestHouses: string[]) => void;
  selectedActivities: string[];
  totalDays: number;
  preferenceType?: 'luxury' | 'authentic' | 'mixed';
}

export function EnhancedSelectableGuestHouses({
  selectedGuestHouses,
  setSelectedGuestHouses,
  selectedActivities,
  totalDays,
  preferenceType = 'mixed'
}: EnhancedSelectableGuestHousesProps) {
  const { guestHouses = [], isLoading } = useGuestHouses();
  const { activities = [] } = useActivities();

  // Simplified recommendations - show all guest houses with default recommendations
  const recommendations = useMemo(() => {
    let recommendedGuestHouses = guestHouses;
    let reasons = ['Authentic experience for your trip'];

    // If activities are selected, filter by proximity
    if (selectedActivities.length > 0) {
      recommendedGuestHouses = guestHouses.filter(guestHouse => {
        if (!guestHouse.latitude || !guestHouse.longitude) return false;

        // Check if guest house is within 30km of any selected activity
        return activities.some(activity => {
          if (!selectedActivities.includes(activity.id?.toString() || '')) return false;
          if (!activity.latitude || !activity.longitude) return false;

          const distance = calculateDistance(
            guestHouse.latitude!,
            guestHouse.longitude!,
            activity.latitude,
            activity.longitude
          );
          return distance <= 30;
        });
      });
      reasons = ['Authentic experience near your activities'];
    }

    return {
      recommendations: recommendedGuestHouses.map(guestHouse => ({
        type: 'guesthouse' as const,
        accommodation: guestHouse,
        score: 80,
        reasons,
        nearbyActivities: [],
        daysRecommended: Math.ceil(totalDays / 3),
        japaneseAppeal: []
      })),
      summary: {
        totalRegions: 1,
        recommendedHotels: 0,
        recommendedGuesthouses: recommendedGuestHouses.length,
        averageDistance: 15
      }
    };
  }, [selectedActivities, totalDays, guestHouses, activities]);

  const guestHouseRecommendations = useMemo(() => {
    return recommendations.recommendations?.filter(rec => rec.type === 'guesthouse') || [];
  }, [recommendations]);

  // Convert database guest houses to include recommendation data
  const enhancedGuestHouses = useMemo(() => {
    return guestHouses.map(guestHouse => {
      const recommendation = guestHouseRecommendations.find(rec =>
        rec.accommodation.id === guestHouse.id?.toString() ||
        rec.accommodation.name.toLowerCase() === guestHouse.name.toLowerCase()
      );

      // Calculate nearby activities for non-recommended guest houses
      let nearbyActivities: Array<{ id: string, title: string, distance: number }> = [];
      if (guestHouse.latitude && guestHouse.longitude && selectedActivities.length > 0) {
        nearbyActivities = activities
          .filter(activity =>
            selectedActivities.includes(activity.id?.toString() || '') &&
            activity.latitude && activity.longitude
          )
          .map(activity => ({
            id: activity.id?.toString() || '',
            title: activity.title || '',
            distance: calculateDistance(
              guestHouse.latitude!,
              guestHouse.longitude!,
              activity.latitude!,
              activity.longitude!
            )
          }))
          .filter(item => item.distance <= 30) // Smaller radius for guest houses
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 3);
      }

      return {
        ...guestHouse,
        recommendation,
        nearbyActivities,
        isRecommended: !!recommendation,
        score: recommendation?.score || 0
      };
    }).sort((a, b) => {
      // Sort by recommendation score first, then by name
      if (a.isRecommended && !b.isRecommended) return -1;
      if (!a.isRecommended && b.isRecommended) return 1;
      return b.score - a.score;
    });
  }, [guestHouses, guestHouseRecommendations, activities, selectedActivities]);

  const handleGuestHouseToggle = (guestHouseId: string) => {
    if (selectedGuestHouses.includes(guestHouseId)) {
      setSelectedGuestHouses(selectedGuestHouses.filter(id => id !== guestHouseId));
    } else {
      setSelectedGuestHouses([...selectedGuestHouses, guestHouseId]);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <div className="w-full h-48 bg-muted"></div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Section de recommandations TOUJOURS VISIBLE */}
      <div className="bg-success/5 rounded-lg p-4 border border-success/20">
        <h4 className="font-medium text-success mb-2 flex items-center gap-2">
          🏠 Maisons d'hôtes pour une expérience authentique
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>Maisons d'hôtes disponibles: <span className="font-medium">{enhancedGuestHouses.length}</span></div>
          <div>Durée du séjour: <span className="font-medium">{totalDays} jours</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {enhancedGuestHouses.map((guestHouse) => guestHouse.id && (
          <Card
            key={guestHouse.id}
            className={`overflow-hidden transition-all duration-300 cursor-pointer transform hover:scale-105 ${selectedGuestHouses.includes(guestHouse.id)
                ? 'ring-4 ring-success shadow-2xl bg-success/5 border-success scale-105'
                : 'hover:shadow-xl border-gray-200 hover:border-success/30'
              }`}
            onClick={() => handleGuestHouseToggle(guestHouse.id)}
          >
            <div className="relative">
              {((guestHouse.images && guestHouse.images.length > 0) ? guestHouse.images[0] : guestHouse.image) && (
                <img
                  src={(guestHouse.images && guestHouse.images.length > 0) ? guestHouse.images[0] : guestHouse.image}
                  alt={guestHouse.name}
                  className="w-full h-48 object-cover"
                />
              )}

              {/* CHECKBOX ULTRA VISIBLE */}
              <div className="absolute top-3 left-3 z-50">
                <div className={`rounded-full p-2 shadow-2xl border-3 ${selectedGuestHouses.includes(guestHouse.id)
                    ? 'bg-success border-white'
                    : 'bg-white/95 border-gray-300'
                  }`}>
                  <Checkbox
                    checked={selectedGuestHouses.includes(guestHouse.id)}
                    onCheckedChange={() => handleGuestHouseToggle(guestHouse.id)}
                    className={`h-6 w-6 border-2 ${selectedGuestHouses.includes(guestHouse.id)
                        ? 'bg-white border-white data-[state=checked]:bg-white data-[state=checked]:text-success'
                        : 'bg-white border-gray-400 data-[state=checked]:bg-success data-[state=checked]:border-success data-[state=checked]:text-white'
                      }`}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

              {/* BADGES ULTRA VISIBLES */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 z-40">
                <Badge className={`text-xs font-bold shadow-xl ${selectedGuestHouses.includes(guestHouse.id)
                    ? 'bg-white text-success border-2 border-success'
                    : 'bg-success text-white'
                  }`}>
                  🏠 {guestHouse.isRecommended ? 'RECOMMANDÉ' : 'AUTHENTIQUE'}
                </Badge>
                <Badge className={`text-xs font-bold shadow-xl ${selectedGuestHouses.includes(guestHouse.id)
                    ? 'bg-white text-green-600 border-2 border-green-600'
                    : 'bg-green-500 text-white'
                  }`}>
                  📅 {guestHouse.recommendation?.daysRecommended || Math.ceil(totalDays / 3)} JOUR{(guestHouse.recommendation?.daysRecommended || Math.ceil(totalDays / 3)) > 1 ? 'S' : ''}
                </Badge>
              </div>

            </div>

            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {guestHouse.location}
                  </p>
                  <h3 className="text-lg font-medium mt-1">{guestHouse.name}</h3>
                </div>
                <Home className="h-5 w-5 text-success" />
              </div>

              {/* Description and rating */}
              <div className="mb-2">
                {guestHouse.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{guestHouse.description}</p>
                )}
                {guestHouse.rating && (
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < guestHouse.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-1">({guestHouse.rating})</span>
                  </div>
                )}
              </div>

              {/* Recommendation details */}
              {guestHouse.recommendation && (
                <div className="space-y-2 mb-3">
                  <div className="text-xs">
                    <span className="font-medium text-success">Score: {guestHouse.recommendation.score}</span>
                  </div>
                  {guestHouse.recommendation.reasons.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      • {guestHouse.recommendation.reasons[0]}
                    </div>
                  )}
                </div>
              )}

              {/* Nearby activities */}
              {guestHouse.nearbyActivities.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-600 mb-2">Activités proches:</p>
                  <div className="space-y-1">
                    {guestHouse.nearbyActivities.slice(0, 2).map((activity) => (
                      <div key={activity.id} className="flex justify-between items-center text-xs">
                        <span className="text-gray-600 truncate">{activity.title}</span>
                        <span className="text-success font-medium ml-2">{activity.distance.toFixed(1)}km</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}