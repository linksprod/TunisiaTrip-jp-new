
import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useTranslation } from "@/hooks/use-translation";

export default function NotFoundPage(): JSX.Element {
  const navigate = useNavigate();
  const { translateText } = useTranslation();
  const [translations, setTranslations] = useState({
    title: "404 - Page Not Found",
    message: "We're sorry, the page you're looking for cannot be found. It might have been moved, deleted, or never existed.",
    returnHome: "Return Home",
    goBack: "Go Back",
    popularDestinations: "Popular Destinations",
    travelInfo: "Travel Information",
    aboutTunisia: "About Tunisia",
    blog: "Blog",
    startMyTrip: "Start My Trip"
  });
  
  useEffect(() => {
    const loadTranslations = async () => {
      const title = await translateText("404 - Page Not Found");
      const message = await translateText("We're sorry, the page you're looking for cannot be found. It might have been moved, deleted, or never existed.");
      const returnHome = await translateText("Return Home");
      const goBack = await translateText("Go Back");
      const popularDestinations = await translateText("Popular Destinations");
      const travelInfo = await translateText("Travel Information");
      const aboutTunisia = await translateText("About Tunisia");
      const blog = await translateText("Blog");
      const startMyTrip = await translateText("Start My Trip");
      
      setTranslations({
        title, message, returnHome, goBack, popularDestinations,
        travelInfo, aboutTunisia, blog, startMyTrip
      });
    };
    
    loadTranslations();
  }, [translateText]);
  
  return (
    <MainLayout showTagBar={false}>
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4 py-16 md:py-24">
        <OptimizedImage
          src="/uploads/b8d3011d-f5cd-4edd-b34e-9ef0827ba186.png"
          alt="Discover Tunisia Logo"
          width={200}
          height={80}
          className="mb-8"
        />
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4">
          {translations.title}
        </h1>
        
        <p className="text-xl text-center mb-8 max-w-2xl text-gray-600">
          {translations.message}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Button 
            onClick={() => navigate('/')}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white px-8"
          >
            {translations.returnHome}
          </Button>
          
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            size="lg"
            className="px-8"
          >
            {translations.goBack}
          </Button>
        </div>
        
        <div className="mt-16">
          <h2 className="font-semibold text-xl mb-4 text-center">
            {translations.popularDestinations}
          </h2>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              onClick={() => navigate('/travel')}
              variant="ghost"
              className="border border-gray-200"
            >
              {translations.travelInfo}
            </Button>
            
            <Button 
              onClick={() => navigate('/about')}
              variant="ghost"
              className="border border-gray-200"
            >
              {translations.aboutTunisia}
            </Button>
            
            <Button 
              onClick={() => navigate('/blog')}
              variant="ghost"
              className="border border-gray-200"
            >
              {translations.blog}
            </Button>
            
            <Button 
              onClick={() => navigate('/start-my-trip')}
              variant="ghost"
              className="border border-gray-200"
            >
              {translations.startMyTrip}
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
