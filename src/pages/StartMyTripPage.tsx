import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { SelectableActivities } from "@/components/start-my-trip/SelectableActivities";
import { EnhancedSelectableHotels } from "@/components/start-my-trip/EnhancedSelectableHotels";
import { EnhancedSelectableGuestHouses } from "@/components/start-my-trip/EnhancedSelectableGuestHouses";
import { SelectedItems } from "@/components/start-my-trip/SelectedItems";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { InteractiveTripMap } from "@/components/start-my-trip/InteractiveTripMap";
import { DaySelector } from "@/components/start-my-trip/DaySelector";
import { DateRangePicker } from "@/components/start-my-trip/DateRangePicker";
import { ModernItineraryTimeline } from "@/components/travel/itinerary/ModernItineraryTimeline";
import { SmartAccommodationRecommendations } from "@/components/start-my-trip/SmartAccommodationRecommendations";
import { QuoteRequestForm } from "@/components/start-my-trip/QuoteRequestForm";
import { ThemeSelection } from "@/components/start-my-trip/ThemeSelection";
import { ActivityGroupingPage } from "@/components/start-my-trip/ActivityGroupingPage";

// Using the new intelligent itinerary generator
import { EnhancedDayItinerary } from "@/components/travel/itinerary/enhancedTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  PlayCircle,
  ArrowLeft,
  Lightbulb,
  CheckCircle,
  Plane,
  MapPin,
  Info,
  Send,
  Calendar,
  Activity as ActivityIcon,
  Building,
  Home,
  Sparkles,
  Eye
} from "lucide-react";
import { useActivities } from "@/hooks/useActivities";
import { useHotels } from "@/hooks/useHotels";
import { useGuestHouses } from "@/hooks/useGuestHouses";
import { PhotoBanner } from "@/components/start-my-trip/PhotoBanner";
import { calculateOptimalTripDuration, TripDurationCalculation } from "@/utils/tripDurationCalculator";
import { Activity } from "@/data/activities";
import { useMemo } from "react";
import { TripPresentation } from "@/components/start-my-trip/TripPresentation";
import { supabase } from "@/integrations/supabase/client";

const StartMyTripPageOptimized = () => {
  const navigate = useNavigate();
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedHotels, setSelectedHotels] = useState<string[]>([]);
  const [selectedGuestHouses, setSelectedGuestHouses] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState(7);
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [itinerary, setItinerary] = useState<EnhancedDayItinerary[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);
  const [showSmartRecommendations, setShowSmartRecommendations] = useState(false);
  const [activeTab, setActiveTab] = useState("activities");
  const [tripDurationCalculation, setTripDurationCalculation] = useState<TripDurationCalculation | null>(null);
  const [showDurationSelector, setShowDurationSelector] = useState(false);
  const [viewMode, setViewMode] = useState<'theme' | 'manual' | 'grouping'>('theme');
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [showPresentation, setShowPresentation] = useState(false);
  const [presentationContent, setPresentationContent] = useState<string>('');
  const [isGeneratingPresentation, setIsGeneratingPresentation] = useState(false);
  const { currentLanguage } = useTranslation();
  const activitiesScrollRef = useRef<HTMLDivElement>(null);
  const mainPageRef = useRef<HTMLDivElement>(null);

  // Use Supabase hooks for dynamic data
  const { activities = [], isLoading: activitiesLoading } = useActivities();
  const { hotels = [], isLoading: hotelsLoading } = useHotels();
  const { guestHouses = [], isLoading: guestHousesLoading } = useGuestHouses();

  // Convert data to usable format for trip calculation
  const convertedActivities: Activity[] = useMemo(() => {
    return activities.map(activity => ({
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
  }, [activities]);

  // Calculate trip duration when activities change
  useEffect(() => {
    if (selectedActivities.length >= 3) {
      const selectedActivityData = convertedActivities.filter(a => selectedActivities.includes(a.id));
      const calculation = calculateOptimalTripDuration(selectedActivityData);
      setTripDurationCalculation(calculation);
      setSelectedDays(calculation.suggestedDays);
      setShowDurationSelector(true);
    } else {
      setTripDurationCalculation(null);
      setShowDurationSelector(false);
    }
  }, [selectedActivities, convertedActivities]);

  const handleGeneratePresentation = async () => {
    if (selectedActivities.length === 0) {
      toast.warning(
        <TranslateText text="Veuillez sélectionner au moins une activité" language={currentLanguage} />,
        {
          description: <TranslateText text="Les activités sont nécessaires pour créer votre présentation personnalisée." language={currentLanguage} />
        }
      );
      return;
    }

    const totalAccommodations = selectedHotels.length + selectedGuestHouses.length;
    if (totalAccommodations === 0) {
      toast.warning(
        <TranslateText text="Veuillez sélectionner au moins un hébergement" language={currentLanguage} />,
        {
          description: <TranslateText text="Les hébergements aident à optimiser votre présentation." language={currentLanguage} />
        }
      );
      return;
    }

    setIsGeneratingPresentation(true);
    setShowPresentation(true);

    toast.info(
      <TranslateText text="Génération de votre présentation personnalisée..." language={currentLanguage} />,
      {
        description: <TranslateText text="Notre IA crée une présentation engageante pour votre voyage en Tunisie" language={currentLanguage} />,
        duration: 3000
      }
    );

    try {
      // Prepare selected activities and hotels data
      const selectedActivitiesData = activities.filter(a => selectedActivities.includes(a.id?.toString() || ''));
      const selectedHotelsData = hotels.filter(h => selectedHotels.includes(h.id?.toString() || ''));

      const { data, error } = await supabase.functions.invoke('generate-presentation', {
        body: {
          activities: selectedActivitiesData,
          hotels: selectedHotelsData,
          language: 'french'
        }
      });

      if (error) throw error;

      setPresentationContent(data.htmlContent);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      toast.success(
        <TranslateText text="Votre présentation de voyage a été créée !" language={currentLanguage} />,
        {
          description: <TranslateText text="Découvrez votre voyage personnalisé en Tunisie" language={currentLanguage} />
        }
      );
    } catch (error) {
      console.error("Presentation generation error:", error);
      toast.error(<TranslateText text="Impossible de générer la présentation. Veuillez réessayer." language={currentLanguage} />);
      setShowPresentation(false);
    } finally {
      setIsGeneratingPresentation(false);
    }
  };

  const handleGenerateItinerary = async () => {
    setIsGenerating(true);
    setShowItinerary(true);
    setShowPresentation(false);

    toast.info(
      <TranslateText text="Generating Your Optimized Itinerary..." language={currentLanguage} />,
      {
        description: <TranslateText text="Our AI is creating your perfect Tunisia trip with optimized routes and accommodations" language={currentLanguage} />,
        duration: 3000
      }
    );

    try {
      // Use the consolidated itinerary service
      const { generateItinerary } = await import('../services/itineraryService');

      const generatedItinerary = await generateItinerary(
        selectedDays,
        selectedActivities,
        selectedHotels,
        selectedGuestHouses,
        {
          activities,
          hotels,
          guestHouses,
          airports: [] // Will fetch if needed or passing empty
        }
      );

      setItinerary(generatedItinerary);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (generatedItinerary.length > 0) {
        toast.success(
          <TranslateText text={`Your optimized ${selectedDays}-day itinerary has been created!`} language={currentLanguage} />,
          {
            description: <TranslateText text="Geographically optimized route with cultural tips and weather alternatives included." language={currentLanguage} />
          }
        );
      }
    } catch (error) {
      console.error("Itinerary generation error:", error);
      toast.error(<TranslateText text="Unable to generate itinerary. Please try again." language={currentLanguage} />);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToSelection = () => {
    setShowItinerary(false);
    setShowPresentation(false);
  };

  const handleBackToPresentation = () => {
    setShowItinerary(false);
    setShowPresentation(true);
  };

  const handleThemeSelect = (themeId: string, activityIds: string[], recommendedHotels: string[], recommendedGuestHouses: string[]) => {
    setSelectedActivities(activityIds);
    setSelectedHotels(recommendedHotels);
    setSelectedGuestHouses(recommendedGuestHouses);
    setSelectedTheme(themeId);
    setViewMode('grouping');
  };

  const handleBackToThemes = () => {
    setViewMode('theme');
    setSelectedActivities([]);
    setSelectedHotels([]);
    setSelectedGuestHouses([]);
    setSelectedTheme(null);
  };

  const handleManualSelection = () => {
    // Navigate to accommodation selection page with selected activities and days
    navigate('/select-accommodations', {
      state: {
        selectedActivities,
        selectedDays
      }
    });
  };

  const handleProceedToGrouping = () => {
    if (selectedActivities.length > 0) {
      setViewMode('grouping');
    }
  };

  const handleHotelToggle = (hotelId: string) => {
    setSelectedHotels(prev =>
      prev.includes(hotelId)
        ? prev.filter(id => id !== hotelId)
        : [...prev, hotelId]
    );
  };

  const handleGuestHouseToggle = (guestHouseId: string) => {
    setSelectedGuestHouses(prev =>
      prev.includes(guestHouseId)
        ? prev.filter(id => id !== guestHouseId)
        : [...prev, guestHouseId]
    );
  };

  const handleActivityToggle = (activityId: string) => {
    setSelectedActivities(prev =>
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const handleCustomizeItinerary = () => {
    toast.info(<TranslateText text="Customization feature will be available soon!" language={currentLanguage} />);
  };

  const handleAccommodationSelect = (accommodationId: string, type: 'hotel' | 'guesthouse') => {
    if (type === 'hotel') {
      if (!selectedHotels.includes(accommodationId)) {
        setSelectedHotels([...selectedHotels, accommodationId]);
        toast.success(<TranslateText text="Hotel added to your selection!" language={currentLanguage} />);
      }
    } else {
      if (!selectedGuestHouses.includes(accommodationId)) {
        setSelectedGuestHouses([...selectedGuestHouses, accommodationId]);
        toast.success(<TranslateText text="Guest house added to your selection!" language={currentLanguage} />);
      }
    }
  };

  React.useEffect(() => {
    if (selectedActivities.length > 0 && !showSmartRecommendations) {
      setShowSmartRecommendations(true);
    } else if (selectedActivities.length === 0) {
      setShowSmartRecommendations(false);
    }
  }, [selectedActivities.length]);

  // Scroll synchronization effect
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      const activitiesScroll = activitiesScrollRef.current;
      const mainPage = mainPageRef.current;

      if (!activitiesScroll || !mainPage) return;

      const { scrollTop, scrollHeight, clientHeight } = activitiesScroll;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
      const isAtTop = scrollTop <= 1;

      if (e.deltaY > 0 && isAtBottom) {
        e.preventDefault();
        window.scrollBy(0, e.deltaY);
        return;
      }

      if (e.deltaY < 0 && window.scrollY <= 0 && !isAtTop) {
        e.preventDefault();
        activitiesScroll.scrollBy(0, e.deltaY);
        return;
      }
    };

    const activitiesElement = activitiesScrollRef.current;
    if (activitiesElement) {
      activitiesElement.addEventListener('wheel', handleScroll, { passive: false });
      return () => {
        activitiesElement.removeEventListener('wheel', handleScroll);
      };
    }
  }, []);

  const isLoading = activitiesLoading || hotelsLoading || guestHousesLoading;
  const totalAccommodations = selectedHotels.length + selectedGuestHouses.length;
  const canGenerate = selectedActivities.length > 0 && totalAccommodations > 0;

  if (isLoading) {
    return (
      <MainLayout showTagBar={false}>
        <div className="w-full bg-gradient-to-b from-background to-muted/30">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground">
                  <TranslateText text="Loading trip options..." language={currentLanguage} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (showItinerary) {
    return (
      <MainLayout showTagBar={false}>
        <div className="w-full bg-background">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
            <div className="mb-6">
              <Button variant="ghost" className="flex items-center gap-2 text-primary hover:bg-primary/10" onClick={handleBackToSelection}>
                <ArrowLeft className="h-4 w-4" />
                <TranslateText text="Back to Selection" language={currentLanguage} />
              </Button>
            </div>

            <div className="flex flex-col xl:flex-row gap-6">
              <div className="w-full xl:w-2/3">
                <ModernItineraryTimeline
                  isLoading={isGenerating}
                  itinerary={itinerary}
                  onCustomize={handleCustomizeItinerary}
                  selectedActivities={selectedActivities}
                  selectedHotels={selectedHotels}
                  selectedGuestHouses={selectedGuestHouses}
                  selectedDays={selectedDays}
                />
              </div>

              <div className="w-full xl:w-1/3">
                <div className="sticky top-4 space-y-4">
                  <SelectedItems
                    selectedActivities={selectedActivities}
                    selectedHotels={selectedHotels}
                    selectedGuestHouses={selectedGuestHouses}
                    selectedDays={selectedDays}
                    activities={activities}
                    hotels={hotels}
                    guestHouses={guestHouses}
                  />

                  <div className="bg-gradient-to-r from-success/10 to-success/5 border border-success/20 rounded-lg p-4">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-success-foreground mb-2">
                        <TranslateText text="Get Your Personalized Quote" language={currentLanguage} />
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        <TranslateText text="Request a detailed quote for your Tunisia adventure" language={currentLanguage} />
                      </p>
                      <QuoteRequestForm
                        selectedActivities={selectedActivities}
                        selectedHotels={selectedHotels}
                        selectedGuestHouses={selectedGuestHouses}
                        selectedDays={selectedDays}
                        trigger={
                          <Button
                            size="lg"
                            className="w-full flex items-center justify-center gap-2"
                          >
                            <Send className="h-5 w-5" />
                            <TranslateText text="Request Quote" language={currentLanguage} />
                          </Button>
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show presentation view
  if (showPresentation) {
    return (
      <MainLayout showTagBar={false}>
        <div className="w-full bg-gradient-to-b from-background to-muted/30">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
            <TripPresentation
              htmlContent={presentationContent}
              isGenerating={isGeneratingPresentation}
              onProceed={handleGenerateItinerary}
              onBack={handleBackToSelection}
            />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showTagBar={false}>
      <div ref={mainPageRef} className="w-full bg-gradient-to-b from-background to-muted/30">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
          {/* Hero Section */}
          <div className="text-center mb-8 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-8 w-8 text-primary" />
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                  <TranslateText text="Plan Your Perfect Trip to Tunisia" language={currentLanguage} />
                </h1>
              </div>

              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                <TranslateText text="Select activities and accommodations that interest you, and we'll create an optimized itinerary for your Tunisian adventure." language={currentLanguage} />
              </p>
            </div>

            <div className="relative overflow-hidden rounded-lg h-[200px] sm:h-[250px] md:h-[300px]">
              <PhotoBanner />
            </div>
          </div>

          {/* Theme Selection View */}
          {viewMode === 'theme' && (
            <div className="space-y-6">
              <ThemeSelection
                activities={activities}
                hotels={hotels}
                guestHouses={guestHouses}
                onThemeSelect={handleThemeSelect}
                onManualChoice={() => setViewMode('manual')}
                selectedActivities={selectedActivities}
                setSelectedActivities={setSelectedActivities}
                selectedHotels={selectedHotels}
                setSelectedHotels={setSelectedHotels}
                selectedGuestHouses={selectedGuestHouses}
                setSelectedGuestHouses={setSelectedGuestHouses}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                setCheckInDate={setCheckInDate}
                setCheckOutDate={setCheckOutDate}
              />
            </div>
          )}

          {/* Activity Grouping View */}
          {viewMode === 'grouping' && (
            <ActivityGroupingPage
              selectedActivities={selectedActivities}
              activities={activities}
              hotels={hotels}
              guestHouses={guestHouses}
              selectedHotels={selectedHotels}
              selectedGuestHouses={selectedGuestHouses}
              onActivityToggle={handleActivityToggle}
              onHotelToggle={handleHotelToggle}
              onGuestHouseToggle={handleGuestHouseToggle}
              onBack={handleBackToThemes}
              onGenerateItinerary={handleGeneratePresentation}
            />
          )}

          {/* Manual Selection View */}
          {viewMode === 'manual' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={handleBackToThemes} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <TranslateText text="Back to Themes" language={currentLanguage} />
                </Button>

                {selectedActivities.length > 0 && (
                  <Button onClick={handleProceedToGrouping}>
                    <TranslateText text="Continue with Selection" language={currentLanguage} />
                  </Button>
                )}
              </div>

              {/* Main Content Split Layout */}
              <div className="flex flex-col lg:flex-row lg:min-h-[80vh] gap-6">
                <div ref={activitiesScrollRef} className="flex-1 lg:max-h-[80vh] lg:overflow-y-auto lg:pr-2 space-y-6 custom-scrollbar">
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-primary" />
                        <TranslateText text="Choose Your Preferences" language={currentLanguage} />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-6">
                          <TabsTrigger value="activities" className="flex items-center gap-2">
                            <ActivityIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">
                              <TranslateText text="Activities" language={currentLanguage} />
                            </span>
                            {selectedActivities.length > 0 && (
                              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                {selectedActivities.length}
                              </Badge>
                            )}
                          </TabsTrigger>
                          <TabsTrigger value="hotels" className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            <span className="hidden sm:inline">
                              <TranslateText text="Hotels" language={currentLanguage} />
                            </span>
                            {selectedHotels.length > 0 && (
                              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                {selectedHotels.length}
                              </Badge>
                            )}
                          </TabsTrigger>
                          <TabsTrigger value="guesthouses" className="flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            <span className="hidden sm:inline">
                              <TranslateText text="Guest Houses" language={currentLanguage} />
                            </span>
                            {selectedGuestHouses.length > 0 && (
                              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                {selectedGuestHouses.length}
                              </Badge>
                            )}
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="activities" className="mt-0">
                          <SelectableActivities
                            selectedActivities={selectedActivities}
                            setSelectedActivities={setSelectedActivities}
                            selectedHotels={selectedHotels}
                            setSelectedHotels={setSelectedHotels}
                            selectedGuestHouses={selectedGuestHouses}
                            setSelectedGuestHouses={setSelectedGuestHouses}
                          />
                        </TabsContent>

                        <TabsContent value="hotels" className="mt-0">
                          <EnhancedSelectableHotels
                            selectedHotels={selectedHotels}
                            setSelectedHotels={setSelectedHotels}
                            selectedActivities={selectedActivities}
                            totalDays={selectedDays}
                            preferenceType="mixed"
                          />
                        </TabsContent>

                        <TabsContent value="guesthouses" className="mt-0">
                          <EnhancedSelectableGuestHouses
                            selectedGuestHouses={selectedGuestHouses}
                            setSelectedGuestHouses={setSelectedGuestHouses}
                            selectedActivities={selectedActivities}
                            totalDays={selectedDays}
                            preferenceType="mixed"
                          />
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>

                <div className="w-full lg:w-1/3 space-y-6">
                  <div className="sticky top-4 space-y-4">
                    {/* Interactive Map in Right Sidebar */}
                    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                      <div className="p-4 border-b">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          <TranslateText text="Interactive Map" language={currentLanguage} />
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          <TranslateText text="Click on activities and accommodations to select them" language={currentLanguage} />
                        </p>
                      </div>
                      <div className="h-80 rounded-b-lg overflow-hidden">
                        <InteractiveTripMap
                          selectedActivities={selectedActivities}
                          setSelectedActivities={setSelectedActivities}
                          selectedHotels={selectedHotels}
                          selectedGuestHouses={selectedGuestHouses}
                          activeTab="all-activities"
                          setSelectedHotels={setSelectedHotels}
                          setSelectedGuestHouses={setSelectedGuestHouses}
                        />
                      </div>
                    </Card>

                    <SelectedItems
                      selectedActivities={selectedActivities}
                      selectedHotels={selectedHotels}
                      selectedGuestHouses={selectedGuestHouses}
                      selectedDays={selectedDays}
                      activities={activities}
                      hotels={hotels}
                      guestHouses={guestHouses}
                    />

                    {tripDurationCalculation && (
                      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                            <Calendar className="h-5 w-5" />
                            <TranslateText text="Suggested Trip Duration" language={currentLanguage} />
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                              <TranslateText text="Recommended:" language={currentLanguage} />
                            </span>
                            <Badge variant="secondary" className="bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-100">
                              {tripDurationCalculation.suggestedDays} <TranslateText text="days" language={currentLanguage} />
                            </Badge>
                          </div>

                          <DateRangePicker
                            checkInDate={checkInDate}
                            checkOutDate={checkOutDate}
                            setCheckInDate={setCheckInDate}
                            setCheckOutDate={setCheckOutDate}
                            onDaysChange={setSelectedDays}
                          />

                          {showDurationSelector && (
                            <div className="space-y-3">
                              <DaySelector
                                selectedDays={selectedDays}
                                setSelectedDays={setSelectedDays}
                                minDays={tripDurationCalculation.minDays}
                                maxDays={Math.max(tripDurationCalculation.suggestedDays + 3, 14)}
                              />

                              <div className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                {tripDurationCalculation.reasoning}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {showSmartRecommendations && (
                      <SmartAccommodationRecommendations
                        selectedActivities={selectedActivities}
                        selectedDays={selectedDays}
                        onAccommodationSelect={handleAccommodationSelect}
                      />
                    )}

                    <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                      <CardContent className="p-6 text-center space-y-4">
                        <div className="flex items-center justify-center gap-2">
                          <PlayCircle className="h-6 w-6 text-primary" />
                          <h3 className="text-lg font-semibold">
                            <TranslateText text="Ready to Generate?" language={currentLanguage} />
                          </h3>
                        </div>

                        <p className="text-sm text-muted-foreground">
                          <TranslateText text="Create your personalized itinerary with optimized routes" language={currentLanguage} />
                        </p>

                        <Button
                          onClick={handleGeneratePresentation}
                          disabled={!canGenerate || isGenerating}
                          size="lg"
                          className="w-full"
                        >
                          {isGenerating ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              <TranslateText text="Generating..." language={currentLanguage} />
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-5 w-5 mr-2" />
                              <TranslateText text="Generate My Itinerary" language={currentLanguage} />
                            </>
                          )}
                        </Button>

                        {!canGenerate && (
                          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <div className="space-y-1">
                              {selectedActivities.length === 0 && (
                                <div>
                                  <TranslateText text="• Select at least one activity" language={currentLanguage} />
                                </div>
                              )}
                              {totalAccommodations === 0 && (
                                <div>
                                  <TranslateText text="• Choose at least one accommodation" language={currentLanguage} />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default StartMyTripPageOptimized;