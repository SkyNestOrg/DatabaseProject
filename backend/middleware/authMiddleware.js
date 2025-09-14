import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // attach user payload to request, contains { id: user.id }
    next(); // this allows the request to proceed to the next middleware or route handler
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};