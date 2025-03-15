import { MongoClient } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../config';
import { isHashValid } from '../validate-hash';
import { parse } from '@telegram-apps/init-data-node';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const client = await clientPromise;
  const db = client.db('flirthub'); // Replace with your actual DB name
  const usersCollection = db.collection('users');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

  if (!req.body.location || !userData.user.id) {
    return res.status(400).json({
      error: 'Missing user details or location',
    });
  }

  let location = [req.body.location.lon, req.body.location.lat];
  try {
    // Update the user's location in the collection
    const result = await usersCollection.updateOne(
      { id: userData.user.id }, // Finding the user by their ID
      { $set: { location: location, username: req.body.username } } // Setting the location field
    );

    if (result.modifiedCount === 0) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    return res.status(400).json({
      error: 'Failed to save settings',
    });
  }

  return res.status(200).json({ success: true, message: 'User location saved successfully' });
}
