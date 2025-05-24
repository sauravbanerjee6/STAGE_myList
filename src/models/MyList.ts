// File: src/models/MyList.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMyListItem {
  contentId: string;
  contentType: 'Movie' | 'TVShow';
  addedAt: Date;
}

export interface IMyList extends Document {
  userId: string;
  items: IMyListItem[];
}

const MyListSchema = new Schema<IMyList>({
  userId: { type: String, required: true, index: true },
  items: [{
    contentId: { type: String, required: true },
    contentType: { type: String, enum: ['Movie', 'TVShow'], required: true },
    addedAt: { type: Date, default: Date.now }
  }]
});

export default mongoose.model<IMyList>('MyList', MyListSchema);
