import dbConnect from './database.mjs';
import dateFormat from 'date-format';
import path from 'path';
import fs from 'fs';
import 'colors';

async function analyze({ dataPath }) {
    const db = await dbConnect();
    const data10k = await extract10k({ db, dataPath });
    const bestChan = await extractChans({ data10k });
    console.log(
        'Chan ' +
            String(bestChan[0]).white +
            ': ' +
            String(bestChan[1]).blue +
            ' entries'
    );
    const { users } = await extractUsersMsg(bestChan[0], { data10k });
    await showAnalyzeUser(users[44], { db });
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
                channelId: entry.channelId,
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

async function showAnalyzeUser(user, { db }) {
    let ts = 0;
    console.log('User: ' + user.username.yellow + `#${user.id}`.grey);
    for (let msg of user.messages) {
        console.log(
            `${user.username}_${
                ts
                    ? `+${Math.floor(
                        (new Date(msg.date).getTime() - ts) / 1000
                    )}s`
                    : '+0s'
            }> ` + msg.content.white
        );
        ts = new Date(msg.date).getTime();
    }
    /* Timeline */
    /* Ban? */
    const timeouts = await db
        .collection('timeouts')
        .find({
            username: user.username,
            channelId: user.channelId
        })
        .toArray();
    if (timeouts.length) {
        console.log('BAN ' + String(timeouts.length).blue + ' times');
        for (let entry of timeouts) {
            console.log(`- ${dateFormat('dd/MM/yyyy hh:mm:ss', entry.date)}`);
        }
    }
}

export default analyze;
