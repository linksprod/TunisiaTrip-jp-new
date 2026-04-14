
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Send, X, UserRound, ChevronRight, Loader2, MapPin } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/use-translation";
import { useChatAI } from "@/hooks/use-chat-ai";
import { useNavigate } from "react-router-dom";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function ChatDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();
  const { currentLanguage } = useTranslation();
  const { sendMessage, isLoading } = useChatAI();
  const navigate = useNavigate();
  
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [isHidden, setIsHidden] = React.useState(false);

  // Set initial welcome message based on language with emojis and HTML formatting
  React.useEffect(() => {
    setMessages([{
      id: "1",
      text: currentLanguage === "JP" 
        ? "こんにちは！🌟 チュニジア旅行の<b>エキスパートアシスタント</b>です！🎉 <b>素晴らしいサハラ砂漠</b> 🐪、<b>美しい地中海ビーチ</b> 🏖️、<b>古代遺跡</b> 🏛️、<b>美味しい料理</b> 🍽️ など、チュニジアの魅力について何でもお聞かせください！ ✨"
        : "Hello! 🌟 I'm your <b>Tunisia Trip expert assistant</b>! 🎉 I'm absolutely thrilled to help you discover <b>amazing Tunisia</b>! From <b>Sahara desert adventures</b> 🐪 to <b>Mediterranean beaches</b> 🏖️, <b>ancient ruins</b> 🏛️ to <b>delicious cuisine</b> 🍽️ - I know it all! What would you like to explore? ✨",
      sender: "bot",
      timestamp: new Date(),
    }]);
  }, [currentLanguage]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");

    // Check if this is the first user message (potentially the email)
    if (!userEmail && currentInput.includes('@')) {
      setUserEmail(currentInput);
      const emailConfirmMessage = currentLanguage === "JP" 
        ? "メールアドレスを受け取りました！🎉 それでは<b>素晴らしいチュニジア旅行</b>の計画を始めましょう！🌟 どんなことについて知りたいですか？ 🗺️"
        : "Email received! 🎉 Now let's start planning your <b>amazing Tunisia adventure</b>! 🌟 What would you like to know about? 🗺️";
      
      toast.success(currentLanguage === "JP" 
        ? "メールアドレスありがとうございます！🎉" 
        : "Email received! 🎉"
      );
      
      // Add immediate confirmation message
      setTimeout(() => {
        const confirmMessage: ChatMessage = {
          id: (Date.now() + 100).toString(),
          text: emailConfirmMessage,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, confirmMessage]);
      }, 500);
    }

    try {
      // Prepare conversation history for OpenAI (last 10 messages to manage context)
      const conversationHistory = messages
        .slice(-10)
        .map(msg => ({
          role: msg.sender === "user" ? "user" as const : "assistant" as const,
          content: msg.text
        }));

      // Get AI response
      const aiResponse = await sendMessage(currentInput, conversationHistory, currentLanguage);

      // Add AI response to messages
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);

    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Enhanced error message with emojis and HTML
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: currentLanguage === "JP" 
          ? "申し訳ございませんが、現在返答できません 😅 でもチュニジアについて<b>何でも聞いてください</b>！🌟 もう一度お試しください ✨"
          : "I apologize, but I can't respond right now 😅 But I'm still here to help with your <b>Tunisia questions</b>! 🌟 Please try again ✨",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        return;
      } else {
        e.preventDefault();
        handleSend();
      }
    }
  };

  // Function to render message text with HTML support and trip suggestions
  const renderMessageText = (text: string) => {
    // Check for travel suggestion trigger
    if (text.includes('[START_TRIP_SUGGESTION]')) {
      const parts = text.split('[START_TRIP_SUGGESTION]');
      return (
        <div className="whitespace-pre-wrap">
          <div dangerouslySetInnerHTML={{ __html: parts[0] }} />
          <div className="mt-3 pt-3 border-t border-gray-200">
            <Button
              onClick={() => {
                navigate('/start-my-trip');
                onOpenChange(false);
                toast.success(currentLanguage === "JP" 
                  ? "旅行プランナーに移動中... 🎉" 
                  : "Redirecting to trip planner... 🎉"
                );
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg py-2 px-4 transition-all duration-200 hover:scale-105 flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              {currentLanguage === "JP" ? "旅行をシミュレート 🌟" : "Start Trip Simulation 🌟"}
            </Button>
          </div>
          {parts[1] && <div dangerouslySetInnerHTML={{ __html: parts[1] }} />}
        </div>
      );
    }
    
    return (
      <div 
        className="whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  };

  return (
    <div 
      className={`fixed ${isMobile ? 'inset-0 z-[100]' : 'right-6 bottom-24 z-50'} transition-all duration-300 transform ${
        open 
          ? 'scale-100 opacity-100' 
          : 'scale-95 opacity-0 pointer-events-none'
      } ${isHidden ? 'translate-x-[calc(100%-32px)]' : 'translate-x-0'}`}
    >
      <div className={`${isMobile ? 'h-full w-full' : 'sm:max-w-[400px] h-[500px] w-[350px]'} flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in`}>
        <div className="flex items-center justify-between px-4 py-3 border-b bg-[#347EFF]">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border-2 border-white">
              <AvatarImage 
                src="/uploads/42ee9aec-52e6-40fb-a7f4-f4813e355e7c.png" 
                alt="Tunisia Trip Expert Avatar"
              />
              <AvatarFallback><UserRound className="h-5 w-5" /></AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-semibold text-white">
              {currentLanguage === "JP" ? "🌟 チュニジア旅行エキスパート" : "🌟 Tunisia Trip Expert"}
            </h2>
          </div>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {
                if (!isHidden) {
                  onOpenChange(false);
                } else {
                  setIsHidden(false);
                }
              }}
              className="h-8 w-8 hover:bg-blue-600 text-white relative"
            >
              {isHidden ? (
                <ChevronRight className="h-4 w-4 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        <ScrollArea className="flex-1 p-4">
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                } animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 transition-all duration-200 hover:scale-[1.02] ${
                    message.sender === "user"
                      ? "bg-[#347EFF] text-white rounded-br-sm animate-slide-in-right"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm animate-slide-in-left"
                  }`}
                >
                  {message.sender === "bot" ? renderMessageText(message.text) : (
                    <div className="whitespace-pre-wrap">{message.text}</div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm px-4 py-2 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{currentLanguage === "JP" ? "🤔 考え中..." : "🤔 Thinking..."}</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2 p-4 border-t bg-gray-50">
          <Textarea
            placeholder={currentLanguage === "JP" ? "チュニジアについて聞いてください... 🌟" : "Ask me about Tunisia... 🌟"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1 rounded-full border-none bg-gray-50 hover:bg-gray-100 focus:ring-2 focus:ring-[#347EFF] focus:ring-opacity-50 outline-none transition-all duration-200 h-10 min-h-[40px] py-2 px-4 resize-none overflow-hidden"
          />
          <Button
            onClick={handleSend}
            size="icon"
            disabled={isLoading || !input.trim()}
            className="bg-[#347EFF] hover:bg-blue-600 rounded-full transition-all duration-200 hover:scale-105 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
