
import React from "react";
import { ArrowLeft, ArrowRight, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

const festivals = [{
  image: "/uploads/307f0f8d-8403-4efc-bd7e-d982d895749e.png",
  type: "Winter Festival",
  title: "JCC Carthage Film Festival",
  description: `The country's official name is the Republic of Tunisia, or "Tunis" in the Tunisian Arabic dialect. The meaning behind this name originates from the word "Tawannas"...`
}, {
  image: "/uploads/1583aea5-f593-41bd-88e8-3208bd08b542.png",
  type: "Winter Festival",
  title: "Douz Sahara International Festival",
  description: "Known as the 'Gateway to the Sahara', Douz hosts a spectacular international festival showcasing traditional Saharan horse riding, cultural performances, and the rich heritage of desert communities. Witness breathtaking equestrian displays that highlight the connection between humans and horses in this unique desert landscape."
}, {
  image: "/uploads/a581f055-2a12-41d9-9874-a0757aee2f40.png",
  type: "Winter Festival",
  title: "Tozeur International Oasis Festival",
  description: "Tozeur, a stunning oasis town known for its unique architecture and desert landscapes, hosts an international festival celebrating the cultural richness of Tunisia's desert regions. Experience traditional music, crafts, and performances that showcase the vibrant life of oasis communities."
}];

export const WinterFestivals = () => {
  const { currentLanguage } = useTranslation();
  
  return <section className="mt-16 mb-12">
      <div className="bg-[#F9F9F9] rounded-lg p-6 sm:p-8">
        <div className="text-blue-500 mb-2">
          <TranslateText text="Festivals" language={currentLanguage} />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h2 className="text-[#1B2F3D] text-2xl sm:text-3xl font-bold">
            <TranslateText text="Winter Festivals in Tunisia" language={currentLanguage} />
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {festivals.map((festival, index) => <div key={index} className="bg-white rounded-lg overflow-hidden border border-gray-100">
              <img src={festival.image} alt={festival.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="text-blue-500 mb-2">
                  <TranslateText text={festival.type} language={currentLanguage} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  <TranslateText text={festival.title} language={currentLanguage} />
                </h3>
                <p className="text-gray-600 mb-4">
                  <TranslateText text={festival.description} language={currentLanguage} />
                </p>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};
