import cookieParser from "cookie-parser";
import express from "express";
import createError from "http-errors";
import logger from "morgan";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use(function (req, res, next) {
  next(createError(404));
});

export default app;
