'use strict';

const express = require('express');
const simpleOauthModule = require('./../');

const app = express();
const oauth2 = simpleOauthModule.create({
  client: {
    id: 'app.bbva.vga.bot',
    secret: 'wn7OIEYKluPzeWudjxeeaeEQBRWZ3j70U*kVUMwjSEsmLFGB04kxH3LYpDGp1cnP',
  },
  auth: {
    tokenHost: 'https://connect.bbva.com',
    tokenPath: '/token',
    authorizePath: '/sandboxconnect',
  },
  options:{
    useBasicAuthorizationHeader: true,
    bodyFormat:'qs',
    useBodyAuth:false
  }
});

// Authorization uri definition
const authorizationUri = oauth2.authorizationCode.authorizeURL({
  redirect_uri: 'http://localhost:3000/callback',
  // scope: 'notifications',
  // state: '3(#0/!~',
});

// Initial page redirecting to Github
app.get('/auth', (req, res) => {
  console.log(authorizationUri);
  res.redirect(authorizationUri);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', (req, res) => {
  const code = req.query.code;
  const redirect_uri = 'http://localhost:3000/callback';
  console.log('AQUIIIII ESTA EL CODE: '+code)
  const options = {
    code,
    redirect_uri,
  };

  oauth2.authorizationCode.getToken(options, (error, result) => {

    if (error) {
      console.error('Access Token Error', error.message);
      return res.json('Authentication failed');
    }

    console.log('The resulting token: ', result);
    const token = oauth2.accessToken.create(result);

    return res
      .status(200)
      .json(token);
  });
});

app.get('/success', (req, res) => {
  res.send('');
});

app.get('/', (req, res) => {
  res.send('Hello<br><a href="/auth">Log in with Github</a>');
});

app.listen(3000, () => {
  console.log('Express server started on port 3000'); // eslint-disable-line
});


// Credits to [@lazybean](https://github.com/lazybean)
