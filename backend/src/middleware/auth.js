import jwt from "jsonwebtoken";

export async function authCognitoMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing token" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("❌ JWT Verify error:", err);
        return res.status(401).json({ message: "Invalid token" });
      }

      req.user = {
        username: decoded.username || decoded.email || decoded.sub,
        email: decoded.email,
        id: decoded.id,
      };

      next();
    });
  } catch (err) {
    console.error("❌ Middleware error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
}
