require('dotenv').config();
const axios = require('axios');

// client ID and client secret obtained while registering the application on GitHub
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_URL = 'https://github.com/login/oauth/access_token';

/*
 * GitHub Authorizing OAuth Apps
 * https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/
 */

// GitHub will redirect the login request here, providing the request token as `code` parameter
exports.handler = async function (event, context) {
    try {
        // get the request token needed to get the access_token for GitHub
        const requestToken = event.queryStringParameters.code;

        const {data: {access_token: accessToken}} = await axios.post(
            `${GITHUB_URL}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${requestToken}`,
            null,
            {
                headers: {Accept: 'application/json'}
            });

        // redirect user to authorization URL
        return {
            statusCode: 302,
            headers: {
                Location: `${process.env.URL}/?access_token=${accessToken}`,
                'Cache-Control': 'no-cache' // disable caching of this response
            },
            body: '' // return body for local dev
        };

    } catch (err) {
        console.error(err);
        return {
            statusCode: err.statusCode || 500,
            body: JSON.stringify({
                error: err.message,
            })
        };
    }
}
