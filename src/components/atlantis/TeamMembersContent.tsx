
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export function TeamMembersContent() {
  const { currentLanguage } = useTranslation();
  const teamMembers = [
    "/uploads/0e8b91dd-c161-45a9-9333-2b524f9117df.png",
    "/uploads/7f9acada-726b-43e1-a65e-466d327381ee.png",
    "/uploads/520e8e05-6e0d-4465-a70f-76d4df659a27.png",
  ];

  return (
    <div className="w-full max-w-[1588px] mx-auto px-5">
      <div className="mb-8">
        <h1 className="text-[#1F1F20] font-inter text-3xl md:text-4xl font-bold">
          <TranslateText text="Meet Our Team Members" language={currentLanguage} />
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {teamMembers.map((member, index) => (
          <div 
            key={index}
            className="w-full aspect-video rounded-lg shadow-[0px_0px_15px_2px_rgba(0,0,0,0.05)] overflow-hidden"
          >
            <img
              src={member}
              alt={`Team Member ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end items-center mb-10">
        <Button 
          onClick={() => window.location.href = 'https://atlantis-voyages.com/#services'}
          variant="ghost" 
          className="text-[#347EFF] hover:text-blue-600 px-0 text-lg group inline-flex items-center cursor-pointer"
        >
          <TranslateText text="Learn More About Atlantis Services" language={currentLanguage} />
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      <div className="bg-[#F6F8FB] rounded-xl p-6 md:p-10 shadow-[0px_0px_0px_2px_rgba(0,0,0,0.05)]">
        <h2 className="text-[#1F1F20] font-inter text-2xl md:text-3xl font-medium mb-4">
          <TranslateText text="The Team Behind Atlantis" language={currentLanguage} />
        </h2>
        <p className="text-[#1F1F20] font-inter text-base md:text-lg leading-relaxed">
          <TranslateText 
            text="Get to know the passionate professionals behind your unforgettable journeys with Atlantis Voyages. Our team is dedicated to delivering exceptional service every step of the way."
            language={currentLanguage}
          />
        </p>
      </div>
    </div>
  );
}
