import React, { useState, useEffect, useRef } from "react";
import { Users, Plane, Building, GraduationCap, Award, Map } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { preloadImages } from "@/utils/imageUtils";

export function StatisticsSection() {
  const navigate = useNavigate();
  const { currentLanguage } = useTranslation();
  const [activeInfo, setActiveInfo] = useState<string>("population"); // Set population as default
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [populationImageLoaded, setPopulationImageLoaded] = useState(false);
  const initialLoadAttempted = useRef(false);
  
  const statisticsData = [
    {
      id: "population",
      icon: <Users className="h-8 w-8" />,
      value: "12+M",
      label: "Population",
      bgColor: "bg-blue-500",
      textColor: "text-white",
      hoverColor: "hover:bg-blue-600",
      detailTitle: "Population",
      detailText: "Tunisia has over 12 million citizens, with a rich diversity of cultural backgrounds and traditions spread across its coastal cities and inland regions."
    },
    {
      id: "tourists",
      icon: <Plane className="h-8 w-8 text-blue-500" />,
      value: "10M",
      label: "Tourists in 2024",
      bgColor: "bg-white",
      textColor: "text-gray-900",
      hoverColor: "hover:shadow-md",
      detailTitle: "Tourists in 2024",
      detailText: "Tunisia has seen a significant recovery in tourism with 10 million international visitors in 2024, drawn to its beautiful beaches, historical sites, and desert experiences."
    },
    {
      id: "historic",
      icon: <Building className="h-8 w-8 text-blue-500" />,
      value: "700",
      label: "Historic Sites",
      bgColor: "bg-white",
      textColor: "text-gray-900",
      hoverColor: "hover:shadow-md",
      detailTitle: "Historic Sites",
      detailText: "Tunisia boasts over 700 historical sites spanning Phoenician, Roman, Byzantine, Arab and Ottoman eras, including the ancient city of Carthage and the amphitheater of El Jem."
    },
    {
      id: "university",
      icon: <GraduationCap className="h-8 w-8 text-blue-500" />,
      value: "1st",
      label: "University in History",
      bgColor: "bg-white",
      textColor: "text-gray-900",
      hoverColor: "hover:shadow-md",
      detailTitle: "University in History",
      detailText: "Tunisia is home to the Ez-Zitouna University, established in 737 AD, recognized as one of the oldest universities in the world and the first in the Arab world."
    },
    {
      id: "unesco",
      icon: <Award className="h-8 w-8 text-blue-500" />,
      value: "9",
      label: "UNESCO Recognized",
      bgColor: "bg-white",
      textColor: "text-gray-900",
      hoverColor: "hover:shadow-md",
      detailTitle: "UNESCO Recognized",
      detailText: "Tunisia proudly hosts 9 UNESCO World Heritage sites, including the ancient ruins of Carthage, the medinas of Tunis and Sousse, and the amphitheater of El Jem."
    },
    {
      id: "landarea",
      icon: <Map className="h-8 w-8 text-blue-500" />,
      value: "164K km²",
      label: "Land Area",
      bgColor: "bg-white",
      textColor: "text-gray-900",
      hoverColor: "hover:shadow-md",
      detailTitle: "Land Area",
      detailText: "Tunisia covers 164,000 square kilometers, featuring diverse landscapes from Mediterranean beaches to the northern mountains and the Sahara Desert in the south."
    }
  ];

  // Define illustrations with the population one first for priority
  const illustrations = {
    population: "/uploads/44101cc8-fa72-4b3f-bd5f-aaf7b31185be.png",
    tourists: "/uploads/6cb11651-d5dc-47a3-ba8c-2b563eaa9b25.png", // Colorful tourist illustration
    historic: "/uploads/67395cf4-21f5-4090-8626-50a7e2d78022.png", // Historic sites illustration
    university: "/uploads/2c67e89f-e389-4963-814d-d3176f543d56.png", // University image with books
    unesco: "/uploads/58b21545-9c98-4989-a04e-7b8126cd4855.png", // New UNESCO image
    landarea: "/uploads/0e39366d-1fa3-4b06-bf5a-79b16b3bc3b8.png"  // Updated Land area image with new upload
  };

  // Explicitly preload all images when component mounts
  useEffect(() => {
    // First load high-priority population image
    if (!initialLoadAttempted.current) {
      initialLoadAttempted.current = true;
      console.log("Loading population image immediately");
      
      // Create and directly append the image to the DOM to ensure it loads
      const populationImg = new Image();
      populationImg.onload = () => {
        console.log("Population image loaded successfully in StatisticsSection");
        setPopulationImageLoaded(true);
      };
      populationImg.onerror = (e) => {
        console.error("Failed to load population image in StatisticsSection:", e);
      };
      populationImg.src = illustrations.population;
      
      // Force browser to load the image by briefly appending it to DOM
      document.body.appendChild(populationImg);
      populationImg.style.position = 'absolute';
      populationImg.style.width = '1px';
      populationImg.style.height = '1px';
      populationImg.style.opacity = '0';
      populationImg.style.pointerEvents = 'none';
      
      // Preload all other images
      const allImages = Object.values(illustrations);
      console.log("Preloading all statistics images:", allImages);
      preloadImages(allImages, { 
        onComplete: () => {
          console.log("All statistics images preloaded successfully in component");
          setImagesLoaded(true);
        }
      });
    }
  }, []);
  
  const handleStatisticClick = (id: string) => {
    setActiveInfo(id);
  };
  
  // Render the illustration based on the selected statistic
  const renderIllustration = (id: string) => {
    const imageUrl = illustrations[id as keyof typeof illustrations];
    console.log(`Rendering illustration for ${id} with URL: ${imageUrl}`);
    
    return (
      <div className="mt-8 bg-[#F6F8FB] rounded-xl overflow-hidden">
        <img 
          src={imageUrl} 
          alt={`Illustration for ${id}`}
          className="w-full h-64 sm:h-72 md:h-80 object-cover"
          loading="eager"
          onLoad={() => console.log(`Image for ${id} loaded successfully in UI`)}
          onError={(e) => {
            console.error(`Failed to load image for ${id} in UI:`, e);
            // Fallback if image fails to load
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
      </div>
    );
  };
  
  const activeStatistic = statisticsData.find(stat => stat.id === activeInfo);
  
  // Pre-render the hidden population image to ensure it's loaded
  const hiddenPopulationImage = (
    <div style={{ display: 'none', position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <img 
        src={illustrations.population}
        alt="Hidden population image"
        onLoad={() => console.log("Hidden population image loaded in DOM")}
        onError={(e) => console.error("Failed to load hidden population image in DOM", e)}
      />
    </div>
  );
  
  return (
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm">
      {/* Hidden image preloader */}
      {hiddenPopulationImage}
      
      {/* Main content */}
      <div className="p-6 md:p-8">
        <div className="text-blue-500 text-sm mb-2">
          <TranslateText text="General Knowledge" language={currentLanguage} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-10">
          <TranslateText text="Learn About Tunisia in Numbers" language={currentLanguage} />
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {statisticsData.map((stat) => (
            <button 
              key={stat.id}
              className={`${stat.bgColor} rounded-lg p-4 text-center ${stat.textColor} ${stat.hoverColor} transition-colors cursor-pointer ${activeInfo === stat.id ? 'ring-2 ring-blue-400' : ''} min-w-0 w-full`}
              onClick={() => handleStatisticClick(stat.id)}
            >
              <div className="flex justify-center mb-3">
                {stat.icon}
              </div>
              <div className="text-xl md:text-2xl font-bold whitespace-nowrap">{stat.value}</div>
              <div className="text-sm opacity-90 line-clamp-2 min-h-[2.5rem]">
                <TranslateText text={stat.label} language={currentLanguage} />
              </div>
            </button>
          ))}
        </div>
        
        {/* Information card for the selected statistic */}
        {activeStatistic && (
          <div className="mt-10 animate-fadeIn">
            {renderIllustration(activeStatistic.id)}
            <h3 className="text-2xl font-bold mt-6 text-gray-900">
              <TranslateText text={activeStatistic.detailTitle} language={currentLanguage} />
            </h3>
            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              <TranslateText text={activeStatistic.detailText} language={currentLanguage} />
            </p>
            <div className="mt-6 text-center">
              <button 
                className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
                onClick={() => navigate("/travel?tab=activities")}
              >
                <TranslateText text="Explore Tunisia" language={currentLanguage} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatisticsSection;
