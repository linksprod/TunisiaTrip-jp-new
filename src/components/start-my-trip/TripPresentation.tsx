import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Eye, Sparkles, MapPin } from "lucide-react";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface TripPresentationProps {
  htmlContent: string;
  onProceed: () => void;
  onBack: () => void;
  isGenerating?: boolean;
}

export function TripPresentation({ 
  htmlContent, 
  onProceed, 
  onBack, 
  isGenerating = false 
}: TripPresentationProps) {
  const { currentLanguage } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  interface Slide {
    id: number;
    content: string;
    type: string;
    fullSlide?: string;
  }

  // Parse HTML content into slides
  const slides = React.useMemo((): Slide[] => {
    if (!htmlContent) return [];
    
    // Extract slides with proper class matching
    const slideRegex = /<div[^>]*class[^>]*slide[^>]*>(.*?)<\/div>/gis;
    const matches = Array.from(htmlContent.matchAll(slideRegex));
    
    if (matches.length === 0) {
      // Fallback: split by major headings
      const parts = htmlContent.split(/<h[1-3][^>]*>/i);
      return parts.filter(part => part.trim().length > 0).map((part, index) => ({
        id: index,
        content: index === 0 ? part : `<h2>${part.split('</h')[0]}</h2>${part.split('</h')[1] || ''}`,
        type: 'fallback'
      }));
    }
    
    return matches.map((match, index) => {
      const fullSlide = match[0];
      const slideContent = match[1];
      
      // Determine slide type
      let type = 'default';
      if (fullSlide.includes('cover-slide')) type = 'cover';
      else if (fullSlide.includes('activity-slide')) type = 'activity';
      else if (fullSlide.includes('conclusion-slide')) type = 'conclusion';
      
      return {
        id: index,
        content: slideContent,
        type,
        fullSlide
      };
    });
  }, [htmlContent]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (isGenerating) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4">
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-12">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                <h2 className="text-3xl font-bold text-foreground">
                  <TranslateText text="Création de votre présentation de voyage..." language={currentLanguage} />
                </h2>
              </div>
              
              <div className="flex items-center justify-center space-x-2 mb-8">
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                <TranslateText 
                  text="Notre IA prépare une présentation personnalisée de votre voyage en Tunisie avec des descriptions engageantes de vos activités et hébergements sélectionnés." 
                  language={currentLanguage} 
                />
              </p>

              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
                <img 
                  src="/uploads/05c1d0ef-d2de-4096-a5eb-7b5cc45a4789.png" 
                  alt="Touriste avec tablette" 
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!htmlContent || slides.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4">
        <Card className="bg-destructive/5 border-destructive/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-4 text-destructive-foreground">
              <TranslateText text="Erreur lors de la génération" language={currentLanguage} />
            </h3>
            <p className="text-muted-foreground mb-6">
              <TranslateText text="Impossible de créer la présentation. Veuillez réessayer." language={currentLanguage} />
            </p>
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <TranslateText text="Retour" language={currentLanguage} />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          <TranslateText text="Retour" language={currentLanguage} />
        </Button>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Eye className="h-4 w-4" />
          <span>{currentSlide + 1} / {slides.length}</span>
        </div>
      </div>

      {/* Main Presentation Card */}
      <Card className="overflow-hidden shadow-2xl border-0 bg-white">
        <CardContent className="p-0">
          <div className="relative w-full h-[70vh] min-h-[600px]">
            {slides[currentSlide] && (
              <div 
                className="presentation-slide w-full h-full"
                dangerouslySetInnerHTML={{ __html: slides[currentSlide].fullSlide || slides[currentSlide].content }}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={prevSlide} 
          disabled={currentSlide === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <TranslateText text="Précédent" language={currentLanguage} />
        </Button>

        {/* Slide Indicators */}
        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-primary scale-125' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>

        {currentSlide === slides.length - 1 ? (
          <Button onClick={onProceed} className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80">
            <Sparkles className="h-4 w-4" />
            <TranslateText text="Voir l'itinéraire détaillé" language={currentLanguage} />
          </Button>
        ) : (
          <Button 
            variant="default" 
            onClick={nextSlide}
            className="flex items-center gap-2"
          >
            <TranslateText text="Suivant" language={currentLanguage} />
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}