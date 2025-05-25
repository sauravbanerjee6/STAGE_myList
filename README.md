##Installation and Setup## -
1. **Clone the repository**
   ```bash
   git clone https://github.com/sauravbanerjee6/STAGE_myList.git
   cd your-repo-name
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file**
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/mylist
   ```

4. **setup the project**
   ```bash
   npm run setup
   ```

5. **Start the server**
   ```bash
   npm run start
   ```

6. **Run integration tests**
   ```bash
   npm run test
   ```

## Design Choices - ##
- **MongoDB Indexing**: User list items are stored in a way that allows indexing by `userId` and `contentId` to prevent duplicates and improve query performance.
- **Pagination**: The `/mylist` GET API supports `page` and `limit` query params for performance under large data loads.
- **Stateless API**: Designed as RESTful endpoints, allowing horizontal scaling across multiple instances.

##Assumptions-##
- User authentication is assumed to be handled upstream (mock `userId` is used during development).
- Movie and TV Show content are pre-populated in MongoDB; setup scripts can be added for local setup.
- Items in “My List” are uniquely identified by `userId` and `contentId`.

## API Documentation-##
1. **Add to MyList-**
   ### Endpoint
```
POST /mylist/
```

### Request Body

```json
{
  "userId": "user123",
  "contentId": "movie456",
  "contentType": "Movie" 
}
```
2. **Remove from MyList-**
   ### Endpoint
```
DELETE /mylist/
```

### Request Body

```json
{
  "userId": "user123",
  "contentId": "movie456"
}
```

3. **Get MyList-**
   ### Endpoint
```
Get /mylist/:userId?limit=<limit>&page=<page>
```

### Request query

```
limit(number)
page(number)
```
