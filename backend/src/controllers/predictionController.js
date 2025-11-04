import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  SageMakerRuntimeClient,
  InvokeEndpointCommand,
} from "@aws-sdk/client-sagemaker-runtime";
import Prediction from "../models/Prediction.js";

const s3 = new S3Client({ region: process.env.AWS_REGION });
const sagemaker = new SageMakerRuntimeClient({
  region: process.env.AWS_REGION,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "temp");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

export const uploadMiddleware = multer({ storage }).single("image");

export async function handleUpload(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const username = req.user.username;

    const IMG_SIZE = 224;
    const { data, info } = await sharp(req.file.path)
      .resize(IMG_SIZE, IMG_SIZE)
      .toFormat("png")
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const floatArray = Float32Array.from(data, (v) => v / 255.0);
    const arr = [];
    for (let i = 0; i < IMG_SIZE; i++) {
      const row = [];
      for (let j = 0; j < IMG_SIZE; j++) {
        const idx = (i * IMG_SIZE + j) * 3;
        row.push([floatArray[idx], floatArray[idx + 1], floatArray[idx + 2]]);
      }
      arr.push(row);
    }

    const payload = JSON.stringify({ instances: [arr] });

    const s3Key = `uploads/${req.file.filename}`;
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
        Body: fs.createReadStream(req.file.path),
        ContentType: req.file.mimetype,
      })
    );

    const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    const response = await sagemaker.send(
      new InvokeEndpointCommand({
        EndpointName: process.env.SAGEMAKER_ENDPOINT_NAME,
        ContentType: "application/json",
        Body: payload,
      })
    );

    const body = new TextDecoder("utf-8").decode(response.Body);
    const result = JSON.parse(body);

    let label = "Unknown";
    let confidence = 0;
    const predictions = result.predictions?.[0];

    if (predictions && predictions.length === 1) {
      const prob = predictions[0]; // probability of Pneumonia
      const threshold = 0.5; // adjust if needed
      label = prob > threshold ? "Pneumonia" : "Normal";
      confidence = prob;
    }

    console.log("💾 [MongoDB Save] Using username:", username);
    let doc = await Prediction.findOne({ username });
    if (!doc) doc = await Prediction.create({ username, images: [] });

    doc.images.unshift({
      imageUrl,
      prediction: label,
      confidence,
      segmentationMapUrl: null,
    });
    await doc.save();

    fs.unlinkSync(req.file.path);

    return res.json({
      username,
      imageUrl,
      prediction: label,
      confidence,
      segmentationMapUrl: null,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: e.message || "Server error" });
  }
}

export async function getDashboard(req, res) {
  try {
    const username = req.user.username;
    const doc = await Prediction.findOne({ username });
    return res.json({ username, images: doc?.images || [] });
  } catch (e) {
    return res.status(500).json({ message: "Dashboard error" });
  }
}
