const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const userRoutes = require("./routes/user.routes"); 

const { notFound, errorHandler } = require("./middlewares/error.middleware");

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
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZTZmYWIxZjEzMDM0ZmYxZDVkODRlMiIsImlhdCI6MTc3Njc0NTEzNywiZXhwIjoxNzc3MzQ5OTM3fQ.G4v9SSNxHboT5pCcF36435m7GvJttY1d0L7lh7KsLa4
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZTVlMjNjMTRjYTgwZTRlYTMzNWM2OCIsImlhdCI6MTc3NjY3MzM0NSwiZXhwIjoxNzc3Mjc4MTQ1fQ.EnhNdNj - Cl4X_FomnIRUPVo6ebfDXrFgQv3vjD2dFGs