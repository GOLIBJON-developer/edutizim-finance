import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edutizim_finance';
    await mongoose.connect(mongoUri);
    console.log('MongoDB muvaffaqiyatli ulandi.');
  } catch (error) {
    console.error('MongoDB ulanishida xatolik:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
};