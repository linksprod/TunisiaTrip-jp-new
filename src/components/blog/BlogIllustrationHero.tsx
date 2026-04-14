
import React from "react";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export function BlogIllustrationHero() {
  const { currentLanguage } = useTranslation();

  return (
    <div className="w-full bg-[#FFFBF6]">
      <div className="w-full px-0 relative">
        <img
          src="/uploads/64122175-5717-4890-b166-cc665ff1ea4b.png"
          alt="Travelers exploring Tunisia"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              <TranslateText 
                text="Discover Tunisia Through Our Stories" 
                language={currentLanguage} 
              />
            </h1>
            <p className="text-white text-sm md:text-base max-w-2xl mx-auto">
              <TranslateText 
                text="Join our community of travelers sharing their experiences and adventures across Tunisia" 
                language={currentLanguage} 
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
