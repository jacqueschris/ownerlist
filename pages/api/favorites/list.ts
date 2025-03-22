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
    let favorites = await favoritesCollection
    
      .aggregate([{ $match: { userId } }, {
        $lookup: {
          from: 'properties', // Collection to join with
          localField: 'propertyId', // Field in properties collection
          foreignField: 'id', // Field in users collection
          as: 'property', // Output array field
        },
      },
      { $unwind: { path: "$property", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users', // Collection to join with
          localField: 'property.owner', // Field in properties collection
          foreignField: 'id', // Field in users collection
          as: 'owner', // Output array field
        },
      },
      { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
      {$project: {
        "_id": 0,
        "property.id": 1,
        "property.active": 1,
        "property.listingType": 1,
        "property.propertyType": 1,
        "property.price": 1,
        "property.bedrooms": 1,
        "property.bathrooms": 1,
        "property.size": 1,
        "property.location": 1,
        "property.position": 1,
        "property.description": 1,
        "property.amenities": 1,
        "property.availabilitySchedule": 1,
        "property.images": 1,
        "property.activeUntil": 1,
        "owner.id": 1,
        "owner.name": 1,
        "owner.username": 1,
      }}])
      .toArray();


      favorites = favorites.filter((favorite: any) => favorite.property.active);
      
    return res.status(200).json({ success: true, favorites });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      error: 'Failed to retrieve properties',
    });
  }
}
