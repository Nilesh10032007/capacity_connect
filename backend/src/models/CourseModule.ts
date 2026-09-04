import mongoose, { Schema, Document } from 'mongoose';

export interface ICourseModule extends Document {
  courseId: mongoose.Types.ObjectId;
  title: string;
  duration: string;
  contentType: 'video' | 'lab' | 'interactive';
  contentUrl?: string;
  content?: string;
  orderIndex: number;
}

const courseModuleSchema = new Schema<ICourseModule>({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  duration: { type: String, required: true },
  contentType: { type: String, enum: ['video', 'lab', 'interactive'], required: true },
  contentUrl: { type: String },
  content: { type: String },
  orderIndex: { type: Number, required: true },
});

export const CourseModule = mongoose.model<ICourseModule>('CourseModule', courseModuleSchema);
