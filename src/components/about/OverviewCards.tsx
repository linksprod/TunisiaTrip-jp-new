
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface OverviewCard {
  image: string;
  category: string;
  title: string;
  description: string;
}

const overviewCards: OverviewCard[] = [
  {
    image: "/uploads/157b2dce-b095-4b76-a1de-65c8049265c7.png",
    category: "General Information",
    title: "Tunisia's Official Name",
    description: "The country's official name is Republic of Tunisia or 'Toon-is' in Tunisian Arabic Dialect. The meaning behind this name originates from the word 'Tawannas'..."
  },
  {
    image: "/uploads/02f81651-61f1-4410-9750-6af178dfeb82.png",
    category: "General Information",
    title: "Tunis: The Capital of Tunisia",
    description: "Tunis is the capital city of Tunisia and it's located in North East of the country. This city is famous for multiple things but mainly its traditional locations like Medina..."
  },
  {
    image: "/uploads/47f24b6d-8919-4239-8451-7c16e7a085f8.png",
    category: "General Information",
    title: "Population Compared to Area",
    description: "Some Tunisian areas are more dense in population than others and they are mainly cities in the north or center east of the the country. The number of people in Tunis is...."
  },
  {
    image: "/uploads/f9130b27-cf48-4cc7-be56-e8e5bbe9205f.png",
    category: "General Information",
    title: "The Mediterranean Climate",
    description: "The country's official name is Republic of Tunisia or 'Toon-is' in Tunisian Arabic Dialect. The meaning behind this name originates from the word 'Tawannas'..."
  },
  {
    image: "/uploads/f4dd04d7-55de-47a8-924e-a11575cfc578.png",
    category: "General Information",
    title: "Know Tunisia Politically",
    description: "Tunis is the capital city of Tunisia and it's located in North East of the country. This city is famous for multiple things but mainly its traditional locations like Medina..."
  },
  {
    image: "/uploads/4b3c133b-766b-4bb3-9cc7-906fd3b9168d.png",
    category: "General Information",
    title: "Religious Practices in Tunisia",
    description: "Some Tunisian areas are more dense in population than others and they are mainly cities in the north or center east of the the country. The number of people in Tunis is...."
  }
];

export interface OverviewCardsProps {
  getCardColumnClass: () => string;
}

export function OverviewCards({ getCardColumnClass }: OverviewCardsProps) {
  const { currentLanguage } = useTranslation();
  
  const getCategoryTranslation = (category: string) => {
    if (currentLanguage !== "JP") return category;
    return category === "General Information" ? "一般情報" : category;
  };
  
  return (
    <>
      <div className={`grid ${getCardColumnClass()} gap-4 sm:gap-6 md:gap-8 lg:gap-10 mb-8 sm:mb-12`}>
        {overviewCards.slice(0, 3).map((card, index) => (
          <Card key={index} className="border shadow-sm hover:shadow-md transition-shadow">
            <div className="overflow-hidden rounded-t-lg">
              <img 
                src={card.image} 
                alt={card.title} 
                className="w-full h-[200px] sm:h-[240px] md:h-[280px] object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-4 sm:p-6">
              <p className="text-blue-500 text-sm sm:text-base md:text-lg">{getCategoryTranslation(card.category)}</p>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mt-2 sm:mt-4 text-gray-900">
                <TranslateText text={card.title} language={currentLanguage} />
              </h3>
              <p className="text-gray-800 mt-2 sm:mt-3 text-sm sm:text-base">
                <TranslateText text={card.description} language={currentLanguage} />
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className={`grid ${getCardColumnClass()} gap-4 sm:gap-6 md:gap-8 lg:gap-10 mb-8 sm:mb-12`}>
        {overviewCards.slice(3).map((card, index) => (
          <Card key={index} className="border shadow-sm hover:shadow-md transition-shadow">
            <div className="overflow-hidden rounded-t-lg">
              <img 
                src={card.image} 
                alt={card.title} 
                className="w-full h-[200px] sm:h-[240px] md:h-[280px] object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-4 sm:p-6">
              <p className="text-blue-500 text-sm sm:text-base md:text-lg">{getCategoryTranslation(card.category)}</p>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mt-2 sm:mt-4 text-gray-900">
                <TranslateText text={card.title} language={currentLanguage} />
              </h3>
              <p className="text-gray-800 mt-2 sm:mt-3 text-sm sm:text-base">
                <TranslateText text={card.description} language={currentLanguage} />
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
