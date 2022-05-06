const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { MongoDb } = require("./config.js"); // getting DataBase Url
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./Routes/user"); // Routing Purpose Of URL

app.use(express.json({ limit: "50mb" }));
app.use(cors());

app.use(bodyParser.json()); // Parsing the Data Comes from Request else It shows Undefined Data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));
// app.use("/uploads", express.static("uploads"));

app.use("/am/socialMedia", userRoutes);

app.use((req, res, next) => {
  const err = new Error("Path is Not found please check");
  err.status = 404;
  next(err);
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  res.status(status).json({
    error: {
      message: error.message,
    },
  });
});

mongoose
  .connect(MongoDb, { useNewUrlParser: true })
  .then(() => {
    console.log("Database is Connected Successfully");
    return app.listen(5000);
  })
  .then(() => console.log("Successfully Running Port 5000"))
  .catch((e) =>
    console.log("Error Raised In Connection OR Running", e.message)
  );
