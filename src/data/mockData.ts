export interface Complaint {
  id: string;
  citizenName: string;
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
}

export interface Notification {
  id: string;
  message: string;
  date: string;
  read: boolean;
  complaintId: string;
}

export const mockComplaints: Complaint[] = [
  {
    id: 'CIV-001', citizenName: 'Rahul Kumar', issueType: 'Pothole',
    description: 'Large pothole on main road causing traffic issues',
    location: 'MG Road, Bengaluru', lat: 12.9716, lng: 77.5946,
    date: '2026-03-05', priority: 'high', status: 'pending',
    aiSuggestedDept: 'BBMP', assignedDept: null,
    imageUrl: '', upvotes: 12,
  },
  {
    id: 'CIV-002', citizenName: 'Priya Sharma', issueType: 'Streetlight Not Working',
    description: 'Streetlight not functioning for past 3 days',
    location: 'Koramangala, Bengaluru', lat: 12.9352, lng: 77.6245,
    date: '2026-03-04', priority: 'medium', status: 'assigned',
    aiSuggestedDept: 'BESCOM', assignedDept: 'BESCOM',
    imageUrl: '', upvotes: 5,
  },
  {
    id: 'CIV-003', citizenName: 'Anil Reddy', issueType: 'Garbage Pile',
    description: 'Garbage not collected for a week in residential area',
    location: 'Whitefield, Bengaluru', lat: 12.9698, lng: 77.7500,
    date: '2026-03-03', priority: 'medium', status: 'inProgress',
    aiSuggestedDept: 'BBMP', assignedDept: 'BBMP',
    imageUrl: '', upvotes: 8,
  },
  {
    id: 'CIV-004', citizenName: 'Meena Iyer', issueType: 'Drainage Issue',
    description: 'Blocked drainage causing waterlogging during rains',
    location: 'Indiranagar, Bengaluru', lat: 12.9784, lng: 77.6408,
    date: '2026-03-02', priority: 'high', status: 'assigned',
    aiSuggestedDept: 'BBMP', assignedDept: 'BBMP',
    imageUrl: '', upvotes: 15,
  },
  {
    id: 'CIV-005', citizenName: 'Suresh Babu', issueType: 'Electric Pole Damage',
    description: 'Damaged electric pole leaning dangerously',
    location: 'JP Nagar, Bengaluru', lat: 12.9063, lng: 77.5857,
    date: '2026-03-01', priority: 'high', status: 'resolved',
    aiSuggestedDept: 'BESCOM', assignedDept: 'BESCOM',
    imageUrl: '', proofUrl: '', upvotes: 20,
  },
  {
    id: 'CIV-006', citizenName: 'Lakshmi Devi', issueType: 'Road Crack',
    description: 'Small cracks developing on the newly laid road',
    location: 'HSR Layout, Bengaluru', lat: 12.9116, lng: 77.6389,
    date: '2026-02-28', priority: 'low', status: 'pending',
    aiSuggestedDept: 'BBMP', assignedDept: null,
    imageUrl: '', upvotes: 3,
  },
];

export const mockNotifications: Notification[] = [
  { id: 'N1', message: 'Your complaint about a pothole near MG Road has been assigned to BBMP.', date: '2026-03-05', read: false, complaintId: 'CIV-001' },
  { id: 'N2', message: 'Your complaint about electric pole damage near JP Nagar has been resolved by BESCOM.', date: '2026-03-04', read: false, complaintId: 'CIV-005' },
  { id: 'N3', message: 'A similar issue has been reported near your complaint location.', date: '2026-03-03', read: true, complaintId: 'CIV-003' },
];

export const aiIssueMapping: Record<string, { dept: string; priority: 'low' | 'medium' | 'high' }> = {
  'Streetlight Not Working': { dept: 'BESCOM', priority: 'medium' },
  'Electric Pole Damage': { dept: 'BESCOM', priority: 'high' },
  'Power Line Issue': { dept: 'BESCOM', priority: 'high' },
  'Garbage Pile': { dept: 'BBMP', priority: 'medium' },
  'Pothole': { dept: 'BBMP', priority: 'high' },
  'Drainage Issue': { dept: 'BBMP', priority: 'high' },
  'Road Crack': { dept: 'BBMP', priority: 'low' },
  'Broken Footpath': { dept: 'BBMP', priority: 'medium' },
};
