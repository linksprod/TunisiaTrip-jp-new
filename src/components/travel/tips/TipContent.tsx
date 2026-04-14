
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TipContentProps } from "./types";
import { TranslateText } from "../../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export const TipContent: React.FC<TipContentProps> = ({ slide }) => {
  const navigate = useNavigate();
  // Special case for health/medicine content
  const isMedicineContent = slide.category.toLowerCase() === "health";
  const medicineImage = "/uploads/cca7f6a4-c2a2-4c66-a5bd-64c33eeb8f87.png";
  const { currentLanguage } = useTranslation();

  // Only translate if not English
  const shouldTranslate = currentLanguage !== 'EN';

  return (
    <div className="w-full border-2 border-[#347EFF] rounded-lg p-4 sm:p-6 flex flex-col md:flex-row gap-5 md:gap-6">
      <div className="w-full md:w-1/3 h-[180px] sm:h-[220px] bg-[#F3F7FF] rounded-sm flex-shrink-0 flex items-center justify-center">
        <img 
          src={isMedicineContent ? medicineImage : slide.image} 
          alt={slide.title} 
          className="w-auto h-auto max-w-[85%] max-h-[85%] object-contain rounded-[4px] mx-auto"
        />
      </div>

      <div className="flex flex-col flex-1">
        <span className="text-[#347EFF] text-[16px] sm:text-[18px] mb-2 sm:mb-3">
          {shouldTranslate ? <TranslateText text={slide.category} language={currentLanguage} /> : slide.category}
        </span>
        <h3 className="text-[22px] sm:text-[26px] text-[#1F1F20] font-bold mb-3 sm:mb-4">
          {shouldTranslate ? <TranslateText text={slide.title} language={currentLanguage} /> : slide.title}
        </h3>
        <p className="text-[15px] sm:text-[16px] text-[#1F1F20] mb-4 sm:mb-6">
          {shouldTranslate ? <TranslateText text={slide.content} language={currentLanguage} /> : slide.content}
        </p>
        <Button 
          onClick={() => navigate("/blog")}
          variant="outline" 
          className="w-full md:w-fit mt-auto text-[#347EFF] border-[#347EFF] border-[1.5px] rounded-full py-2 px-4 text-[15px] sm:text-[16px] font-['Noto_Sans_KR'] cursor-pointer hover:bg-[#347EFF] hover:text-white transition-colors"
        >
          {shouldTranslate ? 
            <TranslateText text="Learn more about lifestyle in Tunisia" language={currentLanguage} /> : 
            "Learn more about lifestyle in Tunisia"
          }
        </Button>
      </div>
    </div>
  );
};

export default TipContent;
