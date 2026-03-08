import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  user?: mongoose.Types.ObjectId;
  recipient: string; // Can be user ID or department name (BBMP, BESCOM)
  recipientType: 'citizen' | 'department'; // Specify who receives this
  message: string;
  date: Date;
  read: boolean;
  complaint: mongoose.Types.ObjectId;
}

const NotificationSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  recipient: { type: String, required: true }, // User ID or department name
  recipientType: { type: String, enum: ['citizen', 'department'], default: 'citizen' },
  message: String,
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  complaint: { type: Schema.Types.ObjectId, ref: 'Complaint' },
});

export default mongoose.model<INotification>('Notification', NotificationSchema);
