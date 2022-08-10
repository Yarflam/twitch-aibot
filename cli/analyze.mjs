import dbConnect from './database.mjs';
import path from 'path';
import fs from 'fs';

async function analyze({ dataPath }) {
    const db = await dbConnect();
    const data10k = await extract10k({ db, dataPath });
    const bestChan = await extractChans({ data10k });
    console.log(`Chan ${bestChan[0]}: ${bestChan[1]} entries`);
    const { users } = await extractUsersMsg(bestChan[0], { data10k });
    showAnalyzeUser(users[42]);
    db.close();
}

async function extract10k({ db, dataPath }) {
    const outData = path.resolve(dataPath, '10k.json');
    if (fs.existsSync(outData)) {
        console.log('10k.json exists');
        return JSON.parse(fs.readFileSync(outData, 'utf-8'));
    }
    /* Extract the data */
    const data = await db
        .collection('messages')
        .find({}, { limit: 1e4 })
        .toArray();
    fs.writeFileSync(outData, JSON.stringify(data));
    console.log('10k.json saved');
    return data;
}

async function extractChans({ data10k }) {
    let channels = {};
    for (let { channelId } of data10k) {
        if (typeof channels[channelId] === 'undefined') channels[channelId] = 0;
        channels[channelId]++;
    }
    return Object.entries(channels)
        .sort(([, a], [, b]) => (a > b ? -1 : 1))
        .slice(0)[0];
}

async function extractUsersMsg(channelId, { data10k }) {
    let users = {};
    let messages = [];
    for (let entry of data10k) {
        if (entry.channelId !== channelId) continue;
        if (entry.userInfo.type !== 'USER') continue;
        /* Binds */
        const userId = entry.userState['user-id'];
        const message = {
            id: entry.id,
            content: entry.message,
            date: entry.date
        };
        /* User/Message */
        if (typeof users[userId] === 'undefined') {
            users[userId] = {
                id: userId,
                username: entry.userInfo.username,
                messages: []
            };
        }
        users[userId].messages.push(message);
        messages.push(entry.message);
    }
    users = Object.values(users).sort(({ messages: a }, { messages: b }) =>
        a.length > b.length ? -1 : 1
    );
    return { users, messages };
}

function showAnalyzeUser(user) {
    let ts = 0;
    console.log(`User: ${user.username}`);
    for (let msg of user.messages) {
        console.log(
            `${
                ts
                    ? `+${Math.floor(
                        (new Date(msg.date).getTime() - ts) / 1000
                    )}s`
                    : '#'
            }> ${msg.content}`
        );
        ts = new Date(msg.date).getTime();
    }
}

export default analyze;
