const expressSession = require("express-session");
const mongoDbStore = require("connect-mongodb-session");

const createSessionStore = () => {
  const MongoDbStore = mongoDbStore(expressSession);

  const store = new MongoDbStore({
    uri: "mongodb://localhost:27017",
    databaseName: "shipkart",
    collection: "sessions",
  });

  return store;
};

const createSessionConfig = () => {
  return {
    secret: "super-secret",
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000,
    },
  };
};

module.exports = createSessionConfig;
