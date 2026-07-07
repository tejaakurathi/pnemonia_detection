import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  prediction: { type: String, required: true },
  confidence: { type: Number, required: true },
  segmentationMapUrl: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const predictionSchema = new mongoose.Schema({
  username: { type: String, required: true },
  images: [imageSchema]
}, { timestamps: true });

export default mongoose.model('Prediction', predictionSchema)
