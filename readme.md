[![Netlify Status](https://api.netlify.com/api/v1/badges/638b9095-c150-40dd-ba3b-e5e61586f35b/deploy-status)](https://app.netlify.com/sites/turf-sandbox/deploys)

# Turf Sandbox

Playground environment allowing users to try out [Turf](https://github.com/Turfjs/turf)'s features and create (hopefully)
 easy to debug examples for issues they encountered using any Turf package.<br>
The app is currently hosted at [https://turf-sandbox.netlify.app](https://turf-sandbox.netlify.app/).

### Usage

Write your code on the editor and return a valid GeoJSON object, it will be rendered on the map on the right.

### TODOs

- [ ] ~Add package selection~ We'll just use the latest version from `https://npmcdn.com/@turf/turf`

- [x] Allow the user to save code snippets and create links to share the examples

- [ ] Add instructions on how to use the tool

- [ ] Evaluate strategies to improve system security


### Credits

This project has been inspired by [Try Carbon][5] ([![alt text][4]](https://github.com/kylekatarnls/try-carbon)), the
 test environment for [Carbon PHP][6].

The following articles and projects were very useful for the development of this project:
- [Build your own interactive JavaScript playground][1]
- [How to Write Your Own JSFiddle][2]
- [Best practices for building your own live paste bin][3]

[1]: https://krasimirtsonev.com/blog/article/build-your-own-interactive-javascript-playground#transpiling-the-code
[2]: https://websanova.com/posts/jquery/how-to-write-your-own-jsfiddle-in-15-minutes-or-less
[3]: https://github.com/jsbin/jsbin/wiki/Best-practices-for-building-your-own-live-paste-bin#xss-from-dynamically-generated-iframe-to-top-level-application
[4]: http://i.imgur.com/9I6NRUm.png (see project on github)
[5]: https://try-carbon.herokuapp.com
[6]: https://carbon.nesbot.com


### Login process

##### GitHub

[**Process flow Steps**](https://medium.com/shriram-navaratnalingam/authentication-using-github-oauth-2-0-with-nodejs-be1091ce10a7):<br>
- Register the app on GitHub to obtain the `ClientID` and `ClientSecret` for the app
- From the browser the client makes a request to the `https://github.com/login/oauth/authorize` with
 the appropriate app's `ClientID`
- The above operation allows the user to authorizes the client to access the user's GitHub data and redirects the user
 to the callback URL we defined when registering app
- Now (here on the server) with the use of the obtained `RequestToken` in addition to `ClientID` and `ClientSecret` we
 call `https://github.com/login/oauth/access_token` to request an API `AccessToken`
- If all the values we've provided are valid, the API will respond with the `AccessToken` for client to make authorised
 requests to the GitHub API, which we store in the Local Storage.

## Development

Set your env variables in `.env`.

Make sure you have [Netlify CLI](https://github.com/netlify/cli) installed globally.

Run `netlify dev`.
