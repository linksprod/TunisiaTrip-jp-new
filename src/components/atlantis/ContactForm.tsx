import React, { useState, useEffect } from "react";
import { Mail, Phone, Pin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { InfoImagesCarousel } from "./InfoImagesCarousel";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { useLocation, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  typeOfRequest: z.string().min(1, "Type of request is required"),
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  confirmEmail: z.string().min(1, "Please confirm your email"),
  details: z.string()
});

export function ContactForm() {
  const { toast } = useToast();
  const { currentLanguage } = useTranslation();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      typeOfRequest: "",
      name: "",
      address: "",
      zipCode: "",
      phone: "",
      email: "",
      confirmEmail: "",
      details: ""
    }
  });

  // Check for message parameter in URL
  useEffect(() => {
    const messageParam = searchParams.get('message');
    if (messageParam) {
      form.setValue('details', decodeURIComponent(messageParam));
    }
  }, [searchParams, form]);

  // Listen for tab change events that might include a message
  useEffect(() => {
    const handleTabChange = (event: CustomEvent) => {
      const { message } = event.detail;
      if (message) {
        form.setValue('details', message);
      }
    };

    window.addEventListener('changeTab', handleTabChange as EventListener);

    return () => {
      window.removeEventListener('changeTab', handleTabChange as EventListener);
    };
  }, [form]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (data.email !== data.confirmEmail) {
      toast({
        variant: "destructive",
        title: currentLanguage === 'JP' ? 'エラー' : "Error",
        description: currentLanguage === 'JP' ? 'メールアドレスが一致しません' : "Email addresses do not match"
      });
      return;
    }

    try {
      console.log("Attempting to insert data:", {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.typeOfRequest,
        message: data.details,
        status: 'new',
        submittedDate: new Date().toISOString().split('T')[0]
      });

      const response = await supabase
        .from('contacts')
        .insert([{
          name: data.name,
          email: data.email,
          phone: data.phone,
          subject: data.typeOfRequest,
          message: data.details,
          status: 'new',
          submitted_date: new Date().toISOString().split('T')[0]
        }]);

      console.log("Supabase response:", response);

      if (response.error) throw response.error;

      toast({
        title: currentLanguage === 'JP' ? 'フォームが送信されました' : "Form submitted",
        description: currentLanguage === 'JP' ? 'すぐにご連絡いたします！' : "We'll get back to you soon!"
      });
      form.reset();
    } catch (error: any) {
      console.error("DETAILED ERROR:", error);
      toast({
        variant: "destructive",
        title: currentLanguage === 'JP' ? 'エラー' : "Error",
        description: error.message || (currentLanguage === 'JP' ? '送信中にエラーが発生しました。' : "There was an error submitting your request.")
      });
    }
  }

  return (
    <div className="w-full mx-auto">
      <div className="w-full h-[180px] relative mb-4">
        <img
          src="/uploads/7750fd54-c8b5-41c9-8087-42fc1c8e6d94.png"
          alt="Office interior"
          className="object-cover w-full h-full rounded-xl"
        />
      </div>

      <div>
        <h1 className="text-lg md:text-xl text-[#1F1F20] font-bold mb-2">
          <TranslateText text="Inquiry Form for Group Travels" language={currentLanguage} />
        </h1>

        <div className="flex items-center text-[#347EFF] text-sm cursor-pointer mb-4">
          <TranslateText text="Explore our Itineraries" language={currentLanguage} />
          <span className="ml-2">→</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-2/3">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                
                <div className="relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#347EFF]" />
                  <FormField control={form.control} name="typeOfRequest" render={({ field }) => (
                    <FormItem className="ml-8">
                      <div className="text-[#BF4757] text-xs mb-1">
                        <TranslateText text="must fill" language={currentLanguage} />
                      </div>
                      <FormLabel className="text-base md:text-lg text-[#1F1F20] font-medium">
                        <TranslateText text="Type of Request" language={currentLanguage} />
                      </FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="mt-1 bg-[#F6F8FB] text-sm p-3 rounded-lg w-full">
                            <SelectValue placeholder={<TranslateText text="Select type..." language={currentLanguage} />} />
                          </SelectTrigger>
                          <SelectContent className="z-50 bg-white">
                            <SelectItem value="Transportation">
                              <TranslateText text="Transportation" language={currentLanguage} />
                            </SelectItem>
                            <SelectItem value="Booking">
                              <TranslateText text="Booking" language={currentLanguage} />
                            </SelectItem>
                            <SelectItem value="Personalised Trip">
                              <TranslateText text="Personalised Trip" language={currentLanguage} />
                            </SelectItem>
                            <SelectItem value="Hotels">
                              <TranslateText text="Hotels" language={currentLanguage} />
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {[{
                  name: "name" as const,
                  label: "Your Name"
                }, {
                  name: "address" as const,
                  label: "Address"
                }, {
                  name: "zipCode" as const,
                  label: "Zip Code"
                }, {
                  name: "phone" as const,
                  label: "Telephone Number"
                }, {
                  name: "email" as const,
                  label: "E-Mail Address"
                }, {
                  name: "confirmEmail" as const,
                  label: "Confirm E-mail Address"
                }].map(fieldInfo => (
                  <div key={fieldInfo.name} className="relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#347EFF]" />
                    <FormField control={form.control} name={fieldInfo.name} render={({ field }) => (
                      <FormItem className="ml-8">
                        <div className="text-[#BF4757] text-xs mb-1">
                          <TranslateText text="must fill" language={currentLanguage} />
                        </div>
                        <FormLabel className="text-base md:text-lg text-[#1F1F20] font-medium">
                          <TranslateText text={fieldInfo.label} language={currentLanguage} />
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="mt-1 bg-[#F6F8FB] text-sm p-3 rounded-lg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                ))}

                <div className="relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#347EFF]" />
                  <FormField control={form.control} name="details" render={({ field }) => (
                    <FormItem className="ml-8">
                      <FormLabel className="text-base md:text-lg text-[#1F1F20] font-medium">
                        <TranslateText text="Details of Consultation and Inquiry" language={currentLanguage} />
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} className="mt-1 bg-[#F6F8FB] min-h-[100px] text-sm p-3 rounded-lg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-2">
                  <Button type="submit" className="w-full md:w-[270px] h-10 bg-[#347EFF] hover:bg-[#2461d5] rounded-lg text-base font-normal">
                    <TranslateText text="Submit Form" language={currentLanguage} />
                    <Send className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          <div className="lg:w-1/3 bg-white rounded-xl p-5 shadow border border-[#F6F8FB] flex flex-col">
            
            <div className="space-y-3">
              <h2 className="text-base md:text-lg text-[#6B6B6B] font-medium capitalize">
                <TranslateText text="Important Notes On Inquiry Forms" language={currentLanguage} />
              </h2>
              <p className="text-[#2E2E2E] text-sm leading-relaxed font-light">
                <TranslateText text="When using an inquiry form, it's important to understand how personal information is handled. Customer details will only be used for responding to inquiries, verifying facts, and confirming the situation. In some cases," language={currentLanguage} />
                {" "}
                <TranslateText text="personal information may be shared within related departments or group companies to provide appropriate responses. If you are submitting an opinion or request, please note that responses may take time, especially during holidays or when further investigation is needed." language={currentLanguage} />
              </p>
            </div>
            
            <div className="mt-5 space-y-2">
              <div className="flex items-center gap-2">
                <Pin className="text-[#4E9DD2]" />
                <span className="text-[#1F1F20] text-xs">
                  29, AV.du,Japon, Imm. Fatma 1002 <strong><TranslateText text="Montplaisir - Tunis" language={currentLanguage} /></strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="text-[#4E9DD2]" />
                <span className="text-[#1F1F20] text-xs">+216 31 31 8000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="text-[#4E9DD2]" />
                <span className="text-[#1F1F20] text-xs">atlantis@atlantis.tn</span>
              </div>
            </div>
            
            <div className="mt-5">
              <a
                href="https://atlantis-voyages.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-[#eee] hover:bg-[#ddd] px-3 py-2 rounded-lg text-sm font-medium text-[#346b87] transition-colors duration-150"
              >
                <TranslateText text="Visit atlantis-voyages.com" language={currentLanguage} />
              </a>
            </div>
            
            <div className="mt-6">
              <InfoImagesCarousel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
