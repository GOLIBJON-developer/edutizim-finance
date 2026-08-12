import { Schema, model, Document } from 'mongoose';

export interface IPostingLine {
  accountCode: string;
  debit: number;
  credit: number;
}

export interface IJournalEntry extends Document {
  date: Date;
  description: string;
  referenceId?: string;
  flowCategory?: 'OPERATING' | 'INVESTING' | 'FINANCING' | 'NON_CASH';
  lines: IPostingLine[];
}

const JournalEntrySchema = new Schema<IJournalEntry>({
  date: { type: Date, required: true, index: true },
  description: { type: String, required: true },
  referenceId: { type: String },
  flowCategory: { 
    type: String, 
    enum: ['OPERATING', 'INVESTING', 'FINANCING', 'NON_CASH'],
    default: 'NON_CASH'
  },
  lines: [{
    accountCode: { type: String, required: true, index: true },
    debit: { type: Number, required: true, default: 0 },
    credit: { type: Number, required: true, default: 0 }
  }]
});

JournalEntrySchema.index({ date: 1, 'lines.accountCode': 1 });

export const JournalEntryModel = model<IJournalEntry>('JournalEntry', JournalEntrySchema);