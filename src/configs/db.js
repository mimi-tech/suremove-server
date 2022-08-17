const mongoose = require("mongoose");

(async () => {
  mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Local DB Connection Successful!")).catch((error) => console.log(error));
})();

module.exports = { mongoose };
