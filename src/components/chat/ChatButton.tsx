
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, UserRound } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "@/hooks/use-translation";

export function ChatButton({ onClick, isOpen }: { onClick: () => void; isOpen: boolean }) {
  const { currentLanguage } = useTranslation();
  
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 h-14 px-4 rounded-full bg-[#347EFF] hover:bg-blue-600 shadow-lg z-50 transition-all duration-200 hover:scale-105 hover:shadow-xl flex items-center gap-2"
    >
      {isOpen ? (
        <>
          <X className="h-6 w-6 text-white" />
          <span className="text-white">{currentLanguage === "JP" ? "閉じる" : "Close"}</span>
        </>
      ) : (
        <>
          <Avatar className="h-8 w-8 border-2 border-white">
            <AvatarImage 
              src="/uploads/42ee9aec-52e6-40fb-a7f4-f4813e355e7c.png" 
              alt="Trip Assistant Avatar"
            />
            <AvatarFallback><UserRound className="h-5 w-5" /></AvatarFallback>
          </Avatar>
          <span className="text-white">{currentLanguage === "JP" ? "こんにちは!" : "Hi!"}</span>
        </>
      )}
    </Button>
  );
}
