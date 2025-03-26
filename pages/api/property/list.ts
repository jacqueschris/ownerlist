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

    // Extract filters and pagination params
    const { listingType, priceRange, propertyType, bedrooms, bathrooms, size, amenities, locality, garageSpaces } = req.body.filters;
    let { page = 1, limit = 100 } = req.body; // Default page = 1, limit = 20

    // Ensure valid pagination values
    page = Math.max(1, parseInt(page)); // Page should be at least 1
    limit = Math.min(100, Math.max(1, parseInt(limit))); // Limit should be between 1 and 100
    const skip = (page - 1) * limit;

    // Build query filters
    const filters: Record<string, any> = {};

    if (listingType && listingType !== 'all') filters.listingType = listingType;
    if (priceRange && Array.isArray(priceRange) && priceRange.length === 2) {
      filters.price = { $gte: priceRange[0], $lte: priceRange[1] };
    }
    if (propertyType && propertyType.length > 0) filters.propertyType = { $in: propertyType };
    if (locality && locality.length > 0) filters.locality = { $in: locality };
    if (bedrooms) filters.bedrooms = bedrooms === '4+' ? { $gte: 4 } : parseInt(bedrooms);
    if (bathrooms) filters.bathrooms = bathrooms === '3+' ? { $gte: 3 } : parseInt(bathrooms);
    if (garageSpaces) filters.totalCarSpaces = garageSpaces === '10+' ? { $gte: 10 } : parseInt(garageSpaces);
    if (size && Array.isArray(size) && size.length === 2) {
      filters.size = { $gte: size[0], $lte: size[1] };
    }
    if (amenities && Array.isArray(amenities) && amenities.length > 0) {
      filters.amenities = { $all: amenities };
    }
    
    filters.active = true;

    console.log('Applied filters:', filters, { page, limit, skip });

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const propertiesCollection = db.collection('properties');

    // Fetch properties with pagination
    const properties = await propertiesCollection
      .aggregate([
        { $addFields: { totalCarSpaces: { $sum: "$carSpaces.capacity" } } },
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
            createdAt: 1,
            activeUntil: 1,
            'owner.id': '$ownerDetails.id',
            'owner.name': '$ownerDetails.name',
            'owner.username': '$ownerDetails.username',
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip }, // Skip items based on page number
        { $limit: limit }, // Limit items per query
      ])
      .toArray();

    // Count total properties for pagination info
    const totalCount = await propertiesCollection.countDocuments(filters);

    return res.status(200).json({
      success: true,
      properties,
      count: properties.length,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      perPage: limit,
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
