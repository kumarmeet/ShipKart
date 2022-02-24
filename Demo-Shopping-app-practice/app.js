const path = require("path");
const express = require("express");
const csrf = require("csurf");
const expressSession = require("express-session");

const db = require("./data/database");

const createSessionConfig = require("./config/session");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/products.routes");
const baseRoutes = require("./routes/base.routes");
const adminRoutes = require("./routes/admin.routes");

const csrfTokenMiddleware = require("./middlewares/csrf-token");
const handleServerSideErrorMiddleware = require("./middlewares/error-handler");
const checkAuthStatusMiddleware = require("./middlewares/check-auth");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
//hiding the folder structure for the users
app.use("/products/assets", express.static("products-data"));
app.use(express.json());

const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

app.use(csrf());
app.use(csrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productRoutes);

app.use("/admin", adminRoutes);

app.use(handleServerSideErrorMiddleware);

db.connectToDatabase()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log("Failed to connect to the database");
    console.log(err);
  });
