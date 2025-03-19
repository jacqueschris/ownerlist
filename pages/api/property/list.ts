import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../config';
import { isHashValid } from '../validate-hash';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log(req.body);

    // Validate Telegram token
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

    // Get filter parameters from request body
    const { listingType, priceRange, propertyType, bedrooms, bathrooms, size, amenities } =
      req.body.filters;

    // Build query filters
    const filters: Record<string, any> = {};

    // Add listingType filter (if not 'all')
    if (listingType && listingType !== 'all') {
      filters.listingType = listingType;
    }

    // Add price range filter
    if (priceRange && Array.isArray(priceRange) && priceRange.length === 2) {
      filters.price = {
        $gte: priceRange[0],
        $lte: priceRange[1],
      };
    }

    // Add propertyType filter
    if (propertyType && propertyType !== 'all') {
      filters.propertyType = propertyType;
    }

    // Add bedrooms filter (exact match or minimum)
    if (bedrooms) {
      if (bedrooms === '4+') {
        filters.bedrooms = { $gte: 4 };
      } else {
        filters.bedrooms = parseInt(bedrooms);
      }
    }

    // Add bathrooms filter (exact match or minimum)
    if (bathrooms) {
      if (bathrooms === '3+') {
        filters.bathrooms = { $gte: 3 };
      } else {
        filters.bathrooms = parseInt(bathrooms);
      }
    }

    // Add size range filter
    if (size && Array.isArray(size) && size.length === 2) {
      filters.size = {
        $gte: size[0],
        $lte: size[1],
      };
    }

    // Add amenities filter (must have all specified amenities)
    if (amenities && Array.isArray(amenities) && amenities.length > 0) {
      filters.amenities = { $all: amenities };
    }

    filters.active = true

    console.log('Applied filters:', filters);

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const propertiesCollection = db.collection('properties');

    // Fetch properties with owner details
    const properties = await propertiesCollection
      .aggregate([
        { $match: filters },
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
      properties,
      count: properties.length,
      filters: filters,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      error: 'Failed to retrieve properties',
      message: err.message,
    });
  }
}
