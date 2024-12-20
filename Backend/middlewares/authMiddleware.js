// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) {
//     return res.status(401).json({ message: "Access Denied. No token provided." });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(400).json({ message: "Invalid or expired token." });
//   }
// };

// module.exports = authMiddleware;

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
	try {
		// Extract the token from the Authorization header
		const token = req.header("Authorization")?.replace("Bearer ", "");

		if (!token) {
			return res
				.status(401)
				.json({ message: "Access Denied. No token provided." });
		}

		// Verify the token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Ensure the role and other required fields are present
		if (!decoded._id || !decoded.role) {
			return res.status(400).json({ message: "Invalid token structure." });
		}

		// Attach the decoded user information to the request
		req.user = {
			_id: decoded._id,
			role: decoded.role,
			name: decoded.name || "Unknown", // Optional fallback
		};

		next(); // Proceed to the next middleware or route handler
	} catch (error) {
		console.error("Authentication Error:", error);
		res
			.status(400)
			.json({ message: "Invalid or expired token.", error: error.message });
	}
};

module.exports = authMiddleware;
