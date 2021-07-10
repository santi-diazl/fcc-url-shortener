require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Require routes
const router = require("./routes");

// Mongoose Configuration
const mongoose = require("mongoose");
const MONGO_URI = process.env["MONGO_URI"];

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

// root handler
app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// api handler
app.use("/api/shorturl", router);

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
