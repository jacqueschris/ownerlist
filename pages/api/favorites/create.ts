import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../config';
import { isHashValid } from '../validate-hash';

// API handler
export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse FormData
    const { propertyId, userId } = await req.body;

    // Validate token
    if (!propertyId || !userId) {
      return res.status(400).json({ error: 'Missing userId or propertyId' });
    }

    let params = new URLSearchParams(req.body.token);
    const data = Object.fromEntries(params);
    let valid = await isHashValid(data, process.env.BOT_TOKEN);
    if (!valid) {
      return res.status(400).json({
        error: 'Unauthorized',
      });
    }

    // Connect to MongoDB and insert property
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const favoritesCollection = db.collection('favorites');

    await favoritesCollection.insertOne({ propertyId, userId });

    return res.status(200).json({
      success: true,
      message: 'Favorites added successfully',
      record: { propertyId, userId },
    });
  } catch (error) {
    console.error('Error handling favorites submission:', error);
    return res.status(500).json({ error: 'Failed to process favorites submission' });
  }
}
