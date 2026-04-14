import React, { useMemo } from "react";
import { Hotel, Star, MapPin, Calendar, TrendingUp, Plus, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useHotels } from "@/hooks/useHotels";
import { useActivities } from "@/hooks/useActivities";

import { calculatePureDistance as calculateDistance } from "@/services/geographicalService";

interface EnhancedSelectableHotelsProps {
  selectedHotels: string[];
  setSelectedHotels: (hotels: string[]) => void;
  selectedActivities: string[];
  totalDays: number;
  preferenceType?: 'luxury' | 'authentic' | 'mixed';
}

export function EnhancedSelectableHotels({
  selectedHotels,
  setSelectedHotels,
  selectedActivities,
  totalDays,
  preferenceType = 'mixed'
}: EnhancedSelectableHotelsProps) {
  const { hotels = [], isLoading } = useHotels();
  const { activities = [] } = useActivities();

  // Simplified recommendations - show all hotels with default recommendations
  const recommendations = useMemo(() => {
    let recommendedHotels = hotels;
    let reasons = ['Excellent choice for your trip'];

    // If activities are selected, filter by proximity
    if (selectedActivities.length > 0) {
      recommendedHotels = hotels.filter(hotel => {
        if (!hotel.latitude || !hotel.longitude) return false;

        // Check if hotel is within 50km of any selected activity
        return activities.some(activity => {
          if (!selectedActivities.includes(activity.id?.toString() || '')) return false;
          if (!activity.latitude || !activity.longitude) return false;

          const distance = calculateDistance(
            hotel.latitude!,
            hotel.longitude!,
            activity.latitude,
            activity.longitude
          );
          return distance <= 50;
        });
      });
      reasons = ['Close to your selected activities'];
    }

    return {
      recommendations: recommendedHotels.map(hotel => ({
        type: 'hotel' as const,
        accommodation: hotel,
        score: 75,
        reasons,
        nearbyActivities: [],
        daysRecommended: Math.ceil(totalDays / 2),
        japaneseAppeal: []
      })),
      summary: {
        totalRegions: 1,
        recommendedHotels: recommendedHotels.length,
        recommendedGuesthouses: 0,
        averageDistance: 25
      }
    };
  }, [selectedActivities, totalDays, hotels, activities]);

  const hotelRecommendations = useMemo(() => {
    return recommendations.recommendations?.filter(rec => rec.type === 'hotel') || [];
  }, [recommendations]);

  // Convert database hotels to include recommendation data
  const enhancedHotels = useMemo(() => {
    return hotels.map(hotel => {
      const recommendation = hotelRecommendations.find(rec =>
        rec.accommodation.id === hotel.id?.toString() ||
        rec.accommodation.name.toLowerCase() === hotel.name.toLowerCase()
      );

      // Calculate nearby activities for non-recommended hotels
      let nearbyActivities: Array<{ id: string, title: string, distance: number }> = [];
      if (hotel.latitude && hotel.longitude && selectedActivities.length > 0) {
        nearbyActivities = activities
          .filter(activity =>
            selectedActivities.includes(activity.id?.toString() || '') &&
            activity.latitude && activity.longitude
          )
          .map(activity => ({
            id: activity.id?.toString() || '',
            title: activity.title || '',
            distance: calculateDistance(
              hotel.latitude!,
              hotel.longitude!,
              activity.latitude!,
              activity.longitude!
            )
          }))
          .filter(item => item.distance <= 50) // Within 50km
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 3);
      }

      return {
        ...hotel,
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
  }, [hotels, hotelRecommendations, activities, selectedActivities]);

  const handleHotelToggle = (hotelId: string) => {
    if (selectedHotels.includes(hotelId)) {
      setSelectedHotels(selectedHotels.filter(id => id !== hotelId));
    } else {
      setSelectedHotels([...selectedHotels, hotelId]);
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
      {/* Recommendations Summary */}
      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
        <h4 className="font-medium text-primary mb-2 flex items-center gap-2">
          🏨 Recommended Hotels for Your Stay
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>Available Hotels: <span className="font-medium">{enhancedHotels.length}</span></div>
          <div>Trip Duration: <span className="font-medium">{totalDays} days</span></div>
        </div>
      </div>

      <div className="grid gap-4">
        {enhancedHotels.map((hotel) => {
          const isSelected = selectedHotels.includes(hotel.id || '');
          return hotel.id && (
            <Card
              key={hotel.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
              onClick={() => handleHotelToggle(hotel.id)}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative">
                    <img
                      src={((hotel.images && hotel.images.length > 0) ? hotel.images[0] : hotel.image) || '/placeholder.svg'}
                      alt={hotel.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center ${isSelected ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                      }`}>
                      {isSelected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base mb-1 truncate">
                      {hotel.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{hotel.location}</span>
                    </div>

                    {/* Price and Rating */}
                    <div className="flex items-center gap-4 text-sm mb-2">
                      {hotel.price_per_night && (
                        <span className="font-medium text-primary">
                          {hotel.price_per_night}/night
                        </span>
                      )}
                      {hotel.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{hotel.rating}</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {hotel.description && (
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {hotel.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}