const mongoose = require("mongoose");
// const fs = require("fs"); // Require the fs module for reading certificate files

const dbConnect = async () => {
  try {
    // const options = {
      // ssl: true, 
    //   // sslValidate: true,
    //   // sslCA: fs.readFileSync("/path/to/ca.pem"), // Specify CA file
    //   // sslKey: fs.readFileSync("/path/to/key.pem"), // Specify private key file
    //   // sslCert: fs.readFileSync("/path/to/cert.pem"), // Specify certificate file
    //   // useNewUrlParser: true,
    //   // useUnifiedTopology: true,
    // };

    const conn = await mongoose.connect(process.env.MONGO_URL);

    if (conn) {
      console.log("Connected to the Database");
    }
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    throw error;
  }
};

module.exports = dbConnect;
