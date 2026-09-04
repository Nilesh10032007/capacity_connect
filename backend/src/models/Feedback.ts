import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  courseId: mongoose.Types.ObjectId;
  traineeId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  sentiment: 'positive' | 'neutral' | 'constructive' | 'negative';
  createdAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    traineeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    sentiment: { type: String, enum: ['positive', 'neutral', 'constructive', 'negative'], required: true },
  },
  { timestamps: true }
);

export const Feedback = mongoose.model<IFeedback>('Feedback', feedbackSchema);
