import 'dotenv/config';
import { auth } from 'express-oauth2-jwt-bearer';

const domain = process.env.AUTH0_DOMAIN;
const audience = process.env.AUTH0_AUDIENCE;

if (!domain || !audience) {
  console.warn(
    '[Auth0] AUTH0_DOMAIN or AUTH0_AUDIENCE is missing. Protected routes will fail until they are set.'
  );
}

export const checkJwt = auth({
  audience,
  issuerBaseURL: domain ? `https://${domain}/` : undefined,
  tokenSigningAlg: 'RS256'
});

export const requireAuth = (req, res, next) => {
  if (!req.auth || !req.auth.payload?.sub) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  req.user = {
    auth0Id: req.auth.payload.sub,
    email: req.auth.payload.email,
    name: req.auth.payload.name
  };

  return next();
};

