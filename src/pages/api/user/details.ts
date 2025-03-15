import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../config';
import { parse } from '@telegram-apps/init-data-node';
import { isHashValid } from '../validate-hash';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!req.body.userDetails) {
    return res.status(400).json({
      error: 'Missing user details',
    });
  }

  if (!req.body.avatar) {
    return res.status(400).json({
      error: 'Missing avatar details',
    });
  }

  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('flirthub'); // Replace with your actual DB name
    const usersCollection = db.collection('users');

    if (!req.body.token || req.body.token.length == 0) {
      return res.status(400).json({
        error: 'Missing user token',
      });
    }

    let params = new URLSearchParams(req.body.token);
    const data = Object.fromEntries(params);
    let userData = parse(params);
    let valid = await isHashValid(data, process.env.BOT_TOKEN);
    if (!valid) {
      return res.status(400).json({
        error: 'Unauthorized',
      });
    }

    const userId = userData.user.id;

    // Update or insert user details and avatar
    await usersCollection.updateOne(
      { id: userId }, // Convert ID if stored as ObjectId
      { $set: { details: req.body.userDetails, avatar: req.body.avatar } },
      { upsert: true } // Create if not exists
    );
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      error: 'Failed to save settings',
    });
  }

  return res.status(200).json({ success: true, message: 'User details saved successfully' });
}
