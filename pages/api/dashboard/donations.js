import { connectToDatabase } from '../database';

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const donations = await db.collection('donations')
    .find({})
    .sort({ timestamp: -1 })
    .limit(5)
    .toArray();

  res.status(200).json(donations);
}
