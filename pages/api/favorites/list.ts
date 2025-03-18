import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../config';
import { isHashValid } from '../validate-hash';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!req.body.token || req.body.token.length === 0) {
      return res.status(400).json({
        error: 'Missing user token',
      });
    }

    if (!req.body.userId) {
        return res.status(400).json({
            error: 'Missing user id',
        })
    }

    let params = new URLSearchParams(req.body.token);
    const data = Object.fromEntries(params);
    let valid = await isHashValid(data, process.env.BOT_TOKEN);
    if (!valid) {
      return res.status(400).json({
        error: 'Unauthorized',
      });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME); // Replace with your actual DB name
    const favoritesCollection = db.collection('favorites');

    // Fetch favorites with owner details using $lookup
    const userId = Number(req.body.userId);
    const favorites = await favoritesCollection
      .find({ userId }, { projection: { propertyId: 1 } })
      .toArray();

      
    return res.status(200).json({ success: true, favorites });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      error: 'Failed to retrieve properties',
    });
  }
}
