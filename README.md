# Twitch AI bot

## Setup

1. Install node_modules `npm i`
2. Copy `sample.env` to `.env` and set the constants.

## Usages

Analyze

```bash
npm run analyze
node index.mjs analyze # or directly
```

## Work steps

1. Data analyze
2. Build extractors
3. Prepare the datasets
4. Create AI models
5. Optimizations & integrations
6. Use it!

## Network

### MongoDB database

_messages_

-   id
-   channelId
-   message
-   date
-   expiresAt
-   userInfo
    -   displayName
    -   subTypes
    -   type
    -   username
-   userState
    -   badge-info
    -   badge-info-raw
    -   badges
    -   badges-raw
    -   color
    -   display-name
    -   emotes
    -   emotes-raw
    -   first-msg
    -   flags
    -   id
    -   message-type
    -   mod
    -   returning-chatter
    -   room-id
    -   subscriber
    -   tmi-sent-ts
    -   turbo
    -   user-id
    -   user-type
    -   username

_timeouts_

-   username
-   duration
-   channelId
-   expiresAt
-   date

## Authors

-   Yarflam - https://github.com/Yarflam
-   Thibaut - https://github.com/thib3113

## License

-   **MIT** : http://opensource.org/licenses/MIT
