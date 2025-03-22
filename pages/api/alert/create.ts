import { v4 as uuidv4 } from "uuid";
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../config";
import { parse } from "@telegram-apps/init-data-node";
import { isHashValid } from "../validate-hash";
import { getCurrentPropertyIndex, getNextPropertyIndex } from "../property/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { token, filters, name } = req.body;

        if (!filters) {
            return res.status(400).json({ error: "Missing filters" });
        }

        if (!name || name.length == 0) {
            return res.status(400).json({ error: "Missing name for search alert" });
        }

        // Validate token
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

        let lastPropertyIndex = await getCurrentPropertyIndex();
        lastPropertyIndex = lastPropertyIndex - 1;

        const newSearch = {
            id: uuidv4(),
            name: name,
            userId: userData.user?.id,
            filters,
            lastPropertyIndex,
            active: true,
            createdAt: new Date(),
        };

        const result = await searchCollection.insertOne(newSearch);

        return res.status(200).json({
            success: true,
            message: "Search alert saved successfully",
            search: newSearch,
        });
    } catch (error) {
        console.error("Error saving search alert:", error);
        return res.status(500).json({ error: "Failed to save search alert" });
    }
}
