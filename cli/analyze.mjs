import dbConnect from './database.mjs';

async function analyze() {
    const db = await dbConnect();
    const data = await db
        .collection('messages')
        .find(
            {
                channelId: '207813352'
            },
            { limit: 100 }
        )
        .toArray();
    console.log(data.length);
}

export default analyze;
