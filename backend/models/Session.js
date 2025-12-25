import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  sid: { type: String, required: true, index: true, unique: true },
  ip: { type: String },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now },
});

export default mongoose.models.Session || mongoose.model('Session', SessionSchema);
