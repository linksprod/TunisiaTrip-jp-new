
import React from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface VideoCard {
  title: string;
  subtitle?: string;
  image: string;
  comingSoon?: boolean;
}

const videos: VideoCard[] = [
  {
    title: "MYSTICAL EXPLORATIONS IN TUNISIA",
    subtitle: "Watch video",
    image: "/uploads/f490eb11-b7d5-4bb1-86c7-33f38275a59b.png",
    comingSoon: true
  },
  {
    title: "TUNIS VLOG",
    subtitle: "チュニジアのメディナでのブイログ",
    image: "/uploads/7004eb7b-0db7-4919-a8fd-c6eb54f3e157.png",
    comingSoon: true
  },
  {
    title: "DISCOVER TOZEUR",
    subtitle: "トジュールを発見",
    image: "/uploads/2a55f591-b880-443b-bfe4-1f5662503a3d.png",
    comingSoon: true
  }
];

export function VideoSection() {
  const { currentLanguage } = useTranslation();
  
  return (
    <section className="w-full bg-gray-50 py-12 md:py-16">
      <div className="container max-w-[1200px] mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          <TranslateText text="Featured Videos" language={currentLanguage} />
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <div 
              key={index}
              className="group flex flex-col"
            >
              {/* Video Thumbnail */}
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4 cursor-pointer hover:transform hover:scale-[1.02] transition-all duration-300">
                <img
                  src={video.image}
                  alt={video.title}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-75 transition-opacity"
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button 
                    variant="secondary"
                    size="sm"
                    className="bg-white/90 hover:bg-white text-black rounded-full"
                  >
                    <Play className="w-4 h-4" />
                    <TranslateText 
                      text={video.comingSoon ? "Coming Soon" : "Play"} 
                      language={currentLanguage} 
                    />
                  </Button>
                </div>
              </div>
              
              {/* Text Content Below */}
              <div className="space-y-1">
                <h3 className="text-gray-900 text-lg font-bold">
                  <TranslateText text={video.title} language={currentLanguage} />
                </h3>
                {video.subtitle && (
                  <p className="text-gray-600 text-sm">
                    <TranslateText text={video.subtitle} language={currentLanguage} />
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
