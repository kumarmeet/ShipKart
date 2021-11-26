const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let database = null;

const mongoDBDefaultUrl = "mongodb://localhost:27017";

const connectToDatabase = async () => {
  const client = await MongoClient.connect(mongoDBDefaultUrl);
  database = client.db("shipkart");
};

const getDB = () => {
  if (!database) {
    throw new Error("Database may not connected!");
  }

  return database;
};

module.exports = {
  connectToDatabase: connectToDatabase,
  getDB: getDB,
};
