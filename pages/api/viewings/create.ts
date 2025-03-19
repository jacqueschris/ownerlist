import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../config';
import { isHashValid } from '../validate-hash';
import { parse } from '@telegram-apps/init-data-node';
import { Formidable } from 'formidable';
import { v4 as uuidv4 } from 'uuid';
import { ViewingSchema } from '@/models/viewing';

// Disable default body parser to handle FormData
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to parse FormData
const parseForm = (req: NextApiRequest) => {
  return new Promise<{ fields: Record<string, string> }>((resolve, reject) => {
    const form = new Formidable();

    form.parse(req, (err, fields) => {
      if (err) {
        console.error('Error parsing form:', err);
        return reject({ error: 'Invalid form format', details: err.message });
      }

      // Ensure fields are strings
      const formattedFields = Object.keys(fields).reduce((acc: any, key) => {
        acc[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
        return acc;
      }, {} as Record<string, string>);

      resolve({ fields: formattedFields });
    });
  });
};

// API handler
export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse FormData
    const { fields } = await parseForm(req);
    console.log('Viewing fields:', fields);

    // Validate token
    if (!fields.token) {
      return res.status(400).json({ error: 'Missing user token' });
    }

    const params = new URLSearchParams(fields.token);
    const data = Object.fromEntries(params);
    const userData = parse(params);
    const valid = await isHashValid(data, process.env.BOT_TOKEN as string);

    if (!valid) {
      return res.status(400).json({ error: 'Unauthorized' });
    }

    // Parse Viewing data
    let viewingData;
    try {
      viewingData = JSON.parse(fields.viewing);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'Invalid Viewing data format' });
    }

    console.log('Viewing Data:', viewingData);

    viewingData.sourceUser = Number(userData.user!.id);
    viewingData.id = uuidv4();

    // Validate Viewing data
    const result = ViewingSchema.safeParse(viewingData);
    if (!result.success) {
      return res.status(400).json({ error: 'Validation failed', details: result.error.errors });
    }

    // Connect to MongoDB and insert Viewing
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const viewingsCollection = db.collection('viewings');

    await viewingsCollection.insertOne(viewingData);

    return res.status(200).json({
      success: true,
      message: 'Viewing added successfully',
      viewing: { ...viewingData },
    });
  } catch (error) {
    console.error('Error handling Viewing submission:', error);
    return res.status(500).json({ error: 'Failed to process Viewing submission' });
  }
}
