import { EnhancedDayItinerary, ScheduleItem, AccommodationDetails } from '../components/travel/itinerary/enhancedTypes';
import { Activity } from '../data/activities';
import { getValidImageUrl } from '../utils/imageFallbacks';
import { optimizeGeographicalRoute, calculateDistance } from './geographicalService';
import { supabase } from "@/integrations/supabase/client";

/**
 * Helper to convert raw accommodation data to a consistent format.
 */
const convertToAccommodationDetails = (accommodation: any): AccommodationDetails => {
    const primaryImage = accommodation.images?.[0] || accommodation.image;
    const imageUrl = primaryImage && primaryImage.startsWith('http')
        ? primaryImage
        : primaryImage
            ? `https://bxfmhruxybcgjeufnyvd.supabase.co/storage/v1/object/public/website_images/${primaryImage}`
            : getValidImageUrl(null, null, accommodation.style ? 'hotel' : 'guesthouse');

    return {
        id: accommodation.id,
        name: accommodation.name,
        type: accommodation.style ? 'hotel' : 'guesthouse',
        image: imageUrl,
        description: accommodation.description || `Experience authentic Tunisian hospitality at ${accommodation.name}`,
        amenities: accommodation.amenities || ['Wi-Fi', 'Breakfast', 'Local Tours'],
        breakfast: accommodation.breakfast !== undefined ? accommodation.breakfast : true,
        location: accommodation.location,
        coordinates: {
            lat: accommodation.latitude || 0,
            lng: accommodation.longitude || 0
        }
    };
};

/**
 * Creates a schedule item for the itinerary.
 */
const createScheduleItem = (
    time: string,
    activity: string,
    location: string,
    duration: string,
    type: ScheduleItem['type'],
    options?: Partial<Omit<ScheduleItem, 'time' | 'activity' | 'location' | 'duration' | 'type'>>
): ScheduleItem => ({
    time,
    activity,
    location,
    duration,
    type,
    ...options
});

/**
 * Provides basic cultural tips based on the region.
 */
const getCulturalTips = (region: string): string[] => {
    return [
        "Respect local dress codes especially when visiting religious sites",
        "Tunisian hospitality is warm; expect friendly interactions",
        "Bargaining is common in medinas and traditional markets"
    ];
};

/**
 * Generates a detailed daily schedule including arrival and departure logistics.
 */
const generateDailySchedule = (
    day: number,
    activities: any[],
    accommodation: AccommodationDetails | null,
    region: string,
    travelDistance: number,
    totalDays: number,
    airports: any[]
): ScheduleItem[] => {
    const schedule: ScheduleItem[] = [];
    const isFirstDay = day === 1;
    const isLastDay = day === totalDays;

    if (isFirstDay) {
        const airport = airports.find(a => a.name?.includes('Tunis')) || airports[0];
        schedule.push(
            createScheduleItem('09:00', `Arrival at ${airport?.name || 'International Airport'}`, airport?.location || 'Tunis', '1h', 'arrival', {
                description: 'Welcome to Tunisia! Your journey begins here.'
            }),
            createScheduleItem('10:30', 'Private transfer to accommodation', accommodation?.name || 'Hotel', '45min', 'activity', {
                distance: '20km',
                transport: 'Private Vehicle'
            }),
            createScheduleItem('12:30', 'Welcome lunch & orientation', 'Traditional Restaurant', '2h', 'lunch')
        );
    } else if (isLastDay) {
        const airport = airports.find(a => a.name?.includes('Tunis')) || airports[0];
        schedule.push(
            createScheduleItem('08:00', 'Farewell breakfast', accommodation?.name || 'Hotel', '1h', 'breakfast'),
            createScheduleItem('13:00', `Transfer to ${airport?.name || 'Airport'}`, airport?.location || 'Tunis', '1h', 'departure', {
                distance: '20km'
            })
        );
    } else {
        schedule.push(createScheduleItem('08:00', 'Regional breakfast', accommodation?.name || 'Hotel', '1h', 'breakfast'));

        activities.forEach((activity, idx) => {
            schedule.push(createScheduleItem(
                idx === 0 ? '09:30' : '15:00',
                activity.title || activity.name,
                activity.location,
                activity.duration || '3h',
                'activity',
                {
                    image: activity.image,
                    description: activity.description
                }
            ));

            if (idx === 0 && activities.length > 1) {
                schedule.push(createScheduleItem('13:00', 'Authentic regional lunch', 'Local Restaurant', '1.5h', 'lunch'));
            }
        });
    }

    return schedule;
};

/**
 * Main itinerary generation function.
 */
export async function generateItinerary(
    days: number,
    selectedActivityIds: string[],
    selectedHotelIds: string[],
    selectedGuestHouseIds: string[],
    dbData?: {
        activities: any[],
        hotels: any[],
        guestHouses: any[],
        airports: any[]
    },
    arrivalAirportId?: string
): Promise<EnhancedDayItinerary[]> {
    // Use passed data or fetch if missing
    const allActivities = dbData?.activities || [];
    const allHotels = dbData?.hotels || [];
    const allGuestHouses = dbData?.guestHouses || [];
    const allAirports = dbData?.airports || [];

    const selectedActivities = allActivities.filter(a => selectedActivityIds.includes(a.id.toString()));
    const selectedHotels = allHotels.filter(h => selectedHotelIds.includes(h.id.toString()));
    const selectedGuestHouses = allGuestHouses.filter(gh => selectedGuestHouseIds.includes(gh.id.toString()));
    const selectedAccommodations = [...selectedHotels, ...selectedGuestHouses];

    // 1. Optimize Geographically
    const optimizedRoute = optimizeGeographicalRoute(
        selectedActivities.map(a => ({
            id: a.id.toString(),
            name: a.title || a.name,
            location: a.location,
            description: a.description,
            image: a.image,
            coordinates: { lat: a.latitude || 0, lng: a.longitude || 0 }
        })),
        selectedAccommodations.map(acc => ({
            ...acc,
            coordinates: { lat: acc.latitude || 0, lng: acc.longitude || 0 }
        })),
        days
    );

    // 2. Build Daily Itinerary
    const enhancedItinerary: EnhancedDayItinerary[] = [];
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'];

    for (let day = 1; day <= days; day++) {
        const isFirstDay = day === 1;
        const isLastDay = day === days;

        // Assign activities to days (simple distribution)
        const clusterIdx = Math.min(day - 2, optimizedRoute.clusters.length - 1);
        const dayActivities = (!isFirstDay && !isLastDay && clusterIdx >= 0)
            ? optimizedRoute.clusters[clusterIdx].activities
            : [];

        const dayAccommodation = (!isFirstDay && !isLastDay && clusterIdx >= 0)
            ? optimizedRoute.clusters[clusterIdx].accommodations[0] || selectedAccommodations[0]
            : selectedAccommodations[0];

        const accDetails = dayAccommodation ? convertToAccommodationDetails(dayAccommodation) : null;

        enhancedItinerary.push({
            day,
            title: isFirstDay ? 'Arrival & Welcome' : isLastDay ? 'Departure' : `Exploring ${optimizedRoute.clusters[clusterIdx]?.region}`,
            description: isFirstDay ? 'Welcome to Tunisia' : isLastDay ? 'Safe journey home' : `Discovering the beauty of ${optimizedRoute.clusters[clusterIdx]?.region}`,
            accommodation: accDetails,
            schedule: generateDailySchedule(day, dayActivities, accDetails, optimizedRoute.clusters[clusterIdx]?.region || 'Tunisia', 0, days, allAirports),
            culturalTips: getCulturalTips(optimizedRoute.clusters[clusterIdx]?.region || 'Tunisia'),
            totalDistance: isFirstDay || isLastDay ? 0 : optimizedRoute.dailyDistances[clusterIdx] || 0,
            color: colors[(day - 1) % colors.length],
            weatherAlternatives: ['Visit a local museum', 'Enjoy a traditional hammam'],
            additionalInfo: `Day ${day} explores the ${optimizedRoute.clusters[clusterIdx]?.region || 'capital'} area`,
            image: dayActivities[0]?.image || accDetails?.image || '/uploads/tunisia-default.jpg'
        });
    }

    return enhancedItinerary;
}

/**
 * AI Optimization Integration (Optional)
 */
export async function optimizeWithAI(params: any): Promise<EnhancedDayItinerary[]> {
    try {
        const { data, error } = await supabase.functions.invoke('smart-itinerary-optimizer', {
            body: params
        });
        if (error) throw error;
        // ... logic to convert AI response to EnhancedDayItinerary[]
        return data.itinerary;
    } catch (err) {
        console.error("AI optimization failed, falling back to traditional generation", err);
        return [];
    }
}
