import { getImpactCollection } from './database';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const impactCollection = await getImpactCollection();
    
    // Find impact data for the specific user
    let userImpact = await impactCollection.findOne({ userId });

    // If no impact data exists for this user, create a default entry
    if (!userImpact) {
      // Create default impact data
      const defaultImpact = {
        userId,
        mealsProvided: 0,
        foodSavedLbs: 0,
        recipientsHelped: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Insert the default impact data
      const result = await impactCollection.insertOne(defaultImpact);
      
      if (result.acknowledged) {
        userImpact = defaultImpact;
      } else {
        return res.status(500).json({ error: 'Failed to create impact data' });
      }
    }

    // Return the impact data
    return res.status(200).json(userImpact);
  } catch (error) {
    console.error('Error fetching impact data:', error);
    return res.status(500).json({ error: 'Failed to fetch impact data' });
  }
}
