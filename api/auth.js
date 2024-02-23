const { AuthenticationError } = require('apollo-server-express');
const bodyParser = require('body-parser');
const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

let { JWT_SECRET } = process.env;
if (!JWT_SECRET) {
  if (process.env.NODE_ENV !== 'production') {
    JWT_SECRET = 'temporaryjwtsecretfordevonly';
    console.log('Missing environment variable JWT_SECRET. Using unsafe dev Secret');
  }
  else {
    console.log('Missing env var JWT_SECRET. Authentication disabled');
  }
}

const routes = express.Router();

routes.use(bodyParser.json());
routes.post('/signin', async (req, res) => {
  if (!JWT_SECRET) {
    res.status(500).send('Missing JWT_SECRET. Refusing to authenticate.');
  }

  const googleToken = req.body.google_token;
  if (!googleToken) {
    res.status(400).send({ code: 400, message: 'Missing Token' });
    return;
  }
  const client = new OAuth2Client();
  let payload;
  try {
    const ticket = await client.verifyIdToken({ idToken: googleToken });
    payload = ticket.getPayload();
  } catch (err) {
    res.status(403).send('Invalid Credentials');
  }
  const { given_name: givenName, name, email } = payload;
  const credentials = {
    signedIn: true,
    givenName,
    name,
    email,
  };
  const token = jwt.sign(credentials, JWT_SECRET);
  res.cookie('jwt', token, { httpOnly: true });
  res.json(credentials);
});

routes.post('/signout', (req, res) => {
  res.clearCookie('jwt');
  res.json({ status: 'ok' });
})

function getUser(req) {
  const token = req.cookies.jwt;
  if (!token) {
    return { signedIn: false };
  }
  try {
    const credentials = jwt.verify(token, JWT_SECRET);
    return credentials;
  } catch (err) {
    return { signedIn: false };
  }
}

function mustBeSignedIn(resolver) {
  return (root, args, { user }) => {
    if (!user || !user.signedIn) {
      throw new AuthenticationError('Please Sign in to continue');
    }
    else return resolver(root, args, { user });
  }
}

routes.post('/user', (req, res) => {
  res.send(getUser(req));
})

module.exports = { routes, getUser, mustBeSignedIn };