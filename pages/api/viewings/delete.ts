import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../config';
import { isHashValid } from '../validate-hash';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME); // Replace with your actual DB name
  const usersCollection = db.collection('favorites');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!req.body.token || req.body.token.length == 0) {
    return res.status(400).json({
      error: 'Missing user token',
    });
  }

  let params = new URLSearchParams(req.body.token);
  const data = Object.fromEntries(params);
  let valid = await isHashValid(data, process.env.BOT_TOKEN);
  if (!valid) {
    return res.status(400).json({
      error: 'Unauthorized',
    });
  }

  try {
    const result = await usersCollection.deleteOne(
      { propertyId: req.body.propertyId, userId: req.body.userId } // Finding the favorite by property ID and user ID
    );

    if (result.deletedCount === 0) {
      console.log('Record not found');
      return res.status(404).json({ error: 'Record not found' });
    }
  } catch (err) {
    return res.status(400).json({
      error: 'Failed to delete favorite record',
    });
  }

  return res.status(200).json({ success: true, message: 'Favorite deleted successfully' });
}
