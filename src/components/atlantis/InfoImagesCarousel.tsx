
import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import clsx from "clsx";
import useEmblaCarousel from "embla-carousel-react";

const images = [
  {
    src: "/uploads/594e9224-d9ce-498d-9bcf-b9ecd0412353.png",
    alt: "Colorful Tunisia Illustration 1 (4:5 Ratio)"
  },
  {
    src: "/uploads/76eba813-1133-401a-b0e3-e6c519afa261.png",
    alt: "Colorful Tunisia Illustration 2 (4:5 Ratio)"
  }
];

export function InfoImagesCarousel({ className = "" }: { className?: string }) {
  // Carousel options
  const opts = { loop: true };

  // Embla carousel for custom auto-play control
  const [emblaRef, emblaApi] = useEmblaCarousel(opts);

  // Auto-play: Advance slide every 2.5s
  React.useEffect(() => {
    if (!emblaApi) return;
    let autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 2500);
    return () => clearInterval(autoplay);
  }, [emblaApi]);

  return (
    <div className={clsx("relative w-full", className)}>
      {/* Set the emblaRef directly on CarouselContent outer div */}
      <Carousel className="w-full" opts={opts}>
        <CarouselContent ref={emblaRef}>
          {images.map((img, idx) => (
            <CarouselItem key={idx}>
              <AspectRatio ratio={4 / 5} className="w-full max-w-xs md:max-w-sm rounded-xl overflow-hidden mx-auto">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover rounded-xl border border-[#F6F8FB]"
                  style={{ objectFit: "cover" }}
                />
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
