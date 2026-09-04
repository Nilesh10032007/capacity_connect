import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  code: string;
  title: string;
  subject: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  duration: string;
  trainerId?: mongoose.Types.ObjectId;
  trainerName?: string;
  thumbnailUrl?: string;
  status: 'draft' | 'pending_approval' | 'published';
  competenciesCovered: string[];
  requiredLevel?: number;
  prerequisites: string[];
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], required: true },
    duration: { type: String, required: true },
    trainerId: { type: Schema.Types.ObjectId, ref: 'User' },
    trainerName: { type: String },
    thumbnailUrl: { type: String },
    status: { type: String, enum: ['draft', 'pending_approval', 'published'], default: 'published' },
    competenciesCovered: [{ type: String }],
    requiredLevel: { type: Number, default: 4 },
    prerequisites: [{ type: String }],
  },
  { timestamps: true }
);

export const Course = mongoose.model<ICourse>('Course', courseSchema);
