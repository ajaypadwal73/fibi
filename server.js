const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport")

const bodyParser = require("body-parser");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

//BodyParser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//DB config
const db = require("./config/keys").mongoURI;

//Connection
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
        .then(() => console.log("MongoDB connected"))
        .catch((err) => console.log(err))

//Passport middleware
app.use(passport.initialize());

//Passport config
//Dint understanf this
require("./config/passport")(passport);


app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})