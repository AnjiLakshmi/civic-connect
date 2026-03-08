export interface Complaint {
  _id: string;
  citizen: string;
  citizenName?: string;
  citizenEmail?: string;
  issueType: string;
  description: string;
  location: string;
  lat: number;
  lng: number;
  date: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'assigned' | 'inProgress' | 'resolved';
  aiSuggestedDept: string;
  assignedDept: string | null;
  imageUrl: string;
  proofUrl?: string;
  upvotes: number;
  nearbyCount: number;
  isEmergency: boolean;
  estimatedResolutionDays: number;
  resolvedAt?: string;
  duplicateGroup?: string;
}

export interface Notification {
  _id: string;
  recipient: string;
  recipientType: 'citizen' | 'department';
  message: string;
  date: string;
  read: boolean;
  complaint: string;
}
