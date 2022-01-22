const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

//routes
const authRouter = require("./routes/auth");
const userRouter = require("./routes/users");
const movieRouter = require("./routes/movies");
const listRouter = require("./routes/lists");
const seriesRouter = require("./routes/series");

const app = express();
app.use(express.json());
app.use(
  cors({
    "Access-Control-Allow-Origin": "*",
  })
);
const PORT = process.env.PORT || 5200;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful."))
  .catch((err) => console.log(err));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/lists", listRouter);
app.use("/api/series", seriesRouter);

app.listen(PORT, () =>
  console.log(`Server started in port: ${process.env.PORT}`)
);
