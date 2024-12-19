const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;

// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) {
//     return res.status(401).json({ message: "Access Denied. No token provided." });
//   }

//   try {
//     // Verify and decode the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;

//     // Check if the user has the "admin" role
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ message: "Access Denied. Only admins can perform this action." });
//     }

//     next();  // User is authenticated and authorized, proceed to the next middleware or route handler
//   } catch (error) {
//     res.status(400).json({ message: "Invalid or expired token." });
//   }
// };

// module.exports = authMiddleware;
