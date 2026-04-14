
import React, { useState, useEffect } from "react";
import { useDeviceSize } from "@/hooks/use-mobile";
import { useTranslation } from "@/hooks/use-translation";
import { TranslateText } from "@/components/translation/TranslateText";

const slides = [
  {
    id: 1,
    image: "/uploads/06199176-075c-4ff5-9af4-6888ffeffc16.png",
    title: "Discover Tunisia",
    subtitle: "A Land of History and Culture"
  },
  {
    id: 2,
    image: "/uploads/b1054a66-c723-4e47-b4d5-345f2c611881.png",
    title: "Ancient Wonders",
    subtitle: "Explore Tunisia's Historical Sites"
  },
  {
    id: 3,
    image: "/uploads/3caaa473-8150-4b29-88b4-e2e9c696bf1d.png",
    title: "Desert Adventures",
    subtitle: "Experience the Sahara"
  }
];

export function AboutTunisiaHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isMobile, isTablet } = useDeviceSize();
  const { currentLanguage } = useTranslation();

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[300px] sm:h-[350px] md:h-[450px] lg:h-[500px] overflow-hidden">
      {/* Slide Images */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            currentSlide === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          
          {/* Text Overlay with TranslateText for Japanese translation */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-10 text-white">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2">
              <TranslateText text={slide.title} language={currentLanguage} />
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light">
              <TranslateText text={slide.subtitle} language={currentLanguage} />
            </p>
          </div>
        </div>
      ))}
      
      {/* Indicators - More compact on mobile */}
      <div className="absolute bottom-3 sm:bottom-5 left-0 right-0 flex justify-center gap-1 sm:gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
              currentSlide === index ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
