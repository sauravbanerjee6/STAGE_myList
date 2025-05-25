import mongoose from "mongoose";
import User from "../models/User";
import Movie, { IMovie } from "../models/Movie";
import TVShow, { ITVShow } from "../models/TVShow";
import dotenv from 'dotenv';

dotenv.config();

async function setup() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || '');

        //clear exsting data
        await User.deleteMany({});
        await Movie.deleteMany({});
        await TVShow.deleteMany({});

        const genres = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'];
        const actors = ['Andy Samberg', 'Adam Scott', 'Melissa Fumero', 'Amy Poehler', 'Aubrey Plaza'];
        const directors = ['Steven Spielberg', 'Alfred Hitchcock', 'Quentin Tarantino', 'Stanley Kubrick', 'Micheal Bay'];

        //Movies
        const movies: IMovie[] = [];
        for (let i = 1; i <= 10; i++) {
            const movie = new Movie({
                title: `Movie Title ${i}`,
                description: `Description for movie ${i}`,
                genres: [genres[i % genres.length]],
                releaseDate: new Date(2000 + i, i % 12, i),
                director: directors[i % directors.length],
                actors: [actors[i % actors.length], actors[(i + 1) % actors.length]],
            });
            movies.push(await movie.save());
        }

        //TV Shows
        const tvShows: ITVShow[] = [];
        for (let i = 1; i <= 10; i++) {
            const episodes = [];
            for (let ep = 1; ep <= 3; ep++) {
                episodes.push({
                    episodeNumber: ep,
                    seasonNumber: 1,
                    releaseDate: new Date(2020, ep, i),
                    director: directors[(i + ep) % directors.length],
                    actors: [actors[(i + ep) % actors.length], actors[(i + ep + 1) % actors.length]],
                });
            }
            const tvShow = new TVShow({
                title: `TV Show Title ${i}`,
                description: `Description for TV Show ${i}`,
                genres: [genres[(i + 2) % genres.length]],
                episodes,
            });
            tvShows.push(await tvShow.save());
        }

        //Users
        for (let u = 1; u <= 5; u++) {
            const favoriteGenres = [genres[u % genres.length], genres[(u + 1) % genres.length]];
            const dislikedGenres = [genres[(u + 3) % genres.length]];
            const watchHistory = [];

            // Each user watches 2 movies and 2 TV show episodes randomly
            for (let w = 0; w < 2; w++) {
                const movie = movies[(u + w) % movies.length];
                watchHistory.push({
                    contentId: movie?._id?.toString(),
                    watchedOn: new Date(Date.now() - (w * 1000000000)),
                    rating: Math.floor(Math.random() * 5) + 1,
                });
            }
            for (let w = 0; w < 2; w++) {
                const tvShow = tvShows[(u + w) % tvShows.length];
                // Reference the TV show _id as contentId (you might want episode id if available)
                watchHistory.push({
                    contentId: tvShow?._id?.toString(),
                    watchedOn: new Date(Date.now() - (w * 2000000000)),
                    rating: Math.floor(Math.random() * 5) + 1,
                });
            }

            const user = new User({
                username: `user${u}`,
                preferences: {
                    favoriteGenres,
                    dislikedGenres,
                },
                watchHistory,
            });
            await user.save();
        }

        console.log("Dummy Data added to the database!");

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error creating dummy data!", error);
    }
}

setup();