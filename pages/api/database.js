import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so the connection
  // is not repeatedly created during hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new client
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

// Export the database connection function
export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db('FoodBridge');
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
}

// Export collections for easy access
export async function getUsersCollection() {
  const { db } = await connectToDatabase();
  return db.collection('users');
}

export async function getFoodCollection() {
  const { db } = await connectToDatabase();
  return db.collection('foods');
}

export async function getDonationsCollection() {
  const { db } = await connectToDatabase();
  return db.collection('donations');
}

export async function getImpactCollection() {
  const { db } = await connectToDatabase();
  return db.collection('impact');
}

// Seed example data for development/testing
export async function seedDatabase() {
  const { db } = await connectToDatabase();

  // Clear existing data (optional)
  await db.collection('impact').deleteMany({});
  await db.collection('donations').deleteMany({});

  // Seed impact collection
  await db.collection('impact').insertOne({
    mealsProvided: 1234,
    foodSavedLbs: 5678,
    recipientsHelped: 321
  });

  // Seed donations collection
  await db.collection('donations').insertMany([
    {
      item: "Fresh Produce",
      quantity: "50 lbs",
      status: "Available",
      timestamp: new Date()
    },
    {
      item: "Canned Goods",
      quantity: "100 cans",
      status: "Claimed",
      timestamp: new Date()
    },
    {
      item: "Bakery Items",
      quantity: "20 loaves",
      status: "Expired",
      timestamp: new Date()
    }
  ]);

  console.log("✅ Database seeded successfully.");
}

export default clientPromise;
