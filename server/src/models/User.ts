import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'citizen' | 'admin' | 'bbmp' | 'bescom';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['citizen', 'admin', 'bbmp', 'bescom'],
    default: 'citizen',
  },
});

export default mongoose.model<IUser>('User', UserSchema);
