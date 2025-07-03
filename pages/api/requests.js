import { getRequestCollection } from './database';

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

      // Prepare request data
      const requestItem = {
        foodId: foodId.trim(),
        userId: userId || null,
        requesterName: requesterName.trim(),
        requesterEmail: requesterEmail.trim(),
        requesterPhone: requesterPhone ? requesterPhone.trim() : '',
        message: message ? message.trim() : '',
        status: 'pending', // pending, approved, rejected, completed
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save to MongoDB
      const requestCollection = await getRequestCollection();
      const result = await requestCollection.insertOne(requestItem);

      if (result.insertedId) {
        res.status(201).json({
          success: true,
          message: 'Request submitted successfully',
          data: {
            requestId: result.insertedId,
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