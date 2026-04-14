
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Globe, ChevronDown, Menu, Home, Book, Briefcase } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useDeviceSize } from "@/hooks/use-mobile";
import { MobileNavbar } from "./MobileNavbar";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "sonner";
import { TranslateText } from "@/components/translation/TranslateText";
import { preloadImages } from "@/utils/imageUtils";
import { OptimizedImage } from "@/components/ui/optimized-image";

// Define the logo path constant to avoid repetition
const LOGO_PATH = "/uploads/b8d3011d-f5cd-4edd-b34e-9ef0827ba186.png";
const JP_FLAG_PATH = "/uploads/5d66739d-6d91-48f0-99e6-f5ec39df4306.png";
const TRAVEL_ICON_PATH = "/uploads/a64c161a-eae4-496a-b8ad-b352708d5a06.png";

export function Navbar(): JSX.Element {
  const { isMobile, isTablet } = useDeviceSize();
  const location = useLocation();
  const { currentLanguage, updateKey } = useTranslation();
  
  // Pre-load all critical images on component mount
  useEffect(() => {
    // Preload critical images using the utility function
    preloadImages([
      LOGO_PATH,
      JP_FLAG_PATH,
      TRAVEL_ICON_PATH
    ], { 
      priority: 'high' 
    });
    
    console.log("Navbar - Preloaded critical navigation images");
  }, []);
  
  useEffect(() => {
    console.log("Navbar - Current language:", currentLanguage, "Update key:", updateKey);
  }, [currentLanguage, updateKey]);
  
  const handleLanguageChange = (newLang: string) => {
    if (newLang === 'EN') {
      // Redirect to English site
      window.location.href = 'https://tunisiatrip.com/';
      return;
    }
    // JP is already the default, no action needed
  };
  
  if (isMobile) {
    return <MobileNavbar />;
  }
  
  return (
    <header className="w-full bg-white border-b border-gray-100 fixed top-0 left-0 right-0 z-[60] will-change-transform transform-gpu">
      <div className="container max-w-[1400px] mx-auto flex items-center justify-between h-16 px-4">
        {isTablet && (
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex text-[#347EFF] hover:text-blue-700 transition-colors mr-3" aria-label="Menu">
                <Menu size={16} className="text-[#347EFF]" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="pt-6 w-[280px] sm:w-[320px] z-[70]">
              <nav className="flex flex-col gap-2">
                <Link to="/" className="flex items-center mb-4">
                  <div className="h-7 w-[140px] relative">
                    <OptimizedImage 
                      src={LOGO_PATH}
                      alt="Tunisia Trip Logo" 
                      className="h-7 w-auto" 
                      priority={true}
                      persistent={true}
                      width={140}
                      height={28}
                    />
                  </div>
                </Link>
                <Link 
                  to="/" 
                  className="flex items-center gap-3 py-2 border-b border-gray-100 text-[15px] transition-colors text-gray-700 hover:text-[#347EFF] font-inter"
                >
                  <Home size={16} className="text-[#347EFF] opacity-70" />
                  <TranslateText key={`home-${updateKey}`} text="Home" language={currentLanguage} />
                </Link>
                <Link 
                  to="/about" 
                  className="flex items-center gap-3 py-2 border-b border-gray-100 text-[15px] transition-colors text-gray-700 hover:text-[#347EFF] font-inter"
                >
                  <TranslateText key={`learn-tunisia-${updateKey}`} text="Learn about Tunisia" language={currentLanguage} />
                </Link>
                <Link 
                  to="/travel" 
                  className="flex items-center gap-3 py-2 border-b border-gray-100 text-[15px] transition-colors text-gray-700 hover:text-[#347EFF] font-inter"
                >
                  <TranslateText key={`travel-info-${updateKey}`} text="Travel Information" language={currentLanguage} />
                </Link>
                <Link 
                  to="/blog" 
                  className="flex items-center gap-3 py-2 border-b border-gray-100 text-[15px] transition-colors text-gray-700 hover:text-[#347EFF] font-inter"
                >
                  <Book size={16} className="text-[#347EFF] opacity-70" />
                  <TranslateText key={`blog-${updateKey}`} text="Blog" language={currentLanguage} />
                </Link>
                <Link 
                  to="/atlantis" 
                  className="flex items-center gap-3 py-2 border-b border-gray-100 text-[15px] transition-colors text-gray-700 hover:text-[#347EFF] font-inter"
                >
                  <Briefcase size={16} className="text-[#347EFF] opacity-70" />
                  <TranslateText key={`atlantis-${updateKey}`} text="Atlantis" language={currentLanguage} />
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        )}
        
        <Link to="/" className="flex items-center">
          <div className="h-7 w-[140px] relative">
            <OptimizedImage 
              src={LOGO_PATH}
              alt="Tunisia Trip Logo" 
              className="h-7 w-auto" 
              priority={true}
              persistent={true}
              width={140}
              height={28}
            />
          </div>
        </Link>
        
        <nav className={`hidden ${!isTablet ? 'lg:flex' : ''} items-center justify-center space-x-6 mx-auto`}>
          <Link 
            to="/" 
            className={`flex items-center gap-2 transition-colors ${
              location.pathname === '/' ? 'text-[#347EFF]' : 'text-gray-700 hover:text-[#347EFF]'
            }`}
          >
            <Home size={16} className="text-[#347EFF] opacity-70" />
            <span className="text-[14px] font-inter">
              <TranslateText key={`home-${updateKey}`} text="Home" language={currentLanguage} />
            </span>
          </Link>
          <Link 
            to="/about" 
            className={`flex items-center gap-2 transition-colors ${
              location.pathname === '/about' ? 'text-[#347EFF]' : 'text-gray-700 hover:text-[#347EFF]'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M15.4648 20.423L9.46484 18.323L5.50684 19.853C5.25084 19.9484 5.01318 19.9207 4.79384 19.77C4.57451 19.6194 4.46484 19.4074 4.46484 19.134V6.90403C4.46484 6.72536 4.50818 6.56236 4.59484 6.41503C4.68151 6.26769 4.80751 6.16536 4.97284 6.10803L9.46484 4.57703L15.4648 6.67703L19.4228 5.14703C19.6788 5.05169 19.9165 5.06969 20.1358 5.20103C20.3552 5.33236 20.4648 5.52836 20.4648 5.78903V18.173C20.4648 18.3644 20.4118 18.5304 20.3058 18.671C20.2005 18.8124 20.0585 18.9117 19.8798 18.969L15.4648 20.423ZM14.9648 19.203V7.50303L9.96484 5.75803V17.458L14.9648 19.203ZM15.9648 19.203L19.4648 18.05V6.20003L15.9648 7.50403V19.203ZM5.46484 18.8L8.96484 17.458V5.75803L5.46484 6.95003V18.8Z" fill="#347EFF"/>
            </svg>
            <span className="text-[14px] font-inter">
              <TranslateText key={`learn-tunisia-nav-${updateKey}`} text="Learn about Tunisia" language={currentLanguage} />
            </span>
          </Link>
          <Link 
            to="/travel" 
            className={`flex items-center gap-2 transition-colors ${
              location.pathname === '/travel' ? 'text-[#347EFF]' : 'text-gray-700 hover:text-[#347EFF]'
            }`}
          >
            <div className="w-[18px] h-[18px] flex items-center justify-center">
              <img 
                src={TRAVEL_ICON_PATH}
                alt="Travel icon" 
                className="w-[18px] h-[18px]" 
                loading="eager"
                width="18" 
                height="18"
                decoding="async"
              />
            </div>
            <span className="text-[14px] font-inter">
              <TranslateText key={`travel-info-nav-${updateKey}`} text="Travel Information" language={currentLanguage} />
            </span>
          </Link>
          <Link 
            to="/atlantis" 
            className={`flex items-center gap-2 transition-colors ${
              location.pathname === '/atlantis' ? 'text-[#347EFF]' : 'text-gray-700 hover:text-[#347EFF]'
            }`}
          >
            <Briefcase size={16} className="text-[#347EFF] opacity-70" />
            <span className="text-[14px] font-inter">
              <TranslateText key={`atlantis-${updateKey}`} text="Atlantis" language={currentLanguage} />
            </span>
          </Link>
          <Link 
            to="/blog" 
            className={`flex items-center gap-2 transition-colors ${
              location.pathname === '/blog' ? 'text-[#347EFF]' : 'text-gray-700 hover:text-[#347EFF]'
            }`}
          >
            <Book size={16} className="text-[#347EFF] opacity-70" />
            <span className="text-[14px] font-inter">
              <TranslateText key={`blog-${updateKey}`} text="Blog" language={currentLanguage} />
            </span>
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors text-[#347EFF] border border-gray-200">
              {currentLanguage === "JP" ? (
                <OptimizedImage 
                  src={JP_FLAG_PATH}
                  alt="Japanese flag" 
                  className="w-5 h-4 object-cover border border-gray-200 rounded-sm"
                  width={20} 
                  height={16}
                  persistent={true}
                  priority={true}
                />
              ) : (
                <img 
                  src="/flags/us.png" 
                  alt="US flag" 
                  className="w-6 h-4 object-cover border border-gray-200 rounded-sm"
                />
              )}
              <span className="text-[13px] font-inter font-medium">{currentLanguage}</span>
              <ChevronDown size={12} className="text-[#347EFF]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[140px] z-[70]">
              <DropdownMenuItem onClick={() => handleLanguageChange("EN")} className={currentLanguage === "EN" ? "bg-blue-50 text-[#347EFF]" : ""}>
                <span className="flex items-center gap-2">
                  <img 
                    src="/flags/us.png" 
                    alt="US flag" 
                    className="w-5 h-4 object-cover border border-gray-200 rounded-sm"
                  />
                  <span className="font-medium">
                    <TranslateText key={`en-english-${updateKey}`} text="EN (English)" language={currentLanguage} />
                  </span>
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange("JP")} className={currentLanguage === "JP" ? "bg-blue-50 text-[#347EFF]" : ""}>
                <span className="flex items-center gap-2">
                  <OptimizedImage 
                    src={JP_FLAG_PATH}
                    alt="Japanese flag" 
                    className="w-5 h-4 object-cover border border-gray-200 rounded-sm"
                    width={20} 
                    height={16}
                    persistent={true}
                  />
                  <span className="font-medium">
                    <TranslateText key={`jp-japanese-${updateKey}`} text="JP (日本語)" language={currentLanguage} />
                  </span>
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
