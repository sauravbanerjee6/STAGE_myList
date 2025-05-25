import request from 'supertest';
import app from '../src/app'; // Update with actual path to Express app
import mongoose from 'mongoose';

describe('My List API', () => {
    it('should add item to list', async () => {
        const response = await request(app)
            .post('/mylist/')
            .send({ userId: 'testUser1', contentId: 'movie-123', contentType: "Movie" });
        expect(response.status).toBe(200);
    });

    it('should return paginated list', async () => {
        const response = await request(app).get('/mylist/testUser1?page=1&limit=10');
        expect(response.status).toBe(200);
        expect(response.body.data).toBeInstanceOf(Array);
    });

    it('should remove item from list', async () => {
        const response = await request(app)
            .delete('/mylist/')
            .send({ userId: 'testUser1', contentId: 'movie-123' });
        expect(response.status).toBe(200);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

});
