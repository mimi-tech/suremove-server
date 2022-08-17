require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const formData = require("express-form-data");
const swaggerUi = require("swagger-ui-express");

const routes = require("./routes");
const { env, swagger } = require("./configs");
const { security } = require("./middlewares");
const { response } = require("./helpers");

const app = express();
const server = http.createServer(app);
const {port} = env;

app.use(formData.parse());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
  })
); 

app.use("/suremove-app-api", swaggerUi.serve, swaggerUi.setup(swagger));


app.use(security);
app.use("", routes);

app.use((err, req, res, next) => {
  return response(
    res,
    { status: false, message: "Internal server error" },
    500
  );
});

if (!module.parent) {
  server.listen(port, () => {
    console.log(
      `SUREMOVE service is running on http://localhost:${port}/suremove-app-api`
    );
  });
}
module.exports = app;
