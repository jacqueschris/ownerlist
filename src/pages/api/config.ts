import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI || '';
const client = new MongoClient(MONGO_URI, {});

const clientPromise = client.connect();

export default clientPromise;
