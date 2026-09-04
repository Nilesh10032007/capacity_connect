import mongoose, { Schema, Document } from 'mongoose';

export interface IUserCompetency extends Document {
  userId: mongoose.Types.ObjectId;
  competencyId: mongoose.Types.ObjectId;
  currentLevel: number;
  requiredLevel: number;
  lastAssessedDate: Date;
  trend: 'improving' | 'stable' | 'needs_attention';
}

const userCompetencySchema = new Schema<IUserCompetency>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  competencyId: { type: Schema.Types.ObjectId, ref: 'Competency', required: true },
  currentLevel: { type: Number, required: true },
  requiredLevel: { type: Number, required: true },
  lastAssessedDate: { type: Date },
  trend: { type: String, enum: ['improving', 'stable', 'needs_attention'], default: 'stable' },
});

export const UserCompetency = mongoose.model<IUserCompetency>('UserCompetency', userCompetencySchema);
