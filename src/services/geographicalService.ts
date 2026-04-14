import { Activity } from '../data/activities';
import { GuestHouse } from '@/data/guestHouses';

export interface GeographicalZone {
    id: string;
    name: string;
    centerLat: number;
    centerLng: number;
    activities: Activity[];
    nearbyHotels: any[];
    nearbyGuestHouses: any[];
}

export interface GeographicalCluster {
    region: string;
    activities: Activity[];
    accommodations: any[];
    centerLat: number;
    centerLng: number;
    dailyDistance?: number;
    order?: number;
}

export interface OptimizedRoute {
    clusters: GeographicalCluster[];
    totalDistance: number;
    dailyDistances: number[];
    reasoning: string;
    estimatedTravelTimes: string[];
}

/**
 * Enhanced distance calculation with real-world travel considerations.
 * Uses Haversine formula and adds a buffer for real road factors.
 */
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Real-world road factor (1.3x) to account for curves and non-direct paths
    return R * c * 1.3;
}

/**
 * Standard Haversine distance without road factor for pure geographical matching.
 */
export function calculatePureDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Determine region based on GPS coordinates.
 */
export function getRegionFromCoordinates(lat: number, lng: number): string {
    if (lat > 36.6) return 'Far North';
    if (lat > 36.0) return 'North';
    if (lat > 35.0) return ' Sahel (East-Central)';
    if (lat > 34.0) return 'Central';
    if (lat > 33.0) return 'South (Matmata/Matmata)';
    return 'Deep South (Sahara)';
}

/**
 * Group activities by geographical proximity.
 */
export function clusterActivities(
    activities: Activity[],
    days: number,
    maxClusterDistance: number = 80
): GeographicalCluster[] {
    const clusters: GeographicalCluster[] = [];
    const used = new Set<string>();

    // Attempt to cluster activities that are geographically close
    activities.forEach(activity => {
        if (used.has(activity.id)) return;

        const cluster: GeographicalCluster = {
            region: getRegionFromCoordinates(activity.coordinates.lat, activity.coordinates.lng),
            activities: [activity],
            accommodations: [],
            centerLat: activity.coordinates.lat,
            centerLng: activity.coordinates.lng
        };

        used.add(activity.id);

        // Find nearby activities to add to this cluster
        activities.forEach(otherActivity => {
            if (used.has(otherActivity.id)) return;

            const distance = calculateDistance(
                activity.coordinates.lat,
                activity.coordinates.lng,
                otherActivity.coordinates.lat,
                otherActivity.coordinates.lng
            );

            // Activities within maxClusterDistance km belong together
            if (distance <= maxClusterDistance) {
                cluster.activities.push(otherActivity);
                used.add(otherActivity.id);

                // Update cluster center weighted average
                const total = cluster.activities.length;
                cluster.centerLat = cluster.activities.reduce((sum, act) => sum + act.coordinates.lat, 0) / total;
                cluster.centerLng = cluster.activities.reduce((sum, act) => sum + act.coordinates.lng, 0) / total;
            }
        });

        clusters.push(cluster);
    });

    return clusters;
}

/**
 * Assign accommodations to clusters based on proximity.
 */
export function assignAccommodations(clusters: GeographicalCluster[], accommodations: any[]): void {
    accommodations.forEach(acc => {
        let bestCluster = clusters[0];
        let minDistance = Infinity;

        clusters.forEach(cluster => {
            const distance = calculateDistance(
                acc.coordinates.lat,
                acc.coordinates.lng,
                cluster.centerLat,
                cluster.centerLng
            );

            if (distance < minDistance) {
                minDistance = distance;
                bestCluster = cluster;
            }
        });

        if (bestCluster) {
            bestCluster.accommodations.push(acc);
        }
    });
}

/**
 * Optimize cluster order to minimize travel distance (Greedy approach).
 */
export function optimizeRouteOrder(clusters: GeographicalCluster[]): GeographicalCluster[] {
    if (clusters.length <= 1) return clusters;

    // Start from Tunis (approx. 36.8, 10.2) as default entry point
    const sorted = [...clusters].sort((a, b) => {
        const distA = calculateDistance(36.8, 10.2, a.centerLat, a.centerLng);
        const distB = calculateDistance(36.8, 10.2, b.centerLat, b.centerLng);
        return distA - distB;
    });

    const optimized = [sorted[0]];
    const remaining = sorted.slice(1);

    while (remaining.length > 0) {
        const current = optimized[optimized.length - 1];
        let nearestIndex = 0;
        let minDistance = Infinity;

        remaining.forEach((cluster, index) => {
            const distance = calculateDistance(current.centerLat, current.centerLng, cluster.centerLat, cluster.centerLng);
            if (distance < minDistance) {
                minDistance = distance;
                nearestIndex = index;
            }
        });

        optimized.push(remaining[nearestIndex]);
        remaining.splice(nearestIndex, 1);
    }

    return optimized;
}

/**
 * Calculate estimated travel times between clusters.
 */
export function calculateTravelPeriods(clusters: GeographicalCluster[]): string[] {
    const times: string[] = [];
    for (let i = 0; i < clusters.length - 1; i++) {
        const dist = calculateDistance(
            clusters[i].centerLat,
            clusters[i].centerLng,
            clusters[i + 1].centerLat,
            clusters[i + 1].centerLng
        );

        // Average speed 70km/h for Tunisia
        const hours = dist / 70;
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);

        times.push(h > 0 ? `${h}h ${m}min` : `${m}min`);
    }
    return times;
}

/**
 * Core function to optimize a geographical route.
 */
export function optimizeGeographicalRoute(
    activities: Activity[],
    accommodations: any[],
    days: number
): OptimizedRoute {
    // 1. Cluster activities by proximity
    const clusters = clusterActivities(activities, days);

    // 2. Assign accommodations to clusters
    assignAccommodations(clusters, accommodations);

    // 3. Optimize cluster order
    const optimizedClusters = optimizeRouteOrder(clusters);

    // 4. Calculate distances and reasoning
    const dailyDistances: number[] = [];
    let totalDistance = 0;

    for (let i = 0; i < optimizedClusters.length - 1; i++) {
        const dist = calculateDistance(
            optimizedClusters[i].centerLat,
            optimizedClusters[i].centerLng,
            optimizedClusters[i + 1].centerLat,
            optimizedClusters[i + 1].centerLng
        );
        dailyDistances.push(dist);
        totalDistance += dist;
    }

    return {
        clusters: optimizedClusters,
        totalDistance: Math.round(totalDistance),
        dailyDistances,
        estimatedTravelTimes: calculateTravelPeriods(optimizedClusters),
        reasoning: `Smart geographical clustering: ${optimizedClusters.map(c => c.region).join(' -> ')}`
    };
}

/**
 * Group activities by geographical zones
 */
export function groupActivitiesByZones(
    activities: Activity[],
    hotels: any[],
    guestHouses: any[],
    radiusKm: number = 30
): GeographicalZone[] {
    const zones: GeographicalZone[] = [];
    const processedActivities = new Set<string>();

    activities.forEach(activity => {
        if (processedActivities.has(activity.id) || !activity.coordinates) return;

        // Find all activities within radius
        const nearbyActivities = activities.filter(otherActivity => {
            if (processedActivities.has(otherActivity.id) || !otherActivity.coordinates) return false;

            const distance = calculatePureDistance(
                activity.coordinates!.lat,
                activity.coordinates!.lng,
                otherActivity.coordinates.lat,
                otherActivity.coordinates.lng
            );
            return distance <= radiusKm;
        });

        if (nearbyActivities.length > 0) {
            // Calculate zone center
            const centerLat = nearbyActivities.reduce((sum, act) => sum + act.coordinates!.lat, 0) / nearbyActivities.length;
            const centerLng = nearbyActivities.reduce((sum, act) => sum + act.coordinates!.lng, 0) / nearbyActivities.length;

            // Find accommodations near the zone center
            const { hotels: nearbyHotels, guestHouses: nearbyGuestHouses } = findNearbyAccommodations(
                { coordinates: { lat: centerLat, lng: centerLng } } as Activity,
                hotels,
                guestHouses,
                radiusKm
            );

            // Determine zone name based on most common location
            const locations = nearbyActivities.map(act => act.location);
            const zoneName = getMostCommonLocation(locations);

            zones.push({
                id: `zone-${zones.length + 1}`,
                name: zoneName,
                centerLat,
                centerLng,
                activities: nearbyActivities,
                nearbyHotels,
                nearbyGuestHouses
            });

            // Mark activities as processed
            nearbyActivities.forEach(act => processedActivities.add(act.id));
        }
    });

    return zones;
}

/**
 * Get the most common location from a list of locations
 */
function getMostCommonLocation(locations: string[]): string {
    const locationCounts = locations.reduce((acc, location) => {
        // Extract main city/region from location string
        const mainLocation = location.split(',')[0].trim();
        acc[mainLocation] = (acc[mainLocation] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(locationCounts)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || locations[0];
}

/**
 * Find the closest hotel to a given activity.
 */
export function findClosestHotel(activity: Activity, hotels: any[]): any | null {
    if (!activity.coordinates || hotels.length === 0) return null;

    let closestHotel = hotels[0];
    let minDistance = Infinity;

    hotels.forEach(hotel => {
        if (hotel.coordinates || (hotel.latitude && hotel.longitude)) {
            const lat = hotel.coordinates?.lat || hotel.latitude;
            const lng = hotel.coordinates?.lng || hotel.longitude;
            const distance = calculatePureDistance(activity.coordinates.lat, activity.coordinates.lng, lat, lng);
            if (distance < minDistance) {
                minDistance = distance;
                closestHotel = hotel;
            }
        }
    });

    return closestHotel;
}

/**
 * Find nearby accommodations within a given radius.
 */
export function findNearbyAccommodations(
    activity: Partial<Activity>,
    hotels: any[],
    guestHouses: any[],
    radiusKm: number = 25
) {
    if (!activity.coordinates) return { hotels: [], guestHouses: [] };

    const nearbyHotels = hotels.filter(hotel => {
        const lat = hotel.coordinates?.lat || hotel.latitude;
        const lng = hotel.coordinates?.lng || hotel.longitude;
        if (!lat || !lng) return false;
        const distance = calculatePureDistance(activity.coordinates!.lat, activity.coordinates!.lng, lat, lng);
        return distance <= radiusKm;
    });

    const nearbyGuestHouses = guestHouses.filter(guestHouse => {
        const lat = guestHouse.coordinates?.lat || guestHouse.latitude;
        const lng = guestHouse.coordinates?.lng || guestHouse.longitude;
        if (!lat || !lng) return false;
        const distance = calculatePureDistance(activity.coordinates!.lat, activity.coordinates!.lng, lat, lng);
        return distance <= radiusKm;
    });

    return { hotels: nearbyHotels, guestHouses: nearbyGuestHouses };
}

/**
 * Get activity recommendations based on selected activities.
 */
export function getActivityRecommendations(
    selectedActivities: Activity[],
    allActivities: Activity[],
    radiusKm: number = 20
): Activity[] {
    if (selectedActivities.length === 0) return [];

    const recommendations = new Set<Activity>();

    selectedActivities.forEach(selectedActivity => {
        if (!selectedActivity.coordinates) return;

        allActivities.forEach(activity => {
            if (
                !activity.coordinates ||
                selectedActivities.some(sel => sel.id === activity.id) ||
                Array.from(recommendations).some(r => r.id === activity.id)
            ) return;

            const distance = calculatePureDistance(
                selectedActivity.coordinates.lat,
                selectedActivity.coordinates.lng,
                activity.coordinates.lat,
                activity.coordinates.lng
            );

            if (distance <= radiusKm) {
                recommendations.add(activity);
            }
        });
    });

    return Array.from(recommendations);
}

/**
 * Determine the region of an activity based on latitude.
 */
export function getActivityRegion(activity: any): 'tunis' | 'center' | 'south' {
    const lat = activity.coordinates?.lat || activity.latitude || 0;

    // Tunis and North (above 36°N)
    if (lat > 36.0) return 'tunis';

    // South Region (below 34°N)
    if (lat < 34.0) return 'south';

    // Center Region (between 34°N and 36°N)
    return 'center';
}
