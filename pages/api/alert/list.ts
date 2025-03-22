import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import clientPromise from "../config";
import { isHashValid } from "../validate-hash";
import { parse } from "@telegram-apps/init-data-node";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { token } = req.query;

    if (!token || token.length == 0) {
        return res.status(400).json({ error: "Missing user token" });
    }

    const params = new URLSearchParams(token as string);
    const data = Object.fromEntries(params);
    const userData = parse(params);
    const valid = await isHashValid(data, process.env.BOT_TOKEN as string);

    if (!valid) {
        return res.status(400).json({ error: "Unauthorized" });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const searchCollection = db.collection("saved_searches");

    // Find the search and ensure the user owns it
    const searchAlerts = await searchCollection.find({
        userId: Number(userData.user!.id)
    }).toArray();

    return res.status(200).json({
      success: true,
      searches: searchAlerts
    });
  } catch (error) {
    console.error("Error getting search alerts:", error);
    return res.status(500).json({ error: "Failed to get search alerts" });
  }
}
