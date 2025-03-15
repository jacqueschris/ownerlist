import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI || '';
const DB_NAME = process.env.DB_NAME || '';
const client = new MongoClient(MONGO_URI+"/"+DB_NAME, {});

const clientPromise = client.connect();

export default clientPromise;
