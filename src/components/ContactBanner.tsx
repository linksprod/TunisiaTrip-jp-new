
import React from "react";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { TranslateText } from "./translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export function ContactBanner() {
  const { currentLanguage } = useTranslation();
  
  return (
    <div className="w-full bg-gradient-to-r from-[#3F95D0] via-[#529ED1] to-[#3E97D3] relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-5 py-12 flex items-center justify-center">
        <div className="flex items-center gap-28 lg:gap-32 max-lg:flex-col max-lg:gap-10">
          {/* Left Column */}
          <div className="flex flex-col gap-8 max-w-[372px] max-lg:max-w-full max-lg:items-center max-lg:text-center">
            <div className="flex flex-col gap-5">
              {/* Begin your Journey heading with vertical line */}
              <div className="flex items-center gap-4">
                <div className="w-[6px] h-10 bg-white/40 rounded-full"></div>
                <h2 className="text-4xl font-bold text-white">
                  <TranslateText text="Begin your Journey" language={currentLanguage} />
                </h2>
              </div>
              
              <p className="text-white text-xl font-medium leading-tight max-w-[366px] max-lg:max-w-full">
                <TranslateText text="Looking for your next destination?" language={currentLanguage} /><br />
                <TranslateText text="Let's plan The Trip of Your Dreams" language={currentLanguage} />
              </p>
            </div>
            
            {/* More about us button with link to website */}
            <a 
              href="https://atlantis-voyages.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center w-[238px] h-[62px] rounded-xl border-4 border-white/50 bg-white/10 text-white text-xl font-semibold cursor-pointer hover:bg-white/20 transition-colors"
            >
              <TranslateText text="More about us" language={currentLanguage} /> <ExternalLink className="ml-2 w-5 h-5" />
            </a>
          </div>
          
          {/* Vertical Divider - hidden on mobile */}
          <div className="h-[220px] w-[1px] bg-white/10 max-lg:hidden"></div>
          
          {/* Right Column */}
          <div className="flex flex-col gap-8 max-lg:items-center">
            {/* Atlantis Logo - replace text with image */}
            <div className="text-white">
              <img 
                src="/uploads/887573e2-027f-4492-8fb5-dab816ee46da.png" 
                alt="Atlantis Voyages Logo" 
                className="h-16 w-auto"
              />
            </div>
            
            {/* Contact Information */}
            <div className="flex flex-col gap-3">
              {/* Address */}
              <div className="flex items-center gap-4">
                <MapPin className="w-6 h-6 text-white" />
                <div className="text-white text-lg">
                  <span className="font-medium">29, AV.du,Japon, Imm. Fatma 1002</span><br />
                  <span className="font-bold">Montplaisir - Tunis</span>
                </div>
              </div>
              
              {/* Phone */}
              <div className="flex items-center gap-4">
                <Phone className="w-6 h-6 text-white" />
                <div className="text-white text-lg font-medium">+216 31 31 8000</div>
              </div>
              
              {/* Email */}
              <div className="flex items-center gap-4">
                <Mail className="w-6 h-6 text-white" />
                <div className="text-white text-lg font-medium">atlantis@atlantis.tn</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
