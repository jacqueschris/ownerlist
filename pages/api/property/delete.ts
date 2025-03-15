import { MongoClient } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../config';
import { isHashValid } from '../validate-hash';
import { parse } from '@telegram-apps/init-data-node';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME); // Replace with your actual DB name
  const usersCollection = db.collection('properties');

  if (req.method !== 'DELETE') {
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

  try {
    const result = await usersCollection.deleteOne(
      { id: req.body.id }, // Finding the user by their ID
    );

    if (result.deletedCount === 0) {
      console.log('User not found');
      return res.status(404).json({ error: 'Property not found' });
    }
  } catch (err) {
    return res.status(400).json({
      error: 'Failed to delete property',
    });
  }

  return res.status(200).json({ success: true, message: 'Property deleted successfully' });
}
