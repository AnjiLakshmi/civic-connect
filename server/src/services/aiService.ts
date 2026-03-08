import Complaint, { IComplaint } from '../models/Complaint';

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Convert to meters
};

// Find nearby complaints within 200 meters
export const findNearbyComplaints = async (
  latitude: number,
  longitude: number,
  issueType: string,
  radiusMeters: number = 200
): Promise<IComplaint[]> => {
  const allComplaints = await Complaint.find({ issueType });
  return allComplaints.filter(complaint => {
    const distance = calculateDistance(latitude, longitude, complaint.lat, complaint.lng);
    return distance <= radiusMeters;
  });
};

// Check if complaint should be marked as emergency
export const checkEmergency = async (latitude: number, longitude: number, issueType: string): Promise<boolean> => {
  const nearbyComplaints = await findNearbyComplaints(latitude, longitude, issueType);
  return nearbyComplaints.length >= 5;
};

// Update complaint counts for nearby issues
export const updateNearbyComplaintCounts = async (
  latitude: number,
  longitude: number,
  issueType: string
): Promise<void> => {
  const nearby = await findNearbyComplaints(latitude, longitude, issueType);
  const nearbyIds = nearby.map(c => c._id);
  
  // Update all nearby complaints with the count
  await Complaint.updateMany(
    { _id: { $in: nearbyIds } },
    { nearbyCount: nearby.length, isEmergency: nearby.length >= 5 }
  );
};

// Calculate estimated resolution time based on priority and department
export const estimateResolutionTime = (priority: string, department: string): number => {
  const baseTime = { low: 7, medium: 3, high: 1 };
  const deptMultiplier = { BBMP: 1, BESCOM: 1 };
  
  const base = baseTime[priority as keyof typeof baseTime] || 3;
  const multiplier = deptMultiplier[department as keyof typeof deptMultiplier] || 1;
  
  return Math.ceil(base * multiplier);
};

// Group nearby complaints
export const groupNearbyComplaints = async (complaint: IComplaint): Promise<string> => {
  const nearbyComplaints = await findNearbyComplaints(
    complaint.lat,
    complaint.lng,
    complaint.issueType
  );
  
  // Create a group ID based on location and issue type
  const groupId = `${complaint.issueType}-${Math.floor(complaint.lat * 100)}-${Math.floor(complaint.lng * 100)}`;
  return groupId;
};

// Get emergency alerts for admin dashboard
export const getEmergencyAlerts = async () => {
  const emergencies = await Complaint.find({
    isEmergency: true,
    status: { $in: ['pending', 'assigned'] },
  })
    .select('location issueType nearbyCount priority')
    .limit(10)
    .sort({ nearbyCount: -1 });
  
  return emergencies;
};

// Get heatmap data for admin dashboard
export const getHeatmapData = async () => {
  const complaints = await Complaint.find({
    status: { $in: ['pending', 'assigned', 'inProgress'] },
  })
    .select('lat lng priority issueType nearbyCount')
    .limit(100);
  
  return complaints;
};

export default {
  calculateDistance,
  findNearbyComplaints,
  checkEmergency,
  updateNearbyComplaintCounts,
  estimateResolutionTime,
  groupNearbyComplaints,
  getEmergencyAlerts,
  getHeatmapData,
};
