
import React, { useState, useEffect } from "react";
import { useDeviceSize } from "@/hooks/use-mobile";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

const slides = [
  {
    id: 1,
    image: "/uploads/f66ee597-e8d7-44b5-834e-d0eb1266a0ba.png",
    title: "Travel Tunisia",
    subtitle: "Unforgettable Experiences Await"
  },
  {
    id: 2,
    image: "/uploads/2714f2c3-4465-4a55-8369-5484aa8f3b28.png",
    title: "Discover Hidden Gems",
    subtitle: "Authentic Cultural Experiences"
  },
  {
    id: 3,
    image: "/uploads/a2d95c89-23fc-48b3-b72b-742bdd9b0076.png",
    title: "Desert Adventures",
    subtitle: "Journey Through the Sahara"
  }
];

export function TravelHero() {
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
