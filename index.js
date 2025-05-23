const express = require("express");
const path = require("node:path");
const cors = require("cors");
require("dotenv").config();

const app = express();
const commentRouter = require("./routes/commentRouter");
const postRouter = require("./routes/postRouter");
const userRouter = require("./routes/userRouter");
const passport = require("passport");
require("./auth/auth");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(passport.initialize());

app.use("/posts", postRouter);
app.use("/users", userRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err);
});

app.listen(3000, () => {
  console.log(`Listening on PORT ${3000}`);
});
