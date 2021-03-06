const cors = require("cors");
const AccessToken = require("twilio").jwt.AccessToken;
const express = require("express");
const env = require("dotenv");
const { json, urlencoded } = require("body-parser");
const { auth } = require("./utils/authUtils");
const mongoose = require("mongoose");

const roomsRouter = require("./Rooms/rooms.router");
const usersRouter = require("./Users/users.router");
const authRouter = require("./Auth/auth.router");

require("./Users/users.model");
require("./Rooms/rooms.model");

env.config();
const app = express();
require("./utils/passport");

app.use(cors());
app.use(json());
app.use(
  urlencoded({
    extended: true,
  })
);

app.use("/auth", authRouter);

app.use("/api", auth.required);
app.use("/api/room", roomsRouter);
app.use("/api/user", usersRouter);

async function init() {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.set("debug", true);
    app.listen(3000, () => {
      console.log('ready')
    })
  } catch (e) {
    console.log(e);
    init();
  }

  // appRouter.get('/user', auth.required, async (req, res, next) => {
  //   return res.json(await Users.find({}));
  // })
}

init();

// Step 1: generate access token from the user name, and validate
// against twilio servers. Return to the user
// app.post("/login",auth.optional, );
