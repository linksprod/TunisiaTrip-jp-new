import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { preloadImages } from "@/utils/imageUtils";
import { heroSlides } from "@/data/heroSlides";
import { HeroCarousel } from "./hero/HeroCarousel";
import { CategoryGrid } from "./hero/CategoryGrid";
import { TranslateText } from "./translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export function HeroSection(): JSX.Element {
  const isMobile = useIsMobile();
  const { currentLanguage, updateKey } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    // Preload all slide images
    const slideImages = heroSlides.map(slide => slide.src);
    preloadImages(slideImages, { 
      onComplete: () => {
        setImagesLoaded(true);
        console.log("Hero slideshow images loaded successfully");
      }
    });
  }, []);

  return (
    <section className="relative w-full bg-[#F9F5E8] pt-6 md:pt-8 pb-10 md:pb-16 overflow-hidden">
      <div className="absolute left-0 bottom-0 w-16 md:w-24 h-48 md:h-64 z-0 hidden md:block">
        <div className="w-full h-full bg-yellow-400 opacity-50 rounded-tr-full"></div>
      </div>

      <div className="absolute right-0 bottom-0 w-16 md:w-24 h-48 md:h-64 z-0 hidden md:block">
        <div className="w-full h-full bg-yellow-400 opacity-50 rounded-tl-full"></div>
      </div>
      
      <div className="w-full h-32 md:h-64 absolute bottom-0 left-0 right-0 z-0">
        <div
          className="w-full h-full bg-contain bg-bottom bg-no-repeat"
          style={{ 
            backgroundImage: "url('/uploads/b87f5384-55dd-4ccb-a2bb-18d70a68a396.png')",
            backgroundSize: isMobile ? "250%" : "100%"
          }}
          role="presentation"
          aria-hidden="true"
        ></div>
      </div>
      
      <div className="container max-w-[1200px] mx-auto px-4 relative z-10">
        <div className="hidden md:flex text-gray-500 text-sm mb-6">
          <Link to="/" className="hover:text-blue-500 transition-colors">tunisiatrip</Link>
          <span className="mx-1">›</span>
          <span className="font-medium">
            <TranslateText key={`travel-blog-${updateKey}`} text="Travel Blog" language={currentLanguage} />
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-8 md:mb-12">
          <div className="md:w-1/2 z-10 text-center md:text-left">
            <div className="mb-2 flex justify-center md:justify-start items-center">
              <span className="text-sm text-gray-600">
                <TranslateText key={`tunisian-desert-${updateKey}`} text="Tunisian Desert" language={currentLanguage} />
              </span>
            </div>
            
            <h1 className={`text-3xl md:text-5xl font-bold text-[#1b2f3d] mb-4 leading-tight ${isMobile ? 'px-8' : ''}`}>
              <TranslateText key={`blog-title-${updateKey}`} text="Let our Blog be Your Best Travel Companion" language={currentLanguage} />
            </h1>
            
            <p className="text-base md:text-lg text-gray-700 mb-6">
              <TranslateText key={`plan-trip-${updateKey}`} text="Plan your dream trip with Atlantis" language={currentLanguage} />
            </p>
            
            <Link to="/explore">
              <Button 
                variant="outline" 
                className="rounded-full px-8 border-gray-300 hover:bg-gray-100 transition-colors"
              >
                <TranslateText key={`explore-more-${updateKey}`} text="Explore More" language={currentLanguage} />
              </Button>
            </Link>
          </div>
          
          <div className="md:w-1/2 relative">
            <HeroCarousel 
              slides={heroSlides}
              imagesLoaded={imagesLoaded}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          </div>
        </div>
        
        <CategoryGrid />
      </div>
    </section>
  );
}
