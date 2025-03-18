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

    if (!req.body.token || req.body.token.length === 0) {
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

    // Fetch properties with owner details using $lookup
    const properties = await propertiesCollection
      .aggregate([
        { $match: filters }, // Apply filters
        {
          $lookup: {
            from: 'users', // Collection to join with
            localField: 'owner', // Field in properties collection
            foreignField: 'id', // Field in users collection
            as: 'owner', // Output array field
          },
        },
        { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
        {$project: {
          "id": 1,
          "listingType": 1,
          "propertyType": 1,
          "price": 1,
          "bedrooms": 1,
          "bathrooms": 1,
          "size": 1,
          "location": 1,
          "position": 1,
          "description": 1,
          "amenities": 1,
          "availabilitySchedule": 1,
          "images": 1,
          "owner.id": 1,
          "owner.name": 1,
          "owner.username": 1,
        }}, // Convert array to object, preserve if no match
      
      ])
      .toArray();

      console.log(properties)

    return res.status(200).json({ success: true, properties });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      error: 'Failed to retrieve properties',
    });
  }
}
