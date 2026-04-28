import React, { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';
import { useTranslationProvider } from './TranslationProvider';
// Force reload translations after update
import { commonTranslations } from '../../translations/japanese/common';
import { navigationTranslations } from '../../translations/japanese/navigation';
import { blogTranslations } from '../../translations/japanese/blog';
import { weatherTranslations } from '../../translations/japanese/weather';
import { atlantisTranslations } from '../../translations/japanese/atlantis';
import { travelTranslations } from '../../translations/japanese/travel';
import { heroSectionTranslations } from '../../translations/japanese/heroSection';
import { servicesSectionTranslations } from '../../translations/japanese/servicesSection';
import { featuresSectionTranslations } from '../../translations/japanese/featuresSection';
import { statisticsSectionTranslations } from '../../translations/japanese/statisticsSection';
import { videoSectionTranslations } from '../../translations/japanese/videoSection';
import { testimonialsSectionTranslations } from '../../translations/japanese/testimonialsSection';
import { contactSectionTranslations } from '../../translations/japanese/contactSection';
import { travelInfoTranslations } from '../../translations/japanese/travelInfo';
import { tipsSectionTranslations } from '../../translations/japanese/tipsSection';
import { aboutPageTranslations } from '../../translations/japanese/aboutPage';
import { travelCitiesTranslations } from '../../translations/japanese/travel-cities';
import { startMyTripTranslations } from '../../translations/japanese/start-my-trip';

// Combine all translations into a single object for easy access
const allTranslations = {
  ...commonTranslations,
  ...navigationTranslations,
  ...blogTranslations,
  ...weatherTranslations,
  ...atlantisTranslations,
  ...travelTranslations,
  ...heroSectionTranslations,
  ...servicesSectionTranslations,
  ...featuresSectionTranslations,
  ...statisticsSectionTranslations,
  ...videoSectionTranslations,
  ...testimonialsSectionTranslations,
  ...contactSectionTranslations,
  ...travelInfoTranslations,
  ...tipsSectionTranslations,
  ...aboutPageTranslations,
  ...travelCitiesTranslations,
  ...startMyTripTranslations
};

// Normalized lookup to handle punctuation/spacing differences
const normalizeKey = (s: string) => s
  ?.replace(/\u00A0/g, ' ') // normalize non-breaking spaces
  .replace(/[\u2013\u2014]/g, '-') // en/em dash -> hyphen
  .replace(/[\u2018\u2019]/g, "'") // curly single quotes -> '
  .replace(/[\u201C\u201D]/g, '"') // curly double quotes -> "
  .replace(/\s+/g, ' ') // collapse whitespace
  .trim();
const normalizedTranslations: Record<string, string> = Object.fromEntries(
  Object.entries(allTranslations).map(([k, v]) => [normalizeKey(k), v as string])
);

// Helper function to get initial translation immediately (avoids flash of English)
const getInitialTranslation = (text: string, targetLanguage?: string): string => {
  if (!text?.trim()) return text;
  
  // Check URL parameter only - default to Japanese (no localStorage)
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  const lang = targetLanguage || (langParam === 'en' || langParam === 'EN' ? 'EN' : 'JP');
  
  if (lang === 'EN') return text;
  
  // Check precompiled translations
  if (lang === 'JP' && text in allTranslations) {
    return allTranslations[text as keyof typeof allTranslations];
  }
  
  // Try normalized lookup
  const normalizedText = normalizeKey(text);
  const normalizedHit = normalizedTranslations[normalizedText];
  if (normalizedHit) return normalizedHit;
  
  return text;
};

interface TranslateTextProps {
  text: string;
  language?: string;
  className?: string;
}

export const TranslateText: React.FC<TranslateTextProps> = ({ 
  text, 
  language, 
  className = '' 
}) => {
  const { translate } = useTranslationProvider();
  const { currentLanguage, updateKey } = useTranslation();
  
  // Initialize with Japanese translation immediately to avoid flash of English
  const [translatedText, setTranslatedText] = useState<string>(() => 
    getInitialTranslation(text, language)
  );
  
  // Use the current language if none is provided
  const targetLanguage = language || currentLanguage;
  
  // Create a memoized translation function to avoid unnecessary re-translations
  const updateTranslation = useCallback(async () => {
    if (!text?.trim()) {
      setTranslatedText(text);
      return;
    }
    
    if (!targetLanguage || targetLanguage === 'EN') {
      setTranslatedText(text);
      return;
    }
    
    // Log the translation request in detail for debugging
    console.log(`TranslateText [${updateKey}]: Translating "${text}" to ${targetLanguage}`);
    
  // Check if the translation is in our precompiled translation file
    if (targetLanguage === 'JP' && text in allTranslations) {
      const precompiledTranslation = allTranslations[text as keyof typeof allTranslations];
      console.log(`TranslateText: Found precompiled translation for "${text}": "${precompiledTranslation}"`);
      setTranslatedText(precompiledTranslation);
      // Clear any old cache for this text
      try {
        localStorage.removeItem(`${text}_${targetLanguage}`);
      } catch (e) {
        console.error('Error clearing cache:', e);
      }
      return;
    }

    // Try normalized lookup (handles different dashes/spaces)
    if (targetLanguage === 'JP') {
      const normalizedText = normalizeKey(text);
      const normalizedHit = normalizedTranslations[normalizedText as keyof typeof normalizedTranslations];
      if (normalizedHit) {
        console.log(`TranslateText: Found normalized precompiled translation for "${text}" -> key "${normalizedText}"`);
        setTranslatedText(normalizedHit);
        try {
          localStorage.removeItem(`${text}_${targetLanguage}`);
          localStorage.removeItem(`${normalizedText}_${targetLanguage}`);
        } catch (e) {
          console.error('Error clearing cache:', e);
        }
        return;
      }
    }
    
    // Otherwise, check the local cache
    const cacheKey = `${text}_${targetLanguage}`;
    const cachedTranslation = localStorage.getItem(cacheKey);
    
    // Skip cache if we know this should have a precompiled translation
    if (cachedTranslation && !(text in allTranslations)) {
      console.log(`TranslateText: Using cached translation for "${text}"`);
      setTranslatedText(cachedTranslation);
      return;
    }
    
    // As a last resort, use the translation API
    try {
      console.log(`TranslateText [${updateKey}]: Translating "${text}" via API to ${targetLanguage}`);
      const result = await translate(text, targetLanguage);
      
      if (result?.success && result?.translation) {
        console.log(`TranslateText [${updateKey}]: Translation result: "${result.translation}"`);
        setTranslatedText(result.translation);
        
        localStorage.setItem(cacheKey, result.translation);
      } else {
        console.warn(`TranslateText [${updateKey}]: Translation failed:`, result);
        setTranslatedText(text);
      }
    } catch (error) {
      console.error(`TranslateText [${updateKey}]: Translation error:`, error);
      setTranslatedText(text);
    }
  }, [text, targetLanguage, translate, updateKey]);
  
  // Update translation immediately when language changes
  useEffect(() => {
    console.log(`TranslateText [${updateKey}]: Language or text changed, updating translation for "${text}"`);
    updateTranslation();
  }, [updateTranslation, targetLanguage, updateKey, text]);
  
  return <span className={cn("notranslate", className)}>{translatedText}</span>;
};
