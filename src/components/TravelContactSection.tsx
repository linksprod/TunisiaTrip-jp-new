import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { TranslateText } from "./translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { MapPin, Mail, Plane } from "lucide-react";

export function TravelContactSection(): JSX.Element {
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const { currentLanguage, t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: t("Please enter your email"),
        variant: "destructive"
      });
      return;
    }

    // Form validation for email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: t("Please enter a valid email"),
        variant: "destructive"
      });
      return;
    }

    if (!question) {
      toast({
        title: t("Please enter your question"),
        variant: "destructive"
      });
      return;
    }

    // In a real app, you would send this data to your backend
    console.log("Travel inquiry submitted:", {
      email,
      question
    });

    // Show success message
    toast({
      title: t("Thank you for your travel inquiry!"),
      description: t("We'll get back to you within 24 hours with travel recommendations.")
    });

    // Reset form
    setEmail("");
    setQuestion("");
  };

  return (
    <section className="max-w-[1200px] mx-auto px-4">
      <div className="bg-primary rounded-2xl overflow-hidden shadow-xl">
        <div className="relative p-8 md:p-12">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-white/20"></div>
            <div className="absolute bottom-8 left-8 w-24 h-24 rounded-full bg-white/20"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-white/20"></div>
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="text-white space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-full">
                  <Plane className="w-6 h-6 text-white" />
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-white" />
                </div>
              </div>

              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  <TranslateText
                    text="Ready to Experience Tunisia?"
                    language={currentLanguage}
                  />
                </h2>
                <p className="text-lg md:text-xl text-white/90 mb-2">
                  <TranslateText
                    text="Get personalized travel advice from our local experts"
                    language={currentLanguage}
                  />
                </p>
                <p className="text-white/80">
                  <TranslateText
                    text="Let us help you plan your perfect Tunisia adventure based on our featured destinations and insider knowledge."
                    language={currentLanguage}
                  />
                </p>
              </div>

              {/* Feature List */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/90">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-sm">
                    <TranslateText
                      text="Personalized itinerary planning"
                      language={currentLanguage}
                    />
                  </span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-sm">
                    <TranslateText
                      text="Local insider recommendations"
                      language={currentLanguage}
                    />
                  </span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-sm">
                    <TranslateText
                      text="24/7 travel support"
                      language={currentLanguage}
                    />
                  </span>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 border border-white/30 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-900 text-sm font-medium mb-2">
                    <TranslateText text="Email Address" language={currentLanguage} />
                  </label>
                  <Input
                    type="email"
                    placeholder={t("your@email.com")}
                    className="bg-white text-gray-900 border-gray-300 placeholder-gray-500 focus:border-primary focus:ring-primary/50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-gray-900 text-sm font-medium mb-2">
                    <TranslateText text="Your Travel Questions" language={currentLanguage} />
                  </label>
                  <Textarea
                    placeholder={t("What would you like to know about Tunisia? Which places interest you most?")}
                    className="bg-white text-gray-900 border-gray-300 placeholder-gray-500 focus:border-primary focus:ring-primary/50 min-h-[100px] resize-none"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-white text-primary hover:bg-white/90 transition-all duration-300 font-semibold py-3"
                >
                  <TranslateText text="Get Travel Advice" language={currentLanguage} />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}