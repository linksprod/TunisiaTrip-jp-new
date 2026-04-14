
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Home } from "lucide-react";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

const guestHouses = [
  {
    name: "Dar Ben Gacem",
    location: "Medina of Tunis, Tunisia",
    image: "/uploads/549c131b-140c-4a2b-a663-3d920f194f91.png",
    rating: 5,
  },
  {
    name: "Dar Fatma",
    location: "Sidi Bou Said, Tunis, Tunisia",
    image: "/uploads/cbd7751a-e460-45c8-847d-849a5ca51bcc.png",
    rating: 5,
  },
  {
    name: "Dar Ellama",
    location: "Bizerte, Tunisia",
    image: "/uploads/549c131b-140c-4a2b-a663-3d920f194f91.png",
    rating: 5,
  },
];

export function GuestHousesContent() {
  const { currentLanguage } = useTranslation();

  return (
    <div className="w-full max-w-[1588px] mx-auto px-5">
      <div className="mb-8">
        <span className="text-[#347EFF] font-inter text-lg block mb-2">
          <TranslateText text="Guest Houses & Riads" language={currentLanguage} />
        </span>
        <h1 className="text-[#1F1F20] font-inter text-3xl md:text-4xl font-bold">
          <TranslateText 
            text="Experience Authentic Tunisian Hospitality in Handpicked Guesthouses" 
            language={currentLanguage} 
          />
        </h1>
      </div>

      <div className="bg-[#F6F8FB] rounded-xl p-6 md:p-10 shadow-[0px_0px_0px_2px_rgba(0,0,0,0.05)] mb-10">
        <h2 className="text-[#1F1F20] font-inter text-2xl md:text-3xl font-medium capitalize mb-4">
          <TranslateText 
            text="Select Guest Houses in Tunisia's Historic Districts" 
            language={currentLanguage} 
          />
        </h2>
        <p className="text-[#1F1F20] font-inter text-base md:text-lg leading-relaxed">
          <TranslateText 
            text="Atlantis Travel Agency curates authentic guest house options such as Dar Ben Gacem in the heart of Medina of Tunis, blending traditional architecture with modern comforts. Enjoy personalized stays with local charm." 
            language={currentLanguage} 
          />
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guestHouses.map((house, index) => (
          <Card key={index} className="overflow-hidden">
            <img
              src={house.image}
              alt={house.name}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    <TranslateText text={house.location} language={currentLanguage} />
                  </p>
                  <h3 className="text-lg font-medium mt-1">
                    <TranslateText text={house.name} language={currentLanguage} />
                  </h3>
                </div>
                <Home className="h-5 w-5 text-[#347EFF]" />
              </div>
              <div className="flex mt-2">
                {Array.from({ length: house.rating }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                  </svg>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
