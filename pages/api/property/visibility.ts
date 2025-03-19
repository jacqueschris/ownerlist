import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../config";
import { isHashValid } from "../validate-hash";
import { parse } from "@telegram-apps/init-data-node";

// API handler
export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log(req.body)
    const { token, active, id } = req.body

    const params = new URLSearchParams(token);
    const data = Object.fromEntries(params);
    const userData = parse(params);
    const valid = await isHashValid(data, process.env.BOT_TOKEN as string);

    if (!valid) {
      return res.status(400).json({ error: "Unauthorized" });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const propertiesCollection = db.collection("properties");

      // For update: Find the existing property
      const existingProperty = await propertiesCollection.findOne({ 
        id: id,
        owner: Number(userData.user!.id) // Ensure user owns this property
      });

      if (!existingProperty) {
        return res.status(404).json({ error: "Property not found or you don't have permission to update it" });
      }

      // Update the property in the database
      await propertiesCollection.updateOne(
        { id },
        { $set: { active: active} }
      );

      return res.status(200).json({
        success: true,
        message: "Property visibility updated successfully",
      });
  } catch (error) {
    console.error("Error handling property visibility update:", error);
    return res.status(500).json({ error: "Failed to process property visibility update" });
  }
}