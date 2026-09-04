import mongoose, { Schema, Document } from 'mongoose';

export interface IResourceItem extends Document {
  courseId?: mongoose.Types.ObjectId;
  uploaderId: mongoose.Types.ObjectId;
  title: string;
  type: 'pdf' | 'code' | 'script' | 'text' | 'dataset' | 'video' | 'image' | 'other';
  fileSize: string;
  fileUrl?: string;
  content?: string;
  category: string;
  uploadDate: Date;
}

const resourceItemSchema = new Schema<IResourceItem>({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
  uploaderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['pdf', 'code', 'script', 'text', 'dataset', 'video', 'image', 'other'], required: true },
  fileSize: { type: String, required: true },
  fileUrl: { type: String },
  content: { type: String },
  category: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
});

export const ResourceItem = mongoose.model<IResourceItem>('ResourceItem', resourceItemSchema);
