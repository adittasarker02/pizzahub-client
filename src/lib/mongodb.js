import { MongoClient } from 'mongodb';

// Re-use one client across hot reloads (dev) and warm serverless invocations (prod)
const g = globalThis;

export function getMongoClient() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Add it to your environment variables.');
  }
  g._pizzahubMongo ??= new MongoClient(process.env.MONGODB_URI, { maxPoolSize: 10 });
  return g._pizzahubMongo;
}

export function getDb() {
  return getMongoClient().db(process.env.DB_NAME || 'pizzahub');
}
