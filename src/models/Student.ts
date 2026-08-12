import { Schema, model, Document } from 'mongoose';

export interface IStudent extends Document {
  fullName: string;
  monthlyFee: number;
  hasDiscount: boolean;
  discountAmount: number;
  isActive: boolean;
}

const StudentSchema = new Schema<IStudent>({
  fullName: { type: String, required: true },
  monthlyFee: { type: Number, required: true, default: 600000 },
  hasDiscount: { type: Boolean, default: false },
  discountAmount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

export const StudentModel = model<IStudent>('Student', StudentSchema);