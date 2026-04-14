
import React from "react";
import { Button } from "@/components/ui/button";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export function AboutAtlantisContent() {
  const { currentLanguage } = useTranslation();
  const shouldTranslate = currentLanguage !== 'EN';
  
  return (
    <div id="atlantis-content">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-10">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
          {shouldTranslate ? 
            <TranslateText 
              text="Learn about Atlantis, your best companion for your next trip to Tunisia!" 
              language={currentLanguage} 
            /> : 
            "Learn about Atlantis, your best companion for your next trip to Tunisia!"
          }
        </h1>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
        <div className="mb-6">
          <img
            src="/uploads/4b6750cd-a4dc-435b-be65-8e7faa7d8960.png"
            alt="Atlantis Office Interior"
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            {shouldTranslate ? 
              <TranslateText 
                text="Explore Tunisia with Atlantis, Your Trusted Travel Partner Since 1991" 
                language={currentLanguage} 
              /> : 
              "Explore Tunisia with Atlantis, Your Trusted Travel Partner Since 1991"
            }
          </h3>
          
          <p className="text-base text-gray-600 leading-relaxed mb-4">
            {shouldTranslate ? 
              <TranslateText 
                text="Atlantis Travel started in 1991. Currently, we're working cooperatively with travel agencies in Korea and other parts of Asia and Europe. Since 2006, we have been the world's No.1 business travel management company with a global network of more than 150 countries around the world as Carlson Wagonlet Travel (CWT) Tunisia." 
                language={currentLanguage} 
              /> : 
              "Atlantis Travel started in 1991. Currently, we're working cooperatively with travel agencies in Korea and other parts of Asia and Europe. Since 2006, we have been the world's No.1 business travel management company with a global network of more than 150 countries around the world as Carlson Wagonlet Travel (CWT) Tunisia."
            }
          </p>
          
          <p className="text-base text-gray-600 leading-relaxed mb-4">
            {shouldTranslate ? 
              <TranslateText 
                text="Through travel consulting suitable for corporate travel regulations, we're proposing efficient programs. Every year, the number of tourists who come to Tunisia through Atlantis is increasing." 
                language={currentLanguage} 
              /> : 
              "Through travel consulting suitable for corporate travel regulations, we're proposing efficient programs. Every year, the number of tourists who come to Tunisia through Atlantis is increasing."
            }
          </p>
          
          <div className="mt-6">
            <Button 
              onClick={() => window.location.href = 'https://atlantis-voyages.com/'}
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto cursor-pointer"
            >
              {shouldTranslate ? 
                <TranslateText 
                  text="Learn More About Atlantis" 
                  language={currentLanguage} 
                /> : 
                "Learn More About Atlantis"
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
