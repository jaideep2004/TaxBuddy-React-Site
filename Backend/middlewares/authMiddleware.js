const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    console.log("No token provided in Authorization header");
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to the request object
    console.log("Token verified successfully for user:", decoded.userId);
    next();
  } catch (error) {
    console.error("Invalid token error:", error);
    return res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;
