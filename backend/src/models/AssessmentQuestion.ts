import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessmentQuestion extends Document {
  assessmentId: mongoose.Types.ObjectId;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

const assessmentQuestionSchema = new Schema<IAssessmentQuestion>({
  assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
  explanation: { type: String, required: true },
});

export const AssessmentQuestion = mongoose.model<IAssessmentQuestion>('AssessmentQuestion', assessmentQuestionSchema);
