import { MongoClient } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  const uri = process.env.MONGODB_URI;
  const info = {
    hasUri: !!uri,
    startsWith: uri ? uri.slice(0, 14) : null,
    hasQuote: uri ? /["'\s]/.test(uri) : null,
    dbName: process.env.DB_NAME || '(not set)',
    hasSecret: !!process.env.BETTER_AUTH_SECRET,
    authUrl: process.env.BETTER_AUTH_URL || '(not set)',
  };
  try {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
    await client.connect();
    info.users = await client.db(process.env.DB_NAME || 'pizzahub').collection('users').countDocuments();
    await client.close();
    info.ok = true;
  } catch (e) {
    info.ok = false;
    info.error = `${e.name}: ${e.message}`.slice(0, 300);
  }
  return Response.json(info);
}
