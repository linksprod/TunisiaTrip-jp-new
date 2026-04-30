import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { TranslateText } from "./translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { supabase } from "@/integrations/supabase/client";
export function NewsletterSection(): JSX.Element {
  const { currentLanguage, t } = useTranslation();
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      const { error } = await supabase
        .from('contacts')
        .insert([{
          name: "Newsletter User",
          email,
          message: question || "Newsletter Subscription",
          subject: "Quick Question / Newsletter",
          status: 'new',
          submitted_date: new Date().toISOString().split('T')[0]
        }]);

      if (error) throw error;

      // Show success message
      toast({
        title: t("Thank you for your question!"),
        description: t("We'll get back to you soon.")
      });

      // Reset form
      setEmail("");
      setQuestion("");
    } catch (error: any) {
      console.error("Error submitting newsletter question:", error);
      toast({
        variant: "destructive",
        title: t("Error"),
        description: t("There was an error submitting your request.")
      });
    }
  };
  return <section className="max-w-[1200px] mx-auto px-4">
    <form onSubmit={handleSubmit} className="bg-blue-500 rounded-xl text-white p-6 flex flex-col md:flex-row items-center">
      {/* Left image */}
      <div className="w-full md:w-1/4 mb-4 md:mb-0 flex items-center justify-center">

      </div>

      {/* Center text */}
      <div className="w-full md:w-1/2 text-center md:text-left mb-4 md:mb-0">
        <p className="text-lg mb-2">
          <TranslateText
            text="Do you have any more questions
that weren't answered in our Blog?"
            language={currentLanguage}
          />
        </p>
        <h2 className="text-2xl font-bold">
          <TranslateText text="Don't Hesitate to Ask!" language={currentLanguage} />
        </h2>
      </div>

      {/* Right form */}
      <div className="w-full md:w-1/4 space-y-4">
        <Input type="email" placeholder={t("Email")} className="bg-transparent border border-white text-white placeholder-white/70 h-10 rounded focus:ring-2 focus:ring-white/50" value={email} onChange={e => setEmail(e.target.value)} />

        <Input type="text" placeholder={t("What's your question?")} className="bg-white text-blue-500 placeholder-blue-300 h-10 rounded focus:ring-2 focus:ring-blue-300" value={question} onChange={e => setQuestion(e.target.value)} />

        <Button type="submit" className="w-full bg-white text-blue-500 hover:bg-blue-50 transition-colors rounded">
          <TranslateText text="Submit" language={currentLanguage} />
        </Button>
      </div>
    </form>
  </section>;
}