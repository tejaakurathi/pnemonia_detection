import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const client = jwksClient({
  jwksUri: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error("❌ JWKS key fetch error:", err);
      return callback(err);
    }

    try {
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    } catch (e) {
      console.error("❌ Error extracting public key:", e);
      callback(e);
    }
  });
}

export async function authCognitoMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing token" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
      if (err) {
        console.error("❌ JWT Verify error:", err);
        return res.status(401).json({ message: "Invalid token" });
      }

      req.user = {
        username:
          decoded["cognito:username"] ||
          decoded.username ||
          decoded.email ||
          decoded.sub,
        email: decoded.email,
        sub: decoded.sub,
      };

      next();
    });
  } catch (err) {
    console.error("❌ Middleware error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
}
