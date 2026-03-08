import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'assigned' | 'inProgress' | 'resolved';

export interface IComplaint extends Document {
  citizen: IUser['_id'];
  citizenName: string;
  issueType: string;
  description: string;
  location: string;
  lat: number;
  lng: number;
  date: Date;
  priority: Priority;
  status: Status;
  aiSuggestedDept: string;
  assignedDept: string | null;
  imageUrl: string;
  proofUrl?: string;
  upvotes: number;
  nearbyCount: number;
  isEmergency: boolean;
  estimatedResolutionDays: number;
  resolvedAt?: Date;
  duplicateGroup?: string;
}

const ComplaintSchema: Schema = new Schema({
  citizen: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  citizenName: String,
  issueType: String,
  description: String,
  location: String,
  lat: Number,
  lng: Number,
  date: { type: Date, default: Date.now },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'inProgress', 'resolved'],
    default: 'pending',
  },
  aiSuggestedDept: String,
  assignedDept: { type: String, default: null },
  imageUrl: String,
  proofUrl: String,
  upvotes: { type: Number, default: 0 },
  nearbyCount: { type: Number, default: 1 },
  isEmergency: { type: Boolean, default: false },
  estimatedResolutionDays: { type: Number, default: 3 },
  resolvedAt: Date,
  duplicateGroup: String,
});

export default mongoose.model<IComplaint>('Complaint', ComplaintSchema);
