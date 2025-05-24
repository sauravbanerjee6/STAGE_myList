// File: src/models/Movie.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMovie extends Document {
  title: string;
  description: string;
  genres: string[];
  releaseDate: Date;
  director: string;
  actors: string[];
}

const MovieSchema = new Schema<IMovie>({
  title: { type: String, required: true },
  description: String,
  genres: [{ type: String }],
  releaseDate: { type: Date },
  director: String,
  actors: [{ type: String }]
});

export default mongoose.model<IMovie>('Movie', MovieSchema);