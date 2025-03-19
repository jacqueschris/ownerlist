import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../config';
import { isHashValid } from '../validate-hash';
import { parse } from '@telegram-apps/init-data-node';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate Telegram token
    if (!req.query.token || req.query.token.length === 0) {
      return res.status(400).json({
        error: 'Missing user token',
      });
    }

    let params = new URLSearchParams(req.query.token as string);
    const data = Object.fromEntries(params);
    const userData = parse(params);
    let valid = await isHashValid(data, process.env.BOT_TOKEN);
    if (!valid) {
      return res.status(400).json({
        error: 'Unauthorized',
      });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const propertiesCollection = db.collection("properties");

    // Fetch properties with owner details
    const listings = await propertiesCollection
      .aggregate([
        { $match: {
          owner: userData.user!.id
        } },
        {
          $lookup: {
            from: 'users',
            localField: 'owner',
            foreignField: 'id',
            as: 'ownerDetails',
          },
        },
        { $unwind: { path: '$ownerDetails', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            id: 1,
            active: 1,
            listingType: 1,
            propertyType: 1,
            title: 1,
            price: 1,
            bedrooms: 1,
            bathrooms: 1,
            size: 1,
            location: 1,
            locality: 1,
            position: 1,
            description: 1,
            amenities: 1,
            availabilitySchedule: 1,
            carSpaces: 1,
            images: 1,
            'owner.id': '$ownerDetails.id',
            'owner.name': '$ownerDetails.name',
            'owner.username': '$ownerDetails.username',
          },
        },
      ])
      .toArray();

    return res.status(200).json({
      success: true,
      listings,
      count: listings.length,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      error: 'Failed to retrieve user listings',
      message: err.message,
    });
  }
}
