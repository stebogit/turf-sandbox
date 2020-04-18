const router = require('express').Router();
const axios = require('axios');

// This is the client ID and client secret that you obtained
// while registering the application
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_URL = 'https://github.com/login/oauth/access_token';
const origin = process.env.NODE_ENV !== 'production' ? process.env.APP_URL : '';

/*
 * GitHub Authorizing OAuth Apps
 * https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/
 */

// GitHub will redirect the login request here, providing the request token as `code` parameter
router.get('/', async (req, res) => {
    try {
        // get the request token needed to get the access_token for GitHub
        const requestToken = req.query.code;
        const {data: {access_token: accessToken}} = await axios.post(
            `${GITHUB_URL}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${requestToken}`,
            null,
            {
                headers: {Accept: 'application/json'}
            });

        return res.redirect(`${origin}/?access_token=${accessToken}`);

    } catch (err) {
        console.error(err);
        return res.status(500).send({error: err});
    }
});

module.exports = router;
