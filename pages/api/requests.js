import { getRequestCollection, getFoodCollection, getImpactCollection } from './database';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Extract data from request
      const { foodId, userId, requesterName, requesterEmail, requesterPhone, message } = req.body;

      // Validate required fields
      if (!foodId || !requesterName || !requesterEmail) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: foodId, requesterName, and requesterEmail are required'
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(requesterEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      const requestCollection = await getRequestCollection();
      const foodCollection = await getFoodCollection();

      // Check if this food item exists and is still available
      const { ObjectId } = require('mongodb');
      const foodItem = await foodCollection.findOne({ _id: new ObjectId(foodId) });
      
      if (!foodItem) {
        return res.status(404).json({
          success: false,
          message: 'Food item not found'
        });
      }

      // Check if this food item already has an approved request (is claimed)
      const existingApprovedRequest = await requestCollection.findOne({ 
        foodId: foodId,
        status: 'approved'
      });

      if (existingApprovedRequest) {
        return res.status(409).json({
          success: false,
          message: 'This food item has already been claimed by another user'
        });
      }

      // Check if this user has already requested this food item
      const userExistingRequest = await requestCollection.findOne({
        foodId: foodId,
        $or: [
          { userId: userId },
          { requesterEmail: requesterEmail.trim() }
        ]
      });

      if (userExistingRequest) {
        return res.status(409).json({
          success: false,
          message: 'You have already requested this food item'
        });
      }

      // AUTO-APPROVAL LOGIC: First requester gets automatically approved
      const requestItem = {
        foodId: foodId.trim(),
        userId: userId || null,
        requesterName: requesterName.trim(),
        requesterEmail: requesterEmail.trim(),
        requesterPhone: requesterPhone ? requesterPhone.trim() : '',
        message: message ? message.trim() : '',
        status: 'approved', // AUTO-APPROVE first request
        createdAt: new Date(),
        updatedAt: new Date(),
        approvedAt: new Date() // Track when it was approved
      };

      // Save the approved request to MongoDB
      const result = await requestCollection.insertOne(requestItem);

      if (result.insertedId) {
        // Mark the food item as claimed in the database
        await foodCollection.updateOne(
          { _id: new ObjectId(foodId) },
          { 
            $set: { 
              status: 'claimed',
              claimedAt: new Date(),
              claimedBy: result.insertedId
            }
          }
        );

        // Update donor's impact - increment recipients helped
        if (foodItem.userId) {
          try {
            const impactCollection = await getImpactCollection();
            await impactCollection.updateOne(
              { userId: foodItem.userId },
              {
                $inc: { recipientsHelped: 1 },
                $set: { updatedAt: new Date() }
              },
              { upsert: true }
            );
          } catch (impactError) {
            console.error('Error updating donor impact:', impactError);
            // Don't fail the main operation if impact update fails
          }
        }

        res.status(201).json({
          success: true,
          message: 'Request automatically approved! You can now contact the donor.',
          data: {
            requestId: result.insertedId,
            status: 'approved',
            autoApproved: true,
            ...requestItem
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to save request to database'
        });
      }

    } catch (error) {
      console.error('Error creating request:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  } else if (req.method === 'GET') {
    try {
      const requestCollection = await getRequestCollection();
      
      // Check if an ID is provided in the query
      if (req.query.id) {
        const { ObjectId } = require('mongodb');
        try {
          const request = await requestCollection.findOne({ _id: new ObjectId(req.query.id) });
          if (request) {
            return res.status(200).json({
              success: true,
              data: request
            });
          } else {
            return res.status(404).json({
              success: false,
              message: 'Request not found'
            });
          }
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: 'Invalid request ID format'
          });
        }
      }

      // Check if foodId is provided to get requests for a specific food item
      if (req.query.foodId) {
        const requests = await requestCollection.find({ foodId: req.query.foodId }).sort({ createdAt: -1 }).toArray();
        return res.status(200).json({
          success: true,
          data: requests
        });
      }

      // Check if userId is provided to get requests by a specific user
      if (req.query.userId) {
        const requests = await requestCollection.find({ userId: req.query.userId }).sort({ createdAt: -1 }).toArray();
        return res.status(200).json({
          success: true,
          data: requests
        });
      }

      // If no specific query, return all requests
      const requests = await requestCollection.find({}).sort({ createdAt: -1 }).toArray();
      res.status(200).json({
        success: true,
        data: requests
      });
    } catch (error) {
      console.error('Error fetching requests:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch requests'
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