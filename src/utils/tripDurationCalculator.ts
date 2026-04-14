import { Activity } from '../data/activities';
import { optimizeGeographicalRoute } from '../services/geographicalService';

export interface TripDurationCalculation {
  minDays: number;
  suggestedDays: number;
  reasoning: string[];
  clusters: Array<{
    region: string;
    activities: string[];
    days: number;
  }>;
}

export function calculateOptimalTripDuration(
  selectedActivities: Activity[]
): TripDurationCalculation {
  if (selectedActivities.length === 0) {
    return {
      minDays: 3,
      suggestedDays: 3,
      reasoning: ["Minimum 3 days recommended for Tunisia"],
      clusters: []
    };
  }

  // Use geographical optimizer to cluster activities
  const optimizedRoute = optimizeGeographicalRoute(selectedActivities, [], 7);
  const clusters = optimizedRoute.clusters;

  let totalDays = 0;
  const reasoning: string[] = [];
  const clusterDetails: Array<{
    region: string;
    activities: string[];
    days: number;
  }> = [];

  // Always start with arrival day in Tunis
  totalDays += 1;
  reasoning.push("Day 1: Arrival in Tunis");

  // Analyze each cluster
  clusters.forEach((cluster, index) => {
    const activitiesInCluster = cluster.activities.length;
    let daysNeeded = Math.ceil(activitiesInCluster / 3); // Max 3 activities per day

    // Minimum 1 day per region
    daysNeeded = Math.max(1, daysNeeded);

    // Special rules for regions
    if (cluster.region === 'south' && activitiesInCluster >= 2) {
      daysNeeded = Math.max(2, daysNeeded); // South needs minimum 2 days due to distances
    }

    totalDays += daysNeeded;

    clusterDetails.push({
      region: cluster.region,
      activities: cluster.activities.map(a => a.name),
      days: daysNeeded
    });

    const regionName = cluster.region === 'north' ? 'North' :
      cluster.region === 'center' ? 'Center' : 'South';
    reasoning.push(`${regionName} region: ${daysNeeded} day${daysNeeded > 1 ? 's' : ''} (${activitiesInCluster} activities)`);

    // Add travel day if changing regions (except for first cluster)
    if (index > 0 && clusters[index - 1].region !== cluster.region) {
      totalDays += 1;
      reasoning.push(`+1 day for travel between regions`);
    }
  });

  // Add departure buffer if staying in different regions
  const hasMultipleRegions = new Set(clusters.map(c => c.region)).size > 1;
  if (hasMultipleRegions) {
    totalDays += 1;
    reasoning.push("Final day: Return to Tunis for departure");
  }

  return {
    minDays: totalDays,
    suggestedDays: totalDays + 1, // Always suggest +1 day for comfort
    reasoning,
    clusters: clusterDetails
  };
}