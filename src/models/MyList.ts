// File: src/models/MyList.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMyList extends Document {
  userId: string;
  contentId: string;
  contentType: 'Movie' | 'TVShow';
  addedAt: Date;
}

const MyListSchema = new Schema<IMyList>({
  userId: { type: String, required: true, index: true },
  contentId: { type: String, required: true },
  contentType: { type: String, enum: ['Movie', 'TVShow'], required: true },
  addedAt: { type: Date, default: Date.now }
});

MyListSchema.index({ userId: 1, contentId: 1 }, { unique: true });

export default mongoose.model<IMyList>('MyList', MyListSchema);
