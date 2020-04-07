const router = require('express').Router();
const axios = require('axios');

// This is the client ID and client secret that you obtained
// while registering the application
const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const githubUrl = 'https://github.com/login/oauth/access_token';

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
            `${githubUrl}?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
            null,
            {
                headers: {Accept: 'application/json'}
            });

        return res.redirect(`${process.env.APP_URL}/?access_token=${accessToken}`);

    } catch (err) {
        console.error(err);
        return res.status(500).send({error: err});
    }
});

module.exports = router;
