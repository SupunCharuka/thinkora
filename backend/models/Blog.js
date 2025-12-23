import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String },
    image: { type: String },
    gallery: [{ type: String }],
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    published: { type: Boolean, default: true },
    // highlighted: simple boolean flag for featured/highlighted blogs
    highlighted: { type: Boolean, default: false },
    // heroRank: 1..4 to mark blog as hero slot; null/undefined means not a hero
    heroRank: { type: Number, default: null },
    // tags: array of short strings for categorization/search
    tags: [{ type: String, trim: true, lowercase: true }],
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Blog', blogSchema);
