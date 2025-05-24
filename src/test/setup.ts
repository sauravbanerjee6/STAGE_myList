import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  // await mongoose.connect(uri, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true
  // } as any);
});

beforeEach(async () => {
  const collections = await mongoose?.connection?.db?.collections();
  for (const collection of collections!) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  // await mongoose.connection.close();
  await mongo.stop();
});
