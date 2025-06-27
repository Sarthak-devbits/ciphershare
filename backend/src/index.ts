import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import multer from "multer";
import { UploadApiResponse } from "cloudinary";
import { prisma } from "./lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import { authorization } from "./middleware/authorization.middleware";
import passport from "./config/passport";

const cookieParse = require("cookie-parser");
const bcrypt = require("bcryptjs");

require("dotenv").config();

declare global {
  namespace Express {
    interface Request {
      userId: number;
      email: string;
    }
  }
}

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
app.use(cookieParse());

// app.use(limiter);

//Middleware to check authorization

//Authentication
app.post("/login", async (req: Request, res: Response) => {
  if (!req.body) {
    res.status(400).json({ error: "Request body is required" });
    return;
  }
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const isUserExist = await prisma?.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!isUserExist) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const isPasswordMatch = await bcrypt.compare(password, isUserExist.password);

  if (!isPasswordMatch) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  const token = jwt.sign(
    { id: isUserExist.id, email: isUserExist.email },
    process.env.JWT_SECERT as string
  );

  res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({
      message: "Login successful",
      user: {
        id: isUserExist.id,
        email: isUserExist.email,
      },
    });
  return;
});

app.post("/signup", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const isUserExist = await prisma?.user.findUnique({
    where: {
      email: email,
    },
  });
  if (isUserExist) {
    res.status(409).json({ error: "User already exists" });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await prisma?.user.create({
    data: {
      email: email,
      password: hashPassword,
    },
  });

  const token = await jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECERT as string
  );

  res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({
      message: "Signup successful",
      user: {
        id: user.id,
        email: user.email,
      },
    });
});

app.get("logout", (req: Request, res: Response) => {
  res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Logout successful" });
});

// Google Authentication
app.get(
  "/login/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

app.get(
  "/googleRedirect",
  passport.authenticate("google", { session: false }),
  async (req: Request, res: Response) => {
    const emailId = (req.user as any).emails[0].value;

    const isUserExist = await prisma?.user.findUnique({
      where: {
        email: emailId,
      },
    });

    if (!isUserExist) {
      const user = await prisma?.user.create({
        data: {
          email: emailId,
          password: "",
          name: (req.user as any).displayName || "Google User",
        },
      });
    }

    const token = jwt.sign(
      { id: (req.user as any).id, email: emailId },
      process.env.JWT_SECERT as string
    );

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .redirect(`http://localhost:5173/`);
    return;
  }
);

app.get("/protected", authorization, (req: Request, res: Response) => {
  res.json({ user: { id: req.userId, role: req.email } });
  return;
});

app.get("/api/file/:id", async (req: Request, res: Response) => {
  const fileId = req.params.id;
  console.log(fileId);
  if (!fileId) {
    res.status(400).json({ error: "File ID is required" });
    return;
  }
  try {
    const file = await prisma?.file.findUnique({
      where: { id: parseInt(fileId) },
    });
    if (!file) {
      res.status(404).json({ error: "File not found" });
      return;
    }
    res.status(200).json(file);
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post(
  "/api/upload",
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      const {
        iv,
        encryptedKey,
        keyIv,
        salt,
        userId,
        fileSize,
        externalUsername,
        externalEmail,
        expiry,
      } = req.body;

      const fileBuffer = req.file?.buffer;
      const fileName = req.body.fileName || "defaultFileName";

      if (!fileBuffer) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }

      if (!iv || !encryptedKey || !keyIv || !salt || !userId) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const expirationDate = expiry
        ? new Date(expiry)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Default to 7 days

      // Upsert external user if info is present
      let externalUserId: number | null = null;

      if (externalEmail && externalUsername) {
        const externalUser = await prisma.externalUsers.upsert({
          where: { email: externalEmail },
          update: { name: externalUsername },
          create: { name: externalUsername, email: externalEmail },
        });
        externalUserId = externalUser.id;
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
              (error: any, result: any) => {
                if (error) return reject(error);
                resolve(result);
              }
            )
            .end(fileBuffer);
        }
      );

      if (!uploadResult?.secure_url) {
        res.status(500).json({ error: "Cloudinary upload failed" });
        return;
      }

      const fileRecord = await prisma.file.create({
        data: {
          name: fileName,
          src: uploadResult.secure_url,
          size: parseInt(fileSize, 10) || 0,
          type: req.file?.mimetype || "application/octet-stream",
          iv,
          encryptedAesKey: encryptedKey,
          keyIv,
          salt,
          userId: parseInt(userId),
          expiry: expirationDate,
          externalUserId,
        },
      });

      res.status(200).json({
        message: "File uploaded successfully",
        file: {
          id: fileRecord.id,
          name: fileRecord.name,
          size: fileRecord.size,
          src: fileRecord.src,
          type: fileRecord.type,
          iv: fileRecord.iv,
          keyIv: fileRecord.keyIv,
          salt: fileRecord.salt,
          encryptedAesKey: fileRecord.encryptedAesKey,
        },
      });
      return;
    } catch (err) {
      console.error("Upload failed:", err);
      res.status(500).json({ error: "Upload failed" });
      return;
    }
  }
);

app.post("/download/count/:id", async (req: Request, res: Response) => {
  const fileId = req.params.id;
  if (!fileId) {
    res.status(400).json({ error: "File ID is required" });
    return;
  }

  const isFileExist = await prisma?.file.findUnique({
    where: {
      id: +fileId,
    },
  });

  if (!isFileExist) {
    res.status(404).json({ error: "File not found" });
    return;
  }

  const updatedFileCount = await prisma?.file.update({
    where: {
      id: +fileId,
    },
    data: {
      downloadCount: {
        increment: 1,
      },
    },
  });
  if (!updatedFileCount) {
    res.status(500).json({ error: "Failed to update download count" });
    return;
  }

  res.status(200).json({
    message: "Download count updated successfully",
    fileData: updatedFileCount,
  });
  return;
});

app.get("/api/files", async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }
  const userIdExist = await prisma?.user.findUnique({
    where: {
      id: parseInt(userId.toString()),
    },
  });
  if (!userIdExist) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const files = await prisma?.file.findMany({
    where: {
      userId: parseInt(userId.toString()),
    },
  });

  res.status(200).json(files || []);
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
