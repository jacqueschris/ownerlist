import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import clientPromise from "../config";
import { isHashValid } from "../validate-hash";
import { parse } from "@telegram-apps/init-data-node";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { searchId, active, token } = req.body;

    if (!searchId || typeof active !== "boolean") {
      return res.status(400).json({ error: "Missing searchId or invalid active status" });
    }

    if (!token || token.length == 0) {
        return res.status(400).json({ error: "Missing user token" });
    }

    const params = new URLSearchParams(token);
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
    const search = await searchCollection.findOne({
        id: searchId,
        userId: Number(userData.user!.id)
    });

    const result = await searchCollection.updateOne(
      { id: searchId },
      { $set: { active } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Search alert not found" });
    }

    return res.status(200).json({
      success: true,
      message: `Search alert ${active ? "activated" : "deactivated"}`,
    });
  } catch (error) {
    console.error("Error toggling search alert:", error);
    return res.status(500).json({ error: "Failed to update search alert" });
  }
}
