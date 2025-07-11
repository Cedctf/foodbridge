import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MongoDB URI is not defined in .env file');
  throw new Error('Please add your MongoDB URI to .env');
}

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so the connection
  // is not repeatedly created during hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {
      // Add MongoDB connection options
      connectTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000,  // 45 seconds
    });
    global._mongoClientPromise = client.connect()
      .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        throw err;
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new client
  client = new MongoClient(uri, {
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });
  clientPromise = client.connect()
    .catch(err => {
      console.error('Failed to connect to MongoDB:', err);
      throw err;
    });
}

// Export the database connection function
export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db('FoodBridge');
    // Test the connection
    await db.command({ ping: 1 });
    console.log('Successfully connected to MongoDB');
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

export async function getRequestCollection() {
  const { db } = await connectToDatabase();
  return db.collection('requests');
}

export async function getImpactCollection() {
  const { db } = await connectToDatabase();
  return db.collection('impact');
}

export async function getRequestsCollection() {
  const { db } = await connectToDatabase();
  return db.collection('requests');
}

export default clientPromise;
