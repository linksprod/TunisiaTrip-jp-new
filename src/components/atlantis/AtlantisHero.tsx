
import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

const slides = [
  {
    src: "/uploads/6b47c2b1-2c3e-4895-80eb-1813b4351672.png",
    alt: "Tunis City View with Cathedral"
  },
  {
    src: "/uploads/67d662bd-9913-40c8-9171-f34177b63a89.png",
    alt: "Ancient Roman Ruins in Tunisia"
  }
];

export function AtlantisHero() {
  // Setup carousel with autoplay
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const { currentLanguage } = useTranslation();

  React.useEffect(() => {
    if (!emblaApi) return;
    
    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 6000); // Switch every 6 seconds

    return () => clearInterval(autoplay);
  }, [emblaApi]);

  return (
    <div className="relative h-[500px] overflow-hidden">
      <Carousel className="w-full h-full" opts={{ loop: true }}>
        <CarouselContent ref={emblaRef}>
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="relative h-[500px]">
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                    <TranslateText text="Welcome to Atlantis" language={currentLanguage} />
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                    <TranslateText 
                      text="Your trusted travel partner in Tunisia since 1991" 
                      language={currentLanguage} 
                    />
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
}
