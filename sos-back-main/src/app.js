const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

const indexRouter = require("./routes/index");
const viacepRouter = require("./routes/viacep.js");
const sessionUserRouter = require("./routes/sessionUser.js");

const app = express();

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/", indexRouter);
app.use("/cep", viacepRouter);
app.use("/", sessionUserRouter);

const port = process.env.PORT || PORT;

app.listen(port, () => {
  console.log(`Servidor Express ouvindo na porta ${port}`);
});

module.exports = app;
