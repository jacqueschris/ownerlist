import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import clientPromise from "../config";
import { isHashValid } from "../validate-hash";
import { parse } from "@telegram-apps/init-data-node";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "DELETE") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { searchId, token } = req.body;

        if (!searchId) {
            return res.status(400).json({ error: "Missing searchId" });
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

        if (!search) {
            return res.status(404).json({ error: "Search not found or you don't have permission to delete it" });
        }

        const result = await searchCollection.deleteOne({ id: searchId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Search alert not found" });
        }

        return res.status(200).json({ success: true, message: "Search alert deleted" });
    } catch (error) {
        console.error("Error deleting search alert:", error);
        return res.status(500).json({ error: "Failed to delete search alert" });
    }
}
