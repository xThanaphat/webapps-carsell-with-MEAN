import mongoose from 'mongoose';

const CarSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    year: Number,
    mileage: Number,
    price: { type: Number, required: true },
    imageUrl: String,
    description: String,
    premium: { type: Boolean, default: true },
    spin: {
      frames: [{ type: String }] // relative paths to frontend assets
    }
  },
  { timestamps: true }
);

export default mongoose.model('Car', CarSchema);
