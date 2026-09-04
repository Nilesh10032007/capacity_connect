import mongoose, { Schema, Document } from 'mongoose';

export interface IModuleProgress extends Document {
  enrollmentId: mongoose.Types.ObjectId;
  moduleId: mongoose.Types.ObjectId;
  isCompleted: boolean;
  completedAt?: Date;
}

const moduleProgressSchema = new Schema<IModuleProgress>({
  enrollmentId: { type: Schema.Types.ObjectId, ref: 'Enrollment', required: true },
  moduleId: { type: Schema.Types.ObjectId, ref: 'CourseModule', required: true },
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date },
});

moduleProgressSchema.index({ enrollmentId: 1, moduleId: 1 }, { unique: true });

export const ModuleProgress = mongoose.model<IModuleProgress>('ModuleProgress', moduleProgressSchema);
