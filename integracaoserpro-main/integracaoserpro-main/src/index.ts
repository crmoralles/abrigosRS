import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import { router } from "./interfaces/http/routes";

dotenv.config();

const app = express();

const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    const whitelist = process.env.ALLOWED_ORIGINS?.split(",") || [];

    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Não autorizado pelo CORS"));
    }
  },
};

app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(router);

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`Servidor Express ouvindo na porta ${port}`);
});

export default app;
