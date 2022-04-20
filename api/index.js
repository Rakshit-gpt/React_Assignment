const express = require("express");
const bodyParser = require("body-parser");
const usersRoutes = require("./routes/v1/users.js");
const compression = require("compression");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;
app.use(compression());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Server running on PORT:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.use("/users", usersRoutes);