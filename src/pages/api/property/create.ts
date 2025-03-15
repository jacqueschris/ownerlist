import { MongoClient } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../config';
import { isHashValid } from '../validate-hash';
import { parse } from '@telegram-apps/init-data-node';
import { propertySchema } from '@/models/Property';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME); // Replace with your actual DB name
  const propertiesCollection = db.collection('properties');

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

  req.body.property.owner = userData.user!.id

  const result = propertySchema.safeParse(req.body.property);
  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.errors, // Include validation error details
    });
  }

  try {
    // Update the user's location in the collection
    await propertiesCollection.insertOne(
      req.body.property , // Finding the user by their ID
    );

  } catch (err) {
    return res.status(400).json({
      error: 'Failed to save settings',
    });
  }

  return res.status(200).json({ success: true, message: 'Property added successfully' });
}
