
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { TranslateText } from "./translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export function QuestionBanner(): JSX.Element {
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isQuestionFocused, setIsQuestionFocused] = useState(false);
  const { currentLanguage } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Submitted:", { email, question });
    toast.success(currentLanguage === "EN"
      ? "Your question has been submitted. We'll get back to you soon!"
      : "質問が送信されました。すぐにご連絡いたします！");
    // Reset form
    setEmail("");
    setQuestion("");
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 mb-12">
      <div className="bg-blue-500 rounded-[12px] overflow-hidden shadow-lg">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row px-6 py-10">
          {/* Left section with image and message */}
          <div className="w-full md:w-[63%] flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-full md:w-[38%]">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/62d9bdcbd9e942429261da212732eafc/e41c623001a3346d1041f4cb74e77131d6c5bc92"
                alt="Support Image"
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="w-full md:w-[60%] text-white">
              <p className="text-2xl font-normal mb-2">
                <TranslateText text="Do you have any more questions that weren't answered in this video?" language={currentLanguage} />
              </p>
              <h3 className="text-3xl md:text-4xl font-bold leading-tight">
                <TranslateText text="Don't Hesitate to Ask!" language={currentLanguage} />
              </h3>
            </div>
          </div>

          {/* Right section with form */}
          <div className="w-full md:w-[35%] mt-8 md:mt-0 md:pl-8">
            <div className="flex flex-col gap-5">
              {/* Email input field - making frame invisible */}
              <label
                htmlFor="email"
                className={`bg-blue-600/50 hover:bg-blue-600/70 rounded-[13px] transition-colors cursor-text ${isEmailFocused ? 'bg-blue-600/70' : ''} flex items-center gap-2 px-5 py-4 w-full`}
                onClick={() => document.getElementById('email')?.focus()}
              >
                <Mail className="w-5 h-5 text-white flex-shrink-0" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  placeholder={
                    currentLanguage === "EN" ? "Your email" : "メールアドレス"
                  }
                  className="border-none focus-visible:ring-0 bg-transparent text-white placeholder:text-[#C0D6FB] p-0 h-auto text-lg w-full shadow-none outline-none"
                  required
                  style={{ outline: 'none', boxShadow: 'none' }}
                />
              </label>

              {/* Question input field */}
              <label
                htmlFor="question"
                className={`border-2 ${isQuestionFocused ? 'border-blue-400' : 'border-[#C0D6FB]'} bg-white rounded-[13px] px-5 py-4 transition-colors hover:border-blue-400 shadow-sm cursor-text`}
                onClick={() => document.getElementById('question')?.focus()}
              >
                <div className="flex items-start gap-2">
                  <Textarea
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onFocus={() => setIsQuestionFocused(true)}
                    onBlur={() => setIsQuestionFocused(false)}
                    placeholder={
                      currentLanguage === "EN" ? "What's your question about Tunisia?" : "チュニジアについて質問がありますか？"
                    }
                    className="border-none focus-visible:ring-0 text-[#4A7AB5] placeholder:text-[#8FAFE5] p-0 h-24 text-lg resize-none w-full"
                    required
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    <span>
                      <TranslateText text="Submit" language={currentLanguage} />
                    </span>
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
