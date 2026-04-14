import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, X, MapPin, Clock, Star, Calendar as CalendarIcon, Compass, FileText, Plane, RotateCcw, Building, Home, Check, AlertTriangle } from "lucide-react";
import { calculatePureDistance as calculateDistance, getActivityRegion } from "@/services/geographicalService";
import { usePredefinedTrips } from "@/hooks/usePredefinedTrips";
import { DaySelector } from "./DaySelector";
import { cn } from "@/lib/utils";
import { format } from "date-fns";


interface TripPlannerSidebarProps {
  activities: any[];
  hotels: any[];
  guestHouses: any[];
  selectedActivities: string[];
  selectedHotels: string[];
  selectedGuestHouses: string[];
  selectedAirport: 'tunis' | 'djerba' | null;
  currentStep: 'activities' | 'accommodations';
  selectedDay: number;
  activitiesByDay: Record<number, string[]>;
  accommodationsByDay: Record<number, string>;
  numberOfDays: number;
  checkInDate?: Date;
  checkOutDate?: Date;
  arrivalDate?: Date;
  currentWorkflowStep: 'activities' | 'accommodations' | 'dates' | 'generation';
  onActivityToggle: (activityId: string) => void;
  onActivitySelect: (activityId: string, day: number) => void;
  onActivityRemove: (activityId: string, day: number) => void;
  onDaySelect: (day: number) => void;
  onNextStep: () => void;
  onAirportSelect: (airport: 'tunis' | 'djerba') => void;
  onHotelSelect: (hotelId: string) => void;
  onGuestHouseSelect: (guestHouseId: string) => void;
  onAccommodationSelect: (accommodationId: string, day: number) => void;
  onArrivalDateSelect: (date: Date) => void;
  onClearDates: () => void;
  onDaysChange: (days: number) => void;
}

export const TripPlannerSidebar: React.FC<TripPlannerSidebarProps> = ({
  activities,
  hotels,
  guestHouses,
  selectedActivities,
  selectedHotels,
  selectedGuestHouses,
  selectedAirport,
  currentStep,
  selectedDay,
  activitiesByDay,
  accommodationsByDay,
  numberOfDays,
  checkInDate,
  checkOutDate,
  arrivalDate,
  currentWorkflowStep,
  onActivityToggle,
  onActivitySelect,
  onActivityRemove,
  onDaySelect,
  onNextStep,
  onAirportSelect,
  onHotelSelect,
  onGuestHouseSelect,
  onAccommodationSelect,
  onArrivalDateSelect,
  onClearDates,
  onDaysChange
}) => {
  const [activeTab, setActiveTab] = useState('activities');
  const [showAirportCards, setShowAirportCards] = useState(!selectedAirport);
  const [itineraryDays, setItineraryDays] = useState(8);
  const [itinerarySelectedActivities, setItinerarySelectedActivities] = useState<string[]>([]);
  const [internalArrivalDate, setInternalArrivalDate] = useState<Date>();
  const [departureDate, setDepartureDate] = useState<Date>();

  const airports = [
    {
      id: 'tunis' as const,
      name: 'Tunis-Carthage Airport',
      code: 'TUN',
      location: 'Tunis, Northern Tunisia',
      description: 'Main international airport, ideal for northern and central Tunisia exploration',
      region: 'North',
      advantages: [
        'Capital city location',
        'Best for Tunis, Carthage, Sidi Bou Said',
        'Easy access to northern beaches',
        'Historic medina nearby'
      ]
    },
    {
      id: 'djerba' as const,
      name: 'Djerba-Zarzis Airport',
      code: 'DJE',
      location: 'Djerba, Southern Tunisia',
      description: 'Perfect starting point for southern desert and cultural experiences',
      region: 'South',
      advantages: [
        'Island paradise location',
        'Gateway to Sahara Desert',
        'Traditional culture preservation',
        'Unique architecture and crafts'
      ]
    }
  ];
  const { data: predefinedTrips = [], isLoading: tripsLoading } = usePredefinedTrips();
  const convertedActivities = activities
    .filter(activity => activity.show_in_start_my_trip === true)
    .map(activity => ({
      id: activity.id.toString(),
      name: activity.title,
      location: activity.location,
      description: activity.description || '',
      image: activity.images && activity.images.length > 0 ? activity.images[0] : activity.image || '',
      duration: activity.duration || '2-3 hours',
      rating: activity.rating || 4.5,
      coordinates: activity.latitude && activity.longitude
        ? { lat: Number(activity.latitude), lng: Number(activity.longitude) }
        : undefined
    }));

  const getDayActivities = (day: number) => {
    const dayActivityIds = activitiesByDay[day] || [];
    return convertedActivities.filter(activity => dayActivityIds.includes(activity.id));
  };

  // Get all selected activities that can be assigned to any day
  const getAvailableActivitiesForDay = (day: number) => {
    // Get all activities already assigned to any day
    const allAssignedActivityIds = Object.values(activitiesByDay).flat();

    // Get all selected activities that are not yet assigned to any day
    const availableActivities = convertedActivities.filter(activity =>
      selectedActivities.includes(activity.id) &&
      !allAssignedActivityIds.includes(activity.id)
    );

    // Get activities already assigned to this specific day
    const dayActivities = getDayActivities(day);

    // If no activities are assigned to this day, show all available activities
    if (dayActivities.length === 0) {
      return availableActivities;
    }

    // If activities are assigned to this day, filter by 60km proximity
    return availableActivities.filter(activity => {
      if (!activity.coordinates) return false;

      // Check if within 60km of any activity already assigned to this day
      return dayActivities.some(dayActivity => {
        if (!dayActivity.coordinates) return false;

        const distance = calculateDistance(
          activity.coordinates.lat,
          activity.coordinates.lng,
          dayActivity.coordinates.lat,
          dayActivity.coordinates.lng
        );

        return distance <= 60;
      });
    });
  };

  // Get proximity filtered activities for a day - REMOVED proximity filter, now shows all available activities
  const getProximityFilteredActivities = (day: number) => {
    // Simply return all available activities (selected from Activities tab, not assigned to other days)
    return getAvailableActivitiesForDay(day);
  };

  // Check if an activity is assigned to a specific day
  const isActivityAssignedToDay = (activityId: string, day: number) => {
    const dayActivityIds = activitiesByDay[day] || [];
    return dayActivityIds.includes(activityId);
  };

  // Initialize all selected activities on Day 1 if no activities are assigned yet
  const initializeActivitiesOnDay1 = () => {
    const totalAssignedActivities = Object.values(activitiesByDay).flat().length;
    if (totalAssignedActivities === 0 && selectedActivities.length > 0) {
      // Assign all selected activities to Day 1 initially
      selectedActivities.forEach(activityId => {
        onActivitySelect(activityId, 1);
      });
    }
  };

  // Get suggested activities within 60km radius for a given day
  const getSuggestedActivities = (day: number) => {
    if (day === 1) return []; // Day 1 doesn't need suggestions

    const assignedActivities = getDayActivities(day);
    if (assignedActivities.length === 0) return [];

    const allAssignedActivityIds = Object.values(activitiesByDay).flat();

    const suggestions = convertedActivities.filter(activity => {
      // Skip if already selected or assigned
      if (selectedActivities.includes(activity.id) || allAssignedActivityIds.includes(activity.id)) {
        return false;
      }

      // Check if within 60km of any assigned activity for this day
      return assignedActivities.some(assignedActivity => {
        if (!activity.coordinates || !assignedActivity.coordinates) return false;

        const distance = calculateDistance(
          activity.coordinates.lat,
          activity.coordinates.lng,
          assignedActivity.coordinates.lat,
          assignedActivity.coordinates.lng
        );

        return distance <= 60;
      });
    });

    return suggestions.slice(0, 5); // Limit to 5 suggestions
  };

  // Get activities nearby (within 60km) of selected activities for suggestions
  const getNearbyActivitySuggestions = () => {
    if (itinerarySelectedActivities.length === 0) return [];

    const selectedActivityCoords = convertedActivities
      .filter(activity => itinerarySelectedActivities.includes(activity.id))
      .map(activity => activity.coordinates)
      .filter(Boolean);

    if (selectedActivityCoords.length === 0) return [];

    const suggestions = convertedActivities.filter(activity => {
      // Skip if already selected in activities tab or itinerary
      if (selectedActivities.includes(activity.id) || itinerarySelectedActivities.includes(activity.id)) {
        return false;
      }

      if (!activity.coordinates) return false;

      // Check if within 60km of any selected activity
      return selectedActivityCoords.some(coords => {
        if (!coords) return false;

        const distance = calculateDistance(
          activity.coordinates!.lat,
          activity.coordinates!.lng,
          coords.lat,
          coords.lng
        );

        return distance <= 60;
      });
    });

    return suggestions.slice(0, 8); // Limit to 8 suggestions
  };

  // This function is no longer needed with the new approach
  const getAvailableActivities = () => {
    return [];
  };

  const getTotalDistance = (day: number) => {
    const dayActivities = getDayActivities(day);
    if (dayActivities.length < 2) return '0 km';
    // Simplified distance calculation
    return `${Math.round(dayActivities.length * 15)} km`;
  };

  const getTotalDuration = (day: number) => {
    const dayActivities = getDayActivities(day);
    return `${dayActivities.length * 3}h 30m`;
  };

  // Get activities organized by recommended priority based on airport
  const getActivitiesByRecommendation = () => {
    if (!selectedAirport) return { recommended: [], others: convertedActivities };

    const recommended = convertedActivities.filter(activity => {
      if (!activity.coordinates) return false;
      const region = getActivityRegion(activity);

      if (selectedAirport === 'tunis') {
        return region === 'tunis' || region === 'center';
      } else {
        return region === 'south';
      }
    });

    const others = convertedActivities.filter(activity =>
      !recommended.some(rec => rec.id === activity.id)
    );

    return { recommended, others };
  };

  // Get nearest accommodations for a specific day based on first activity
  const getNearestAccommodationsForDay = (day: number) => {
    const dayActivities = getDayActivities(day);
    if (dayActivities.length === 0) return [];

    const firstActivity = dayActivities[0];
    if (!firstActivity.coordinates) return [];

    const allAccommodations = [
      ...hotels.map(h => ({ ...h, type: 'hotel' as const })),
      ...guestHouses.map(g => ({ ...g, type: 'guesthouse' as const }))
    ];

    const accommodationsWithDistance = allAccommodations
      .filter(acc => acc.coordinates)
      .map(acc => ({
        ...acc,
        distance: calculateDistance(
          firstActivity.coordinates.lat,
          firstActivity.coordinates.lng,
          acc.coordinates.lat,
          acc.coordinates.lng
        )
      }))
      .filter(acc => acc.distance <= 100) // Within 100km
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5); // Top 5 closest

    return accommodationsWithDistance;
  };

  // Check if all days have activities assigned
  const areAllDaysComplete = () => {
    for (let day = 1; day <= numberOfDays; day++) {
      const dayActivities = activitiesByDay[day] || [];
      if (dayActivities.length === 0) return false;
    }
    return true;
  };

  // Check if all days have accommodations selected
  const areAllAccommodationsSelected = () => {
    for (let day = 1; day <= numberOfDays; day++) {
      const dayActivities = activitiesByDay[day] || [];
      if (dayActivities.length > 0 && !accommodationsByDay[day]) return false;
    }
    return true;
  };

  // Auto-advance workflow step when conditions are met
  React.useEffect(() => {
    if (currentWorkflowStep === 'activities' && areAllDaysComplete() && selectedAirport) {
      // All days are complete, ready for accommodations
      // No automatic advancement to allow user control
    } else if (currentWorkflowStep === 'accommodations' && areAllAccommodationsSelected()) {
      // All accommodations selected, ready for dates
      // No automatic advancement to allow user control
    }
  }, [currentWorkflowStep, activitiesByDay, accommodationsByDay, selectedAirport, numberOfDays]);

  // Get current button text and action
  const getMainButtonConfig = () => {
    if (currentWorkflowStep === 'activities' && areAllDaysComplete()) {
      return {
        text: 'Choose the Accommodations',
        action: () => {
          setActiveTab('accommodations');
          // Scroll to top of the component
          const tripPlannerElement = document.querySelector('[data-testid="trip-planner"]');
          if (tripPlannerElement) {
            tripPlannerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      };
    }
    if (currentWorkflowStep === 'accommodations' && areAllAccommodationsSelected()) {
      return {
        text: 'Select Arrival Date',
        action: () => {
          setActiveTab('details');
          // Scroll to top of the component
          const tripPlannerElement = document.querySelector('[data-testid="trip-planner"]');
          if (tripPlannerElement) {
            tripPlannerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      };
    }
    if (currentWorkflowStep === 'dates' && arrivalDate) {
      return { text: 'Generate My Trip', action: onNextStep };
    }
    return { text: 'Generate Tunisia Tour Itinerary', action: onNextStep };
  };

  return (
    <>
      <div className="h-full flex flex-col custom-scrollbar" data-testid="trip-planner">
        {/* Header with trip info - NOT STICKY */}
        <div className="p-4 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
          <h1 className="text-lg font-semibold text-foreground">Plan Your Trip</h1>
          <p className="text-sm text-muted-foreground">
            {checkInDate && checkOutDate
              ? `${numberOfDays} days • ${checkInDate.toLocaleDateString()} - ${checkOutDate.toLocaleDateString()}`
              : "Select dates and activities for your journey"
            }
          </p>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-3">
            {(checkInDate || checkOutDate) && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearDates}
                className="flex items-center gap-1 text-xs"
              >
                <RotateCcw className="h-3 w-3" />
                Clear Dates
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('guide')}
              className="flex items-center gap-1 text-xs"
            >
              <Compass className="h-3 w-3" />
              View Guide
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('travel')}
              className="flex items-center gap-1 text-xs"
            >
              <Plane className="h-3 w-3" />
              Travel ✈
            </Button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border/50 z-50">
            <TabsList className="grid w-full grid-cols-5 ml-1 mr-2 mt-4 h-8 p-0.5">
              <TabsTrigger value="activities" className="text-xs px-1 py-0.5 h-full">Activities</TabsTrigger>
              <TabsTrigger value="itinerary" className="text-xs px-1 py-0.5 h-full">Itinerary</TabsTrigger>
              <TabsTrigger value="accommodations" className="text-xs px-1 py-0.5 h-full">Hotels</TabsTrigger>
              <TabsTrigger value="explore" className="text-xs px-1 py-0.5 h-full">Explore</TabsTrigger>
              <TabsTrigger value="details" className="text-xs px-1 py-0.5 h-full">Details</TabsTrigger>
            </TabsList>
          </div>
          {/* Activities Tab */}
          <TabsContent value="activities" className="flex-1 flex flex-col m-0 p-0">
            <div className="p-4 space-y-4">
              {/* Airport Selection */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Plane className="h-4 w-4" />
                  Choose Your Arrival Airport
                </h3>

                {selectedAirport ? (
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {selectedAirport === 'tunis' ? 'TUN - Tunis-Carthage' : 'DJE - Djerba-Zarzis'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">Selected Airport</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAirportCards(true)}
                      className="text-xs"
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-3 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/30">
                    <Plane className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Select your arrival airport below
                    </span>
                  </div>
                )}

                {/* Airport Cards */}
                {(showAirportCards || !selectedAirport) && (
                  <div className="grid grid-cols-2 gap-3">
                    {airports.map((airport) => (
                      <Card
                        key={airport.id}
                        className={`cursor-pointer transition-all hover:shadow-md group ${selectedAirport === airport.id
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/20"
                          }`}
                        onClick={() => {
                          onAirportSelect(airport.id);
                          setShowAirportCards(false);
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="text-center mb-3">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <Plane className="h-4 w-4 text-primary" />
                              <Badge variant="secondary" className="text-xs">
                                {airport.code}
                              </Badge>
                            </div>
                            <h4 className="font-semibold text-sm mb-1">{airport.name}</h4>
                            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {airport.location}
                            </p>
                          </div>

                          <div className="text-center mb-3">
                            <Badge
                              variant={airport.id === 'tunis' ? 'default' : 'outline'}
                              className="px-2 py-1 text-xs"
                            >
                              {airport.region} Region
                            </Badge>
                          </div>

                          <div className="space-y-1">
                            <h5 className="text-xs font-semibold mb-1">
                              Perfect for:
                            </h5>
                            {airport.advantages.slice(0, 2).map((advantage, index) => (
                              <div key={index} className="flex items-center gap-2 text-xs">
                                <div className="w-1 h-1 bg-primary rounded-full" />
                                <span className="text-xs text-muted-foreground">{advantage}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Activities Selection Counter */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Selected Activities</span>
                  <Badge variant="default" className="bg-primary">
                    {selectedActivities.length}
                  </Badge>
                </div>
                {selectedActivities.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Ready to create your itinerary
                  </p>
                )}
              </div>
            </div>

            <ScrollArea className="flex-1 custom-scrollbar">
              <div className="p-4 space-y-6">
                {(() => {
                  const { recommended, others } = getActivitiesByRecommendation();

                  return (
                    <>
                      {/* Recommended Activities */}
                      {selectedAirport && recommended.length > 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm text-primary">
                              Recommended for {selectedAirport === 'tunis' ? 'Tunis' : 'Djerba'} Arrival
                            </h4>
                            <Badge variant="secondary" className="text-xs">
                              {recommended.length} activities
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {recommended.map((activity) => (
                              <Card
                                key={activity.id}
                                className={`cursor-pointer transition-all duration-200 relative overflow-hidden border ${selectedActivities.includes(activity.id)
                                    ? 'border-blue-200 bg-blue-50/10'
                                    : 'hover:shadow-sm hover:border-gray-300 border-gray-200'
                                  }`}
                                onClick={() => onActivityToggle(activity.id)}
                              >
                                <CardContent className="p-3 relative">
                                  {/* Checkbox */}
                                  <div className="absolute top-2 left-2 z-50">
                                    <div className={`rounded-full p-0.5 shadow-sm border ${selectedActivities.includes(activity.id)
                                        ? 'bg-blue-500 border-blue-500'
                                        : 'bg-white border-gray-300'
                                      }`}>
                                      <div className={`w-3 h-3 rounded-full flex items-center justify-center ${selectedActivities.includes(activity.id)
                                          ? 'bg-white text-blue-500'
                                          : 'bg-transparent'
                                        }`}>
                                        {selectedActivities.includes(activity.id) && (
                                          <Check className="h-3 w-3 font-bold" />
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Image */}
                                  <div className="w-full h-24 mb-3 mt-6">
                                    {activity.image ? (
                                      <img
                                        src={activity.image}
                                        alt={activity.name}
                                        className="w-full h-full object-cover rounded"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                                        <MapPin className="h-6 w-6 text-muted-foreground" />
                                      </div>
                                    )}
                                  </div>

                                  {/* Content */}
                                  <div className="space-y-2">
                                    <h5 className="font-medium text-sm line-clamp-2">{activity.name}</h5>
                                    <p className="text-xs text-muted-foreground line-clamp-1">{activity.location}</p>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs">{activity.rating}</span>
                                      </div>
                                      <Badge variant="outline" className="text-xs">
                                        {activity.duration}
                                      </Badge>
                                    </div>
                                  </div>

                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Other Activities */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">
                            {selectedAirport ? 'Other Activities' : 'All Activities'}
                          </h4>
                          <Badge variant="secondary" className="text-xs">
                            {others.length} activities
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {others.map((activity) => (
                            <Card
                              key={activity.id}
                              className={`cursor-pointer transition-all duration-200 relative overflow-hidden ${selectedActivities.includes(activity.id)
                                  ? 'border-blue-300 bg-blue-50/50 shadow-sm'
                                  : 'hover:shadow-md hover:border-blue-200 border-border'
                                }`}
                              onClick={() => onActivityToggle(activity.id)}
                            >
                              <CardContent className="p-3 relative">
                                {/* Checkbox */}
                                <div className="absolute top-2 left-2 z-50">
                                  <div className={`rounded-full p-0.5 shadow-lg border ${selectedActivities.includes(activity.id)
                                      ? 'bg-primary border-white'
                                      : 'bg-white border-gray-300'
                                    }`}>
                                    <div className={`w-3 h-3 rounded-full flex items-center justify-center ${selectedActivities.includes(activity.id)
                                        ? 'bg-white text-primary'
                                        : 'bg-transparent'
                                      }`}>
                                      {selectedActivities.includes(activity.id) && (
                                        <Check className="h-2 w-2 font-bold" />
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Image */}
                                <div className="w-full h-24 mb-3 mt-6">
                                  {activity.image ? (
                                    <img
                                      src={activity.image}
                                      alt={activity.name}
                                      className="w-full h-full object-cover rounded"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                                      <MapPin className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                  )}
                                </div>

                                {/* Content */}
                                <div className="space-y-2">
                                  <h5 className="font-medium text-sm line-clamp-2">{activity.name}</h5>
                                  <p className="text-xs text-muted-foreground line-clamp-1">{activity.location}</p>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      <span className="text-xs">{activity.rating}</span>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                      {activity.duration}
                                    </Badge>
                                  </div>
                                </div>

                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
              {/* Continue Button */}
              <div className="p-4 mt-6">
                <Button
                  className="w-full"
                  onClick={() => setActiveTab('itinerary')}
                  disabled={selectedActivities.length === 0}
                >
                  Continue to Itinerary ({selectedActivities.length} activities)
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="itinerary" className="flex-1 flex flex-col m-0 p-0">
            <div className="p-4 space-y-4">
              {/* Trip Duration Selector */}
              <DaySelector
                selectedDays={itineraryDays}
                setSelectedDays={setItineraryDays}
                minDays={3}
                maxDays={14}
              />


              {/* Day Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Select Day
                  </h3>
                  {(() => {
                    const totalActivitiesAssigned = Object.values(activitiesByDay).flat().length;
                    const unassignedActivities = selectedActivities.length - totalActivitiesAssigned;

                    if (unassignedActivities > 0) {
                      return (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const suggestedDays = Math.ceil(unassignedActivities / 2);
                            const newDays = itineraryDays + suggestedDays;
                            setItineraryDays(newDays);
                            onDaysChange(newDays);
                          }}
                          className="text-xs h-7 bg-primary/10 border-primary/20 hover:bg-primary/20 text-primary"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add day ({unassignedActivities} suggestions)
                        </Button>
                      );
                    }
                    return null;
                  })()}
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {Array.from({ length: itineraryDays }, (_, i) => i + 1).map((day) => (
                    <Button
                      key={day}
                      variant={selectedDay === day ? "default" : "outline"}
                      size="sm"
                      onClick={() => onDaySelect(day)}
                      className="min-w-16 flex-shrink-0"
                    >
                      Day {day}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 custom-scrollbar">
              <div className="p-4 space-y-6">
                {/* Activities assigned to current day */}
                {getDayActivities(selectedDay).length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">Activities assigned to Day {selectedDay}</h4>
                      <Badge variant="default" className="text-xs">
                        {getDayActivities(selectedDay).length} assigned
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {getDayActivities(selectedDay).map((activity) => (
                        <Card key={activity.id} className="bg-primary/5 border-primary/20">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 flex-shrink-0">
                                {activity.image ? (
                                  <img
                                    src={activity.image}
                                    alt={activity.name}
                                    className="w-full h-full object-cover rounded"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium text-sm line-clamp-1 mb-1">{activity.name}</h5>
                                <p className="text-xs text-muted-foreground mb-2">{activity.location}</p>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {activity.duration}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onActivityRemove(activity.id, selectedDay)}
                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Activities to Assign */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">Activities for Day {selectedDay}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {getAvailableActivitiesForDay(selectedDay).length} available
                    </Badge>
                  </div>

                  {selectedActivities.length === 0 ? (
                    <div className="text-center p-6 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/30">
                      <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground mb-1">
                        No activities selected yet
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Go to the Activities tab to select activities first
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Show activities available for current day (with 60km proximity filter) */}
                      {(() => {
                        const availableActivities = getAvailableActivitiesForDay(selectedDay);

                        return availableActivities.map((activity) => {
                          const isAssigned = isActivityAssignedToDay(activity.id, selectedDay);

                          return (
                            <Card key={activity.id} className={`relative cursor-pointer hover:shadow-md transition-shadow ${isAssigned ? 'bg-blue-50/50 border-blue-300' : ''}`}>
                              <CardContent className="p-5">
                                <div className="flex items-start gap-3">
                                  {/* Checkbox */}
                                  <div className="flex items-center pt-1">
                                    <Checkbox
                                      checked={isAssigned}
                                      onCheckedChange={() => {
                                        if (isAssigned) {
                                          onActivityRemove(activity.id, selectedDay);
                                        } else {
                                          onActivitySelect(activity.id, selectedDay);
                                        }
                                      }}
                                      className="h-4 w-4"
                                    />
                                  </div>

                                  {/* Activity Image */}
                                  <div className="w-16 h-16 flex-shrink-0">
                                    {activity.image ? (
                                      <img
                                        src={activity.image}
                                        alt={activity.name}
                                        className="w-full h-full object-cover rounded"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                                        <MapPin className="h-6 w-6 text-muted-foreground" />
                                      </div>
                                    )}
                                  </div>

                                  {/* Activity Details */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1 min-w-0 pr-2">
                                        <h5 className="font-medium text-sm line-clamp-2 mb-1">{activity.name}</h5>
                                        <p className="text-xs text-muted-foreground mb-2">{activity.location}</p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <Badge variant="outline" className="text-xs">
                                            {activity.duration}
                                          </Badge>
                                          <div className="flex items-center gap-1">
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            <span className="text-xs">{activity.rating}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        });
                      })()}

                      {/* Suggested Activities */}
                      {(() => {
                        const suggestedActivities = getSuggestedActivities(selectedDay);

                        if (suggestedActivities.length === 0) return null;

                        return (
                          <div className="mt-6">
                            <div className="flex items-center gap-2 mb-3">
                              <h4 className="text-sm font-medium text-muted-foreground">Suggested activities nearby</h4>
                              <Badge variant="outline" className="text-xs text-muted-foreground">Within 60km</Badge>
                            </div>
                            <div className="space-y-2">
                              {suggestedActivities.map((activity) => (
                                <Card key={activity.id} className="relative cursor-pointer hover:shadow-md transition-shadow border-dashed bg-muted/20">
                                  <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                      {/* Activity Image */}
                                      <div className="w-12 h-12 flex-shrink-0">
                                        {activity.image ? (
                                          <img
                                            src={activity.image}
                                            alt={activity.name}
                                            className="w-full h-full object-cover rounded opacity-80"
                                          />
                                        ) : (
                                          <div className="w-full h-full bg-muted rounded flex items-center justify-center opacity-80">
                                            <MapPin className="h-5 w-5 text-muted-foreground" />
                                          </div>
                                        )}
                                      </div>

                                      {/* Activity Details */}
                                      <div className="flex-1 min-w-0">
                                        <h5 className="font-medium text-sm line-clamp-2 mb-1 text-muted-foreground">{activity.name}</h5>
                                        <p className="text-xs text-muted-foreground mb-2">{activity.location}</p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <Badge variant="outline" className="text-xs opacity-70">
                                            {activity.duration}
                                          </Badge>
                                          <div className="flex items-center gap-1 opacity-70">
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            <span className="text-xs">{activity.rating}</span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Add button */}
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          onActivityToggle(activity.id);
                                          setTimeout(() => onActivitySelect(activity.id, selectedDay), 100);
                                        }}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* Selected Activities Summary */}
                {itinerarySelectedActivities.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">Selected Activities for Tunisia Tour</h4>
                      <Badge variant="default" className="text-xs">
                        {itinerarySelectedActivities.length} activities
                      </Badge>
                    </div>

                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="space-y-2">
                        {convertedActivities
                          .filter(activity => itinerarySelectedActivities.includes(activity.id))
                          .map((activity, index) => (
                            <div key={activity.id} className="flex items-center gap-2 text-sm">
                              <span className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </span>
                              <span className="font-medium">{activity.name}</span>
                              <span className="text-muted-foreground">• {activity.location}</span>
                            </div>
                          ))}
                      </div>

                      <div className="mt-3 pt-3 border-t border-primary/20 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Duration: {itineraryDays} days</span>
                        <span>Activities: {itinerarySelectedActivities.length}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Nearby Activity Suggestions within 60km */}
                {itinerarySelectedActivities.length > 0 && getNearbyActivitySuggestions().length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm text-muted-foreground">
                        Suggested Activities Nearby
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        Within 60km
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {getNearbyActivitySuggestions().map((activity) => (
                        <Card key={activity.id} className="cursor-pointer hover:shadow-md transition-shadow border-dashed border-muted-foreground/30">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-14 h-14 flex-shrink-0">
                                {activity.image ? (
                                  <img
                                    src={activity.image}
                                    alt={activity.name}
                                    className="w-full h-full object-cover rounded"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                                    <MapPin className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0 pr-2">
                                    <h5 className="font-medium text-sm line-clamp-2 mb-1">{activity.name}</h5>
                                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {activity.location}
                                    </p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <Badge variant="outline" className="text-xs">
                                        {activity.duration}
                                      </Badge>
                                      <div className="flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs">{activity.rating}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setItinerarySelectedActivities(prev => [...prev, activity.id]);
                                    }}
                                    className="h-8 px-3 text-xs"
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Main action button */}
              <div className="p-4 mt-6">
                <Button
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  onClick={() => {
                    const buttonConfig = getMainButtonConfig();
                    buttonConfig.action();
                  }}
                  disabled={
                    currentWorkflowStep === 'activities'
                      ? (itinerarySelectedActivities.length === 0 || !selectedAirport || !areAllDaysComplete())
                      : currentWorkflowStep === 'accommodations'
                        ? !areAllAccommodationsSelected()
                        : currentWorkflowStep === 'dates'
                          ? !arrivalDate
                          : false
                  }
                >
                  {getMainButtonConfig().text}
                  <div className="ml-2 text-sm opacity-90">
                    ({itinerarySelectedActivities.length} activities • {itineraryDays} days)
                  </div>
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="accommodations" className="flex-1 flex flex-col m-0 p-0">
            <ScrollArea className="flex-1 custom-scrollbar">
              <div className="p-4 space-y-4">
                <h3 className="font-semibold">Select Accommodations by Day</h3>

                {areAllDaysComplete() ? (
                  <div className="space-y-6">
                    {Array.from({ length: numberOfDays }, (_, index) => {
                      const day = index + 1;
                      const dayActivities = getDayActivities(day);
                      const nearestAccommodations = getNearestAccommodationsForDay(day);
                      const selectedAccommodation = accommodationsByDay[day];

                      if (dayActivities.length === 0) return null;

                      return (
                        <div key={day} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">Day {day}</h4>
                            <Badge variant="outline" className="text-xs">
                              {dayActivities.length} {dayActivities.length === 1 ? 'activity' : 'activities'}
                            </Badge>
                          </div>

                          {/* Day activities preview */}
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <div className="text-xs text-muted-foreground mb-2">Activities for this day:</div>
                            <div className="space-y-1">
                              {dayActivities.map((activity) => (
                                <div key={activity.id} className="flex items-center gap-2 text-xs">
                                  <MapPin className="h-3 w-3 text-primary" />
                                  <span className="font-medium">{activity.name}</span>
                                  <span className="text-muted-foreground">• {activity.location}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Accommodation options */}
                          <div className="space-y-2">
                            <div className="text-xs text-muted-foreground">
                              Recommended accommodations near your activities:
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                              {nearestAccommodations.map((accommodation) => (
                                <Card
                                  key={`${accommodation.type}-${accommodation.id}`}
                                  className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${selectedAccommodation === `${accommodation.type}-${accommodation.id}`
                                      ? 'border-primary bg-primary/5'
                                      : 'border-transparent hover:border-primary/30'
                                    }`}
                                  onClick={() => onAccommodationSelect(`${accommodation.type}-${accommodation.id}`, day)}
                                >
                                  <CardContent className="p-3">
                                    <div className="flex items-start gap-3">
                                      <div className="w-16 h-16 flex-shrink-0">
                                        <img
                                          src={accommodation.images && accommodation.images.length > 0 ? accommodation.images[0] : (accommodation.image || '/placeholder.svg')}
                                          alt={accommodation.name}
                                          className="w-full h-full object-cover rounded"
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1 min-w-0 pr-2">
                                            <h5 className="font-medium text-sm mb-1">{accommodation.name}</h5>
                                            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                                              <MapPin className="h-3 w-3" />
                                              {accommodation.location}
                                            </p>
                                            <div className="flex items-center gap-3 text-xs">
                                              <Badge variant={accommodation.type === 'hotel' ? 'default' : 'secondary'} className="text-xs">
                                                {accommodation.type === 'hotel' ? 'Hotel' : 'Guesthouse'}
                                              </Badge>
                                              <span className="text-muted-foreground">
                                                {Math.round(accommodation.distance)}km away
                                              </span>
                                              {accommodation.rating && (
                                                <div className="flex items-center gap-1">
                                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                  <span>{accommodation.rating}</span>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                          <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${selectedAccommodation === `${accommodation.type}-${accommodation.id}`
                                              ? "bg-primary text-primary-foreground"
                                              : "bg-muted text-muted-foreground"
                                            }`}>
                                            {selectedAccommodation === `${accommodation.type}-${accommodation.id}` ? (
                                              <Check className="h-3 w-3" />
                                            ) : (
                                              <Plus className="h-3 w-3" />
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center p-6 bg-muted/30 rounded-lg">
                    <Building className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Complete your daily activities first in the Itinerary tab to see accommodation recommendations.
                    </p>
                  </div>
                )}

                {/* Hotels */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Hotels</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {hotels.map((hotel) => (
                      <Card
                        key={hotel.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${selectedHotels.includes(hotel.id.toString())
                            ? 'border-primary bg-primary/5'
                            : 'border-transparent hover:border-primary/30'
                          }`}
                        onClick={() => onHotelSelect(hotel.id.toString())}
                      >
                        <CardContent className="p-0">
                          <div className="relative">
                            <img
                              src={hotel.images && hotel.images.length > 0 ? hotel.images[0] : (hotel.image || '/placeholder.svg')}
                              alt={hotel.name}
                              className="w-full h-24 object-cover rounded-t-lg"
                            />
                            <div className="absolute top-1 right-1">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${selectedHotels.includes(hotel.id.toString())
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-white/90 text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                                }`}>
                                {selectedHotels.includes(hotel.id.toString()) ? (
                                  <Check className="h-2.5 w-2.5" />
                                ) : (
                                  <Plus className="h-2.5 w-2.5" />
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="p-2">
                            <h3 className="font-semibold text-xs mb-1 leading-tight">
                              {hotel.name}
                            </h3>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                              <MapPin className="h-2.5 w-2.5" />
                              {hotel.location}
                            </p>
                            <div className="flex items-center justify-between text-xs">
                              {hotel.price_per_night && (
                                <span className="font-medium text-primary">
                                  {hotel.price_per_night}/night
                                </span>
                              )}
                              {hotel.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                                  <span>{hotel.rating}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Guest Houses */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Guest Houses</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {guestHouses.map((guestHouse) => (
                      <Card
                        key={guestHouse.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${selectedGuestHouses.includes(guestHouse.id.toString())
                            ? 'border-primary bg-primary/5'
                            : 'border-transparent hover:border-primary/30'
                          }`}
                        onClick={() => onGuestHouseSelect(guestHouse.id.toString())}
                      >
                        <CardContent className="p-0">
                          <div className="relative">
                            <img
                              src={guestHouse.images && guestHouse.images.length > 0 ? guestHouse.images[0] : (guestHouse.image || '/placeholder.svg')}
                              alt={guestHouse.name}
                              className="w-full h-24 object-cover rounded-t-lg"
                            />
                            <div className="absolute top-1 right-1">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${selectedGuestHouses.includes(guestHouse.id.toString())
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-white/90 text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                                }`}>
                                {selectedGuestHouses.includes(guestHouse.id.toString()) ? (
                                  <Check className="h-2.5 w-2.5" />
                                ) : (
                                  <Plus className="h-2.5 w-2.5" />
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="p-2">
                            <h3 className="font-semibold text-xs mb-1 leading-tight">
                              {guestHouse.name}
                            </h3>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                              <MapPin className="h-2.5 w-2.5" />
                              {guestHouse.location}
                            </p>
                            <div className="flex items-center justify-between text-xs">
                              {guestHouse.price_per_night && (
                                <span className="font-medium text-primary">
                                  {guestHouse.price_per_night}/night
                                </span>
                              )}
                              {guestHouse.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                                  <span>{guestHouse.rating}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Explore Tab - Predefined Trips */}
          <TabsContent value="explore" className="flex-1 flex flex-col m-0 p-0">
            <ScrollArea className="flex-1 custom-scrollbar">
              <div className="p-4 space-y-4">
                <h3 className="font-semibold">Predefined Trips</h3>
                {tripsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-muted-foreground mt-2">Loading trips...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {predefinedTrips.map((trip) => (
                      <Card key={trip.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {trip.images && trip.images.length > 0 && (
                              <img
                                src={trip.images[0]}
                                alt={trip.name}
                                className="w-full h-32 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <h5 className="font-semibold text-sm mb-1">{trip.name}</h5>
                              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{trip.description}</p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className="text-xs">
                                  {trip.duration_days} days
                                </Badge>
                                {trip.price_estimate && (
                                  <Badge variant="secondary" className="text-xs">
                                    {trip.price_estimate}
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {trip.difficulty_level}
                                </Badge>
                                {trip.theme && (
                                  <Badge variant="outline" className="text-xs">
                                    {trip.theme}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {predefinedTrips.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Compass className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No predefined trips available</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Main generation button for accommodations tab */}
                <div className="p-4 mt-6">
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    onClick={() => {
                      const buttonConfig = getMainButtonConfig();
                      buttonConfig.action();
                    }}
                    disabled={
                      currentWorkflowStep === 'activities'
                        ? !areAllDaysComplete()
                        : currentWorkflowStep === 'accommodations'
                          ? !areAllAccommodationsSelected()
                          : currentWorkflowStep === 'dates'
                            ? !arrivalDate
                            : false
                    }
                  >
                    {getMainButtonConfig().text}
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Details Tab - All Selected Activities Details */}
          <TabsContent value="details" className="flex-1 flex flex-col m-0 p-0">
            <ScrollArea className="flex-1 custom-scrollbar">
              <div className="p-4 space-y-6">
                <h3 className="font-semibold">Trip Details</h3>

                {/* Selected Activities Section */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-primary">Selected Activities</h4>
                  {selectedActivities.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No activities selected</p>
                      <p className="text-xs">Start building your itinerary to see details</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {activities
                        .filter(activity => selectedActivities.includes(activity.id.toString()))
                        .map((activity) => (
                          <Card key={activity.id} className="overflow-hidden transition-transform hover:scale-[1.02]">
                            <div className="grid grid-cols-1">
                              <div className="relative h-48 w-full">
                                {activity.images && activity.images.length > 0 ? (
                                  <img
                                    src={activity.images[0]}
                                    alt={activity.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : activity.image ? (
                                  <img
                                    src={activity.image}
                                    alt={activity.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                                    <MapPin className="h-12 w-12 text-primary" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                  <h4 className="font-semibold text-lg text-white leading-tight">{activity.title}</h4>
                                  <p className="text-sm text-white/80 flex items-center gap-1 mt-1">
                                    <MapPin className="h-4 w-4 flex-shrink-0" />
                                    {activity.location}
                                  </p>
                                </div>
                              </div>
                              <CardContent className="p-4">
                                {activity.description && (
                                  <p className="text-sm text-foreground mb-4 leading-relaxed">
                                    {activity.description}
                                  </p>
                                )}

                                <div className="flex items-center gap-2 flex-wrap">
                                  {activity.duration && (
                                    <Badge variant="secondary" className="text-xs">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {activity.duration}
                                    </Badge>
                                  )}
                                  {activity.rating && (
                                    <Badge variant="secondary" className="text-xs">
                                      <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                                      {activity.rating}
                                    </Badge>
                                  )}
                                  {activity.category && (
                                    <Badge variant="outline" className="text-xs">
                                      {activity.category}
                                    </Badge>
                                  )}
                                  {activity.price && (
                                    <Badge variant="outline" className="text-xs">
                                      {activity.price}
                                    </Badge>
                                  )}
                                </div>
                              </CardContent>
                            </div>
                          </Card>
                        ))
                      }
                    </div>
                  )}
                </div>

                {/* Selected Hotels Section */}
                {(selectedHotels.length > 0 || selectedGuestHouses.length > 0) && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-primary">Selected Accommodations</h4>

                    {/* Hotels */}
                    {hotels
                      .filter(hotel => selectedHotels.includes(hotel.id.toString()))
                      .map((hotel) => (
                        <Card key={hotel.id} className="overflow-hidden transition-transform hover:scale-[1.02]">
                          <div className="grid grid-cols-1">
                            <div className="relative h-48 w-full">
                              {hotel.images && hotel.images.length > 0 ? (
                                <img
                                  src={hotel.images[0]}
                                  alt={hotel.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : hotel.image ? (
                                <img
                                  src={hotel.image}
                                  alt={hotel.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                                  <Building className="h-12 w-12 text-primary" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h4 className="font-semibold text-lg text-white leading-tight">{hotel.name}</h4>
                                <p className="text-sm text-white/80 flex items-center gap-1 mt-1">
                                  <MapPin className="h-4 w-4 flex-shrink-0" />
                                  {hotel.location}
                                </p>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              {hotel.description && (
                                <p className="text-sm text-foreground mb-4 leading-relaxed">
                                  {hotel.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="secondary" className="text-xs">
                                  <Building className="h-3 w-3 mr-1" />
                                  Hotel
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                                  {hotel.rating || 4.5}
                                </Badge>
                                {hotel.price_per_night && (
                                  <Badge variant="outline" className="text-xs">
                                    {hotel.price_per_night}/night
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </div>
                        </Card>
                      ))
                    }

                    {/* Guest Houses */}
                    {guestHouses
                      .filter(guestHouse => selectedGuestHouses.includes(guestHouse.id.toString()))
                      .map((guestHouse) => (
                        <Card key={guestHouse.id} className="overflow-hidden transition-transform hover:scale-[1.02]">
                          <div className="grid grid-cols-1">
                            <div className="relative h-48 w-full">
                              {guestHouse.images && guestHouse.images.length > 0 ? (
                                <img
                                  src={guestHouse.images[0]}
                                  alt={guestHouse.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : guestHouse.image ? (
                                <img
                                  src={guestHouse.image}
                                  alt={guestHouse.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                                  <Home className="h-12 w-12 text-primary" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h4 className="font-semibold text-lg text-white leading-tight">{guestHouse.name}</h4>
                                <p className="text-sm text-white/80 flex items-center gap-1 mt-1">
                                  <MapPin className="h-4 w-4 flex-shrink-0" />
                                  {guestHouse.location}
                                </p>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              {guestHouse.description && (
                                <p className="text-sm text-foreground mb-4 leading-relaxed">
                                  {guestHouse.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="secondary" className="text-xs">
                                  <Home className="h-3 w-3 mr-1" />
                                  Guest House
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                                  {guestHouse.rating || 4.5}
                                </Badge>
                                {guestHouse.price_per_night && (
                                  <Badge variant="outline" className="text-xs">
                                    {guestHouse.price_per_night}/night
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </div>
                        </Card>
                      ))
                    }
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Guide Tab */}
          <TabsContent value="guide" className="flex-1 flex flex-col m-0 p-0">
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                <h3 className="font-semibold">Tunisia Travel Guide</h3>

                <div className="space-y-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Plane className="h-4 w-4" />
                      Transportation
                    </h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Rent a car for maximum flexibility - roads are generally well-maintained</p>
                      <p>• Use louages (shared taxis) for intercity travel - affordable and authentic</p>
                      <p>• Trains connect major cities like Tunis, Sousse, and Sfax</p>
                      <p>• Negotiate taxi fares in advance or use the meter</p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Culture & Etiquette
                    </h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Dress modestly, especially when visiting mosques or rural areas</p>
                      <p>• Learn basic Arabic or French phrases - locals appreciate the effort</p>
                      <p>• Friday is the holy day - some shops may close for prayers</p>
                      <p>• Bargaining is expected in souks (markets)</p>
                      <p>• Always ask permission before photographing people</p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Safety Tips
                    </h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Tunisia is generally safe for tourists</p>
                      <p>• Avoid border areas with Libya and Algeria</p>
                      <p>• Keep copies of important documents</p>
                      <p>• Use hotel safes for valuables</p>
                      <p>• Stay hydrated in the desert regions</p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Best Time to Visit
                    </h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Spring (March-May): Perfect weather, fewer crowds</p>
                      <p>• Fall (September-November): Warm temperatures, ideal for sightseeing</p>
                      <p>• Summer (June-August): Hot, best for beach destinations</p>
                      <p>• Winter (December-February): Mild, good for desert trips</p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Currency & Costs</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Currency: Tunisian Dinar (TND)</p>
                      <p>• Budget: $30-50/day for backpackers</p>
                      <p>• Mid-range: $50-100/day for comfortable travel</p>
                      <p>• Credit cards accepted in hotels and restaurants</p>
                      <p>• ATMs widely available in cities</p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Must-Try Experiences</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Explore the ancient ruins of Carthage</p>
                      <p>• Wander through the medinas of Tunis and Kairouan</p>
                      <p>• Experience a Sahara desert camp</p>
                      <p>• Taste authentic couscous and tagines</p>
                      <p>• Visit the blue and white village of Sidi Bou Said</p>
                    </div>
                  </Card>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Travel Tab */}
          <TabsContent value="travel" className="flex-1 flex flex-col m-0 p-0">
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                <h3 className="font-semibold">Travel Information</h3>

                <div className="space-y-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Plane className="h-4 w-4" />
                      Flights to Tunisia
                    </h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><strong>Main Airport:</strong> Tunis-Carthage International (TUN)</p>
                      <p><strong>Other Airports:</strong> Monastir (MIR), Enfidha (NBE), Tozeur (TOE)</p>
                      <p><strong>Major Airlines:</strong> Tunisair, Air France, Turkish Airlines</p>
                      <p><strong>Flight Duration:</strong> 2-3 hours from Europe</p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Visa Requirements</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• EU citizens: No visa required for stays up to 90 days</p>
                      <p>• US/Canada: No visa required for stays up to 90 days</p>
                      <p>• Valid passport required (6 months validity)</p>
                      <p>• Check latest requirements before travel</p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Local Transportation</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><strong>Car Rental:</strong> Available at airports and cities</p>
                      <p><strong>Public Transport:</strong> Buses and trains connect major cities</p>
                      <p><strong>Taxis:</strong> Available everywhere, negotiate price</p>
                      <p><strong>Louages:</strong> Shared taxis for inter-city travel</p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Useful Contacts</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><strong>Emergency:</strong> 197 (Police), 198 (Fire)</p>
                      <p><strong>Tourist Police:</strong> 71 341 077</p>
                      <p><strong>Tourist Info:</strong> ontt.tourism.tn</p>
                      <p><strong>Weather:</strong> meteo.tn</p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Packing Essentials</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Sunscreen and hat (strong sun year-round)</p>
                      <p>• Comfortable walking shoes</p>
                      <p>• Modest clothing for religious sites</p>
                      <p>• Light jacket for desert evenings</p>
                      <p>• Universal power adapter (Type C/E plugs)</p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Health & Insurance</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• No special vaccinations required</p>
                      <p>• Travel insurance recommended</p>
                      <p>• Drink bottled water in remote areas</p>
                      <p>• Pharmacies (pharmacie) widely available</p>
                    </div>
                  </Card>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};