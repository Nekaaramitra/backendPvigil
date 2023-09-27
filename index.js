const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const userRoute = require("./routes/userRoute");
const officialUserRoute = require("./routes/officialUserRoute");
const locationRoute = require("./routes/locationRoute");
const raidRoute = require("./routes/raidRoute");
const complaintRoute = require("./routes/complaintRoute");
const mediaRoute = require("./routes/mediaRoute");
const helmet = require("helmet");

const compression = require("compression");
const errorHandler = require("./middlewares/errorMiddleware");

const ConnectDB = require("./db");

dotenv.config();

ConnectDB();

const app = express();
const PORT = process.env.MY_PORT || 8000;

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:19006",
      "https://admin.shwaas.org",
    ],
    credentials: true,
  })
);

// ================= routers ============
app.get("/", (req, res) => {
  res.send("<h1>This is the Backend Server</h1>");
});

app.use("/api/users", userRoute);
app.use("/api/officialUsers", officialUserRoute);
app.use("/api/complaints", complaintRoute);
app.use("/api/raids", raidRoute);
app.use("/api/location", locationRoute);
app.use("/api/media", mediaRoute);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is started at PORT ${PORT}`);
});
