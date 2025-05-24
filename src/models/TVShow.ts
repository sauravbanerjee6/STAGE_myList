// File: src/models/TVShow.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ITVShow extends Document {
  title: string;
  description: string;
  genres: string[];
  episodes: Array<{
    episodeNumber: number;
    seasonNumber: number;
    releaseDate: Date;
    director: string;
    actors: string[];
  }>;
}

const TVShowSchema = new Schema<ITVShow>({
  title: { type: String, required: true },
  description: String,
  genres: [{ type: String }],
  episodes: [{
    episodeNumber: Number,
    seasonNumber: Number,
    releaseDate: Date,
    director: String,
    actors: [String]
  }]
});

export default mongoose.model<ITVShow>('TVShow', TVShowSchema);
