import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../config';
import { isHashValid } from '../validate-hash';
import { parse } from '@telegram-apps/init-data-node';
import { Formidable } from 'formidable';
import { ViewingSchema } from '@/models/viewing';

// API handler
export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse FormData
    const { viewingId, status } = req.body;

    if (!req.body.viewingId) {
      return res.status(400).json({ error: 'Missing viewing Id' });
    }

    if (!req.body.status) {
      return res.status(400).json({ error: 'Missing viewing Id' });
    }

    // Validate token
    if (!req.body.token) {
      return res.status(400).json({ error: 'Missing user token' });
    }

    const params = new URLSearchParams(req.body.token);
    const data = Object.fromEntries(params);
    const valid = await isHashValid(data, process.env.BOT_TOKEN as string);

    if (!valid) {
      return res.status(400).json({ error: 'Unauthorized' });
    }

    // Connect to MongoDB and update Viewing
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const viewingsCollection = db.collection('viewings');

    const result = await viewingsCollection.updateOne(
      { id: viewingId },
      { $set: { status: status } }
    );

    if (!result.matchedCount) {
      return res.status(404).json({ error: 'Viewing not found' });
    }

    if (!result.modifiedCount) {
      return res.status(400).json({ error: 'Viewing status not updated' });
    }

    return res.status(200).json({
      success: true,
      message: 'Viewing status updated successfully',
    });
  } catch (error) {
    console.error('Error handling Viewing submission:', error);
    return res.status(500).json({ error: 'Failed to process Viewing submission' });
  }
}
