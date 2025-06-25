import { seedDatabase } from './database';

export default async function handler(req, res) {
  try {
    await seedDatabase();
    res.status(200).json({ message: '✅ Database seeded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Seeding failed', error: err.message });
  }
}
