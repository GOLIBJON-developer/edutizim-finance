import { Schema, model, Document } from 'mongoose';

export interface IEmployee extends Document {
  fullName: string;
  role: string;
  monthlySalary: number;
  isActive: boolean;
}

const EmployeeSchema = new Schema<IEmployee>({
  fullName: { type: String, required: true },
  role: { type: String, required: true },
  monthlySalary: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
});

export const EmployeeModel = model<IEmployee>('Employee', EmployeeSchema);