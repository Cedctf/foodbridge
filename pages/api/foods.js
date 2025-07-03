import { getFoodCollection } from './database';
import { getImpactCollection } from './database';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'public', 'food-images');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if the file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Disable Next.js default body parser for this route to handle multipart data
export const config = { 
  api: {
    bodyParser: false,
  },
};

// Helper function to run multer middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Run multer middleware to handle file upload
      await runMiddleware(req, res, upload.single('image'));

      // Extract data from request
      const { name, foodType, quantity, expiryDate, description, locationAddress, userId } = req.body;

      // Validate required fields
      if (!name || !foodType || !quantity || !expiryDate || !locationAddress) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: name, foodType, quantity, expiryDate, and locationAddress are required'
        });
      }

      // Validate expiry date
      const expiry = new Date(expiryDate);
      if (isNaN(expiry.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid expiry date format'
        });
      }

      // Prepare food item data
      const foodItem = {
        name: name.trim(),
        foodType: foodType.trim(),
        quantity: parseInt(quantity),
        expiryDate: expiry,
        description: description ? description.trim() : '',
        locationAddress: locationAddress.trim(),
        imageUrl: req.file ? `/food-images/${req.file.filename}` : null,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userId || null
      };

      // Validate quantity is a positive number
      if (isNaN(foodItem.quantity) || foodItem.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be a positive number'
        });
      }

      // Save to MongoDB
      const foodCollection = await getFoodCollection();
      const result = await foodCollection.insertOne(foodItem);

      if (result.insertedId) {
        // Update user's impact data if userId is provided
        if (userId) {
          try {
            const impactCollection = await getImpactCollection();
            
            // Find existing impact data or create default
            let userImpact = await impactCollection.findOne({ userId });
            
            if (!userImpact) {
              // Create default impact data
              userImpact = {
                userId,
                mealsProvided: 0,
                foodSavedLbs: 0,
                recipientsHelped: 0,
                createdAt: new Date(),
                updatedAt: new Date()
              };
            }
            
            // Update impact metrics - only increment mealsProvided and foodSaved when donating
            // recipientsHelped will be incremented when someone actually claims the food
            const newMealsProvided = (userImpact.mealsProvided || 0) + parseInt(quantity);
            const randomFoodSaved = Math.floor(Math.random() * 10) + 1; // Random 1-10 lbs
            const newFoodSavedLbs = (userImpact.foodSavedLbs || 0) + randomFoodSaved;
            
            // Update or insert impact data
            await impactCollection.updateOne(
              { userId },
              {
                $set: {
                  mealsProvided: newMealsProvided,
                  foodSavedLbs: newFoodSavedLbs,
                  updatedAt: new Date()
                }
              },
              { upsert: true }
            );
          } catch (impactError) {
            console.error('Error updating impact data:', impactError);
            // Don't fail the main operation if impact update fails
          }
        }

        res.status(201).json({
          success: true,
          message: 'Food item added successfully',
          data: {
            id: result.insertedId,
            ...foodItem
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to save food item to database'
        });
      }

    } catch (error) {
      console.error('Error adding food item:', error);
      
      // Handle multer errors
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size too large. Maximum size is 5MB.'
        });
      }
      
      if (error.message === 'Only image files are allowed!') {
        return res.status(400).json({
          success: false,
          message: 'Only image files are allowed.'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  } else if (req.method === 'GET') {
    try {
      const foodCollection = await getFoodCollection();
      
      // Check if an ID is provided in the query
      if (req.query.id) {
        const { ObjectId } = require('mongodb');
        try {
          const food = await foodCollection.findOne({ _id: new ObjectId(req.query.id) });
          if (food) {
            return res.status(200).json({
              success: true,
              data: food
            });
          } else {
            return res.status(404).json({
              success: false,
              message: 'Food item not found'
            });
          }
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: 'Invalid food ID format'
          });
        }
      }

      // If no ID provided, return all available food items (exclude claimed items)
      const query = req.query.includeAll === 'true' 
        ? {} // Return all items if explicitly requested (for admin/donor views)
        : { $or: [{ status: { $ne: 'claimed' } }, { status: { $exists: false } }] }; // Exclude claimed items
      
      const foods = await foodCollection.find(query).sort({ createdAt: -1 }).toArray();
      res.status(200).json({
        success: true,
        data: foods
      });
    } catch (error) {
      console.error('Error fetching food items:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch food items'
      });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`
    });
  }
} 