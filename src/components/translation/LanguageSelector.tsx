
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";
import { toast } from "sonner";

export function LanguageSelector() {
  const { currentLanguage, setLanguageWithReload } = useTranslation();
  
  const handleLanguageChange = (value: string) => {
    if (value === currentLanguage) return;
    
    console.log(`LanguageSelector: Changing language to ${value}`);
    
    // Show language switching toast first
    if (value === 'JP') {
      toast.info("言語を切り替えています...");
    } else {
      toast.info("Switching language...");
    }
    
    // Use the new method with page reload to ensure complete language switch
    setLanguageWithReload(value as 'EN' | 'JP');
  };

  return (
    <div className="flex items-center">
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[120px] border-blue-100 focus:ring-blue-200">
          <div className="flex items-center gap-2">
            {currentLanguage === "JP" ? (
              <img 
                src="/uploads/5d66739d-6d91-48f0-99e6-f5ec39df4306.png" 
                alt="Japanese flag" 
                className="w-6 h-5 object-cover border border-gray-200 rounded-sm shadow-sm"
              />
            ) : (
              <img 
                src="/flags/us.png" 
                alt="US flag" 
                className="w-6 h-4 object-cover border border-gray-200 rounded-sm shadow-sm"
              />
            )}
            <SelectValue placeholder="Select language" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="EN" className="flex items-center gap-2">
            <span className="flex items-center gap-2">
              <img 
                src="/flags/us.png" 
                alt="US flag" 
                className="w-6 h-4 object-cover border border-gray-200 rounded-sm shadow-sm"
              />
              English
            </span>
          </SelectItem>
          <SelectItem value="JP" className="flex items-center gap-2">
            <span className="flex items-center gap-2">
              <img 
                src="/uploads/5d66739d-6d91-48f0-99e6-f5ec39df4306.png" 
                alt="Japanese flag" 
                className="w-6 h-5 object-cover border border-gray-200 rounded-sm shadow-sm"
              />
              日本語
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
