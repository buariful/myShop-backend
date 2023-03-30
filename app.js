const express = require("express");
const errorMiddleWare = require("./middleware/error");
const cookieParser = require("cookie-parser");
//------- routes ------------
const proudctRoutes = require("./routes/product.route.js");
const userRoutes = require("./routes/user.route");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", proudctRoutes);
app.use("/api/v1", userRoutes);

// middleware for error
app.use(errorMiddleWare);
module.exports = app;
