import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    logoUrl: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model('Brand', BrandSchema);
