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
			userId: decoded._id, // Add this line to match what the controller expects
			_id: decoded._id,
			role: decoded.role,
			name: decoded.name || "Unknown",
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
