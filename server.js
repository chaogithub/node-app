const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const app = express();

// 引入users
const users = require("./routes/api/users");
const profiles = require("./routes/api/profiles");

// DB config
const keys = require('./config/keys');

// 使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// Connect to mongodb  //test test123456
mongoose.connect(keys.mongoURI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        user: keys.MONGO_USER,
        pass: keys.MONGO_PASSWORD
            // user: process.env.MONGO_USER,
            // pass: process.env.MONGO_PASSWORD
    })
    .then(() => {
        console.log("Mongodb Connected");
    })
    .catch(err => {
        console.log(err);
    })

// 初始化passport
app.use(passport.initialize());
// 把passport传递过去
require("./config/passport")(passport);

app.get("/", (req, res) => {
    res.send("Hello World");
})

// 使用routes
app.use("/api/users", users);
app.use("/api/profiles", profiles);

const port = process.envPORT || 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})