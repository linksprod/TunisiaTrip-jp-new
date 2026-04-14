
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { WeatherOverview } from "@/components/weather/WeatherOverview";
import { WeatherInfoBanner } from "@/components/weather/WeatherInfoBanner";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { WeatherCityCard } from "@/components/weather/WeatherCityCard";

export function TunisianWeatherContent() {
  const isMobile = useIsMobile();
  const { currentLanguage } = useTranslation();

  // Weather data moved to a separate component
  const cityWeatherData = [
    {
      name: "Tunis",
      image: "/uploads/f9b5ed8a-f815-4286-b788-45136d3a80a7.png",
      summer: "30-36°C",
      winter: "7-15°C",
      rainfall: "450mm/year",
      description: "The capital city enjoys a Mediterranean climate with hot summers and mild, rainy winters. Sea breezes moderate the temperature along the coast."
    },
    {
      name: "Sousse",
      image: "/uploads/671f7df5-ae19-43c2-b728-ca38ef5d56d0.png",
      summer: "31-37°C",
      winter: "8-16°C",
      rainfall: "320mm/year",
      description: "This coastal resort city experiences hot, dry summers and mild winters with occasional rainfall. The humidity is higher due to its coastal location."
    },
    {
      name: "Djerba",
      image: "/uploads/befe353a-7a26-48cd-8b49-4d468690964e.png",
      summer: "32-38°C",
      winter: "10-18°C",
      rainfall: "200mm/year",
      description: "The island enjoys a mild climate year-round with less rainfall than northern regions. Summer temperatures are moderated by sea breezes."
    },
    {
      name: "Tozeur",
      image: "/uploads/63ebe873-d7c7-4ed8-998c-acbd93df6f15.png",
      summer: "36-45°C",
      winter: "6-19°C",
      rainfall: "100mm/year",
      description: "Located near the Sahara Desert, Tozeur experiences extremely hot, dry summers and cool winters with significant temperature drops at night."
    }
  ];
  
  return (
    <div className="w-full">
      {/* Weather Overview Section */}
      <WeatherOverview />
      
      {/* Regional Weather Cards */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          <TranslateText text="Weather by Region" language={currentLanguage} />
        </h2>
        {isMobile ? (
          <Carousel className="w-full">
            <CarouselContent>
              {cityWeatherData.map((city, index) => (
                <CarouselItem key={index}>
                  <WeatherCityCard city={city} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cityWeatherData.map((city, index) => (
              <WeatherCityCard key={index} city={city} />
            ))}
          </div>
        )}
      </div>
      
      {/* Best Time to Visit */}
      <WeatherInfoBanner />
    </div>
  );
}
