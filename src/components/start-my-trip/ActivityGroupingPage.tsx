import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { ArrowLeft, MapPin, Building, Home } from "lucide-react";
import { Activity } from "@/data/activities";
import { getAccommodationImage } from "@/utils/themeUtils";
import { InteractiveTripMap } from "@/components/start-my-trip/InteractiveTripMap";

interface ActivityGroupingPageProps {
  selectedActivities: string[];
  activities: any[];
  hotels: any[];
  guestHouses: any[];
  selectedHotels: string[];
  selectedGuestHouses: string[];
  onActivityToggle: (activityId: string) => void;
  onHotelToggle: (hotelId: string) => void;
  onGuestHouseToggle: (guestHouseId: string) => void;
  onBack: () => void;
  onGenerateItinerary: () => void;
}

export function ActivityGroupingPage({
  selectedActivities,
  activities,
  hotels,
  guestHouses,
  selectedHotels,
  selectedGuestHouses,
  onActivityToggle,
  onHotelToggle,
  onGuestHouseToggle,
  onBack,
  onGenerateItinerary
}: ActivityGroupingPageProps) {
  const { currentLanguage } = useTranslation();

  // Convert all activities with extended properties for recommendation
  const allConvertedActivities = useMemo(() => {
    return activities.map(activity => ({
      id: activity.id || '',
      name: activity.title || '',
      description: activity.description || '',
      duration: activity.duration || '2-3 hours',
      price: activity.price || '$',
      coordinates: {
        lat: activity.latitude || 0,
        lng: activity.longitude || 0
      },
      image: activity.images?.[0] || activity.image || '',
      category: activity.category || 'cultural',
      subcategory: activity.category || '',
      rating: activity.rating || 4.5,
      location: activity.location || ''
    }));
  }, [activities]);

  // Function to find closest accommodations for an activity with smart selection logic
  const findClosestAccommodation = (activity: any) => {
    const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
      return Math.sqrt(
        Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2)
      ) * 111; // Convert to km
    };

    const CLOSE_DISTANCE = 50; // If both accommodations are within 50km, show both
    const MAX_DISTANCE = 100; // Maximum distance to consider

    // Find all hotels with distances
    const hotelsWithDistance = hotels
      .filter(hotel => hotel.latitude && hotel.longitude)
      .map(hotel => ({
        ...hotel,
        distance: calculateDistance(
          activity.coordinates.lat,
          activity.coordinates.lng,
          hotel.latitude,
          hotel.longitude
        )
      }))
      .filter(hotel => hotel.distance <= MAX_DISTANCE)
      .sort((a, b) => a.distance - b.distance);

    // Find all guest houses with distances
    const guestHousesWithDistance = guestHouses
      .filter(guestHouse => guestHouse.latitude && guestHouse.longitude)
      .map(guestHouse => ({
        ...guestHouse,
        distance: calculateDistance(
          activity.coordinates.lat,
          activity.coordinates.lng,
          guestHouse.latitude,
          guestHouse.longitude
        )
      }))
      .filter(guestHouse => guestHouse.distance <= MAX_DISTANCE)
      .sort((a, b) => a.distance - b.distance);

    // Logic for hotels: if closest is within 50km and there's a second one close, show both
    let selectedHotels = [];
    if (hotelsWithDistance.length > 0) {
      const closest = hotelsWithDistance[0];
      selectedHotels.push(closest);

      if (hotelsWithDistance.length > 1 && closest.distance <= CLOSE_DISTANCE) {
        const second = hotelsWithDistance[1];
        if (second.distance <= CLOSE_DISTANCE) {
          selectedHotels.push(second);
        }
      }
    }

    // Logic for guest houses: if closest is within 50km and there's a second one close, show both
    let selectedGuestHouses = [];
    if (guestHousesWithDistance.length > 0) {
      const closest = guestHousesWithDistance[0];
      selectedGuestHouses.push(closest);

      if (guestHousesWithDistance.length > 1 && closest.distance <= CLOSE_DISTANCE) {
        const second = guestHousesWithDistance[1];
        if (second.distance <= CLOSE_DISTANCE) {
          selectedGuestHouses.push(second);
        }
      }
    }

    return {
      hotels: selectedHotels,
      guestHouses: selectedGuestHouses
    };
  };

  // Activities with their recommended accommodations
  const activitiesWithRecommendations = useMemo(() => {
    return allConvertedActivities.map(activity => {
      const recommendations = findClosestAccommodation(activity);
      return {
        ...activity,
        recommendations,
        isSelected: selectedActivities.includes(activity.id)
      };
    });
  }, [allConvertedActivities, hotels, guestHouses, selectedActivities]);

  const totalSelectedAccommodations = selectedHotels.length + selectedGuestHouses.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          <TranslateText text="Back to Selection" language={currentLanguage} />
        </Button>

        <div className="text-sm text-muted-foreground">
          {selectedActivities.length} activities • {totalSelectedAccommodations} accommodations
        </div>
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">
          <TranslateText text="Select Activities & Recommended Accommodations" language={currentLanguage} />
        </h2>
        <p className="text-muted-foreground">
          <TranslateText text="Choose your activities and we'll recommend the closest accommodations for each." language={currentLanguage} />
        </p>
      </div>

      {/* Main Content Layout with Map */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Activities Section - Left Side */}
        <div className="flex-1 space-y-6">
          {activitiesWithRecommendations.map((activity) => (
            <Card key={activity.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Activity Selection */}
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={activity.isSelected}
                      onCheckedChange={() => onActivityToggle(activity.id)}
                      className="mt-1"
                    />
                    <div className="flex items-start gap-4 flex-1">
                      {activity.image && (
                        <img
                          src={activity.image}
                          alt={activity.name}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">{activity.name}</h3>
                        <p className="text-sm text-muted-foreground">{activity.location}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="outline">{activity.duration || '2-3 hours'}</Badge>
                          <Badge variant="outline">{activity.price || '$'}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Accommodations for this Activity */}
                  {activity.isSelected && (activity.recommendations.hotels.length > 0 || activity.recommendations.guestHouses.length > 0) && (
                    <div className="ml-6 border-l-2 border-muted pl-4 space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">
                        <TranslateText text="Recommended Accommodations nearby (within 50km for multiple, up to 100km for single):" language={currentLanguage} />
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Recommended Hotels */}
                        {activity.recommendations.hotels.map((hotel, index) => (
                          <Card key={hotel.id} className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <Checkbox
                                  checked={selectedHotels.includes(hotel.id)}
                                  onCheckedChange={() => onHotelToggle(hotel.id)}
                                />
                                <img
                                  src={getAccommodationImage(hotel)}
                                  alt={hotel.name}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Building className="h-4 w-4 text-primary" />
                                    <h5 className="font-medium text-foreground">{hotel.name}</h5>
                                    {index === 0 && <Badge variant="outline" className="text-xs">Closest</Badge>}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{hotel.location}</p>
                                  <p className="text-xs text-muted-foreground">
                                    ~{Math.round(hotel.distance)}km from activity
                                  </p>
                                  {hotel.amenities && hotel.amenities.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {hotel.amenities.slice(0, 2).map((amenity, idx) => (
                                        <Badge key={idx} variant="outline" className="text-xs">
                                          {amenity}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}

                        {/* Recommended Guest Houses */}
                        {activity.recommendations.guestHouses.map((guestHouse, index) => (
                          <Card key={guestHouse.id} className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <Checkbox
                                  checked={selectedGuestHouses.includes(guestHouse.id)}
                                  onCheckedChange={() => onGuestHouseToggle(guestHouse.id)}
                                />
                                <img
                                  src={getAccommodationImage(guestHouse)}
                                  alt={guestHouse.name}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Home className="h-4 w-4 text-primary" />
                                    <h5 className="font-medium text-foreground">{guestHouse.name}</h5>
                                    {index === 0 && <Badge variant="outline" className="text-xs">Closest</Badge>}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{guestHouse.location}</p>
                                  <p className="text-xs text-muted-foreground">
                                    ~{Math.round(guestHouse.distance)}km from activity
                                  </p>
                                  {guestHouse.amenities && guestHouse.amenities.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {guestHouse.amenities.slice(0, 2).map((amenity, idx) => (
                                        <Badge key={idx} variant="outline" className="text-xs">
                                          {amenity}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Generate Itinerary Button */}
          <div className="flex justify-center pt-6">
            <Button
              size="lg"
              onClick={onGenerateItinerary}
              disabled={totalSelectedAccommodations === 0}
              className="px-8"
            >
              <TranslateText text="Generate My Itinerary" language={currentLanguage} />
            </Button>
            {totalSelectedAccommodations === 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                <TranslateText text="Please select at least one accommodation to continue" language={currentLanguage} />
              </p>
            )}
          </div>
        </div>

        {/* Map Section - Right Side */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-4">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <TranslateText text="Interactive Map" language={currentLanguage} />
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  <TranslateText text="View your selected activities and accommodations" language={currentLanguage} />
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-96 rounded-b-lg overflow-hidden">
                  <InteractiveTripMap
                    selectedActivities={selectedActivities}
                    setSelectedActivities={(activities) => {
                      // Handle activity selection from map
                      activities.forEach(activityId => {
                        if (!selectedActivities.includes(activityId)) {
                          onActivityToggle(activityId);
                        }
                      });
                      // Handle deselection
                      selectedActivities.forEach(activityId => {
                        if (!activities.includes(activityId)) {
                          onActivityToggle(activityId);
                        }
                      });
                    }}
                    selectedHotels={selectedHotels}
                    selectedGuestHouses={selectedGuestHouses}
                    activeTab="activities"
                    setSelectedHotels={(hotels) => {
                      // Handle hotel selection from map
                      hotels.forEach(hotelId => {
                        if (!selectedHotels.includes(hotelId)) {
                          onHotelToggle(hotelId);
                        }
                      });
                      // Handle deselection
                      selectedHotels.forEach(hotelId => {
                        if (!hotels.includes(hotelId)) {
                          onHotelToggle(hotelId);
                        }
                      });
                    }}
                    setSelectedGuestHouses={(guestHouses) => {
                      // Handle guest house selection from map
                      guestHouses.forEach(guestHouseId => {
                        if (!selectedGuestHouses.includes(guestHouseId)) {
                          onGuestHouseToggle(guestHouseId);
                        }
                      });
                      // Handle deselection
                      selectedGuestHouses.forEach(guestHouseId => {
                        if (!guestHouses.includes(guestHouseId)) {
                          onGuestHouseToggle(guestHouseId);
                        }
                      });
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}