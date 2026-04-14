import React, { useState, useEffect } from "react";
import { EnhancedAdminLayout } from "@/components/admin/modern/EnhancedAdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { PageSEOFormValues, GeneralSEOFormValues, SEOKeyword, LanguageSpecificSEO } from "@/types/seo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Globe, Flag, Plus, X, Tag, Map, ListFilter, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Default Open Graph Image path
const DEFAULT_OG_IMAGE = "/uploads/ff0d63a1-cc6c-4694-be17-2df916fd6334.png";

// Local Storage Keys
const SEO_DATA_KEY = "tunisiaTourism_seoData";
const KEYWORDS_DATA_KEY = "tunisiaTourism_keywordsData";

// Initial SEO data - only used if nothing is found in localStorage
const initialSEOData: LanguageSpecificSEO = {
  EN: {
    homepage: {
      title: "Tunisia Tourism | Discover the Beauty of Tunisia",
      description: "Explore Tunisia's rich history, stunning beaches, and vibrant culture. Plan your perfect vacation with our comprehensive travel guide.",
      keywords: "Tunisia, Tunisia Tourism, Tunisia Travel, Tunisia Vacation, North Africa Travel",
      ogImage: DEFAULT_OG_IMAGE
    },
    aboutPage: {
      title: "About Tunisia | History, Culture & Geography",
      description: "Learn about Tunisia's fascinating history, diverse culture, and beautiful geography. Discover what makes Tunisia a unique destination.",
      keywords: "Tunisia History, Tunisia Culture, Tunisia Geography, Tunisia Facts",
      ogImage: DEFAULT_OG_IMAGE
    },
    travelPage: {
      title: "Travel Information | Tunisia Tourism Guide",
      description: "Essential travel information for your Tunisia trip. Find transportation tips, accommodation options, and practical travel advice.",
      keywords: "Tunisia Travel Tips, Tunisia Transportation, Tunisia Hotels, Travel to Tunisia",
      ogImage: DEFAULT_OG_IMAGE
    },
    blogPage: {
      title: "Tunisia Travel Blog | Tips, Stories & Guides",
      description: "Read our latest articles about traveling in Tunisia. Get insider tips, local stories, and detailed guides for your Tunisian adventure.",
      keywords: "Tunisia Blog, Tunisia Travel Blog, Tunisia Tips, Tunisia Stories",
      ogImage: DEFAULT_OG_IMAGE
    },
    startMyTripPage: {
      title: "Plan Your Trip to Tunisia | Customize Your Itinerary",
      description: "Create your perfect Tunisia itinerary with our trip planning tool. Choose activities, hotels, and attractions for a personalized vacation.",
      keywords: "Tunisia Trip Planning, Tunisia Itinerary, Tunisia Activities, Tunisia Trip Builder",
      ogImage: DEFAULT_OG_IMAGE
    },
    general: {
      title: "Tunisia Tourism",
      description: "Your gateway to exploring Tunisia's beautiful destinations",
      ogImage: DEFAULT_OG_IMAGE
    }
  },
  JP: {
    homepage: {
      title: "Tunisia Tourism | Discover the Beauty of Tunisia",
      description: "チュニジアの豊かな歴史、美しいビーチ、活気ある文化をご探索ください。包括的な旅行ガイドで理想的な休暇を計画しましょう。",
      keywords: "チュニジア, チュニジア観光, チュニジア旅行, チュニジア休暇, 北アフリカ旅行",
      ogImage: DEFAULT_OG_IMAGE
    },
    aboutPage: {
      title: "About Tunisia | History, Culture & Geography",
      description: "チュニジアの魅力的な歴史、多様な文化、美しい地理についてご覧ください。チュニジアをユニークな目的地にしているものを発見してください。",
      keywords: "チュニジア歴史, チュニジア文化, チュニジア地理, チュニジア情報",
      ogImage: DEFAULT_OG_IMAGE
    },
    travelPage: {
      title: "Travel Information | Tunisia Tourism Guide",
      description: "チュニジア旅行に必要な重要な情報。交通手段のヒント、宿泊施設のオプション、実用的な旅行アドバイスをご覧ください。",
      keywords: "チュニジア旅行ヒント, チュニジア交通, チュニジアホテル, チュニジアへの旅行",
      ogImage: DEFAULT_OG_IMAGE
    },
    blogPage: {
      title: "Tunisia Travel Blog | Tips, Stories & Guides",
      description: "チュニジア旅行に関する最新記事をお読みください。現地の情報、地元のストーリー、チュニジアの冒険のための詳細なガイドをお届けします。",
      keywords: "チュニジアブログ, チュニジア旅行ブログ, チュニジアのヒント, チュニジアのストーリー",
      ogImage: DEFAULT_OG_IMAGE
    },
    startMyTripPage: {
      title: "Plan Your Trip to Tunisia | Customize Your Itinerary",
      description: "旅行計画ツールで理想的なチュニジアの旅程を作成しましょう。パーソナライズされた休暇のためのアクティビティ、ホテル、観光スポットを選択してください。",
      keywords: "チュニジア旅行計画, チュニジア旅程, チュニジアアクティビティ, チュニジア旅行プランナー",
      ogImage: DEFAULT_OG_IMAGE
    },
    general: {
      title: "Tunisia Tourism",
      description: "チュニジアの美しい目的地を探索するための入り口",
      ogImage: DEFAULT_OG_IMAGE
    }
  }
};

// Initial keyword lists - only used if nothing is found in localStorage
const initialKeywords = {
  core: [
    { text: "Tunisiatrip", category: "core", priority: 10, isActive: true },
    { text: "Tunisia travel agency", category: "core", priority: 9, isActive: true },
    { text: "Discover Tunisia", category: "core", priority: 9, isActive: true },
    { text: "Go to Tunisia", category: "core", priority: 8, isActive: true },
    { text: "Tunisia tour packages", category: "core", priority: 8, isActive: true },
    { text: "Sahara desert tours Tunisia", category: "core", priority: 7, isActive: true },
    { text: "Cultural tours in Tunisia", category: "core", priority: 7, isActive: true },
    { text: "Tunisia private tours", category: "core", priority: 6, isActive: true },
    { text: "Tunisia travel deals", category: "core", priority: 6, isActive: true },
    { text: "Tunisia vacation packages", category: "core", priority: 5, isActive: true },
    { text: "TunisiaTrip travel agency", category: "core", priority: 5, isActive: true },
    { text: "Luxury trips in Tunisia", category: "core", priority: 4, isActive: true },
    { text: "Personalized trips in Tunisia", category: "core", priority: 4, isActive: true },
    { text: "Best places to visit in Tunisia", category: "core", priority: 3, isActive: true },
    { text: "Tunisia Travel Guide", category: "core", priority: 3, isActive: true },
  ],
  destination: [
    { text: "Tunisia beach holidays", category: "destination", priority: 8, isActive: true },
    { text: "Tunisia desert adventures", category: "destination", priority: 8, isActive: true },
    { text: "Tunisia cultural experiences", category: "destination", priority: 7, isActive: true },
    { text: "Tunisia historical sites tours", category: "destination", priority: 7, isActive: true },
    { text: "Tunisia coastal city tours", category: "destination", priority: 6, isActive: true },
    { text: "Tunisia mountain oasis trips", category: "destination", priority: 6, isActive: true },
    { text: "Tunisia island getaways", category: "destination", priority: 5, isActive: true },
    { text: "Tunisia Travel Guide", category: "destination", priority: 5, isActive: true },
  ],
  "long-tail": [
    { text: "Luxury tours in Tunisia", category: "long-tail", priority: 6, isActive: true },
    { text: "Customized cultural itineraries Tunisia", category: "long-tail", priority: 6, isActive: true },
    { text: "Private guided tours of Tunisian heritage sites", category: "long-tail", priority: 5, isActive: true },
    { text: "Family-friendly vacation packages in Tunisia", category: "long-tail", priority: 5, isActive: true },
    { text: "Adventure travel experiences in the Tunisian Sahara", category: "long-tail", priority: 4, isActive: true },
    { text: "Romantic beach resorts in Tunisia", category: "long-tail", priority: 4, isActive: true },
    { text: "Nature tours in Tunisia", category: "long-tail", priority: 3, isActive: true },
  ]
};

// Japanese keyword lists - to complement the English ones
const japaneseKeywords = {
  core: [
    { text: "チュニジア旅行", category: "core", priority: 10, isActive: true },
    { text: "チュニジア観光ツアー", category: "core", priority: 9, isActive: true },
    { text: "チュニジアを発見する", category: "core", priority: 9, isActive: true },
    { text: "チュニジアへ行く", category: "core", priority: 8, isActive: true },
    { text: "チュニジアツアーパッケージ", category: "core", priority: 8, isActive: true },
    { text: "チュニジアサハラ砂漠ツアー", category: "core", priority: 7, isActive: true },
    { text: "チュニジア文化ツアー", category: "core", priority: 7, isActive: true },
  ],
  destination: [
    { text: "チュニジアビーチホリデー", category: "destination", priority: 8, isActive: true },
    { text: "チュニジア砂漠アドベンチャー", category: "destination", priority: 8, isActive: true },
    { text: "チュニジア文化体験", category: "destination", priority: 7, isActive: true },
    { text: "チュニジア歴史的観光地ツアー", category: "destination", priority: 7, isActive: true },
  ],
  "long-tail": [
    { text: "チュニジアの高級ツアー", category: "long-tail", priority: 6, isActive: true },
    { text: "チュニジアカスタム文化旅程", category: "long-tail", priority: 6, isActive: true },
    { text: "チュニジア遺産地のプライベートガイドツアー", category: "long-tail", priority: 5, isActive: true },
  ]
};

const AdminSEOPage = () => {
  // Current language state - Default to 'JP' instead of 'EN'
  const [currentLanguage, setCurrentLanguage] = useState<'EN' | 'JP'>('JP');
  
  // Load data from localStorage on component mount - with proper initialization and error handling
  const [seoData, setSeoData] = useState<LanguageSpecificSEO>(() => {
    try {
      const savedData = localStorage.getItem(SEO_DATA_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Make sure both language sections exist
        if (!parsedData.EN || !parsedData.JP) {
          console.warn("SEO data structure incomplete, initializing with defaults");
          return initialSEOData;
        }
        
        // Ensure each language has all required sections
        const keysToCheck = ['homepage', 'aboutPage', 'travelPage', 'blogPage', 'startMyTripPage', 'general'];
        let isValid = true;
        
        // Check EN sections
        for (const key of keysToCheck) {
          if (!parsedData.EN[key]) {
            console.warn(`Missing EN.${key} in SEO data, using default`);
            parsedData.EN[key] = initialSEOData.EN[key];
            isValid = false;
          }
        }
        
        // Check JP sections
        for (const key of keysToCheck) {
          if (!parsedData.JP[key]) {
            console.warn(`Missing JP.${key} in SEO data, using default`);
            parsedData.JP[key] = initialSEOData.JP[key];
            isValid = false;
          }
        }
        
        if (!isValid) {
          // If we had to fix the data, save it back to localStorage
          localStorage.setItem(SEO_DATA_KEY, JSON.stringify(parsedData));
        }
        
        return parsedData;
      }
      console.log("No saved SEO data found, using defaults");
      return initialSEOData;
    } catch (error) {
      console.error("Error loading SEO data from localStorage:", error);
      return initialSEOData;
    }
  });

  // Initialize with the default keywords data structure and better error handling
  const [allKeywords, setAllKeywords] = useState<{
    EN: typeof initialKeywords;
    JP: typeof japaneseKeywords;
  }>(() => {
    try {
      const savedKeywords = localStorage.getItem(KEYWORDS_DATA_KEY);
      if (savedKeywords) {
        const parsedKeywords = JSON.parse(savedKeywords);
        // Ensure the structure is correct
        if (!parsedKeywords.EN || !parsedKeywords.JP) {
          console.warn("Keywords data structure incomplete, initializing with defaults");
          return {
            EN: initialKeywords,
            JP: japaneseKeywords
          };
        }
        
        // Ensure all categories exist in both languages
        const categories = ['core', 'destination', 'long-tail'];
        let needsUpdate = false;
        
        // Check EN categories
        for (const category of categories) {
          if (!parsedKeywords.EN[category] || !Array.isArray(parsedKeywords.EN[category])) {
            console.warn(`Missing or invalid EN.${category} in keywords data, using default`);
            parsedKeywords.EN[category] = initialKeywords[category];
            needsUpdate = true;
          }
        }
        
        // Check JP categories
        for (const category of categories) {
          if (!parsedKeywords.JP[category] || !Array.isArray(parsedKeywords.JP[category])) {
            console.warn(`Missing or invalid JP.${category} in keywords data, using default`);
            parsedKeywords.JP[category] = japaneseKeywords[category];
            needsUpdate = true;
          }
        }
        
        if (needsUpdate) {
          // If we had to fix the data, save it back to localStorage
          localStorage.setItem(KEYWORDS_DATA_KEY, JSON.stringify(parsedKeywords));
        }
        
        return parsedKeywords;
      }
      console.log("No saved keywords data found, using defaults");
      return {
        EN: initialKeywords,
        JP: japaneseKeywords
      };
    } catch (error) {
      console.error("Error loading keywords from localStorage:", error);
      return {
        EN: initialKeywords,
        JP: japaneseKeywords
      };
    }
  });

  const [activeTab, setActiveTab] = useState("general");
  const [keywordTab, setKeywordTab] = useState<"core" | "destination" | "long-tail">("core");
  const [newKeyword, setNewKeyword] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [keywordCategory, setKeywordCategory] = useState<"core" | "destination" | "long-tail">("core");
  const { toast } = useToast();
  
  // Save to localStorage when data changes
  useEffect(() => {
    if (seoData) {
      localStorage.setItem(SEO_DATA_KEY, JSON.stringify(seoData));
    }
  }, [seoData]);

  useEffect(() => {
    if (allKeywords) {
      localStorage.setItem(KEYWORDS_DATA_KEY, JSON.stringify(allKeywords));
    }
  }, [allKeywords]);
  
  // Form for the page-specific SEO settings
  const pageSeoForm = useForm<PageSEOFormValues>({
    defaultValues: {
      title: "",
      description: "",
      keywords: "",
      ogImage: DEFAULT_OG_IMAGE
    }
  });
  
  // Form for general site-wide SEO settings
  const generalSeoForm = useForm<GeneralSEOFormValues>({
    defaultValues: {
      title: "",
      description: "",
      ogImage: DEFAULT_OG_IMAGE
    }
  });

  // Toggle between languages
  const handleLanguageChange = (lang: 'EN' | 'JP') => {
    setCurrentLanguage(lang);
    
    // Reset selected keywords when changing language
    setSelectedKeywords([]);
    
    // Reset forms with the data from the selected language - with added safety checks
    if (activeTab === "general" && seoData && seoData[lang] && seoData[lang].general) {
      const genData = seoData[lang].general as GeneralSEOFormValues;
      generalSeoForm.reset({
        title: genData.title || "",
        description: genData.description || "",
        ogImage: genData.ogImage || DEFAULT_OG_IMAGE
      });
    } else if (seoData && seoData[lang] && seoData[lang][activeTab]) {
      const pageData = seoData[lang][activeTab] as PageSEOFormValues;
      pageSeoForm.reset({
        title: pageData.title || "",
        description: pageData.description || "",
        keywords: pageData.keywords || "",
        ogImage: pageData.ogImage || DEFAULT_OG_IMAGE
      });
      
      // Extract keywords from the comma-separated string
      const keywordsArray = (pageData.keywords || "").split(',').map(k => k.trim()).filter(Boolean);
      setSelectedKeywords(keywordsArray);
    }
  };

  // Update form values when tab changes - with added safety checks
  React.useEffect(() => {
    // Safety check to make sure seoData and language data exists
    if (!seoData || !seoData[currentLanguage]) {
      console.error("SEO data not properly initialized");
      return;
    }
    
    if (activeTab === "general") {
      if (seoData[currentLanguage].general) {
        const genData = seoData[currentLanguage].general as GeneralSEOFormValues;
        generalSeoForm.reset({
          title: genData.title || "",
          description: genData.description || "",
          ogImage: genData.ogImage || DEFAULT_OG_IMAGE
        });
      } else {
        console.warn(`Missing general SEO data for ${currentLanguage}. Using defaults.`);
        const defaultGeneral = initialSEOData[currentLanguage].general;
        generalSeoForm.reset({
          title: defaultGeneral?.title || "Tunisia Tourism",
          description: defaultGeneral?.description || "",
          ogImage: defaultGeneral?.ogImage || DEFAULT_OG_IMAGE
        });
      }
    } else {
      if (seoData[currentLanguage][activeTab]) {
        const pageData = seoData[currentLanguage][activeTab] as PageSEOFormValues;
        pageSeoForm.reset({
          title: pageData.title || "",
          description: pageData.description || "",
          keywords: pageData.keywords || "",
          ogImage: pageData.ogImage || DEFAULT_OG_IMAGE
        });
        
        // Extract keywords from the comma-separated string
        const keywordsArray = (pageData.keywords || "").split(',').map(k => k.trim()).filter(Boolean);
        setSelectedKeywords(keywordsArray);
      } else {
        console.warn(`Missing ${activeTab} SEO data for ${currentLanguage}. Using defaults.`);
        const defaultPageData = initialSEOData[currentLanguage][activeTab] as PageSEOFormValues;
        pageSeoForm.reset({
          title: defaultPageData?.title || "",
          description: defaultPageData?.description || "",
          keywords: defaultPageData?.keywords || "",
          ogImage: defaultPageData?.ogImage || DEFAULT_OG_IMAGE
        });
        
        const keywordsArray = (defaultPageData?.keywords || "").split(',').map(k => k.trim()).filter(Boolean);
        setSelectedKeywords(keywordsArray);
      }
    }
  }, [activeTab, pageSeoForm, generalSeoForm, seoData, currentLanguage]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSavePageSEO = (data: PageSEOFormValues) => {
    // Update the keywords field with the selected keywords
    const updatedData = {
      ...data,
      keywords: selectedKeywords.join(', '),
      ogImage: data.ogImage || DEFAULT_OG_IMAGE // Ensure OG image always has a value
    };
    
    setSeoData(prevData => {
      if (!prevData) return initialSEOData;
      
      const newData = {
        ...prevData,
        [currentLanguage]: {
          ...prevData[currentLanguage],
          [activeTab]: updatedData
        }
      };
      return newData;
    });
    
    toast({
      title: currentLanguage === 'JP' ? "SEO設定を保存しました" : "SEO settings saved",
      description: currentLanguage === 'JP' 
        ? `${activeTab}のSEO設定が正常に更新されました。`
        : `Successfully updated SEO settings for ${activeTab}.`,
    });
  };

  const handleSaveGeneralSEO = (data: GeneralSEOFormValues) => {
    const updatedData = {
      ...data,
      ogImage: data.ogImage || DEFAULT_OG_IMAGE // Ensure OG image always has a value
    };

    setSeoData(prevData => {
      if (!prevData) return initialSEOData;
      
      const newData = {
        ...prevData,
        [currentLanguage]: {
          ...prevData[currentLanguage],
          general: updatedData
        }
      };
      return newData;
    });
    
    toast({
      title: currentLanguage === 'JP' ? "グローバルSEO設定を保存しました" : "Global SEO settings saved",
      description: currentLanguage === 'JP'
        ? "グローバルSEO設定が正常に更新されました。"
        : "Successfully updated global SEO settings.",
    });
  };

  const toggleKeywordActive = (keyword: string, category: "core" | "destination" | "long-tail") => {
    // Make sure the structure exists before trying to access it
    if (allKeywords && 
        allKeywords[currentLanguage] && 
        allKeywords[currentLanguage][category] && 
        Array.isArray(allKeywords[currentLanguage][category])) {
      
      setAllKeywords(prev => {
        if (!prev) return {
          EN: initialKeywords,
          JP: japaneseKeywords
        };
        
        const newKeywords = {
          ...prev,
          [currentLanguage]: {
            ...prev[currentLanguage],
            [category]: prev[currentLanguage][category].map((k: SEOKeyword) => 
              k.text === keyword ? { ...k, isActive: !k.isActive } : k
            )
          }
        };
        return newKeywords;
      });

      // Safely get the active state for the toast message
      const isCurrentlyActive = allKeywords[currentLanguage][category].find((k: SEOKeyword) => k.text === keyword)?.isActive;

      toast({
        title: currentLanguage === 'JP' ? "キーワードを更新しました" : "Keyword updated",
        description: currentLanguage === 'JP'
          ? `${keyword}が${isCurrentlyActive ? "無効" : "有効"}になりました。`
          : `${keyword} has been ${isCurrentlyActive ? "deactivated" : "activated"}.`,
      });
    }
  };

  const addNewKeyword = () => {
    if (!newKeyword.trim()) return;

    // Make sure the structure exists before trying to modify it
    if (allKeywords && 
        allKeywords[currentLanguage] && 
        allKeywords[currentLanguage][keywordTab] && 
        Array.isArray(allKeywords[currentLanguage][keywordTab])) {
      
      setAllKeywords(prev => {
        if (!prev) return {
          EN: initialKeywords,
          JP: japaneseKeywords
        };
        
        const keywordsArray = prev[currentLanguage][keywordTab] || [];
        const newKeywords = {
          ...prev,
          [currentLanguage]: {
            ...prev[currentLanguage],
            [keywordTab]: [
              ...keywordsArray,
              { 
                text: newKeyword.trim(), 
                category: keywordTab, 
                priority: keywordsArray.length > 0 ? 
                  Math.min(...keywordsArray.map((k: SEOKeyword) => k.priority)) - 1 : 
                  5,
                isActive: true 
              }
            ]
          }
        };
        return newKeywords;
      });

      setNewKeyword("");
      
      toast({
        title: currentLanguage === 'JP' ? "キーワードを追加しました" : "Keyword added",
        description: currentLanguage === 'JP'
          ? `"${newKeyword}"が${keywordTab}キーワードに追加されました。`
          : `"${newKeyword}" has been added to ${keywordTab} keywords.`,
      });
    }
  };

  const removeKeyword = (keyword: string, category: "core" | "destination" | "long-tail") => {
    // Make sure the structure exists before trying to modify it
    if (allKeywords && 
        allKeywords[currentLanguage] && 
        allKeywords[currentLanguage][category] && 
        Array.isArray(allKeywords[currentLanguage][category])) {
      
      setAllKeywords(prev => {
        if (!prev) return {
          EN: initialKeywords,
          JP: japaneseKeywords
        };
        
        const newKeywords = {
          ...prev,
          [currentLanguage]: {
            ...prev[currentLanguage],
            [category]: (prev[currentLanguage][category] || []).filter((k: SEOKeyword) => k.text !== keyword)
          }
        };
        return newKeywords;
      });

      toast({
        title: currentLanguage === 'JP' ? "キーワードを削除しました" : "Keyword removed",
        description: currentLanguage === 'JP'
          ? `"${keyword}"が${category}キーワードから削除されました。`
          : `"${keyword}" has been removed from ${category} keywords.`,
      });
    }
  };
  
  const toggleSelectedKeyword = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(prev => prev.filter(k => k !== keyword));
    } else {
      setSelectedKeywords(prev => [...prev, keyword]);
    }
  };
  
  const addRecommendedKeywords = () => {
    // Make sure the structure exists before trying to access it
    if (allKeywords && 
        allKeywords[currentLanguage] && 
        allKeywords[currentLanguage][keywordCategory] && 
        Array.isArray(allKeywords[currentLanguage][keywordCategory])) {
      
      // Get all active keywords from the selected category
      const keywordsToAdd = allKeywords[currentLanguage][keywordCategory]
        .filter((k: SEOKeyword) => k.isActive)
        .map((k: SEOKeyword) => k.text)
        .filter(k => !selectedKeywords.includes(k));
      
      // Add them to selected keywords (up to 5 or less)
      const newKeywords = [...selectedKeywords, ...keywordsToAdd.slice(0, 5)];
      setSelectedKeywords(newKeywords);
      
      // Update the form field
      pageSeoForm.setValue("keywords", newKeywords.join(", "));
      
      toast({
        title: currentLanguage === 'JP' ? "キーワードを追加しました" : "Keywords added",
        description: currentLanguage === 'JP'
          ? `推奨${keywordCategory}キーワードをメタデータに追加しました。`
          : `Added recommended ${keywordCategory} keywords to your metadata.`,
      });
    }
  };
  
  // Get language specific titles for UI components
  const getUITitle = (enVersion: string, jpVersion: string) => {
    return currentLanguage === 'JP' ? jpVersion : enVersion;
  };

  // Safety check: ensure allKeywords has both language keys with their category sub-keys
  useEffect(() => {
    // Ensure structure integrity
    if (!allKeywords || typeof allKeywords !== 'object') {
      setAllKeywords({
        EN: initialKeywords,
        JP: japaneseKeywords
      });
    } 
    else if (!allKeywords.EN || !allKeywords.JP) {
      const updatedKeywords = { ...allKeywords };
      if (!updatedKeywords.EN) updatedKeywords.EN = initialKeywords;
      if (!updatedKeywords.JP) updatedKeywords.JP = japaneseKeywords;
      setAllKeywords(updatedKeywords);
    }
  }, [allKeywords]);
  
  // Render function to safely display active keywords count
  const safeRenderKeywordCount = (language: 'EN' | 'JP', category: 'core' | 'destination' | 'long-tail') => {
    try {
      if (allKeywords && 
          allKeywords[language] && 
          allKeywords[language][category] && 
          Array.isArray(allKeywords[language][category])) {
        
        const total = allKeywords[language][category].length;
        const active = allKeywords[language][category].filter((k: SEOKeyword) => k.isActive).length;
        
        return `${active}/${total}`;
      }
      return "0/0";
    } catch (e) {
      console.error("Error rendering keyword count:", e);
      return "0/0";
    }
  };
  
  return (
    <EnhancedAdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              {getUITitle("SEO Management", "SEO管理")}
            </h1>
            <p className="text-gray-600 mt-2">
              {getUITitle(
                "Optimize your website's search engine visibility by managing meta tags, keywords, and SEO settings.",
                "メタタグ、キーワード、SEO設定を管理して、ウェブサイトの検索エンジン表示を最適化します。"
              )}
            </p>
          </div>
          
          {/* Language switcher */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {getUITitle("Language:", "言語:")}
            </span>
            <Select value={currentLanguage} onValueChange={(val: 'EN' | 'JP') => handleLanguageChange(val)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EN" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" /> English
                </SelectItem>
                <SelectItem value="JP" className="flex items-center gap-2">
                  <Flag className="h-4 w-4" /> 日本語
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="metadata" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="metadata">
              {getUITitle("Page Metadata", "ページメタデータ")}
            </TabsTrigger>
            <TabsTrigger value="keywords">
              {getUITitle("Keyword Management", "キーワード管理")}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="metadata">
            <Card>
              <CardHeader>
                <CardTitle>{getUITitle("Page SEO Settings", "ページSEO設定")}</CardTitle>
                <CardDescription>
                  {getUITitle(
                    "Manage the SEO settings for each page of your website.",
                    "ウェブサイトの各ページのSEO設定を管理します。"
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="general" onValueChange={handleTabChange}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="general">{getUITitle("Global Settings", "グローバル設定")}</TabsTrigger>
                    <TabsTrigger value="homepage">{getUITitle("Homepage", "ホームページ")}</TabsTrigger>
                    <TabsTrigger value="aboutPage">{getUITitle("About Page", "アバウトページ")}</TabsTrigger>
                    <TabsTrigger value="travelPage">{getUITitle("Travel Info", "旅行情報")}</TabsTrigger>
                    <TabsTrigger value="blogPage">{getUITitle("Blog Page", "ブログページ")}</TabsTrigger>
                    <TabsTrigger value="startMyTripPage">{getUITitle("Trip Builder", "旅行プランナー")}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value={activeTab}>
                    {activeTab === "general" ? (
                      <Form {...generalSeoForm}>
                        <form onSubmit={generalSeoForm.handleSubmit(handleSaveGeneralSEO)} className="space-y-6">
                          <FormField
                            control={generalSeoForm.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {getUITitle("Site Title", "サイトタイトル")}
                                  {currentLanguage === 'JP' && (
                                    <span className="ml-2 text-xs text-blue-500 font-normal">
                                      (English title for internal reference)
                                    </span>
                                  )}
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                  {getUITitle(
                                    "The main title of your website that appears in search results and browser tabs.",
                                    "検索結果やブラウザタブに表示されるウェブサイトのメインタイトル。"
                                  )}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={generalSeoForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{getUITitle("Site Description", "サイト説明")}</FormLabel>
                                <FormControl>
                                  <Textarea {...field} />
                                </FormControl>
                                <FormDescription>
                                  {getUITitle(
                                    "The primary description of your website used for SEO.",
                                    "SEOに使用されるウェブサイトの主要な説明。"
                                  )}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={generalSeoForm.control}
                            name="ogImage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{getUITitle("Default Open Graph Image", "デフォルトのOG画像")}</FormLabel>
                                <FormControl>
                                  <div className="space-y-4">
                                    <Input {...field} placeholder={DEFAULT_OG_IMAGE} />
                                    <div className="border rounded-md p-2">
                                      <p className="text-sm text-muted-foreground mb-2">{getUITitle("Preview:", "プレビュー:")}</p>
                                      <div className="w-full max-w-md mx-auto overflow-hidden rounded-md">
                                        <AspectRatio ratio={1200/630} className={cn("bg-muted")}>
                                          <img 
                                            src={field.value || DEFAULT_OG_IMAGE} 
                                            alt="Open Graph Preview"
                                            className="object-cover w-full h-full"
                                          />
                                        </AspectRatio>
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-2 text-center">
                                        {getUITitle("Recommended size: 1200×630 pixels", "推奨サイズ：1200×630ピクセル")}
                                      </p>
                                    </div>
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  {getUITitle(
                                    "The default image that appears when your website is shared on social media. Recommended size: 1200×630 pixels.",
                                    "ウェブサイトがソーシャルメディアで共有されるときに表示されるデフォルト画像。推奨サイズ：1200×630ピクセル。"
                                  )}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button type="submit">{getUITitle("Save SEO Settings", "SEO設定を保存")}</Button>
                        </form>
                      </Form>
                    ) : (
                      <Form {...pageSeoForm}>
                        <form onSubmit={pageSeoForm.handleSubmit(handleSavePageSEO)} className="space-y-6">
                          <FormField
                            control={pageSeoForm.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {getUITitle("Page Title", "ページタイトル")} 
                                  {currentLanguage === 'JP' && (
                                    <span className="ml-2 text-xs text-blue-500 font-normal">
                                      (English title for internal reference)
                                    </span>
                                  )}
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                  {getUITitle(
                                    "The title tag that appears in search engine results (50-60 characters recommended).",
                                    "検索エンジンの結果に表示されるタイトルタグ（50〜60文字推奨）。"
                                  )}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={pageSeoForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{getUITitle("Meta Description", "メタ説明")}</FormLabel>
                                <FormControl>
                                  <Textarea {...field} />
                                </FormControl>
                                <FormDescription>
                                  {getUITitle(
                                    "The description that appears in search engine results (150-160 characters recommended).",
                                    "検索エンジンの結果に表示される説明（150〜160文字推奨）。"
                                  )}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={pageSeoForm.control}
                            name="keywords"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{getUITitle("Meta Keywords", "メタキーワード")}</FormLabel>
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Select value={keywordCategory} onValueChange={(value: "core" | "destination" | "long-tail") => setKeywordCategory(value)}>
                                      <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder={getUITitle("Keyword category", "キーワードカテゴリ")} />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="core">{getUITitle("Core Keywords", "コアキーワード")}</SelectItem>
                                        <SelectItem value="destination">{getUITitle("Destination Keywords", "目的地キーワード")}</SelectItem>
                                        <SelectItem value="long-tail">{getUITitle("Long Tail Keywords", "ロングテールキーワード")}</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={addRecommendedKeywords}
                                      className="flex items-center gap-1"
                                    >
                                      <RefreshCw size={14} />
                                      {getUITitle("Add Recommended", "おすすめを追加")}
                                    </Button>
                                  </div>
                                  
                                  <FormControl>
                                    <div className="space-y-3">
                                      <Textarea 
                                        {...field} 
                                        value={selectedKeywords.join(', ')}
                                        onChange={(e) => {
                                          field.onChange(e);
                                          setSelectedKeywords(e.target.value.split(',').map(k => k.trim()).filter(k => k));
                                        }}
                                      />
                                      
                                      <div className="border rounded-lg p-3 bg-muted/30">
                                        <p className="text-sm font-medium mb-2">{getUITitle("Selected Keywords:", "選択されたキーワード:")}</p>
                                        <div className="flex flex-wrap gap-2">
                                          {selectedKeywords.map((keyword, index) => (
                                            <Badge 
                                              key={index} 
                                              variant="secondary"
                                              className="flex items-center gap-1 cursor-pointer"
                                              onClick={() => toggleSelectedKeyword(keyword)}
                                            >
                                              {keyword}
                                              <X size={14} className="opacity-70 hover:opacity-100" />
                                            </Badge>
                                          ))}
                                          {selectedKeywords.length === 0 && (
                                            <p className="text-sm text-muted-foreground">
                                              {getUITitle("No keywords selected.", "キーワードが選択されていません。")}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                      
                                      <div className="rounded-lg border p-3">
                                        <p className="text-sm font-medium mb-2">{getUITitle("Suggested Keywords:", "推奨キーワード:")}</p>
                                        <div className="flex flex-wrap gap-2">
                                          {allKeywords[currentLanguage][keywordCategory]
                                            .filter((k: SEOKeyword) => k.isActive)
                                            .slice(0, 10)
                                            .map((keyword: SEOKeyword, index: number) => (
                                              <Badge 
                                                key={index} 
                                                variant={selectedKeywords.includes(keyword.text) ? "default" : "outline"}
                                                className="cursor-pointer"
                                                onClick={() => toggleSelectedKeyword(keyword.text)}
                                              >
                                                {keyword.text}
                                              </Badge>
                                            ))}
                                        </div>
                                      </div>
                                    </div>
                                  </FormControl>
                                </div>
                                <FormDescription>
                                  {getUITitle(
                                    "Choose keywords relevant to the page content. Mix core, destination, and long-tail keywords for better SEO results.",
                                    "ページの内容に関連するキーワードを選択してください。より良いSEO結果を得るために、コア、目的地、およびロングテールキーワードを組み合わせてください。"
                                  )}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={pageSeoForm.control}
                            name="ogImage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{getUITitle("Open Graph Image", "OG画像")}</FormLabel>
                                <FormControl>
                                  <div className="space-y-4">
                                    <Input {...field} placeholder={DEFAULT_OG_IMAGE} />
                                    <div className="border rounded-md p-2">
                                      <p className="text-sm text-muted-foreground mb-2">{getUITitle("Preview:", "プレビュー:")}</p>
                                      <div className="w-full max-w-md mx-auto overflow-hidden rounded-md">
                                        <AspectRatio ratio={1200/630} className={cn("bg-muted")}>
                                          <img 
                                            src={field.value || DEFAULT_OG_IMAGE} 
                                            alt="Open Graph Preview"
                                            className="object-cover w-full h-full"
                                          />
                                        </AspectRatio>
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-2 text-center">
                                        {getUITitle("Recommended size: 1200×630 pixels", "推奨サイズ：1200×630ピクセル")}
                                      </p>
                                    </div>
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  {getUITitle(
                                    "The image that appears when the page is shared on social media (1200×630 pixels recommended).",
                                    "ページがソーシャルメディアで共有されるときに表示される画像（1200×630ピクセル推奨）。"
                                  )}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button type="submit">{getUITitle("Save SEO Settings", "SEO設定を保存")}</Button>
                        </form>
                      </Form>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="keywords">
            <Card>
              <CardHeader>
                <CardTitle>{getUITitle("Keyword Management", "キーワード管理")}</CardTitle>
                <CardDescription>
                  {getUITitle(
                    "Manage your SEO keywords by category to improve search visibility.",
                    "検索の可視性を向上させるために、カテゴリ別にSEOキーワードを管理します。"
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="core" onValueChange={(value) => setKeywordTab(value as "core" | "destination" | "long-tail")}>
                  <div className="flex justify-between items-center mb-6">
                    <TabsList>
                      <TabsTrigger value="core" className="flex items-center gap-1">
                        <Tag size={16} /> {getUITitle("Core", "コア")}
                      </TabsTrigger>
                      <TabsTrigger value="destination" className="flex items-center gap-1">
                        <Map size={16} /> {getUITitle("Destination", "目的地")}
                      </TabsTrigger>
                      <TabsTrigger value="long-tail" className="flex items-center gap-1">
                        <ListFilter size={16} /> {getUITitle("Long Tail", "ロングテール")}
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="mb-6 flex gap-2">
                    <Input 
                      placeholder={getUITitle(`Add new ${keywordTab} keyword...`, `新しい${keywordTab === 'core' ? 'コア' : keywordTab === 'destination' ? '目的地' : 'ロングテール'}キーワードを追加...`)}
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addNewKeyword()}
                      className="flex-1"
                    />
                    <Button onClick={addNewKeyword} size="sm">
                      <Plus size={16} className="mr-1" /> {getUITitle("Add", "追加")}
                    </Button>
                  </div>

                  <div className="border rounded-lg p-3">
                    <ScrollArea className="h-[420px] pr-4">
                      <div className="space-y-2">
                        {!allKeywords || 
                         !allKeywords[currentLanguage] || 
                         !allKeywords[currentLanguage][keywordTab] ||
                         allKeywords[currentLanguage][keywordTab].length === 0 ? (
                          <p className="text-center text-muted-foreground py-8">
                            {getUITitle(
                              `No ${keywordTab} keywords found. Add some keywords to get started.`,
                              `${keywordTab === 'core' ? 'コア' : keywordTab === 'destination' ? '目的地' : 'ロングテール'}キーワードが見つかりません。始めるにはキーワードを追加してください。`
                            )}
                          </p>
                        ) : (
                          allKeywords[currentLanguage][keywordTab].map((keyword: SEOKeyword) => (
                            <div 
                              key={keyword.text}
                              className="flex items-center justify-between p-2 border rounded-md bg-card"
                            >
                              <div className="flex items-center gap-3">
                                <Checkbox 
                                  id={`keyword-${keyword.text}`}
                                  checked={keyword.isActive}
                                  onCheckedChange={() => toggleKeywordActive(keyword.text, keywordTab)}
                                />
                                <label 
                                  htmlFor={`keyword-${keyword.text}`}
                                  className={cn(
                                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                                    !keyword.isActive && "text-muted-foreground line-through"
                                  )}
                                >
                                  {keyword.text}
                                </label>
                                <Badge variant={keyword.isActive ? "default" : "outline"} className="ml-2">
                                  {getUITitle(`Priority ${keyword.priority}`, `優先度 ${keyword.priority}`)}
                                </Badge>
                              </div>
                              <Button
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeKeyword(keyword.text, keywordTab)}
                              >
                                <X size={16} className="text-muted-foreground hover:text-destructive" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </div>

                  <div className="mt-6 bg-muted/50 p-3 rounded-lg">
                    <h3 className="text-sm font-semibold mb-2">{getUITitle("Keyword Tips", "キーワードのヒント")}</h3>
                    <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                      <li>
                        {getUITitle(
                          "Core keywords should be used across the site in headings and important content.",
                          "コアキーワードは、見出しや重要なコンテンツなど、サイト全体で使用する必要があります。"
                        )}
                      </li>
                      <li>
                        {getUITitle(
                          "Destination keywords are best for landing pages focused on specific locations.",
                          "目的地キーワードは、特定の場所に焦点を当てたランディングページに最適です。"
                        )}
                      </li>
                      <li>
                        {getUITitle(
                          "Long-tail keywords work well for blog posts and detailed service descriptions.",
                          "ロングテールキーワードは、ブログ投稿や詳細なサービス説明に適しています。"
                        )}
                      </li>
                      <li>
                        {getUITitle(
                          "Active keywords will be automatically included in site recommendations.",
                          "アクティブなキーワードは、サイトの推奨事項に自動的に含まれます。"
                        )}
                      </li>
                    </ul>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="bg-muted/30 border-dashed">
          <CardHeader>
            <CardTitle className="text-lg">{getUITitle("SEO Performance Overview", "SEOパフォーマンス概要")}</CardTitle>
            <CardDescription>
              {getUITitle(
                "Monitor how your SEO efforts are performing over time.",
                "SEO活動のパフォーマンスを経時的に監視します。"
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-card rounded-lg border">
                <h3 className="font-medium mb-2">{getUITitle("Keyword Usage", "キーワードの使用")}</h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{getUITitle("Active Core Keywords:", "アクティブなコアキーワード:")}</span>
                    <span className="font-medium">
                      {safeRenderKeywordCount(currentLanguage, 'core')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{getUITitle("Active Destination Keywords:", "アクティブな目的地キーワード:")}</span>
                    <span className="font-medium">
                      {safeRenderKeywordCount(currentLanguage, 'destination')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{getUITitle("Active Long-tail Keywords:", "アクティブなロングテールキーワード:")}</span>
                    <span className="font-medium">
                      {safeRenderKeywordCount(currentLanguage, 'long-tail')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-card rounded-lg border">
                <h3 className="font-medium mb-2">{getUITitle("SEO Recommendations", "SEOの推奨事項")}</h3>
                <ul className="text-sm space-y-1.5 ml-5 list-disc">
                  <li>
                    {getUITitle(
                      "Add more destination-specific keywords for better local targeting",
                      "より良いローカルターゲティングのために、より多くの目的地固有のキーワードを追加する"
                    )}
                  </li>
                  <li>
                    {getUITitle(
                      "Ensure all page titles include at least one core keyword",
                      "すべてのページタイトルに少なくとも1つのコアキーワードが含まれていることを確認する"
                    )}
                  </li>
                  <li>
                    {getUITitle(
                      "Use more long-tail keywords in blog content for improved ranking",
                      "ランキング向上のためにブログコンテンツでより多くのロングテールキーワードを使用する"
                    )}
                  </li>
                  <li>
                    {getUITitle(
                      "Update meta descriptions to be between 150-160 characters",
                      "メタ説明を150〜160文字の間に更新する"
                    )}
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button variant="outline">
                {getUITitle("View Full SEO Report", "完全なSEOレポートを表示")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </EnhancedAdminLayout>
  );
};

export default AdminSEOPage;
