import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../config";
import { isHashValid } from "../validate-hash";
import { parse } from "@telegram-apps/init-data-node";
import path from "path";
import { unlink } from "fs";
import { promisify } from "util";
import { deleteImageFiles } from "./utils";

const unlinkAsync = promisify(unlink);

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get property ID from request body
    const { id, token } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Missing property ID" });
    }

    if (!token) {
      return res.status(400).json({ error: "Missing user token" });
    }

    // Validate token
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

    // Find the property and ensure the user owns it
    const property = await propertiesCollection.findOne({ 
      id: id,
      owner: Number(userData.user!.id)
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found or you don't have permission to delete it" });
    }

    // Delete all associated image files
    if (property.images && property.images.length > 0) {
      await deleteImageFiles(property.images);
    }

    // Delete the property
    await propertiesCollection.deleteOne({ id: id });

    return res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting property:", error);
    return res.status(500).json({ error: "Failed to delete property" });
  }
}