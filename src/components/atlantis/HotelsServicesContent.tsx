
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Hotel } from "lucide-react";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

const hotels = [
  {
    name: "Four Seasons Hotel",
    location: "Tunis, Tunisia",
    image: "/uploads/31fa750b-9618-4556-9aa2-c9b62cf3b480.png",
    rating: 5,
  },
  {
    name: "Anantara Tozeur",
    location: "Tozeur, Tunisia",
    image: "/uploads/7848de0b-5463-4416-ae56-7922714a447b.png",
    rating: 5,
  },
  {
    name: "Movenpick Sousse",
    location: "Sousse, Tunisia",
    image: "/uploads/d5b362eb-773a-485d-aa39-67eff2ccf55e.png",
    rating: 5,
  },
  {
    name: "The Residence Tunis",
    location: "Tunis, Tunisia",
    image: "/uploads/4de6ef16-ca24-431b-899d-e5c7cf11c73c.png",
    rating: 5,
  },
  {
    name: "Le Kasbah Kairouan",
    location: "Kairouan, Tunisia",
    image: "/uploads/4fdc3022-820b-4653-8401-6d31df53747b.png",
    rating: 5,
  },
  {
    name: "Pansy KSAR Ghilene",
    location: "Ghilene, Tunisia",
    image: "/uploads/53341fca-0b8d-47ff-a07c-7a30290c0170.png",
    rating: 5,
  },
];

export function HotelsServicesContent() {
  const { currentLanguage } = useTranslation();
  
  return (
    <div className="w-full max-w-[1588px] mx-auto px-5">
      <div className="mb-8">
        <span className="text-[#347EFF] font-inter text-lg block mb-2">
          <TranslateText text="Hotels & Guest Houses" language={currentLanguage} />
        </span>
        <h1 className="text-[#1F1F20] font-inter text-3xl md:text-4xl font-bold">
          <TranslateText 
            text="A Variety of Accommodation Solutions Through Trusted Partners" 
            language={currentLanguage} 
          />
        </h1>
      </div>

      <div className="bg-[#F6F8FB] rounded-xl p-6 md:p-10 shadow-[0px_0px_0px_2px_rgba(0,0,0,0.05)] mb-10">
        <h2 className="text-[#1F1F20] font-inter text-2xl md:text-3xl font-medium capitalize mb-4">
          <TranslateText 
            text="Premium Hotel Booking Services In Tunisia" 
            language={currentLanguage} 
          />
        </h2>
        <p className="text-[#1F1F20] font-inter text-base md:text-lg leading-relaxed">
          <TranslateText 
            text="Atlantis Travel Agency offers premium hotel bookings in Tunisia, with luxury options in cities like Tunis and Sousse, and historic sites like Kairouan and Douz. Partnering with top brands like Four Seasons Tunis, Anantara Tozeur, Movenpick Sousse, and The Residence Tunis, we ensure a comfortable stay for both business and leisure travelers." 
            language={currentLanguage} 
          />
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel, index) => (
          <Card key={index} className="overflow-hidden">
            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-64 object-cover"
            />
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    <TranslateText text={hotel.location} language={currentLanguage} />
                  </p>
                  <h3 className="text-lg font-medium mt-1">
                    <TranslateText text={hotel.name} language={currentLanguage} />
                  </h3>
                </div>
                <Hotel className="h-5 w-5 text-[#347EFF]" />
              </div>
              <div className="flex mt-2">
                {Array.from({ length: hotel.rating }).map((_, i) => (
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
