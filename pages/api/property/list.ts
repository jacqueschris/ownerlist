import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../config';
import { parse } from '@telegram-apps/init-data-node';
import { isHashValid } from '../validate-hash';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log(req.body);

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

    const filters: Record<string, any> = {};

    // Dynamically add filters from query parameters
    Object.entries(req.query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        filters[key] = { $in: value };
      } else {
        filters[key] = value;
      }
    });

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME); // Replace with your actual DB name
    const propertiesCollection = db.collection('properties');

    const properties = await propertiesCollection.find(filters).toArray();
    
    return res.status(200).json({ success: true, properties: properties });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      error: 'Failed to save settings',
    });
  }
}
