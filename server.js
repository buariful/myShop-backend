const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
const chalk = require("chalk");

// uncaught error
process.on("uncaughtException", (err) => {
  console.log(chalk.hex("#ff29d1")(err.message));
  console.log(
    chalk.hex("#ff29d1")(
      "Server is shutting down due to uncaughtException error"
    )
  );

  process.exit(1);
});

// ------- config -----------
dotenv.config({ path: "config/config.env" });

// ----------- database connect -------
connectDatabase();

app.get("/", (req, res) => {
  res.send("server is running smoothly");
});

const server = app.listen(process.env.PORT, () => {
  console.log(`server is running on prot ${process.env.PORT}`);
});

// unhandled errors
process.on("unhandledRejection", (err) => {
  console.log(err.message);
  console.log(
    chalk.hex("#ff29d1")("Server is shutting down due to unhandled error")
  );

  server.close(() => {
    process.exit(1);
  });
});
