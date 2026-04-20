const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const app = express();

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
    res.send("API is running...");
});

module.exports = app;


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZTVlMjNjMTRjYTgwZTRlYTMzNWM2OCIsImlhdCI6MTc3NjY3MzM0NSwiZXhwIjoxNzc3Mjc4MTQ1fQ.EnhNdNj - Cl4X_FomnIRUPVo6ebfDXrFgQv3vjD2dFGs