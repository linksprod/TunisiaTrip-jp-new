import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Calendar, Star, Clock } from "lucide-react";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "sonner";
import { useActivities } from "@/hooks/useActivities";
import { useHotels } from "@/hooks/useHotels";
import { useGuestHouses } from "@/hooks/useGuestHouses";
import { useAirports } from "@/hooks/useAirports";
import { ModernItineraryTimeline } from "@/components/travel/itinerary/ModernItineraryTimeline";
import { EnhancedDayItinerary } from "@/components/travel/itinerary/enhancedTypes";

const ItineraryGenerationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLanguage } = useTranslation();

  // Get data from URL params (from TripPlannerSidebar) or state (fallback)
  const urlParams = new URLSearchParams(location.search);
  const selectedActivities = urlParams.get('selectedActivities')
    ? JSON.parse(decodeURIComponent(urlParams.get('selectedActivities')!))
    : location.state?.selectedActivities;
  const selectedHotels = urlParams.get('selectedHotels')
    ? JSON.parse(decodeURIComponent(urlParams.get('selectedHotels')!))
    : location.state?.selectedHotels;
  const selectedGuestHouses = urlParams.get('selectedGuestHouses')
    ? JSON.parse(decodeURIComponent(urlParams.get('selectedGuestHouses')!))
    : location.state?.selectedGuestHouses;
  const selectedAirport = urlParams.get('selectedAirport') || location.state?.selectedAirport;
  const checkIn = urlParams.get('checkIn') ? new Date(urlParams.get('checkIn')!) : location.state?.checkIn;
  const checkOut = urlParams.get('checkOut') ? new Date(urlParams.get('checkOut')!) : location.state?.checkOut;

  console.log('📊 ItineraryGenerationPage received data:', {
    selectedActivities: selectedActivities?.length || 0,
    selectedHotels: selectedHotels?.length || 0,
    selectedGuestHouses: selectedGuestHouses?.length || 0,
    selectedAirport,
    checkIn,
    checkOut
  });

  // Calculate actual number of days from calendar selection
  const calculateDays = () => {
    if (checkIn && checkOut) {
      const diffTime = Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 7; // Default fallback
  };

  const selectedDays = calculateDays();
  const [isGenerating, setIsGenerating] = useState(true);
  const [generatedItinerary, setGeneratedItinerary] = useState<EnhancedDayItinerary[]>([]);

  const { activities: dbActivities } = useActivities();
  const { hotels: dbHotels } = useHotels();
  const { guestHouses: dbGuestHouses } = useGuestHouses();
  const { airports: dbAirports } = useAirports();

  // Auto-generate itinerary on page load
  useEffect(() => {
    if (!selectedActivities?.length || (!selectedHotels?.length && !selectedGuestHouses?.length)) {
      toast.warning("Please select activities and accommodations first");
      navigate('/accommodation-selection');
      return;
    }

    const generateItinerary = async () => {
      try {
        setIsGenerating(true);
        toast.info("Generating your detailed itinerary...", {
          description: "Creating a smart itinerary based on your selections and duration"
        });

        // Use the consolidated itinerary service
        const { generateItinerary } = await import('../services/itineraryService');

        const generatedItinerary = await generateItinerary(
          selectedDays,
          selectedActivities,
          selectedHotels || [],
          selectedGuestHouses || [],
          {
            activities: dbActivities,
            hotels: dbHotels,
            guestHouses: dbGuestHouses,
            airports: dbAirports
          },
          selectedAirport
        );

        setGeneratedItinerary(generatedItinerary);
        toast.success(`Your ${selectedDays}-day Tunisia adventure is ready!`);
      } catch (error) {
        console.error("Itinerary generation error:", error);
        toast.error("Failed to generate itinerary. Please try again.");
      } finally {
        setIsGenerating(false);
      }
    };

    generateItinerary();
  }, [selectedActivities, selectedHotels, selectedGuestHouses, selectedDays, navigate]);

  const handleRegenerateItinerary = async () => {
    try {
      setIsGenerating(true);
      toast.info("Regenerating your itinerary...");

      // Use the consolidated itinerary service
      const { generateItinerary } = await import('../services/itineraryService');

      const generatedItinerary = await generateItinerary(
        selectedDays,
        selectedActivities,
        selectedHotels || [],
        selectedGuestHouses || [],
        {
          activities: dbActivities,
          hotels: dbHotels,
          guestHouses: dbGuestHouses,
          airports: dbAirports
        },
        selectedAirport
      );

      setGeneratedItinerary(generatedItinerary);
      toast.success("Your new Tunisia adventure itinerary is ready!");
    } catch (error) {
      console.error("Itinerary regeneration error:", error);
      toast.error("Failed to regenerate itinerary. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToAccommodations = () => {
    navigate('/accommodation-selection', {
      state: { selectedActivities }
    });
  };

  if (!selectedActivities?.length) {
    return null;
  }

  return (
    <MainLayout showTagBar={false}>
      <div className="w-full bg-gradient-to-br from-background to-secondary/20">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
          {/* Enhanced Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-primary hover:bg-primary/10 mb-6"
              onClick={handleBackToAccommodations}
            >
              <ArrowLeft className="h-4 w-4" />
              <TranslateText text="Back to Selection" language={currentLanguage} />
            </Button>

            <div className="text-center space-y-6">
              <div className="space-y-3">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Your {selectedDays}-Day Tunisia Adventure
                </h1>
                <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                  Expertly crafted itinerary with optimized routes and authentic cultural experiences
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-0 px-4 py-2">
                  <Star className="h-4 w-4 mr-2" />
                  {selectedActivities.length} curated experiences
                </Badge>
                <Badge variant="secondary" className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-0 px-4 py-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  {(selectedHotels?.length || 0) + (selectedGuestHouses?.length || 0)} handpicked accommodations
                </Badge>
                <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-0 px-4 py-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  {selectedDays} days of discovery
                </Badge>
              </div>
            </div>
          </div>

          {/* Modern Timeline Component */}
          <div className="space-y-6">
            <ModernItineraryTimeline
              isLoading={isGenerating}
              itinerary={generatedItinerary}
              onCustomize={() => {
                toast.success("Customization features coming soon!", {
                  description: "Advanced itinerary editing will be available soon."
                });
              }}
              selectedActivities={selectedActivities || []}
              selectedHotels={selectedHotels || []}
              selectedGuestHouses={selectedGuestHouses || []}
              selectedDays={selectedDays}
            />

            {/* Action Buttons */}
            {!isGenerating && generatedItinerary.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={handleRegenerateItinerary}
                  disabled={isGenerating}
                  className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground"
                >
                  <Clock className="h-4 w-4" />
                  Regenerate Adventure
                </Button>
                <Button
                  onClick={() => toast.success("Itinerary saved successfully!", {
                    description: "Your personalized itinerary has been saved to your account."
                  })}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                >
                  <Star className="h-4 w-4" />
                  Save Your Journey
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ItineraryGenerationPage;