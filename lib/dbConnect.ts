import connectDB from './db/connect';

export default async function dbConnect() {
  return connectDB();
}
