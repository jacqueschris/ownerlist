import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../config";
import { isHashValid } from "../validate-hash";
import { parse } from "@telegram-apps/init-data-node";
import { File, Formidable } from "formidable";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { propertySchema } from "@/models/property";
import { readFileSync, rename } from "fs";

// Disable default body parser to handle FormData
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to parse FormData
const parseForm = (req: NextApiRequest) => {
  return new Promise<{ fields: Record<string, string>; files: File[]}>((resolve, reject) => {
    const form = new Formidable({ multiples: true, uploadDir: "./public/uploads", keepExtensions: true });

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);

      // Ensure fields are strings and files are an array
      const formattedFields = Object.keys(fields).reduce((acc:any, key) => {
        acc[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
        return acc;
      }, {} as Record<string, string>);

      const formattedFiles = Array.isArray(files.files) ? files.files : [files.files];

      resolve({ fields: formattedFields, files: formattedFiles as File[] });
    });
  });
};

// Helper function to save uploaded files
const saveFiles = async (files: File[]) => {
  const uploadDir = path.join(process.cwd(), "public/uploads");

  // Ensure the upload directory exists
  await mkdir(uploadDir, { recursive: true });

  // Process each file and move it to the upload directory
  const filePaths = await Promise.all(
    files.map(async (file) => {
      if (!file || !file.filepath) return null;
      const fileExt = path.extname(file.originalFilename || "");
      const fileName = `${uuidv4()}${fileExt}`;
      const newPath = path.join(uploadDir, fileName);
      await rename(file.filepath, newPath, ()=>{});
      return `/uploads/${fileName}`; // Return relative path for frontend use
    })
  );

  return filePaths.filter(Boolean); // Remove null values
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

    // Save uploaded files and attach to property data
    let imagePaths;
    if (files){
      imagePaths =  await saveFiles(files!)
    }
    propertyData.images = imagePaths;
    propertyData.owner = String(userData.user!.id);

    // Validate property data
    const result = propertySchema.safeParse(propertyData);
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
