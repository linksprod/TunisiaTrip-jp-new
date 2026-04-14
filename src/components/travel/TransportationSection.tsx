
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plane, Car, Navigation, Bus, Train, Ship } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { useSearchParams } from "react-router-dom";

interface TransportMode {
  id: number;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  name: string;
  title: string;
  description: string;
  image?: string;
}

const transportModes: TransportMode[] = [
  {
    id: 1,
    icon: <Plane className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    name: "Domestic Aviation",
    title: "Domestic Aviation with Tunisair",
    description: "The largest airport is Tunis-Carthage International Airport, named after the ancient Roman city of Carthage. It offers daily flights to dozens of major European cities and operates efficient domestic flights connecting major cities such as Tunis, Djerba, and Monastir.",
    image: "/uploads/ac3256b2-ef44-42d4-bdd0-7e70e4b9da3f.png"
  },
  {
    id: 2,
    icon: <Car className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />,
    iconColor: "text-green-500",
    iconBg: "bg-green-50",
    name: "Car Rent",
    title: "Car Rental Services",
    description: "Explore Tunisia freely by renting a car. Most road signs are bilingual in Arabic and French. Note that parking spaces can be limited and roads are often narrow, which may be challenging for first-time visitors. We recommend careful planning for your self-driving experience.",
    image: "/uploads/8ea83e05-b340-41c9-81da-f416ebb93e0e.png"
  },
  {
    id: 3,
    icon: <Navigation className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />,
    iconColor: "text-yellow-500",
    iconBg: "bg-yellow-50",
    name: "Taxi",
    title: "Taxi Services",
    description: "Tunisian taxis are easily identifiable by their yellow color. Look for the light indicator: red means available, green means occupied. Fares are approximately one-tenth of Korean taxi prices. A night surcharge applies from 9 PM to 5 AM. For added convenience, the 'Bolt' app offers taxi services at a slightly higher rate but with enhanced comfort.",
    image: "/uploads/97b3f2a9-b284-4e18-82c3-189fcad180d9.png"
  },
  {
    id: 4,
    icon: <Bus className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-50",
    name: "Louage",
    title: "Louage - Shared Minibus Service",
    description: "Louage is an intercity shared minibus service with fixed routes and fares. Each vehicle departs when all 8 seats are filled. Main stations include: Beb Alioua Station (Southwest - Hammamet, Nabeul), Beb Saadoun Station (North - Bizerte, Tabarka), and Moncef Bey Station (South - Sousse, Sfax, Djerba).",
    image: "/uploads/8d8f295a-2175-4f00-bd24-9daf31db564e.png"
  },
  {
    id: 5,
    icon: <Train className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />,
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-50",
    name: "Train & Metro",
    title: "Rail Transportation",
    description: "Tunis offers a comprehensive Metro light rail system with six lines connecting throughout the city center. Fares vary by distance but average around 2 TND. The TGM tram connects Tunis to popular tourist destinations like Carthage, Sidi Bou Said, and La Marsa. Intercity train services are also available to suburban areas.",
    image: "/uploads/232e232c-2c00-48cb-85c7-18566817152a.png"
  },
  {
    id: 6,
    icon: <Ship className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />,
    iconColor: "text-cyan-500",
    iconBg: "bg-cyan-50",
    name: "Ferry",
    title: "Ferry Services",
    description: "Tunisia offers ferry connections to European destinations including Italy and France. Domestic ferry services connect to popular tourist islands like Djerba and Kerkena. Regular routes operate from Sfax Port to Kerkena and from Zarzis Port in the south to Djerba.",
    image: "/uploads/e3a98202-682c-40c9-b749-02e60494e047.png"
  }
];

export function TransportationSection() {
  const [activeMode, setActiveMode] = useState(0);
  const { currentLanguage } = useTranslation();
  const [searchParams] = useSearchParams();
  
  // Check for mode parameter on load
  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam) {
      const modeIndex = parseInt(modeParam);
      if (!isNaN(modeIndex) && modeIndex >= 1 && modeIndex <= 6) {
        setActiveMode(modeIndex - 1); // Convert to 0-based index
      }
    }
  }, [searchParams]);

  const nextMode = () => {
    setActiveMode(prev => (prev + 1) % transportModes.length);
  };

  const prevMode = () => {
    setActiveMode(prev => (prev - 1 + transportModes.length) % transportModes.length);
  };

  return <div id="transportation" className="max-w-[1585px] mx-auto w-full p-5 sm:p-[20px] bg-white shadow-[0px_0px_0px_1.948px_rgba(0,0,0,0.05)] rounded-[10px] box-border">
      <div className="flex flex-col items-start mb-5 sm:mb-[20px]">
        <span className="text-[#347EFF] font-inter text-[21px] mb-[10px]">
          <TranslateText text="Transportation" language={currentLanguage} />
        </span>
        <h2 className="text-[#1F1F20] font-inter text-2xl sm:text-3xl md:text-[36px] font-bold">
          <TranslateText text="Means of Transportation in Tunisia" language={currentLanguage} />
        </h2>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-8">
        {transportModes.map((mode, index) => <div key={mode.id} onClick={() => setActiveMode(index)} className={`flex flex-col items-center cursor-pointer group ${activeMode === index ? 'pointer-events-none' : ''}`}>
            <div className={`p-3 md:p-4 rounded-full ${mode.iconBg} text-[#347EFF] 
                           w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-2 
                           transition-all duration-300 group-hover:scale-110 
                           ${activeMode === index ? 'ring-2 ring-offset-2 ring-[#347EFF]' : ''}`}>
              {mode.icon}
            </div>
            <span className={`text-sm md:text-base text-center transition-colors duration-300
                          ${activeMode === index ? 'text-[#347EFF] font-medium' : 'text-gray-600'}`}>
              <TranslateText text={mode.name} language={currentLanguage} />
            </span>
          </div>)}
      </div>

      <div className="flex justify-between items-center flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[702px] flex flex-col justify-center">
          <div className="relative mb-5 pl-8 border-l-4 border-[#347EFF]">
            <h3 className="text-[#1F1F20] font-inter text-2xl sm:text-[35.5859px]">
              <TranslateText text={transportModes[activeMode].title} language={currentLanguage} />
            </h3>
          </div>
          <p className="text-[#1F1F20] font-inter text-lg sm:text-[21px] leading-[26px]">
            <TranslateText text={transportModes[activeMode].description} language={currentLanguage} />
          </p>
        </div>

        {transportModes[activeMode].image && <div className="w-full lg:w-[691px] overflow-hidden rounded-[10.681px]">
            <AspectRatio ratio={16 / 9} className="bg-muted">
              <img 
                src={transportModes[activeMode].image} 
                alt={transportModes[activeMode].name} 
                className="w-full h-full object-cover" 
                loading="lazy" 
                style={{ width: '100%', height: '100%', maxHeight: '400px' }}
              />
            </AspectRatio>
          </div>}
      </div>
    </div>;
}
