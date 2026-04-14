
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { LanguageCard } from "@/components/about/LanguageCard";
import { DetailedLanguageContent } from "@/components/about/DetailedLanguageContent";
import { ExpressionCard } from "@/components/about/ExpressionCard";
import { languageCards, commonExpressions } from "@/data/languageData";
import { useTranslation } from "@/hooks/use-translation";
import { TranslateText } from "@/components/translation/TranslateText";

export function SpokenLanguagesContent() {
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);
  const { currentLanguage } = useTranslation();

  const handleCardClick = (id: string) => {
    setActiveLanguage(id === activeLanguage ? null : id);
  };

  // Modified to use regular strings instead of React elements
  const languageData = [
    {
      id: "arabic",
      category: "Primary Language",
      title: "Arabic in Tunisia",
      description: "Article 1 of the Tunisian Constitution, enacted after the 2011 revolution, defines Arabic as the official language of Tunisia.",
      content: "Article 1 of the Tunisian Constitution, enacted after the 2011 revolution, defines Arabic as the \"language of the state.\" Article 39 of the Constitution also stipulates the universalization of Arab identity and Arabic language education.\n\nTunisian Arabic is similar to the dialects of Algerian and Moroccan dialects that border the country. It is different from standard Arabic, so there is a joke that Tunisian is spoken in Tunisia. Tunisian Arabic is a mixture of many languages, including standard Arabic, French, and Italian.",
      image: "/uploads/51d60728-8778-4e74-826d-4640ab4aea8b.png"
    },
    {
      id: "french",
      category: "Second Language",
      title: "French in Tunisia",
      description: "During the French colonial rule of Tunisia, French was introduced into public institutions and education.",
      content: "During the French colonial rule of Tunisia, French was introduced into public institutions and the education system. It is also a full member of the Francophonie, an international organization of French-speaking countries.",
      image: "/uploads/3c0b1725-00a1-4c11-a832-7c4b586eebdf.png"
    },
    {
      id: "english",
      category: "Growing Language",
      title: "English in Tunisia",
      description: "Young Tunisians speak English quite well and tend to prefer it to French. With increasing tourism, English is becoming more important.",
      content: "Young Tunisians speak English quite well and tend to prefer it to French. With the growing influence of global media and the tourism industry, many younger Tunisians are becoming increasingly proficient in English.",
      image: "/uploads/145d185a-0057-45ba-ba8b-33d5e5f960a3.png"
    },
    {
      id: "amazigh",
      category: "Indigenous Language",
      title: "Amazigh Language",
      description: "The language spoken by the Berber people, also called Berber, was the language used in North Africa before Arabic spread.",
      content: "The language spoken by the Berber people, also called Amazigh, was the language used in North Africa before Arabic spread in the Middle Ages. Although only a small percentage of Tunisians speak Berber languages today, they represent an important part of Tunisia's cultural heritage.",
      image: "/uploads/5d0e792c-e35e-43a4-ae97-71f48ca58d1d.png"
    }
  ];

  return (
    <div className="w-full">
      {/* Language Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {languageData.map((card) => (
          <LanguageCard
            key={card.id}
            id={card.id}
            category={<TranslateText text={card.category} language={currentLanguage} />}
            title={<TranslateText text={card.title} language={currentLanguage} />}
            description={<TranslateText text={card.description} language={currentLanguage} />}
            image={card.image}
            isActive={activeLanguage === card.id}
            onClick={handleCardClick}
          />
        ))}
      </div>

      {/* Detailed Language Content */}
      {activeLanguage && (
        <div className="w-full border border-blue-200 rounded-lg p-8 mb-10">
          {languageData
            .filter(card => card.id === activeLanguage)
            .map(card => (
              <div key={card.id} className="flex flex-col md:flex-row justify-between items-start gap-10">
                <div className="md:w-1/2">
                  <h2 className="text-3xl font-semibold mb-6">
                    <TranslateText text={card.title} language={currentLanguage} />
                  </h2>
                  <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                    <TranslateText text={card.content} language={currentLanguage} />
                  </p>
                </div>
                <div className="md:w-1/2 flex justify-center bg-gray-50 p-6 rounded-lg">
                  <img 
                    src={card.image} 
                    alt={card.title}
                    className="max-w-full h-auto max-h-[300px]"
                  />
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Common Expressions Section with Audio */}
      <div className="mb-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            <TranslateText text="Common Tunisian Expressions" language={currentLanguage} />
          </h2>
          <p className="text-gray-600">
            <TranslateText text="Learn these essential phrases to connect with locals during your visit to Tunisia" language={currentLanguage} />
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commonExpressions.map((expression) => (
            <ExpressionCard
              key={expression.id}
              id={expression.id}
              phrase={expression.phrase}
              translation={expression.translation}
              image={expression.image}
              audio={expression.audio}
            />
          ))}
        </div>

        <div className="text-center mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">
            <TranslateText text="Cultural Tip" language={currentLanguage} />
          </h3>
          <p className="text-gray-700">
            <TranslateText 
              text="Tunisians appreciate when visitors attempt to speak their language, even if just a few words. Don't worry about perfect pronunciation - the effort is what counts!"
              language={currentLanguage}
            />
          </p>
        </div>
      </div>

      {/* Language Facts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">
            <TranslateText text="Linguistic Diversity" language={currentLanguage} />
          </h3>
          <p>
            <TranslateText
              text="Tunisia is a linguistically diverse country with Arabic as the official language, but with significant influence from French, Berber languages, and increasingly English. This diversity reflects Tunisia's rich history and position at the crossroads of different civilizations."
              language={currentLanguage}
            />
          </p>
        </div>
        
        <div className="bg-amber-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">
            <TranslateText text="Language Education" language={currentLanguage} />
          </h3>
          <p>
            <TranslateText
              text="Tunisia's education system places strong emphasis on language learning. Arabic is taught from the early years, with French introduced in elementary school. English is typically taught from middle school onward, and many students also study Italian, Spanish, German, or Turkish."
              language={currentLanguage}
            />
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-10">
        <Button variant="outline" className="text-blue-500 border-blue-500 gap-2" asChild>
          <Link to="/about" onClick={() => {
            window.scrollTo(0, 0);
            const event = new CustomEvent('changeTab', { detail: { tab: 'weather' } });
            window.dispatchEvent(event);
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 4L17 12L9 20" stroke="#347EFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(180 12 12)"/>
            </svg>
            <TranslateText text="Tunisian Weather" language={currentLanguage} />
          </Link>
        </Button>
        
        <Button variant="outline" className="text-blue-500 border-blue-500 gap-2" asChild>
          <Link to="/about" onClick={() => {
            window.scrollTo(0, 0);
            const event = new CustomEvent('changeTab', { detail: { tab: 'religions' } });
            window.dispatchEvent(event);
          }}>
            <TranslateText text="Practiced Religions" language={currentLanguage} />
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
