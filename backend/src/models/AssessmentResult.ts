import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessmentResult extends Document {
  assessmentId: mongoose.Types.ObjectId;
  traineeId: mongoose.Types.ObjectId;
  score: number;
  status: 'passed' | 'failed';
  answers?: Map<string, number>;
  completedDate: Date;
}

const assessmentResultSchema = new Schema<IAssessmentResult>({
  assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
  traineeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  status: { type: String, enum: ['passed', 'failed'], required: true },
  answers: { type: Map, of: Number },
  completedDate: { type: Date, default: Date.now },
});

export const AssessmentResult = mongoose.model<IAssessmentResult>('AssessmentResult', assessmentResultSchema);
