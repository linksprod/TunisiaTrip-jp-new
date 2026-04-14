
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, Youtube, ChevronDown, ChevronUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

export function FooterSection(): JSX.Element {
  const isMobile = useIsMobile();
  const [expandedSections, setExpandedSections] = React.useState<number[]>([]);

  const toggleSection = (sectionIndex: number) => {
    setExpandedSections(prev => 
      prev.includes(sectionIndex) 
        ? prev.filter(i => i !== sectionIndex)
        : [...prev, sectionIndex]
    );
  };

  // Simplified footer section with only Home link
  const footerSections = [
    {
      title: "Main Navigation",
      categories: [
        {
          name: "Pages",
          links: [
            { text: "Home", url: "/" },
          ]
        }
      ]
    }
  ];

  return (
    <section className="w-full bg-[#1b2f3d] py-8 md:py-12">
      <div className="container mx-auto max-w-[1200px] px-4">
        {/* Header with logo and social media */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <Link to="/" className="flex items-center gap-4 mb-4 md:mb-0">
            <img 
              src="/uploads/bcf38a22-1f23-45b7-8c14-701164c5d1b9.png" 
              alt="Tunisia Trip Logo" 
              className="h-8 md:h-10 w-auto"
            />
            <span className="text-white text-xl md:text-2xl font-bold">tunisiatrip</span>
          </Link>

          <div className="flex items-center gap-4">
            <a href="#" className="text-white hover:text-blue-300 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-white hover:text-pink-300 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-white hover:text-red-300 transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>

        {isMobile ? (
          // Mobile accordion style footer
          <div className="space-y-4">
            {footerSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="border-b border-white/20 pb-2">
                <button 
                  className="w-full flex justify-between items-center py-2 text-white"
                  onClick={() => toggleSection(sectionIndex)}
                >
                  <h3 className="text-base font-medium text-left">{section.title}</h3>
                  {expandedSections.includes(sectionIndex) ? 
                    <ChevronUp className="h-5 w-5" /> : 
                    <ChevronDown className="h-5 w-5" />
                  }
                </button>
                
                {expandedSections.includes(sectionIndex) && (
                  <div className="pt-2 pb-4 space-y-4">
                    {section.categories.map((category, catIndex) => (
                      <div key={`mobile-cat-${sectionIndex}-${catIndex}`} className="ml-2">
                        <h4 className="text-sm font-medium text-white mb-1">{category.name}</h4>
                        <ul className="space-y-1 ml-3">
                          {category.links.map((link, linkIndex) => (
                            <li
                              key={`mobile-link-${sectionIndex}-${catIndex}-${linkIndex}`}
                              className="text-xs font-light text-white/80"
                            >
                              <Link to={link.url} className="hover:text-white transition-colors">
                                {link.text}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Desktop footer with columns
          <>
            {footerSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-10">
                <h2 className="text-white text-xl font-bold mb-2">
                  {section.title}
                </h2>
                <Separator className="bg-white/50 mb-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {section.categories.map((category, catIndex) => (
                    <div key={`category-${sectionIndex}-${catIndex}`} className="text-white">
                      <h3 className="text-lg font-medium mb-2">
                        {category.name}
                      </h3>
                      <ul className="space-y-1">
                        {category.links.map((link, linkIndex) => (
                          <li
                            key={`link-${sectionIndex}-${catIndex}-${linkIndex}`}
                            className="text-sm font-light text-white/80 hover:text-white cursor-pointer transition-colors"
                          >
                            <Link to={link.url}>
                              {link.text}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
}
