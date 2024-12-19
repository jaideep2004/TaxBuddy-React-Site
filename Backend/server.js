const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const customerRoutes = require("./routes/customerRoutes");
const messageRoutes = require("./routes/messageRoutes");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON
app.use("/api/admin", adminRoutes); // Admin routes
app.use("/api/customers", customerRoutes); // Admin routes
app.use("/api/messages", messageRoutes); // Admin routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
