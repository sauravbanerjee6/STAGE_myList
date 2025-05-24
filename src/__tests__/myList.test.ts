import request from 'supertest';
import app  from '../app'; // assuming Express app is exported here
// import MyList from '../src/models/MyList';

describe('MyList Service', () => {
    it('should add content to user list', async () => {
        const userId = 'user123';
        const response = await request(app)
            .post('/api/mylist/add') // your actual endpoint
            .send({
                userId,
                contentId: 'movie1',
                contentType: 'Movie'
            });

        expect(response.status).toBe(200);
        expect(response.body.data.items).toHaveLength(1);
    });
});
