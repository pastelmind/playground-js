import cookieParser from "cookie-parser";
import express from "express";
import { engine as handlebarsEngine } from "express-handlebars";
import createError from "http-errors";
import logger from "morgan";
import users from "./routes/users.js";

const app = express();

app.engine(".hbs", handlebarsEngine({ extname: ".hbs" }));
app.set("view engine", ".hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});
app.use("/users", users);

app.use(function (req, res, next) {
  next(createError(404));
});

export default app;
