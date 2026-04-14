
import React from "react";
import { Button } from "@/components/ui/button";
import { useDeviceSize } from "@/hooks/use-mobile";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

const layoverCities = [{
  city: "Paris, France",
  airline: "Air France",
  logo: "/uploads/79a94578-0dc6-427f-8ff7-d3e23a03bb7d.png",
  airlineLogo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Air_France_Logo.svg",
  fromKoreaTime: "14Hrs 30 Mins",
  toTunisiaTime: "2 Hours",
  active: true
}, {
  city: "Doha, Qatar",
  airline: "Qatar Airways",
  logo: "/uploads/79a94578-0dc6-427f-8ff7-d3e23a03bb7d.png",
  airlineLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Qatar_Airways_Logo.svg/300px-Qatar_Airways_Logo.svg.png",
  fromKoreaTime: "14Hrs 30 Mins",
  toTunisiaTime: "2 Hours",
  active: false
}, {
  city: "Istanbul, Turkiye",
  airline: "Turkish Airlines",
  logo: "/uploads/79a94578-0dc6-427f-8ff7-d3e23a03bb7d.png",
  airlineLogo: "/uploads/6e55d8c2-7a0f-4614-b85b-e023f3789099.png",
  fromKoreaTime: "14Hrs 30 Mins",
  toTunisiaTime: "2 Hours",
  active: false
}, {
  city: "Dubai, UAE",
  airline: "Emirates",
  logo: "/uploads/79a94578-0dc6-427f-8ff7-d3e23a03bb7d.png",
  airlineLogo: "/uploads/7b6a6969-e5e2-426d-a054-10a4985a12a7.png",
  fromKoreaTime: "14Hrs 30 Mins",
  toTunisiaTime: "2 Hours",
  active: false
}];

export function TravelRoutes() {
  const {
    isMobile,
    isTablet
  } = useDeviceSize();
  const { currentLanguage } = useTranslation();

  const LocationCard = ({
    type,
    city,
    airport,
    status
  }: {
    type: "departure" | "arrival";
    city: string;
    airport: string;
    status: string;
  }) => <div className="flex-none w-[250px] flex flex-col items-center text-center border border-gray-200 rounded-lg p-6">
      <div className="w-[50px] h-[50px] mb-[15px] flex items-center justify-center">
        <img 
          src={type === "departure" 
            ? "https://upload.wikimedia.org/wikipedia/en/9/9e/Flag_of_Japan.svg" 
            : "https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Tunisia.svg"} 
          alt={`${type === "departure" ? "Japan" : "Tunisia"} Flag`} 
          className="w-full h-full rounded-full object-cover" 
        />
      </div>
      <div className="font-inter text-[18px] text-blue-500 mb-[10px]">
        <TranslateText 
          text={city}
          language={currentLanguage} 
        />
      </div>
      <div className="font-inter text-2xl font-bold text-gray-800 mb-5">
        <TranslateText 
          text={type === "departure" ? "Departure" : "Arrival"}
          language={currentLanguage} 
        />
      </div>
      <div className="mb-[15px] flex flex-col">
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <div className="font-inter text-sm text-gray-500">
            <TranslateText 
              text="Airport"
              language={currentLanguage} 
            />
          </div>
        </div>
        <div className="font-inter text-lg font-medium text-gray-800">
          <TranslateText 
            text={airport}
            language={currentLanguage} 
          />
        </div>
      </div>
      <div className="bg-[#F0F4FF] text-[#347EFF] px-4 py-2 rounded-[20px] text-sm mb-5">
        <TranslateText 
          text={status}
          language={currentLanguage} 
        />
      </div>
      <div className="w-full flex justify-center mt-4">
        <img 
          src={type === "arrival" ? "/uploads/2fbba722-8066-4b0a-83a5-2b1a5f5a148a.png" : "/uploads/e87632b4-7ea3-4ced-a3f2-c9ce81f18e2a.png"}
          alt="Airplane Icon" 
          className="w-24 h-24 object-contain"
        />
      </div>
    </div>;

  const LayoverCard = ({
    city,
    airline,
    airlineLogo,
    fromKoreaTime,
    toTunisiaTime,
    active
  }: {
    city: string;
    airline: string;
    airlineLogo: string;
    fromKoreaTime: string;
    toTunisiaTime: string;
    active: boolean;
  }) => <div className={`rounded-[10px] p-5 transition-all duration-300 ${active ? "bg-[#F0F7FF]" : "bg-[#F8FAFF]"} border border-gray-200 h-full`}>
      <div className="text-center sm:text-left">
        <div className="font-inter text-lg font-medium text-blue-500 mb-2">
          <TranslateText 
            text={active ? "Choose a Stop" : "Choose a Stop"}
            language={currentLanguage} 
          />
        </div>
        <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
          <div className="w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center overflow-hidden border border-gray-100">
            <img src={airlineLogo} alt={`${airline} Logo`} className="w-[32px] h-[32px] object-contain" />
          </div>
          <span className="font-inter text-lg font-medium text-gray-800">
            <TranslateText 
              text={city}
              language={currentLanguage} 
            />
          </span>
        </div>
        <div className="font-inter text-2xl font-bold text-gray-800 mb-5">
          <TranslateText 
            text="Layover"
            language={currentLanguage} 
          />
        </div>
        
        <div className="flex flex-col gap-[15px]">
          <div className="flex items-center gap-[10px]">
            <span className="flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="9" stroke="#347EFF" strokeWidth="2" />
                <circle cx="10" cy="10" r="5" fill="#347EFF" />
              </svg>
            </span>
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span className="font-inter text-sm text-gray-600">
                <TranslateText 
                  text={`From Japan: ${fromKoreaTime}`}
                  language={currentLanguage} 
                />
              </span>
            </div>
          </div>
          <div className="flex items-center gap-[10px]">
            <span className="flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="9" stroke="#347EFF" strokeWidth="2" />
                <circle cx="10" cy="10" r="5" fill="#347EFF" />
              </svg>
            </span>
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span className="font-inter text-sm text-gray-600">
                <TranslateText 
                  text={`To Tunisia: ${toTunisiaTime}`}
                  language={currentLanguage} 
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>;

  return <div className="mb-10">
      <div className="text-[#347EFF] font-inter text-[21px] mb-[10px]">
        <TranslateText 
          text="Flights"
          language={currentLanguage} 
        />
      </div>
      <div className="relative mb-5">
        <h2 className="text-[#1F1F20] font-inter text-[36px] md:text-[28px] sm:text-[24px] font-bold mb-5">
          <TranslateText 
            text="The Main 4 Routes to Travel from Japan to Tunisia"
            language={currentLanguage} 
          />
        </h2>
        <Button 
          onClick={() => window.dispatchEvent(new Event('openChat'))}
          className={`bg-[#347EFF] text-white font-['Noto_Sans_KR'] text-[21px] px-[25px] py-[9px] rounded-[37px] cursor-pointer hover:bg-blue-600 transition-colors
            ${isMobile ? 'w-full mb-5' : isTablet ? 'mb-5' : 'absolute top-0 right-0'}`}
        >
          <TranslateText 
            text="Need Help Booking?"
            language={currentLanguage} 
          />
        </Button>
      </div>

      <div className={`flex gap-5 mt-10 ${isMobile ? 'flex-col' : ''}`}>
        <LocationCard 
          type="departure" 
          city="Tokyo, Japan" 
          airport="Narita Airport (NRT)" 
          status="You are Here (n+1)" 
        />

        <div className={`flex-1 grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-5 px-2 ${isMobile ? 'px-0' : ''}`}>
          {layoverCities.map((city, index) => <LayoverCard key={index} city={city.city} airline={city.airline} airlineLogo={city.airlineLogo} fromKoreaTime={city.fromKoreaTime} toTunisiaTime={city.toTunisiaTime} active={city.active} />)}
        </div>

        <LocationCard 
          type="arrival" 
          city="Tunis, Tunisia" 
          airport="Tunis Carthage" 
          status="We are Waiting for You Here (2)" 
        />
      </div>

      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Noto+Sans_KR:wght@400;700&display=swap" rel="stylesheet" />
    </div>;
}
