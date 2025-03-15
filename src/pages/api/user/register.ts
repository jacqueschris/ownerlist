import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../config';
import { TIER_DAYS_EXPIRY } from '../constants';
import { isHashValid } from '../validate-hash';
import { parse } from '@telegram-apps/init-data-node';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('flirthub'); // Replace with your actual DB name
    const usersCollection = db.collection('users');

    let expiryDate = Date.now() + TIER_DAYS_EXPIRY * 24 * 60 * 60 * 1000;

    const userId = userData.user.id;
    const newUserData = {
      id: userId, // Convert ID if stored as ObjectId
      username: req.body.username,
      name: req.body.name,
      tier: 'free',
      swipesUsed: 0,
      tierExpiry: expiryDate,
    };

    // Upsert (update if exists, insert if not)
    await usersCollection.updateOne({ id: userId }, { $set: newUserData }, { upsert: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }

  return res.status(200).json({ ok: true });
}
