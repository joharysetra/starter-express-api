const { performScraping, searchVideo } = require("./video");

const verifyToken = (req, res) => {
    // Your verify token. Should be a random string.
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    console.log("verify token = ", VERIFY_TOKEN);
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
}

const functionTest = async (_req, res)=> {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    console.log("verify token = ", VERIFY_TOKEN);
    const search = await searchVideo("jeune");
    const searchUrl = search.videos[0].url;
    const url = 'https://www.eporner.com/video-uH84NKCA38u/sister-saw-a-big-dick-of-her-stepbrother-and-framed-her-ass/';
    const videoUrl = await performScraping(searchUrl);
    console.log("video :", videoUrl);
    res.send('Hello World');
}

module.exports = {
    verifyToken,
    functionTest
}