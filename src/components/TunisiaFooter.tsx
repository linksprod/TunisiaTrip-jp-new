import React from "react";
import { Facebook, Instagram } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { TranslateText } from "./translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export function TunisiaFooter(): JSX.Element {
  const { currentLanguage } = useTranslation();
  
  const handleSectionNavigation = (path: string, tab: string, section: string, message?: string) => {
    window.scrollTo(0, 0);
    
    // Create the custom event with the necessary details
    const event = new CustomEvent('changeTab', {
      detail: {
        tab,
        section,
        message
      }
    });
    
    // If we're already on the correct page, dispatch the event immediately
    if ((path === '/travel' && window.location.pathname === '/travel') ||
        (path === '/atlantis' && window.location.pathname === '/atlantis')) {
      window.dispatchEvent(event);
    }
    
    // The navigation will happen via the Link component, and the event
    // will be handled after navigation in the respective page components
  };

  return <footer className="w-full bg-[#1b2f3d] text-white py-12">
      <div className="container mx-auto max-w-[1200px] px-4">
        {/* Top section with logo and social icons */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <Link to="/">
              <img src="/uploads/bcf38a22-1f23-45b7-8c14-701164c5d1b9.png" alt="Tunisia Trip Logo" className="h-10 w-auto" />
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="https://www.facebook.com/tunisiatrip.atlantis" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook className="h-5 w-5 text-white hover:text-blue-300 transition-colors" />
            </a>
            <a href="https://www.instagram.com/tunisiatrip.atlantis/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram className="h-5 w-5 text-white hover:text-pink-300 transition-colors" />
            </a>
          </div>
        </div>
        
        <Separator className="bg-white/20 mb-8" />
        
        {/* First section - Travel Information */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-medium text-lg mb-3">
              <TranslateText text="Travel Information" language={currentLanguage} />
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link 
                  to="/travel?tab=departure&section=flights" 
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="International Flights" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/travel?tab=itinerary&section=tours" 
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Atlantis Popular Tours" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/travel?tab=itinerary&section=routes" 
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Atlantis Main Routes" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/travel?tab=departure" 
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Travel Tips" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/travel?tab=activities" 
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Destinations" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/travel?tab=activities&section=activities" 
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Activities" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/atlantis?section=contact" 
                  onClick={() => handleSectionNavigation('/atlantis', 'contact', 'plan', "I'm planning a 5-day trip to Tunisia in early September. I'm interested in cultural landmarks, underwater experiences, and local cuisine. Please recommend accommodations, guided tours, and dining spots that match this profile.")}
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Plan Your Trip" language={currentLanguage} />
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-3">
              <TranslateText text="Transportation in Tunisia" language={currentLanguage} />
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link 
                  to="/travel?tab=departure&section=transportation" 
                  onClick={() => handleSectionNavigation('/travel', 'departure', 'transportation', '1')}
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Domestic Flights" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/travel?tab=departure&section=transportation" 
                  onClick={() => handleSectionNavigation('/travel', 'departure', 'transportation', '2')}
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Car Rent" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/travel?tab=departure&section=transportation" 
                  onClick={() => handleSectionNavigation('/travel', 'departure', 'transportation', '3')}
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Taxi" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/travel?tab=departure&section=transportation" 
                  onClick={() => handleSectionNavigation('/travel', 'departure', 'transportation', '4')}
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Louage" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/travel?tab=departure&section=transportation" 
                  onClick={() => handleSectionNavigation('/travel', 'departure', 'transportation', '6')}
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Ferry" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/travel?tab=departure&section=transportation" 
                  onClick={() => handleSectionNavigation('/travel', 'departure', 'transportation', '5')}
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Train/Metro" language={currentLanguage} />
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-3">
              <TranslateText text="Atlantis Services" language={currentLanguage} />
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link 
                  to="/atlantis?section=services" 
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Transportation Services" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/atlantis?section=services&scrollTo=car-service" 
                  onClick={() => handleSectionNavigation('/atlantis', 'services', 'car-service')}
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Car" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/atlantis?section=services&scrollTo=minibus-service" 
                  onClick={() => handleSectionNavigation('/atlantis', 'services', 'minibus-service')}
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Mini-Bus" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/atlantis?section=services&scrollTo=bus-service" 
                  onClick={() => handleSectionNavigation('/atlantis', 'services', 'bus-service')}
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Bus" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/atlantis?section=services&scrollTo=van-service" 
                  onClick={() => handleSectionNavigation('/atlantis', 'services', 'van-service')}
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Van" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/atlantis?section=services&scrollTo=hotels" 
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Hotel Booking" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/atlantis?section=services&scrollTo=guesthouses" 
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Guest Houses" language={currentLanguage} />
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-3">
              <TranslateText text="Accommodation Services" language={currentLanguage} />
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link 
                  to="/atlantis?section=services&scrollTo=hotels" 
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Hotels & Resorts" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/atlantis?section=services&scrollTo=guesthouses" 
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Guest Houses" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/atlantis?section=services&scrollTo=rentals" 
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Vacation Rentals" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/atlantis?section=contact"
                  onClick={() => handleSectionNavigation('/atlantis', 'contact', 'booking', "I'm interested in planning a trip with Atlantis. Please send me more information and recommendations.")} 
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Book with Atlantis" language={currentLanguage} />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Second section - Company Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-medium text-lg mb-3">
              <TranslateText text="About Atlantis" language={currentLanguage} />
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link 
                  to="/atlantis" 
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Company Overview" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/atlantis?section=team" 
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Our Team" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/atlantis?section=ceo" 
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Our Values" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/atlantis?section=contact" 
                  onClick={() => handleSectionNavigation('/atlantis', 'contact', 'careers', "I'm interested in collaborating with Atlantis. Please let me know how we can work together.")}
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Work With Us" language={currentLanguage} />
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-3">
              <TranslateText text="Customer Support" language={currentLanguage} />
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link 
                  to="/atlantis?section=contact" 
                  onClick={() => handleSectionNavigation('/atlantis', 'contact', 'support', "I need assistance and would like to get in touch with customer support. Please let me know how to proceed.")}
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Contact Us" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/travel?tab=itinerary&section=faq" 
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="FAQ" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/atlantis?section=contact" 
                  onClick={() => handleSectionNavigation('/atlantis', 'contact', 'privacy', null)}
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Privacy Policy" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/atlantis?section=contact" 
                  onClick={() => handleSectionNavigation('/atlantis', 'contact', 'terms', null)}
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Terms of Service" language={currentLanguage} />
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-3">
              <TranslateText text="Explore Tunisia" language={currentLanguage} />
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  <TranslateText text="About Tunisia" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  <TranslateText text="Travel Blog" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  <TranslateText text="Culture & History" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link to="/blog?category=food" className="hover:text-white transition-colors">
                  <TranslateText text="Local Cuisine" language={currentLanguage} />
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-3">
              <TranslateText text="Partnerships" language={currentLanguage} />
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link 
                  to="/atlantis?section=contact" 
                  onClick={() => handleSectionNavigation('/atlantis', 'contact', 'partner', "I'm interested in becoming a partner. Please share more information about partnership opportunities.")}
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Become a Partner" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/atlantis?section=contact" 
                  onClick={() => handleSectionNavigation('/atlantis', 'contact', 'affiliate', "I'm interested in joining the affiliate program. Please provide more details on how to get started.")}
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Affiliate Program" language={currentLanguage} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/atlantis?section=contact" 
                  onClick={() => handleSectionNavigation('/atlantis', 'contact', 'advertise', "I'm interested in advertising with Atlantis. Please send me more information about available options and pricing.")}
                  className="hover:text-white transition-colors"
                >
                  <TranslateText text="Advertise with Us" language={currentLanguage} />
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom copyright and legal */}
        <div className="pt-8 border-t border-white/10 flex flex-col space-y-4">
          <div className="text-sm text-gray-300 text-center">
            © 2025 TunisiaTrip.com by{' '}
            <a 
              href="https://atlantis-voyages.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-primary transition-colors"
            >
              atlantis voyages
            </a>{' '}
            All rights reserved.
          </div>
          <div className="text-xs text-gray-400 text-center">
            Powered by{' '}
            <a 
              href="https://linksprod.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
            >
              LINKS
            </a>{' '}
            developed by{' '}
            <a 
              href="https://feelinx.dev/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Feelinx.dev
            </a>
          </div>
          <div className="flex justify-center space-x-4 text-xs text-gray-400">
            <Link to="/atlantis?section=contact" onClick={() => handleSectionNavigation('/atlantis', 'contact', 'privacy', null)} className="hover:text-white transition-colors">
              <TranslateText text="Privacy" language={currentLanguage} />
            </Link>
            <Link to="/atlantis?section=contact" onClick={() => handleSectionNavigation('/atlantis', 'contact', 'terms', null)} className="hover:text-white transition-colors">
              <TranslateText text="Terms" language={currentLanguage} />
            </Link>
            <Link to="/atlantis?section=contact" onClick={() => handleSectionNavigation('/atlantis', 'contact', 'cookies', null)} className="hover:text-white transition-colors">
              <TranslateText text="Cookies" language={currentLanguage} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
}
