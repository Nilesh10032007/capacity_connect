import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificate extends Document {
  certificateCode: string;
  courseId: mongoose.Types.ObjectId;
  traineeId: mongoose.Types.ObjectId;
  issueDate: Date;
  issuingAuthority: string;
  grade: string;
  verificationUrl: string;
}

const certificateSchema = new Schema<ICertificate>({
  certificateCode: { type: String, required: true, unique: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  traineeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  issueDate: { type: Date, default: Date.now },
  issuingAuthority: { type: String, required: true },
  grade: { type: String, required: true },
  verificationUrl: { type: String, required: true },
});

export const Certificate = mongoose.model<ICertificate>('Certificate', certificateSchema);
