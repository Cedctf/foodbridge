import bcrypt from 'bcryptjs';
import { getUsersCollection } from './database';

export default async function handler(req, res) {
  // Test connection with GET request
  if (req.method === 'GET') {
    try {
      const users = await getUsersCollection();
      const userCount = await users.countDocuments();
      return res.status(200).json({ 
        success: true, 
        message: 'MongoDB connection successful!',
        totalUsers: userCount
      });
    } catch (error) {
      return res.status(500).json({ 
        error: 'Connection test failed', 
        details: error.message 
      });
    }
  }

  // Handle user registration
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, email, password } = req.body;

  // Validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }

  try {
    const users = await getUsersCollection();
    // Log the namespace (database.collection)
    console.log("Using collection:", users.namespace);

    // Check if user already exists
    const existingUser = await users.findOne({
      $or: [{ username }, { email: email.toLowerCase() }]
    });

    if (existingUser) {
      console.log("User already exists:", existingUser);
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user document
    const newUser = {
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Log the user to be inserted
    console.log("Attempting to insert user:", newUser);

    // Insert user into database
    const result = await users.insertOne(newUser);

    // Log the result of the insert
    console.log("Insert result:", result);

    if (!result.acknowledged) {
      throw new Error('User insert not acknowledged by MongoDB');
    }

    return res.status(201).json({ 
      success: true,
      message: 'User registered successfully!',
      userId: result.insertedId 
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Registration failed'
    });
  }
} 