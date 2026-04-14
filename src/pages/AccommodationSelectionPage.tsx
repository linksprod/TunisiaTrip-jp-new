import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Star, Heart, Plane, Activity as ActivityIcon, Building, Home, Calendar } from "lucide-react";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { InteractiveTripMap } from "@/components/start-my-trip/InteractiveTripMap";
import { toast } from "sonner";
import { useActivities } from "@/hooks/useActivities";
import { useHotels } from "@/hooks/useHotels";
import { useGuestHouses } from "@/hooks/useGuestHouses";
import { calculatePureDistance as calculateDistance } from "@/services/geographicalService";
import { hotels } from "@/data/hotels";
import { guestHouses } from "@/data/guestHouses";

interface ActivityWithAccommodations {
  id: string;
  name: string;
  location: string;
  image: string;
  coordinates: { lat: number; lng: number };
  nearbyHotels: Array<{
    id: string;
    name: string;
    location: string;
    image: string;
    distance: number;
  }>;
  nearbyGuestHouses: Array<{
    id: string;
    name: string;
    location: string;
    image: string;
    distance: number;
  }>;
}

const AccommodationSelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLanguage } = useTranslation();

  const selectedActivities = location.state?.selectedActivities || [];
  const checkInDate = location.state?.checkInDate;
  const checkOutDate = location.state?.checkOutDate;
  const [selectedHotels, setSelectedHotels] = useState<string[]>([]);
  const [selectedGuestHouses, setSelectedGuestHouses] = useState<string[]>([]);
  const [activitiesWithAccommodations, setActivitiesWithAccommodations] = useState<ActivityWithAccommodations[]>([]);

  // Fetch data hooks
  const { activities: dbActivities } = useActivities();
  const { hotels: dbHotels } = useHotels();
  const { guestHouses: dbGuestHouses } = useGuestHouses();

  // Redirect back if no activities are selected
  useEffect(() => {
    if (selectedActivities.length === 0) {
      toast.warning("Please select activities first");
      navigate('/start-my-trip');
    }
  }, [selectedActivities, navigate]);

  // Process activities and find nearby accommodations
  useEffect(() => {
    if (selectedActivities.length > 0 && dbActivities.length > 0 && dbHotels.length > 0 && dbGuestHouses.length > 0) {
      const processedActivities = selectedActivities.map((activityId: string) => {
        const activity = dbActivities.find(a => a.id === activityId);
        if (!activity || !activity.latitude || !activity.longitude) return null;

        const activityCoords = { lat: Number(activity.latitude), lng: Number(activity.longitude) };

        // Find nearby accommodations with extended search if needed
        const findNearbyAccommodations = (accommodations: any[], type: 'hotel' | 'guesthouse') => {
          const allAccommodations = accommodations
            .filter(acc => acc.latitude && acc.longitude)
            .map(accommodation => ({
              id: accommodation.id,
              name: accommodation.name,
              location: accommodation.location,
              image: accommodation.images?.[0] || accommodation.image || '',
              distance: calculateDistance(
                activityCoords.lat,
                activityCoords.lng,
                Number(accommodation.latitude),
                Number(accommodation.longitude)
              )
            }))
            .sort((a, b) => a.distance - b.distance);

          // Always ensure at least one accommodation is returned if any exist
          if (allAccommodations.length === 0) {
            return [];
          }

          // Progressive search: 30km -> 50km -> 100km -> closest available
          const within30km = allAccommodations.filter(acc => acc.distance <= 30);
          if (within30km.length >= 1) {
            return within30km;
          }

          const within50km = allAccommodations.filter(acc => acc.distance <= 50);
          if (within50km.length >= 1) {
            return within50km;
          }

          const within100km = allAccommodations.filter(acc => acc.distance <= 100);
          if (within100km.length >= 1) {
            return within100km;
          }

          // Fallback: return at least the closest accommodation
          return allAccommodations.slice(0, 1);
        };

        const nearbyHotels = findNearbyAccommodations(dbHotels, 'hotel');
        const nearbyGuestHouses = findNearbyAccommodations(dbGuestHouses, 'guesthouse');

        return {
          id: activity.id,
          name: activity.title,
          location: activity.location,
          image: activity.images?.[0] || activity.image || '',
          coordinates: activityCoords,
          nearbyHotels,
          nearbyGuestHouses
        };
      }).filter(Boolean) as ActivityWithAccommodations[];

      setActivitiesWithAccommodations(processedActivities);
    }
  }, [selectedActivities, dbActivities, dbHotels, dbGuestHouses]);

  const handleAccommodationSelect = (accommodationId: string, type: 'hotel' | 'guesthouse') => {
    if (type === 'hotel') {
      if (!selectedHotels.includes(accommodationId)) {
        setSelectedHotels([...selectedHotels, accommodationId]);
        toast.success(<TranslateText text="Hotel added to your selection!" language={currentLanguage} />);
      } else {
        setSelectedHotels(selectedHotels.filter(id => id !== accommodationId));
        toast.info(<TranslateText text="Hotel removed from selection" language={currentLanguage} />);
      }
    } else {
      if (!selectedGuestHouses.includes(accommodationId)) {
        setSelectedGuestHouses([...selectedGuestHouses, accommodationId]);
        toast.success(<TranslateText text="Guest house added to your selection!" language={currentLanguage} />);
      } else {
        setSelectedGuestHouses(selectedGuestHouses.filter(id => id !== accommodationId));
        toast.info(<TranslateText text="Guest house removed from selection" language={currentLanguage} />);
      }
    }
  };

  const handleContinue = () => {
    // Auto-select closest accommodations if none selected
    let finalHotels = selectedHotels;
    let finalGuestHouses = selectedGuestHouses;

    if (selectedHotels.length + selectedGuestHouses.length === 0) {
      const autoSelectedHotels: string[] = [];
      const autoSelectedGuestHouses: string[] = [];

      activitiesWithAccommodations.forEach(activity => {
        if (activity.nearbyHotels.length > 0 && !autoSelectedHotels.length) {
          autoSelectedHotels.push(activity.nearbyHotels[0].id);
        }
        if (activity.nearbyGuestHouses.length > 0 && !autoSelectedGuestHouses.length) {
          autoSelectedGuestHouses.push(activity.nearbyGuestHouses[0].id);
        }
      });

      if (autoSelectedHotels.length > 0 || autoSelectedGuestHouses.length > 0) {
        finalHotels = autoSelectedHotels;
        finalGuestHouses = autoSelectedGuestHouses;
        toast.info(<TranslateText text="We've selected the closest accommodations for you" language={currentLanguage} />);
      }
    }

    // Navigate to airport selection page
    navigate('/airport-selection', {
      state: {
        selectedActivities,
        selectedHotels: finalHotels,
        selectedGuestHouses: finalGuestHouses,
        checkInDate,
        checkOutDate
      }
    });
  };

  const handleBackToActivities = () => {
    navigate('/start-my-trip');
  };

  if (selectedActivities.length === 0) {
    return null;
  }

  return (
    <MainLayout showTagBar={false}>
      <div className="w-full bg-gradient-to-b from-background to-muted/30">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-primary hover:bg-primary/10 mb-4"
              onClick={handleBackToActivities}
            >
              <ArrowLeft className="h-4 w-4" />
              <TranslateText text="Back to Activities" language={currentLanguage} />
            </Button>

            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-foreground">
                <TranslateText text="Choose Your Accommodations" language={currentLanguage} />
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                <TranslateText text="For each activity you selected, we show the closest accommodations to optimize your travel experience." language={currentLanguage} />
              </p>
              <Badge variant="secondary" className="px-3 py-1">
                {selectedActivities.length} <TranslateText text="activities selected" language={currentLanguage} />
              </Badge>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Activities and Accommodations - Unified Cards */}
            <div className="lg:col-span-2 space-y-6">
              {activitiesWithAccommodations.map((activity) => (
                <Card key={activity.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    {/* Unified Activity + Accommodations Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                      {/* Activity Section - 30% on large screens */}
                      <div className="lg:col-span-1 relative">
                        {activity.image && (
                          <img
                            src={activity.image}
                            alt={activity.name}
                            className="w-full h-32 lg:h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 text-white">
                          <h3 className="text-lg font-bold leading-tight">{activity.name}</h3>
                          <p className="text-xs opacity-90 flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {activity.location}
                          </p>
                        </div>
                      </div>

                      {/* Accommodations Section - 70% on large screens */}
                      <div className="lg:col-span-2 p-4">
                        <div className="space-y-4">
                          {/* Hotels */}
                          {activity.nearbyHotels.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <TranslateText text="Hotels" language={currentLanguage} />
                                <Badge variant="secondary" className="text-xs">
                                  {activity.nearbyHotels.length}
                                </Badge>
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                {activity.nearbyHotels.map((hotel) => (
                                  <Card
                                    key={hotel.id}
                                    className={`cursor-pointer transition-all hover:shadow-sm border ${selectedHotels.includes(hotel.id) ? 'ring-1 ring-primary bg-primary/5' : ''
                                      }`}
                                    onClick={() => handleAccommodationSelect(hotel.id, 'hotel')}
                                  >
                                    <CardContent className="p-3">
                                      <img
                                        src={hotel.image}
                                        alt={hotel.name}
                                        className="w-full h-16 object-cover rounded mb-2"
                                      />
                                      <h5 className="font-medium text-xs mb-1 leading-tight">{hotel.name}</h5>
                                      <p className="text-xs text-muted-foreground mb-2 truncate">{hotel.location}</p>
                                      <div className="flex items-center justify-between">
                                        <Badge
                                          variant={hotel.distance <= 30 ? "default" : "outline"}
                                          className="text-xs px-2 py-0"
                                        >
                                          {hotel.distance.toFixed(1)} km
                                        </Badge>
                                        {selectedHotels.includes(hotel.id) && (
                                          <Heart className="h-3 w-3 text-primary fill-current" />
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Guest Houses */}
                          {activity.nearbyGuestHouses.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-green-600" />
                                <TranslateText text="Guest Houses" language={currentLanguage} />
                                <Badge variant="secondary" className="text-xs">
                                  {activity.nearbyGuestHouses.length}
                                </Badge>
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                {activity.nearbyGuestHouses.map((guestHouse) => (
                                  <Card
                                    key={guestHouse.id}
                                    className={`cursor-pointer transition-all hover:shadow-sm border ${selectedGuestHouses.includes(guestHouse.id) ? 'ring-1 ring-primary bg-primary/5' : ''
                                      }`}
                                    onClick={() => handleAccommodationSelect(guestHouse.id, 'guesthouse')}
                                  >
                                    <CardContent className="p-3">
                                      <img
                                        src={guestHouse.image}
                                        alt={guestHouse.name}
                                        className="w-full h-16 object-cover rounded mb-2"
                                      />
                                      <h5 className="font-medium text-xs mb-1 leading-tight">{guestHouse.name}</h5>
                                      <p className="text-xs text-muted-foreground mb-2 truncate">{guestHouse.location}</p>
                                      <div className="flex items-center justify-between">
                                        <Badge
                                          variant={guestHouse.distance <= 30 ? "default" : "outline"}
                                          className="text-xs px-2 py-0"
                                        >
                                          {guestHouse.distance.toFixed(1)} km
                                        </Badge>
                                        {selectedGuestHouses.includes(guestHouse.id) && (
                                          <Heart className="h-3 w-3 text-primary fill-current" />
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* No accommodations found */}
                          {activity.nearbyHotels.length === 0 && activity.nearbyGuestHouses.length === 0 && (
                            <div className="text-center py-6 text-muted-foreground">
                              <MapPin className="h-6 w-6 mx-auto mb-2 opacity-50" />
                              <p className="text-sm"><TranslateText text="No nearby accommodations found" language={currentLanguage} /></p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Map - Takes up 1/3 on large screens */}
            <div className="lg:col-span-1">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 sticky top-4">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <TranslateText text="Activities & Accommodations" language={currentLanguage} />
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    <TranslateText text="View locations on the map" language={currentLanguage} />
                  </p>
                </div>
                <div className="h-96 rounded-b-lg overflow-hidden">
                  <InteractiveTripMap
                    selectedActivities={selectedActivities}
                    setSelectedActivities={() => { }} // Read-only
                    selectedHotels={selectedHotels}
                    selectedGuestHouses={selectedGuestHouses}
                    activeTab="activities"
                    setSelectedHotels={setSelectedHotels}
                    setSelectedGuestHouses={setSelectedGuestHouses}
                  />
                </div>
              </Card>
            </div>
          </div>

          {/* Generate Itinerary Button */}
          <div className="flex justify-center mt-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Badge variant="secondary" className="px-3 py-1">
                  <ActivityIcon className="h-3 w-3 mr-1" />
                  {selectedActivities.length} activities
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  <Building className="h-3 w-3 mr-1" />
                  {selectedHotels.length} hotels
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  <Home className="h-3 w-3 mr-1" />
                  {selectedGuestHouses.length} guest houses
                </Badge>
              </div>

              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleContinue}
              >
                <Calendar className="h-5 w-5 mr-2" />
                <TranslateText text="Generate My Itinerary" language={currentLanguage} />
              </Button>

              <p className="text-sm text-muted-foreground max-w-md">
                <TranslateText text="Create a detailed itinerary based on your selections" language={currentLanguage} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AccommodationSelectionPage;