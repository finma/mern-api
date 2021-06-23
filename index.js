const express = require("express");
const fileupload = require("express-fileupload");
const mongoose = require("mongoose");
const path = require("path");

const authRoutes = require("./src/routes/auth");
const blogRoutes = require("./src/routes/blog");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  fileupload({ useTempFiles: true, tempFileDir: path.join(__dirname, "tmp") })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, OPTIONS. PUT, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/v1/auth", authRoutes);
app.use("/v1/blog", blogRoutes);

app.use((error, req, res, next) => {
  const status = error.errorStatus || 500;
  const { message, data } = error;
  res.status(status).json({ message, data });
});

mongoose
  .connect(
    "mongodb+srv://firman:OdJp83gzMcgHpD7q@cluster0.vadp9.mongodb.net/blog?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  )
  .then(() => {
    app.listen(port);
    console.log(`Listening server on port ${port}`);
  })
  .catch((err) => console.log(err));
