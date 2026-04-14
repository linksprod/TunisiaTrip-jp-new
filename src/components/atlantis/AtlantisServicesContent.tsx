
import React, { useState } from "react";
import { CarFront, BusFront, Bus } from "lucide-react";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface VehicleInfo {
  label: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  capacity: string;
  image: string;
}

export function AtlantisServicesContent() {
  const [activeVehicle, setActiveVehicle] = useState<string>("Car");
  const { currentLanguage } = useTranslation();

  const vehicles: VehicleInfo[] = [
    {
      label: "Car",
      icon: <CarFront className="w-12 h-12 sm:w-8 sm:h-8 md:w-10 md:h-10" />,
      title: "Private Chauffeur-Driven Car Service",
      description:
        "Premium private car service offering personalized transportation solutions. Professional drivers ensure seamless transfers between airports, hotels, and business locations with precision and comfort.",
      capacity: "Accommodates 1-4 passengers",
      image: "/uploads/c869feca-e9bf-46a9-af0b-ce79d63c5985.png",
    },
    {
      label: "Mini-Bus",
      icon: <BusFront className="w-12 h-12 sm:w-8 sm:h-8 md:w-10 md:h-10" />,
      title: "Mini-Bus Transportation Service",
      description:
        "Specialized mini-bus transportation designed for group mobility, offering efficient and comfortable travel solutions. Perfect for corporate workshops, family outings, and specialized tours with professional driver support.",
      capacity: "Accommodates up to 22 passengers",
      image: "/uploads/3321b85a-2390-4dc9-a1c9-cc87dbe3d858.png",
    },
    {
      label: "Bus",
      icon: <Bus className="w-12 h-12 sm:w-8 sm:h-8 md:w-10 md:h-10" />,
      title: "Large Group Bus Service",
      description:
        "Premium group travel experience with our medium-sized buses, providing spacious and comfortable transportation. Designed to deliver smooth, efficient transit for larger groups with a focus on passenger comfort.",
      capacity: "Accommodates up to 53 passengers",
      image: "/uploads/3fb06924-f876-4ad3-a081-ed9b0aa893b7.png",
    },
    {
      label: "Van",
      icon: <CarFront className="w-12 h-12 sm:w-8 sm:h-8 md:w-10 md:h-10" />,
      title: "VIP Van Service",
      description:
        "Luxury transportation for distinguished clients attending high-profile international events and corporate functions. Offering exceptional protocol, professional drivers, and tailored service for discerning travelers.",
      capacity: "Accommodates up to 8 passengers",
      image: "/uploads/46d9154c-784b-4475-9d6b-2fa0b02f357f.png",
    },
  ];

  const currentVehicle = vehicles.find(v => v.label === activeVehicle) || vehicles[0];

  return (
    <div className="w-full max-w-[1588px] mx-auto px-5">
      <div className="mb-8">
        <h1 className="text-[#1F1F20] font-inter text-3xl md:text-4xl font-bold">
          <TranslateText 
            text="Explore Our Range of Travel Solutions and Premium Transportation Services" 
            language={currentLanguage} 
          />
        </h1>
      </div>

      <img 
        src="/uploads/1693354f-b1c4-411e-ad5c-2f34654b0b80.png" 
        alt="Mini-Bus Image" 
        className="w-full rounded-lg shadow-[0px_0px_15px_2px_rgba(0,0,0,0.05)] mb-10" 
      />

      <div className="bg-[#F6F8FB] rounded-xl p-6 md:p-10 shadow-[0px_0px_0px_2px_rgba(0,0,0,0.05)] mb-10">
        <h2 className="text-[#1F1F20] font-inter text-2xl md:text-3xl font-medium capitalize mb-4">
          <TranslateText 
            text="Premium Transport Services by Atlantis Voyages" 
            language={currentLanguage} 
          />
        </h2>
        <p className="text-[#1F1F20] font-inter text-base md:text-lg leading-relaxed">
          <TranslateText 
            text="Atlantis Voyages provides tailored transport solutions, including private vehicles for VIPs and business trips, minibuses for small groups and family outings, spacious buses for large group travel, and luxury cars for high-profile events. Whether for comfort, convenience, or elegance, we have the perfect option to meet your needs." 
            language={currentLanguage} 
          />
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-10">
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {vehicles.map(vehicle => (
              <div 
                key={vehicle.label} 
                onClick={() => setActiveVehicle(vehicle.label)} 
                className="group cursor-pointer transition-all duration-300 ease-in-out"
              >
                <div className={`aspect-square rounded-2xl mb-3 flex items-center justify-center border-2 transition-all duration-300 ${
                  vehicle.label === activeVehicle ? "border-[#FBC179] bg-white shadow-lg scale-105" : "border-[#EDF3FE] group-hover:border-[#FBC179]/50 group-hover:scale-105"
                }`}>
                  {React.cloneElement(vehicle.icon as React.ReactElement, {
                    className: `w-8 h-8 transition-all duration-300 ${
                      vehicle.label === activeVehicle ? "text-[#FBC179]" : "text-gray-400 group-hover:text-[#FBC179]/50"
                    }`
                  })}
                </div>
                <span className={`block text-center font-inter text-xs sm:text-sm transition-all duration-300 ${
                  vehicle.label === activeVehicle ? "text-[#1F1F20] font-semibold" : "text-gray-500 group-hover:text-[#1F1F20]"
                }`}>
                  <TranslateText text={vehicle.label} language={currentLanguage} />
                </span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-1 h-12 bg-[#347EFF] rounded-full" />
              <h3 className="text-[#1F1F20] font-inter text-3xl font-medium">
                <TranslateText text={currentVehicle.title} language={currentLanguage} />
              </h3>
            </div>

            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-[#EDF3FE] text-[#347EFF] rounded-full font-inter text-sm font-medium">
                <TranslateText text={currentVehicle.capacity} language={currentLanguage} />
              </span>
            </div>

            <p className="text-[#1F1F20]/80 font-inter text-lg leading-relaxed mb-8 whitespace-pre-line">
              <TranslateText text={currentVehicle.description} language={currentLanguage} />
            </p>

            <button 
              onClick={() => window.location.href = 'https://atlantis-voyages.com/#contact'}
              className="w-full sm:w-auto px-8 py-4 bg-[#347EFF] text-white font-inter font-medium rounded-xl hover:bg-[#347EFF]/90 transition-colors duration-300 shadow-sm cursor-pointer"
            >
              <TranslateText text="Request More Information" language={currentLanguage} />
            </button>
          </div>
        </div>

        <div className="relative rounded-xl overflow-hidden shadow-lg h-[600px]">
          <img 
            src={currentVehicle.image} 
            alt={`${currentVehicle.label} Service`} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h4 className="text-white font-inter text-2xl font-medium mb-2">
              <TranslateText text={currentVehicle.title} language={currentLanguage} />
            </h4>
            <p className="text-white/80 font-inter">
              <TranslateText 
                text={`Perfect for ${currentVehicle.label.toLowerCase()} transportation needs`}
                language={currentLanguage} 
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
