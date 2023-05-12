const express = require("express");
const errorMiddleWare = require("./middleware/error");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;
const bodyParser = require("body-parser");
const multerUpload = require("./middleware/multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
});
//------- routes ------------
const proudctRoutes = require("./routes/product.route.js");
const userRoutes = require("./routes/user.route");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/v1", proudctRoutes);
app.use("/api/v1", userRoutes);

app.post("/api/upload", multerUpload.single("image"), async (req, res) => {
  await cloudinary.uploader.upload(req.file.path, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Upload failed" });
    }
    res.json({ imageUrl: result.secure_url });
  });
});

// middleware for error
app.use(errorMiddleWare);
module.exports = app;
