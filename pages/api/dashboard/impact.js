import { connectToDatabase } from '../database';

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const impact = await db.collection('impact').findOne({});
  
  res.status(200).json(impact);
}
