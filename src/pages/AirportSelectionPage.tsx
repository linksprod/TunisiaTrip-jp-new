import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plane, MapPin, Loader2, PlaneTakeoff, PlaneLanding, Lightbulb, Star, Hotel, Route } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "sonner";
import { useAirports } from "@/hooks/useAirports";
import { AirportMap } from "@/components/start-my-trip/AirportMap";
import { useActivities } from "@/hooks/useActivities";
import { useHotels } from "@/hooks/useHotels";
import { useGuestHouses } from "@/hooks/useGuestHouses";
import { generateAirportRecommendations, isAirportRecommended } from "@/utils/airportRecommendations";
import { Activity } from '@/data/activities';

const AirportSelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLanguage } = useTranslation();

  const selectedActivities = location.state?.selectedActivities || [];
  const selectedHotels = location.state?.selectedHotels || [];
  const selectedGuestHouses = location.state?.selectedGuestHouses || [];
  const checkInDate = location.state?.checkInDate;
  const checkOutDate = location.state?.checkOutDate;

  const [arrivalAirport, setArrivalAirport] = useState<string | null>(null);
  const [departureAirport, setDepartureAirport] = useState<string | null>(null);
  const [isGeneratingItinerary, setIsGeneratingItinerary] = useState(false);
  const [stayNearAirport, setStayNearAirport] = useState<boolean>(false);
  const [showAirportAccommodations, setShowAirportAccommodations] = useState(false);
  const [selectedArrivalAccommodation, setSelectedArrivalAccommodation] = useState<string | null>(null);
  const [selectedDepartureAccommodation, setSelectedDepartureAccommodation] = useState<string | null>(null);

  // Redirect back if no data is available
  useEffect(() => {
    if (selectedActivities.length === 0) {
      toast.warning("Please select activities first");
      navigate('/start-my-trip');
    }
  }, [selectedActivities, navigate]);

  const { airports, isLoading } = useAirports();
  const { activities: dbActivities } = useActivities();
  const { hotels: dbHotels } = useHotels();
  const { guestHouses: dbGuestHouses } = useGuestHouses();

  // Convert activities to the format needed for recommendations
  const convertedActivities: Activity[] = useMemo(() => {
    return dbActivities
      .filter(activity => selectedActivities.includes(activity.id))
      .map(activity => ({
        id: activity.id || '',
        name: activity.title || '',
        description: activity.description || '',
        duration: activity.duration || '2-3 hours',
        coordinates: {
          lat: activity.latitude || 0,
          lng: activity.longitude || 0
        },
        image: activity.images?.[0] || activity.image || '',
        category: activity.category || 'cultural',
        subcategory: activity.category || '',
        price: activity.price || '$',
        rating: activity.rating || 4.5,
        location: activity.location || ''
      }));
  }, [dbActivities, selectedActivities]);

  // Generate airport recommendations
  const airportRecommendations = useMemo(() => {
    return generateAirportRecommendations(convertedActivities);
  }, [convertedActivities]);

  // Auto-select recommended airports on first load
  useEffect(() => {
    if (!arrivalAirport && !departureAirport && airportRecommendations) {
      setArrivalAirport(airportRecommendations.arrivalAirport);
      setDepartureAirport(airportRecommendations.departureAirport);
    }
  }, [airportRecommendations, arrivalAirport, departureAirport]);

  const handleAirportSelect = (airportId: string, type: 'arrival' | 'departure') => {
    if (type === 'arrival') {
      setArrivalAirport(airportId);
    } else {
      setDepartureAirport(airportId);
    }
  };

  // Function to find nearest accommodations to airport
  const findNearestAccommodations = (airportId: string) => {
    const airport = airports.find(a => a.id === airportId);
    if (!airport || !airport.latitude || !airport.longitude) return [];

    const allAccommodations = [
      ...dbHotels.map(h => ({ ...h, type: 'hotel' })),
      ...dbGuestHouses.map(g => ({ ...g, type: 'guesthouse' }))
    ].filter(acc => acc.latitude && acc.longitude);

    // Calculate distances and sort by proximity
    const withDistances = allAccommodations.map(acc => {
      const distance = calculateDistance(
        airport.latitude!, airport.longitude!,
        acc.latitude!, acc.longitude!
      );
      return { ...acc, distance };
    }).sort((a, b) => a.distance - b.distance);

    return withDistances.slice(0, 3); // Top 3 nearest
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleGenerateItinerary = async () => {
    if (!arrivalAirport || !departureAirport) {
      toast.warning("Please select both arrival and departure airports");
      return;
    }

    setIsGeneratingItinerary(true);

    toast.info(
      <TranslateText text="Generating your optimized itinerary..." language={currentLanguage} />,
      {
        description: <TranslateText text="Our AI is creating your perfect Tunisia trip with geographical optimization" language={currentLanguage} />,
        duration: 3000
      }
    );

    try {
      navigate('/itinerary-generation', {
        state: {
          selectedActivities,
          selectedHotels,
          selectedGuestHouses,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          arrivalAirport,
          departureAirport,
          stayNearAirport,
          selectedArrivalAccommodation,
          selectedDepartureAccommodation
        }
      });

      toast.success(
        <TranslateText text="Your itinerary has been generated!" language={currentLanguage} />,
        {
          description: <TranslateText text="Optimized for your arrival airport and selected preferences" language={currentLanguage} />
        }
      );
    } catch (error) {
      console.error("Itinerary generation error:", error);
      toast.error(<TranslateText text="Unable to generate itinerary. Please try again." language={currentLanguage} />);
      setIsGeneratingItinerary(false);
    }
  };

  const handleBackToAccommodations = () => {
    navigate('/accommodation-selection', {
      state: {
        selectedActivities,
        selectedHotels,
        selectedGuestHouses,
        checkInDate,
        checkOutDate
      }
    });
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
              onClick={handleBackToAccommodations}
              disabled={isGeneratingItinerary}
            >
              <ArrowLeft className="h-4 w-4" />
              <TranslateText text="Back to Accommodations" language={currentLanguage} />
            </Button>

            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-foreground">
                <TranslateText text="Choose Your Airports" language={currentLanguage} />
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                <TranslateText text="Select your arrival and departure airports to optimize your itinerary and travel experience." language={currentLanguage} />
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Badge variant="secondary" className="px-3 py-1">
                  {selectedActivities.length} <TranslateText text="activities" language={currentLanguage} />
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  {selectedHotels.length + selectedGuestHouses.length} <TranslateText text="accommodations" language={currentLanguage} />
                </Badge>
                <Badge variant="outline" className="px-3 py-1 text-primary">
                  <TranslateText text="Step 3 of 4" language={currentLanguage} />
                </Badge>
              </div>
            </div>
          </div>

          {/* Recommendations Section */}
          {airportRecommendations && (
            <div className="max-w-6xl mx-auto mb-8">
              <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
                        <TranslateText text="Recommendation Based on Your Activities" language={currentLanguage} />
                      </h3>
                      <p className="text-amber-800 dark:text-amber-200 text-sm leading-relaxed">
                        {airportRecommendations.reasoning}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge
                          variant={airportRecommendations.confidence === 'high' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {airportRecommendations.confidence === 'high' ? 'Highly Recommended' : 'Recommended'}
                        </Badge>
                        <span className="text-xs text-amber-700 dark:text-amber-300">
                          <TranslateText text="Based on geographical analysis of your selected activities" language={currentLanguage} />
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* First Day Preference Section */}
          <div className="max-w-6xl mx-auto mb-8">
            <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Hotel className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                      <TranslateText text="First Day Preference" language={currentLanguage} />
                    </h3>
                    <RadioGroup
                      value={stayNearAirport ? "airport" : "activities"}
                      onValueChange={(value) => setStayNearAirport(value === "airport")}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value="activities" id="activities" />
                        <Label htmlFor="activities" className="text-blue-800 dark:text-blue-200">
                          <TranslateText text="Start activities immediately after arrival" language={currentLanguage} />
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="airport" id="airport" />
                        <Label htmlFor="airport" className="text-blue-800 dark:text-blue-200">
                          <TranslateText text="Stay near airport on first night for easy rest" language={currentLanguage} />
                        </Label>
                      </div>
                    </RadioGroup>

                    {stayNearAirport && arrivalAirport && (
                      <div className="mt-4 p-3 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                          <TranslateText text="Select accommodation near arrival airport:" language={currentLanguage} />
                        </p>
                        <div className="grid gap-2">
                          {findNearestAccommodations(arrivalAirport).map(acc => (
                            <Card
                              key={acc.id}
                              className={`cursor-pointer transition-all p-3 ${selectedArrivalAccommodation === acc.id
                                  ? 'ring-2 ring-primary bg-primary/5'
                                  : 'hover:bg-muted/50'
                                }`}
                              onClick={() => setSelectedArrivalAccommodation(acc.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h5 className="font-medium text-sm">{acc.name}</h5>
                                  <p className="text-xs text-muted-foreground">{acc.location}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {Math.round(acc.distance)}km from airport
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      {acc.type}
                                    </Badge>
                                  </div>
                                </div>
                                {acc.images?.[0] && (
                                  <img
                                    src={acc.images[0]}
                                    alt={acc.name}
                                    className="w-12 h-12 object-cover rounded ml-2"
                                  />
                                )}
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Departure Accommodation Selection */}
          {departureAirport && (
            <div className="max-w-6xl mx-auto mb-8">
              <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <PlaneTakeoff className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
                        <TranslateText text="Last Night Accommodation" language={currentLanguage} />
                      </h3>
                      <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                        <TranslateText text="Choose accommodation near departure airport for easy departure:" language={currentLanguage} />
                      </p>
                      <div className="grid gap-2">
                        {findNearestAccommodations(departureAirport).map(acc => (
                          <Card
                            key={acc.id}
                            className={`cursor-pointer transition-all p-3 ${selectedDepartureAccommodation === acc.id
                                ? 'ring-2 ring-primary bg-primary/5'
                                : 'hover:bg-muted/50'
                              }`}
                            onClick={() => setSelectedDepartureAccommodation(acc.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium text-sm">{acc.name}</h5>
                                <p className="text-xs text-muted-foreground">{acc.location}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {Math.round(acc.distance)}km from airport
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {acc.type}
                                  </Badge>
                                </div>
                              </div>
                              {acc.images?.[0] && (
                                <img
                                  src={acc.images[0]}
                                  alt={acc.name}
                                  className="w-12 h-12 object-cover rounded ml-2"
                                />
                              )}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Airport Selection Cards - 2/3 on large screens */}
            <div className="lg:col-span-2 space-y-6">
              {/* Arrival Airport Selection */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <PlaneLanding className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">
                    <TranslateText text="Arrival Airport" language={currentLanguage} />
                  </h3>
                </div>
                <div className="grid gap-3">
                  {airports.map((airport) => {
                    const isRecommended = isAirportRecommended(airport.id, 'arrival', airportRecommendations);
                    const nearbyAccommodations = findNearestAccommodations(airport.id);
                    return (
                      <Card
                        key={`arrival-${airport.id}`}
                        className={`cursor-pointer transition-all hover:shadow-lg hover:border-primary/20 group relative ${arrivalAirport === airport.id ? 'ring-2 ring-primary bg-primary/5' : ''
                          } ${isRecommended ? 'border-amber-200 bg-amber-50/30 dark:border-amber-800 dark:bg-amber-950/10' : ''}`}
                        onClick={() => handleAirportSelect(airport.id, 'arrival')}
                      >
                        {isRecommended && (
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                              <Star className="h-3 w-3 mr-1" />
                              <TranslateText text="Recommended" language={currentLanguage} />
                            </Badge>
                          </div>
                        )}
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            {airport.images?.[0] && (
                              <img
                                src={airport.images[0]}
                                alt={airport.name}
                                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-base truncate">{airport.name}</h4>
                                <Badge variant="secondary" className="text-xs flex-shrink-0">
                                  {airport.code}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{airport.location}</span>
                              </p>
                              {airport.description && (
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                  {airport.description}
                                </p>
                              )}

                              {/* Nearby Accommodations Preview */}
                              {nearbyAccommodations.length > 0 && (
                                <div className="mt-3 p-2 bg-muted/30 rounded-lg">
                                  <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                                    <Hotel className="h-3 w-3" />
                                    <TranslateText text="Nearby accommodations:" language={currentLanguage} />
                                  </p>
                                  <div className="space-y-1">
                                    {nearbyAccommodations.slice(0, 2).map(acc => (
                                      <div key={acc.id} className="flex items-center justify-between text-xs">
                                        <span className="truncate font-medium">{acc.name}</span>
                                        <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                                          {Math.round(acc.distance)}km
                                        </Badge>
                                      </div>
                                    ))}
                                    {nearbyAccommodations.length > 2 && (
                                      <p className="text-xs text-muted-foreground">
                                        +{nearbyAccommodations.length - 2} more nearby
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}

                              {arrivalAirport === airport.id && (
                                <Badge variant="default" className="text-xs mt-2">
                                  <PlaneLanding className="h-3 w-3 mr-1" />
                                  <TranslateText text="Selected" language={currentLanguage} />
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Arrival Airport Accommodations Selection */}
                {arrivalAirport && (
                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Hotel className="h-5 w-5 text-primary" />
                      <h4 className="text-lg font-semibold">
                        <TranslateText text="Select Arrival Accommodation" language={currentLanguage} />
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      <TranslateText text="Choose where to stay for arrival night or first nights near your selected airport" language={currentLanguage} />
                    </p>
                    <div className="grid gap-3">
                      {findNearestAccommodations(arrivalAirport).map(acc => (
                        <Card
                          key={`arrival-acc-${acc.id}`}
                          className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/20 ${selectedArrivalAccommodation === acc.id
                              ? 'ring-2 ring-primary bg-primary/5 border-primary/30'
                              : 'hover:bg-muted/30'
                            }`}
                          onClick={() => setSelectedArrivalAccommodation(acc.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              {acc.images?.[0] && (
                                <img
                                  src={acc.images[0]}
                                  alt={acc.name}
                                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-semibold text-base truncate">{acc.name}</h5>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                      <MapPin className="h-3 w-3 flex-shrink-0" />
                                      <span className="truncate">{acc.location}</span>
                                    </p>
                                  </div>
                                  {selectedArrivalAccommodation === acc.id && (
                                    <Badge variant="default" className="text-xs ml-2 flex-shrink-0">
                                      <TranslateText text="Selected" language={currentLanguage} />
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge variant="outline" className="text-xs">
                                    {Math.round(acc.distance)}km from airport
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {acc.type === 'hotel' ? 'Hôtel' : 'Guest House'}
                                  </Badge>
                                  {acc.rating && (
                                    <Badge variant="outline" className="text-xs">
                                      <Star className="h-3 w-3 mr-1" />
                                      {acc.rating}
                                    </Badge>
                                  )}
                                  {acc.price_per_night && (
                                    <Badge variant="outline" className="text-xs">
                                      {acc.price_per_night}/night
                                    </Badge>
                                  )}
                                </div>

                                {acc.description && (
                                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                                    {acc.description}
                                  </p>
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

              {/* Departure Airport Selection */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <PlaneTakeoff className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">
                    <TranslateText text="Departure Airport" language={currentLanguage} />
                  </h3>
                </div>
                <div className="grid gap-3">
                  {airports.map((airport) => {
                    const isRecommended = isAirportRecommended(airport.id, 'departure', airportRecommendations);
                    const nearbyAccommodations = findNearestAccommodations(airport.id);
                    return (
                      <Card
                        key={`departure-${airport.id}`}
                        className={`cursor-pointer transition-all hover:shadow-lg hover:border-primary/20 group relative ${departureAirport === airport.id ? 'ring-2 ring-primary bg-primary/5' : ''
                          } ${isRecommended ? 'border-amber-200 bg-amber-50/30 dark:border-amber-800 dark:bg-amber-950/10' : ''}`}
                        onClick={() => handleAirportSelect(airport.id, 'departure')}
                      >
                        {isRecommended && (
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                              <Star className="h-3 w-3 mr-1" />
                              <TranslateText text="Recommended" language={currentLanguage} />
                            </Badge>
                          </div>
                        )}
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            {airport.images?.[0] && (
                              <img
                                src={airport.images[0]}
                                alt={airport.name}
                                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-base truncate">{airport.name}</h4>
                                <Badge variant="secondary" className="text-xs flex-shrink-0">
                                  {airport.code}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{airport.location}</span>
                              </p>
                              {airport.description && (
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                  {airport.description}
                                </p>
                              )}

                              {/* Nearby Accommodations Preview */}
                              {nearbyAccommodations.length > 0 && (
                                <div className="mt-3 p-2 bg-muted/30 rounded-lg">
                                  <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                                    <Hotel className="h-3 w-3" />
                                    <TranslateText text="Nearby accommodations:" language={currentLanguage} />
                                  </p>
                                  <div className="space-y-1">
                                    {nearbyAccommodations.slice(0, 2).map(acc => (
                                      <div key={acc.id} className="flex items-center justify-between text-xs">
                                        <span className="truncate font-medium">{acc.name}</span>
                                        <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                                          {Math.round(acc.distance)}km
                                        </Badge>
                                      </div>
                                    ))}
                                    {nearbyAccommodations.length > 2 && (
                                      <p className="text-xs text-muted-foreground">
                                        +{nearbyAccommodations.length - 2} more nearby
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}

                              {departureAirport === airport.id && (
                                <Badge variant="default" className="text-xs mt-2">
                                  <PlaneTakeoff className="h-3 w-3 mr-1" />
                                  <TranslateText text="Selected" language={currentLanguage} />
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Departure Airport Accommodations Selection */}
                {departureAirport && (
                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Hotel className="h-5 w-5 text-primary" />
                      <h4 className="text-lg font-semibold">
                        <TranslateText text="Select Departure Accommodation" language={currentLanguage} />
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      <TranslateText text="Choose where to stay for your last night near departure airport for easy departure" language={currentLanguage} />
                    </p>
                    <div className="grid gap-3">
                      {findNearestAccommodations(departureAirport).map(acc => (
                        <Card
                          key={`departure-acc-${acc.id}`}
                          className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/20 ${selectedDepartureAccommodation === acc.id
                              ? 'ring-2 ring-primary bg-primary/5 border-primary/30'
                              : 'hover:bg-muted/30'
                            }`}
                          onClick={() => setSelectedDepartureAccommodation(acc.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              {acc.images?.[0] && (
                                <img
                                  src={acc.images[0]}
                                  alt={acc.name}
                                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-semibold text-base truncate">{acc.name}</h5>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                      <MapPin className="h-3 w-3 flex-shrink-0" />
                                      <span className="truncate">{acc.location}</span>
                                    </p>
                                  </div>
                                  {selectedDepartureAccommodation === acc.id && (
                                    <Badge variant="default" className="text-xs ml-2 flex-shrink-0">
                                      <TranslateText text="Selected" language={currentLanguage} />
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge variant="outline" className="text-xs">
                                    {Math.round(acc.distance)}km from airport
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {acc.type === 'hotel' ? 'Hôtel' : 'Guest House'}
                                  </Badge>
                                  {acc.rating && (
                                    <Badge variant="outline" className="text-xs">
                                      <Star className="h-3 w-3 mr-1" />
                                      {acc.rating}
                                    </Badge>
                                  )}
                                  {acc.price_per_night && (
                                    <Badge variant="outline" className="text-xs">
                                      {acc.price_per_night}/night
                                    </Badge>
                                  )}
                                </div>

                                {acc.description && (
                                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                                    {acc.description}
                                  </p>
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
            </div>

            {/* Interactive Map - 1/3 on large screens, sticky */}
            <div className="lg:col-span-1">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 sticky top-4">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <TranslateText text="Trip Overview" language={currentLanguage} />
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    <TranslateText text="View your activities, accommodations, and airports on the map" language={currentLanguage} />
                  </p>
                </div>
                <div className="h-96 rounded-b-lg overflow-hidden">
                  <AirportMap
                    airports={airports}
                    selectedActivities={selectedActivities}
                    selectedHotels={selectedHotels}
                    selectedGuestHouses={selectedGuestHouses}
                    arrivalAirport={arrivalAirport}
                    departureAirport={departureAirport}
                    onAirportSelect={handleAirportSelect}
                  />
                </div>
              </Card>
            </div>
          </div>

          {/* Generate Itinerary Button */}
          <div className="text-center">
            <Button
              onClick={handleGenerateItinerary}
              disabled={!arrivalAirport || !departureAirport || isGeneratingItinerary}
              size="lg"
              className="px-8 py-3 text-lg font-semibold"
            >
              {isGeneratingItinerary ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Plane className="h-5 w-5 mr-2" />
              )}
              <TranslateText text="Generate My Itinerary" language={currentLanguage} />
            </Button>
            {(!arrivalAirport || !departureAirport) && (
              <p className="text-sm text-muted-foreground mt-2">
                <TranslateText text="Please select both arrival and departure airports to continue" language={currentLanguage} />
              </p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AirportSelectionPage;