import { MongoClient } from 'mongodb';

async function dbConnect() {
    const { MONGODB_CONNECT_STRING } = process.env;
    if (typeof MONGODB_CONNECT_STRING !== 'string') return false;
    /* Connection */
    const client = new MongoClient(MONGODB_CONNECT_STRING);
    try {
        await client.connect();
        return client.db();
    } catch (e) {
        console.error(e);
        return false;
    }
}

export default dbConnect;
