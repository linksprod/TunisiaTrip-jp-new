
import React, { useState, useEffect } from "react";
import { X, Globe, Menu, Home, Book, Image, Briefcase, CarFront } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "sonner";
import { TranslateText } from "./translation/TranslateText";
import { preloadImages } from "@/utils/imageUtils";
import { OptimizedImage } from "@/components/ui/optimized-image";

// Define the logo path constant to avoid repetition
const LOGO_PATH = "/uploads/b8d3011d-f5cd-4edd-b34e-9ef0827ba186.png";
const JP_FLAG_PATH = "/uploads/5d66739d-6d91-48f0-99e6-f5ec39df4306.png";

export function MobileNavbar(): JSX.Element {
  const location = useLocation();
  const { currentLanguage } = useTranslation();
  
  // Preload critical images for mobile navigation
  useEffect(() => {
    // Preload critical images using the utility function
    preloadImages(
      [LOGO_PATH, JP_FLAG_PATH], 
      { priority: 'high' }
    );
    
    console.log("MobileNavbar - Preloaded critical navigation images");
  }, []);
  
  // Debug logs
  useEffect(() => {
    console.log("MobileNavbar - Current language:", currentLanguage);
  }, [currentLanguage]);
  
  const handleLanguageChange = (newLang: string) => {
    if (newLang === 'EN') {
      // Redirect to English site
      window.location.href = 'https://tunisiatrip.com/';
      return;
    }
    // JP is already the default, no action needed
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 fixed top-0 left-0 right-0 z-[60] transform-gpu will-change-transform">
      <div className="container mx-auto flex items-center justify-between h-14 px-3">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex items-center justify-center h-9 w-9 text-[#347EFF] hover:text-blue-700 transition-colors" aria-label="Menu">
                <Menu size={18} className="text-[#347EFF]" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="pt-5 w-[260px] sm:w-[300px] z-[70]">
              <div className="mb-3 flex items-center">
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
              </div>
              
              <nav className="flex flex-col gap-1">
                <Link 
                  to="/" 
                  className={`flex items-center gap-3 py-3 border-b border-gray-100 text-[14px] transition-colors hover:text-[#347EFF] font-inter ${
                    location.pathname === '/' ? 'text-[#347EFF]' : 'text-gray-700'
                  }`}
                >
                  <Home size={16} className="text-[#347EFF] opacity-70" />
                  <TranslateText text="Home" language={currentLanguage} />
                </Link>
                <Link 
                  to="/about" 
                  className={`flex items-center gap-3 py-3 border-b border-gray-100 text-[14px] transition-colors hover:text-[#347EFF] font-inter ${
                    location.pathname === '/about' ? 'text-[#347EFF]' : 'text-gray-700'
                  }`}
                >
                  <Image size={16} className="text-[#347EFF] opacity-70" />
                  <TranslateText text="Learn about Tunisia" language={currentLanguage} />
                </Link>
                <Link 
                  to="/travel" 
                  className={`flex items-center gap-3 py-3 border-b border-gray-100 text-[14px] transition-colors hover:text-[#347EFF] font-inter ${
                    location.pathname === '/travel' ? 'text-[#347EFF]' : 'text-gray-700'
                  }`}
                >
                  <CarFront size={16} className="text-[#347EFF] opacity-70" />
                  <TranslateText text="Travel Information" language={currentLanguage} />
                </Link>
                <Link 
                  to="/blog" 
                  className={`flex items-center gap-3 py-3 border-b border-gray-100 text-[14px] transition-colors hover:text-[#347EFF] font-inter ${
                    location.pathname === '/blog' ? 'text-[#347EFF]' : 'text-gray-700'
                  }`}
                >
                  <Book size={16} className="text-[#347EFF] opacity-70" />
                  <TranslateText text="Blog" language={currentLanguage} />
                </Link>
                <Link 
                  to="/blog" 
                  className={`flex items-center gap-3 py-3 border-b border-gray-100 text-[14px] transition-colors hover:text-[#347EFF] font-inter ${
                    location.pathname === '/blog' ? 'text-[#347EFF]' : 'text-gray-700'
                  }`}
                >
                  <Book size={16} className="text-[#347EFF] opacity-70" />
                  <TranslateText text="Blog" language={currentLanguage} />
                </Link>
                <Link 
                  to="/atlantis" 
                  className={`flex items-center gap-3 py-3 border-b border-gray-100 text-[14px] transition-colors hover:text-[#347EFF] font-inter ${
                    location.pathname === '/atlantis' ? 'text-[#347EFF]' : 'text-gray-700'
                  }`}
                >
                  <Briefcase size={16} className="text-[#347EFF] opacity-70" />
                  <TranslateText text="Atlantis" language={currentLanguage} />
                </Link>
                
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-gray-500 text-xs mb-2 font-inter flex items-center gap-2">
                    <Globe size={14} />
                    <TranslateText text="Select Language" language={currentLanguage} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => handleLanguageChange("EN")}
                      className={`text-left py-2 px-3 rounded-lg text-[13px] transition-colors font-medium ${currentLanguage === "EN" ? "bg-blue-50 text-[#347EFF]" : "text-gray-700 hover:bg-gray-50"}`}
                    >
                      <span className="flex items-center gap-2">
                        <img 
                          src="/flags/us.png" 
                          alt="US flag" 
                          className="w-5 h-4 object-cover border border-gray-200 rounded-sm"
                        />
                        <TranslateText text="EN (English)" language={currentLanguage} />
                      </span>
                    </button>
                    <button 
                      onClick={() => handleLanguageChange("JP")}
                      className={`text-left py-2 px-3 rounded-lg text-[13px] transition-colors font-medium ${currentLanguage === "JP" ? "bg-blue-50 text-[#347EFF]" : "text-gray-700 hover:bg-gray-50"}`}
                    >
                      <span className="flex items-center gap-2">
                        <OptimizedImage 
                          src={JP_FLAG_PATH}
                          alt="Japanese flag" 
                          className="w-5 h-4 object-cover border border-gray-200 rounded-sm"
                          width={20} 
                          height={16}
                          decoding="async"
                        />
                        <TranslateText text="JP (日本語)" language={currentLanguage} />
                      </span>
                    </button>
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          
          <Link to="/" className="flex items-center">
            <div className="h-6 w-[120px] relative">
              <OptimizedImage 
                src={LOGO_PATH}
                alt="Tunisia Trip Logo" 
                className="h-6 w-auto" 
                priority={true}
                persistent={true}
                width={120} 
                height={24}
              />
            </div>
          </Link>
        </div>
        
        <div className="flex items-center">
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
                />
              ) : (
                <img 
                  src="/flags/us.png" 
                  alt="US flag" 
                  className="w-5 h-4 object-cover border border-gray-200 rounded-sm"
                />
              )}
              <span className="text-[13px] font-inter font-medium">{currentLanguage}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[130px] z-[70]">
              <DropdownMenuItem onClick={() => handleLanguageChange("EN")} className={currentLanguage === "EN" ? "bg-blue-50 text-[#347EFF]" : ""}>
                <span className="flex items-center gap-2">
                  <img 
                    src="/flags/us.png" 
                    alt="US flag" 
                    className="w-5 h-4 object-cover border border-gray-200 rounded-sm"
                  />
                  <span className="font-medium">EN</span>
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
                  <span className="font-medium">JP</span>
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
