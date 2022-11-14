const express = require("express");
const mysql = require("mysql");
// 경로
const path = require("path");
const static = require("serve-static");

const dbconfig = require("./config/dbconfig.json");
const routes = require('./routes/main.route.js')

const pool = mysql.createPool({
    connectionLimit: 10,
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
    debug: false
});

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/B", static(path.join(__dirname, "B")));




// create review and rating


app.get("/", (req, res) => {
    res.send("<script>location.href='/B/login.html';</script>");
});

app.use("/", routes);


app.listen(3000, () => {
    console.log("Listening on port 3000");
});
