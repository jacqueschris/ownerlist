import type { NextApiRequest, NextApiResponse } from "next";
import { mkdir } from "fs/promises";
import { File, Formidable } from "formidable";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { rename, unlink } from "fs";
import { promisify } from "util";
import clientPromise from "../config";
import { ObjectId } from "mongodb";
const unlinkAsync = promisify(unlink);

// Helper function to parse FormData
export const parseForm = (req: NextApiRequest) => {
    return new Promise<{ fields: Record<string, string>; files: File[] }>((resolve, reject) => {
        const form = new Formidable({ multiples: true, uploadDir: "./public/uploads", keepExtensions: true });

        form.parse(req, (err, fields, files) => {
            if (err) return reject(err);

            // Ensure fields are strings and files are an array
            const formattedFields = Object.keys(fields).reduce((acc: any, key) => {
                acc[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
                return acc;
            }, {} as Record<string, string>);

            const formattedFiles = Array.isArray(files.files) ? files.files : files.files ? [files.files] : [];

            resolve({ fields: formattedFields, files: formattedFiles as File[] });
        });
    });
};

// Helper function to save uploaded files
export const saveFiles = async (files: File[]) => {
    if (!files || files.length === 0) return [];

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
            await rename(file.filepath, newPath, () => { });
            return `/uploads/${fileName}`; // Return object with id and url for frontend use
        })
    );

    return filePaths.filter(Boolean); // Remove null values
};

// Helper function to delete image files
export const deleteImageFiles = async (images: any[]) => {
    if (!images || images.length === 0) return;


    await Promise.all(
        images.map(async (image) => {
            try {
                if (!image) return;

                // Extract the file path from the URL
                let fullPath = `./public/${image}`

                // Check if file exists before attempting to delete
                await unlinkAsync(fullPath);
                console.log(`Deleted image file: ${fullPath}`);
            } catch (error) {
                console.error(`Failed to delete image file: ${image.url}`, error);
                // Continue with other deletions even if one fails
            }
        })
    );
};

export async function getNextPropertyIndex() {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const counter = await db.collection("counters").findOneAndUpdate(
        { _id: "property_index" as unknown as ObjectId },  // Unique counter identifier
        { $inc: { index: 1 } },     // Increment the index
        { upsert: true, returnDocument: "after" } // Create if not exists, return updated doc
    );

    return counter?.index;
}