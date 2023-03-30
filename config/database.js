const mongoose = require("mongoose");

const conntectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
    })
    .then((data) => {
      console.log(`Mongodb is connected on: ${data.connection.host}`);
    });
  // .catch((err) => {
  //   console.log(err);
  // });
};

module.exports = conntectDatabase;