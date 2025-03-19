import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../config";
import { isHashValid } from "../validate-hash";
import { parse } from "@telegram-apps/init-data-node";
import { File, Formidable } from "formidable";
import { mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { PropertySchema } from "@/models/property";
import { deleteImageFiles, parseForm, saveFiles } from "./utils";


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
    console.log("Files:", files?.length || 0);

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

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const propertiesCollection = db.collection("properties");

    // Check if this is an update (has ID) or create operation
    const isUpdate = !!propertyData.id;
    
    if (isUpdate) {
      // For update: Find the existing property
      const existingProperty = await propertiesCollection.findOne({ 
        id: propertyData.id,
        owner: Number(userData.user!.id) // Ensure user owns this property
      });

      if (!existingProperty) {
        return res.status(404).json({ error: "Property not found or you don't have permission to update it" });
      }

      // Handle images - identify which images to keep and which to delete
      let updatedImages = [];
      let imagesToDelete = [];
      
      // Determine which images to keep and which to delete
      if (propertyData.retainedImageIds && Array.isArray(propertyData.retainedImageIds)) {
        // Images to keep
        updatedImages = existingProperty.images.filter(
          (img: any) => propertyData.retainedImageIds.includes(img)
        );
        
        // Images to delete (those not in retainedImageIds)
        imagesToDelete = existingProperty.images.filter(
          (img: any) => !propertyData.retainedImageIds.includes(img)
        );

      } else {
        // If no retainedImageIds provided, delete all existing images
        imagesToDelete = existingProperty.images || [];
        updatedImages = [];
      }
      
      // Delete removed image files
      await deleteImageFiles(imagesToDelete);
      
      // Add newly uploaded images
      if (files && files.length > 0) {
        const newImagePaths = await saveFiles(files);
        updatedImages = [...updatedImages, ...newImagePaths];
      }
      
      // Update property data with combined images
      propertyData.images = updatedImages;
      
      // Remove fields that shouldn't be in the database
      delete propertyData.retainedImageIds;
      
      // Update the property in the database
      await propertiesCollection.updateOne(
        { id: propertyData.id },
        { $set: propertyData }
      );

      return res.status(200).json({
        success: true,
        message: "Property updated successfully",
        property: propertyData,
      });
    } else {
      // For create: Add new property
      // Save uploaded files and attach to property data
      let imagePaths: any = [];
      if (files && files.length > 0) {
        imagePaths = await saveFiles(files);
      }
      
      propertyData.images = imagePaths;
      propertyData.owner = Number(userData.user!.id);
      propertyData.id = uuidv4();

      // Validate property data
      const result = PropertySchema.safeParse(propertyData);
      if (!result.success) {
        return res.status(400).json({ error: "Validation failed", details: result.error.errors });
      }

      // Insert new property
      await propertiesCollection.insertOne(propertyData);

      return res.status(200).json({
        success: true,
        message: "Property added successfully",
        property: propertyData,
      });
    }
  } catch (error) {
    console.error("Error handling property submission:", error);
    return res.status(500).json({ error: "Failed to process property submission" });
  }
}