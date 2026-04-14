
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export function ReligionsContent() {
  const { currentLanguage } = useTranslation();
  
  const religions = [
    {
      name: "Islam",
      description: "98.2% of the population are Muslims who believe in Sunni Islam. Freedom of religion is guaranteed under the 1988 National Charter, though proselytization and missionary work are subject to legal restrictions.",
      imageUrl: "/uploads/f3b30eee-6fe7-4893-b523-772d88a92794.png"
    },
    {
      name: "Judaism",
      description: "There has been a Jewish minority in Tunisia for a very long time. Since 1967, most Jews have emigrated to France or Israel, with the majority of those remaining now living on the island of Djerba.",
      imageUrl: "/uploads/2a5d4021-ac7b-4673-87d8-cc70469a97e1.png"
    },
    {
      name: "Christianity",
      description: "A small Christian community exists in Tunisia, mostly comprised of foreigners who worship freely in churches and operate several schools throughout the country.",
      imageUrl: "/uploads/4821f6c6-b0ba-468a-8584-133c8e804417.png"
    }
  ];

  return (
    <div className="w-full">
      {/* Blue Info Banner */}
      <div className="w-full rounded-xl bg-[#E4ECFC] p-6 md:p-10 mb-8">
        <p className="text-[#1F1F20] text-base md:text-xl font-light leading-relaxed">
          <TranslateText text="The state religion of Tunisia is Islam!" language={currentLanguage} />
          <br />
          <TranslateText text="Tunisia is an Islamic country, with Islam explicitly stated in its constitution." language={currentLanguage} />
        </p>
      </div>

      {/* Religion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {religions.map((religion, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img 
                src={religion.imageUrl} 
                alt={`${religion.name} in Tunisia`}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle><TranslateText text={religion.name} language={currentLanguage} /></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                <TranslateText text={religion.description} language={currentLanguage} />
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" className="text-blue-500 border-blue-500 gap-2" asChild>
          <Link to="/about" onClick={() => {
            window.scrollTo(0, 0);
            // Update the tab to languages
            const event = new CustomEvent('changeTab', { detail: { tab: 'languages' } });
            window.dispatchEvent(event);
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 4L17 12L9 20" stroke="#347EFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(180 12 12)"/>
            </svg>
            <TranslateText text="Spoken Languages" language={currentLanguage} />
          </Link>
        </Button>
          
        <Button variant="outline" className="text-blue-500 border-blue-500 gap-2 invisible">
          <Link to="/about">
            <TranslateText text="Next" language={currentLanguage} />
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
