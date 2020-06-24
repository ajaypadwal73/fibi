const express = require("express");
const mongoose = require("mongoose");


const bodyParser = require("body-parser");

const users = require("./routes/api/users");


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



app.use("/api/users", users);



const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})