import mongoose, { Schema, Document } from 'mongoose';

export interface IEnrollment extends Document {
  traineeId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  progressPercentage: number;
  enrolledAt: Date;
  completedAt?: Date;
}

const enrollmentSchema = new Schema<IEnrollment>({
  traineeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  progressPercentage: { type: Number, default: 0 },
  enrolledAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

// Prevent duplicate enrollment
enrollmentSchema.index({ traineeId: 1, courseId: 1 }, { unique: true });

export const Enrollment = mongoose.model<IEnrollment>('Enrollment', enrollmentSchema);
