import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    message: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Message', MessageSchema);
