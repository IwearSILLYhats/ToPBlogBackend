const express = require("express");
const path = require("node:path");
const cors = require("cors");

const app = express();
const commentRouter = require("./routes/commentRouter");
const postRouter = require("./routes/postRouter");
const userRouter = require("./routes/userRouter");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err);
});

app.use("/posts", postRouter);

app.listen(
  process.env.PORT,
  console.log(`Listening on PORT ${process.env.PORT}`)
);
