
import React from "react";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface CultureArticle {
  category: string;
  title: string;
  description: string;
  image: string;
}

const cultureArticles: CultureArticle[] = [
  {
    category: "Cuisine",
    title: "World's leading olive producers",
    description: "known for its wide variety of olive varieties. The country's climate and soil are ideal for growing olives, so High quality olives It boasts of its production. Locally...",
    image: "/uploads/cb1753c7-4a7d-4f89-984e-fc285bc55c65.png"
  },
  {
    category: "Cuisine",
    title: "Traditional Tunisian Food",
    description: "In Tunisia, there is a traditional food that tourists must try: couscous. This food is made with steam-cooked semolina wheat flour and meat, With greens...",
    image: "/uploads/160dc00b-e9d5-4c2a-9784-30a40c8763eb.png"
  },
  {
    category: "Cities",
    title: "UNESCO-listed City",
    description: "Khairuan in Tunisia is a UNESCO-listed city known for its rich history and cultural heritage. The medina of Kairuan is a narrow street with a market In a place...",
    image: "/uploads/c1965a9c-b076-4bd5-8627-87405031a622.png"
  },
  {
    category: "History",
    title: "History & Arts",
    description: "Tunisia is home to many historical sites that are important for world archaeology and architectural research. In addition, handicrafts such as carpets...",
    image: "/uploads/cb022f6c-d70b-4cf6-8fc6-28d5dca9c643.png"
  },
  {
    category: "Cuisine",
    title: "Popular Food in Tunisia",
    description: "Tunisian food is a mix of Eastern and Western cuisines. There are many dishes based on olive oil, spices, tomatoes, seafood, and meat. Chili pepper...",
    image: "/uploads/a6255dc3-e107-4750-9b51-4921e17117ec.png"
  },
  {
    category: "Culture",
    title: "National Sport",
    description: "Sports are becoming more and more popular in Tunisia. In particular, football is quite popular. In October 2020, the Tunisian national football team FIFA...",
    image: "/uploads/9b60f3ff-33bb-4e82-9aa3-5bdbdef2519c.png"
  }
];

export interface CultureArticlesProps {
  getCardColumnClass: () => string;
}

export function CultureArticles({ getCardColumnClass }: CultureArticlesProps) {
  const { currentLanguage } = useTranslation();
  
  const getCategoryTranslation = (category: string) => {
    if (currentLanguage !== "JP") return category;
    
    const translations: Record<string, string> = {
      "Cuisine": "料理",
      "Cities": "都市",
      "History": "歴史",
      "Culture": "文化"
    };
    
    return translations[category] || category;
  };
  
  return (
    <div className={`grid ${getCardColumnClass()} gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-10`}>
      {cultureArticles.map((article, index) => (
        <div key={index} className="flex flex-col">
          <div className="overflow-hidden rounded-lg mb-3 sm:mb-6">
            <img 
              src={article.image} 
              alt={article.title} 
              className="w-full h-[180px] sm:h-[200px] md:h-[240px] object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <p className="text-blue-500 text-sm sm:text-base">
            {getCategoryTranslation(article.category)}
          </p>
          <h3 className="text-lg sm:text-xl font-bold mt-1 sm:mt-2 text-gray-900">
            <TranslateText text={article.title} language={currentLanguage} />
          </h3>
          <p className="text-gray-700 mt-1 sm:mt-2 text-sm sm:text-base">
            <TranslateText text={article.description} language={currentLanguage} />
          </p>
        </div>
      ))}
    </div>
  );
}
