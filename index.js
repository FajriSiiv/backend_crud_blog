import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import router from "./routes/index.js";

const app = express();
const port = 5000;

dotenv.config();
app.use(
  cors({
    origin: process.env.WEBSITE_APP,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));
app.use(router);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
