import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import multer from "multer";
import { UploadApiResponse } from "cloudinary";
require("dotenv").config();

const { v4: uuidv4 } = require("uuid");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer();

const PORT = process.env.PORT || 3000;
const app = express();

// Middlewareexp

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
// app.use(limiter);

app.post(
  "/api/upload",
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      const { iv, encryptedKey, keyIv, salt, userId, fileSize } = req.body;

      const fileName = req.body.fileName || "defaultFileName";
      const fileBuffer = req.file?.buffer;

      if (!fileBuffer) {
        res.status(400).json({ error: "No file uploaded" });
      }

      const uniqueFileName = uuidv4();

      const uploadResult: UploadApiResponse = await new Promise(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                resource_type: "raw",
                public_id: `securevault/${uniqueFileName}`,
              },
              (error: any, result: UploadApiResponse) => {
                if (error) return reject(error);
                resolve(result);
              }
            )
            .end(fileBuffer);
        }
      );
      if (!uploadResult || !uploadResult.secure_url) {
        res.status(500).json({ error: "Upload failed" });
        return;
      }
      const addFile = await prisma?.file.create({
        data: {
          encryptedAesKey: encryptedKey,
          iv: iv,
          keyIv: keyIv,
          salt: salt,
          name: fileName,
          size: parseInt(fileSize, 10) || 0,
          src: uploadResult.secure_url,
          type: req.file?.mimetype || "application/octet-stream",
          userId: parseInt(userId),
        },
      });
      if (!addFile) {
        res.status(500).json({ error: "Database operation failed" });
        return;
      } else {
        res.status(200).json({
          message: "File uploaded successfully",
          file: {
            id: addFile.id,
            name: addFile.name,
            size: addFile.size,
            src: addFile.src,
            type: addFile.type,
          },
        });
      }
    } catch (err) {
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
