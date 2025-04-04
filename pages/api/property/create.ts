import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../config";
import { isHashValid } from "../validate-hash";
import { parse } from "@telegram-apps/init-data-node";
import { File, Formidable } from "formidable";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { PropertySchema } from "@/models/property";
import { readFileSync, rename } from "fs";
import { getNextPropertyIndex, parseForm, saveFiles } from "./utils";
import { getTimestampDaysFromNow } from "@/components/lib/utils";

// Disable default body parser to handle FormData
export const config = {
  api: {
    bodyParser: false,
  },
};


// API handler
export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse FormData
    const { fields, files } = await parseForm(req);
    console.log("Fields:", fields);
    console.log("Files:", files);

    // Validate token
    if (!fields.token) {
      return res.status(400).json({ error: "Missing user token" });
    }

    const params = new URLSearchParams(fields.token);
    const data = Object.fromEntries(params);
    const userData = parse(params);
    const valid = await isHashValid(data, process.env.BOT_TOKEN as string);

    if (!valid) {
      return res.status(400).json({ error: "Unauthorized" });
    }

    // Parse property data
    let propertyData;
    try {
      propertyData = JSON.parse(fields.property);
    } catch (error) {
      return res.status(400).json({ error: "Invalid property data format" });
    }

    console.log("Property Data:", propertyData);
  
    if(files.length > 3){
      return res.status(400).json({ error: "You can only upload a maximum of 3 images per property" });
    }
    // Save uploaded files and attach to property data
    let imagePaths;
    if (files){
      imagePaths =  await saveFiles(files!)
    }
    propertyData.images = imagePaths;
    propertyData.owner = Number(userData.user!.id);
    propertyData.active = true;
    propertyData.id = uuidv4();
    propertyData.index = await getNextPropertyIndex();
    propertyData.activeUntil = getTimestampDaysFromNow(7)
    propertyData.createdAt = Math.floor(Date.now() / 1000)

    // Validate property data
    const result = PropertySchema.safeParse(propertyData);
    if (!result.success) {
      return res.status(400).json({ error: "Validation failed", details: result.error.errors });
    }

    // Connect to MongoDB and insert property
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const propertiesCollection = db.collection("properties");
    
    await propertiesCollection.insertOne(propertyData);

    return res.status(200).json({
      success: true,
      message: "Property added successfully",
      property: { ...propertyData, images: imagePaths },
    });
  } catch (error) {
    console.error("Error handling property submission:", error);
    return res.status(500).json({ error: "Failed to process property submission" });
  }
}
