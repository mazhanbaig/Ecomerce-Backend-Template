require("dotenv").config();
const connectDB = require("./src/config/db");
const app = require("./src/index");

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        console.log("✅ MongoDB connected successfully");
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    });