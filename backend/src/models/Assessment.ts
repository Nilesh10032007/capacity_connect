import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessment extends Document {
  courseId: mongoose.Types.ObjectId;
  title: string;
  durationMinutes: number;
  passingScore: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  dueDate?: Date;
  retakeAllowed: boolean;
}

const assessmentSchema = new Schema<IAssessment>({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  passingScore: { type: Number, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  dueDate: { type: Date },
  retakeAllowed: { type: Boolean, default: true },
});

export const Assessment = mongoose.model<IAssessment>('Assessment', assessmentSchema);
