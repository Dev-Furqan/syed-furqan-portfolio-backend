import mongoose from 'mongoose';

export default async function connectDB(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI is required.');
  }

  mongoose.set('strictQuery', true);

  const connection = await mongoose.connect(uri, {
    autoIndex: process.env.NODE_ENV !== 'production',
    connectTimeoutMS: 8000,
    serverSelectionTimeoutMS: 8000,
  });

  console.log(`MongoDB connected: ${connection.connection.host}`);
  return connection;
}
