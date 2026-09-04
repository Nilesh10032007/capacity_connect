import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'trainee' | 'trainer' | 'admin';
  avatarUrl?: string;
  department?: string;
  designation?: string;
  qualification?: string;
  experienceYears?: number;
  skills: string[];
  interests: string[];
  certifications: string[];
  bio?: string;
  completionPercentage: number;
  readinessScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['trainee', 'trainer', 'admin'], required: true },
    avatarUrl: { type: String },
    department: { type: String },
    designation: { type: String },
    qualification: { type: String },
    experienceYears: { type: Number, default: 0 },
    skills: [{ type: String }],
    interests: [{ type: String }],
    certifications: [{ type: String }],
    bio: { type: String },
    completionPercentage: { type: Number, default: 0 },
    readinessScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
