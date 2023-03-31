const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
const chalk = require("chalk");

const port = process.env.PORT || 4000;

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
dotenv.config();
// dotenv.config({ path: "config/config.env" });

// ----------- database connect -------
connectDatabase();

app.get("/", (req, res) => {
  res.send("server is running smoothly");
});

const server = app.listen(port, () => {
  console.log(`server is running on prot ${port}`);
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
