
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export function MessageFromCeoContent() {
  const { currentLanguage } = useTranslation();
  
  return (
    <div className="w-full max-w-[1588px] mx-auto px-5">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        <div className="flex-1 bg-[#F6F8FB] rounded-xl p-6 md:p-10">
          <h2 className="text-[#1F1F20] font-inter text-2xl md:text-3xl font-medium mb-6">
            <TranslateText 
              text="Enriching The Quality Of Your Trips Through Our Services And Guidance"
              language={currentLanguage}
            />
          </h2>
          
          <p className="text-[#1F1F20] font-inter text-base md:text-lg leading-relaxed mb-10">
            <TranslateText 
              text="We invite you to Tunisia, famous for its rich history and friendly people. Tunisia is adjacent to France and Italy, It serves as a bridge between Africa and Europe. Atlantis is based on a sincere heart and many years of experience. Tunisia's beautiful natural environment, deep history, and dynamic present We will guide you on the best trip. We look forward to seeing you soon in beautiful Tunisia."
              language={currentLanguage}
            />
          </p>
          
          <div className="text-xl md:text-2xl text-black">
            <p>
              <TranslateText text="Atlantis Agency" language={currentLanguage} />
            </p>
            <p>
              <TranslateText text="Representative & CEO," language={currentLanguage} />
            </p>
            <p className="font-bold">Kamel Lagha</p>
          </div>
        </div>

        <div className="w-full md:w-[400px] h-[200px] md:h-[400px] flex-shrink-0">
          <img
            src="/uploads/3f34fd48-7842-479e-9fc4-24e87660235a.png"
            alt="CEO Kamel Lagha"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>

      <Button 
        onClick={() => window.location.href = 'https://atlantis-voyages.com/#services'}
        variant="ghost"
        className="text-[#347EFF] hover:text-blue-600 px-0 mt-6 text-lg group hidden md:inline-flex items-center cursor-pointer"
      >
        <TranslateText text="Learn More About Atlantis Services" language={currentLanguage} />
        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
