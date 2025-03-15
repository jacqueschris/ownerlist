import clientPromise from './config'; // Ensure config.ts exports a connected MongoDB client
import type { NextApiRequest, NextApiResponse } from 'next';
import { isHashValid } from './validate-hash';
import { parse } from '@telegram-apps/init-data-node';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let user: any = null;

  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('flirthub'); // Change to your DB name
    const usersCollection = db.collection('users');

    if (!req.body.token || req.body.token.length == 0) {
      return res.status(400).json({
        error: 'Missing user token',
      });
    }
  
    let params = new URLSearchParams(req.body.token)
    const data = Object.fromEntries(params);
    let userData = parse(params)
    let valid = await isHashValid(data, process.env.BOT_TOKEN)
    if (!valid) {
      return res.status(400).json({
        error: 'Unauthorized',
      });
    }

    // Query MongoDB for the user
    console.log("body", req.body)
    user = await usersCollection.findOne({ id: userData.user.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }

  return res.status(200).json({ user });
}
