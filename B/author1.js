const express = require("express");
const mysql = require("mysql2");

const path = require("path");
const static = require("serve-static");

const dbconfig = require("./config/dbconfig.json");

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "C@r3b34r56",
    database: "create_paper",
    port: 3306
});

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// author create
app.post("/author_create", (req, res) => {
    console.log("/author_create" + req);

    const paramtopic = req.body.topic;
    const paramMessage = req.body.message;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query("select `topic`, `message` from `create_paper` where `topic`=? and `message`=?",
            [paramtopic, paramMessage],
            (err, rows) => {
                conn.release();
                console.log("sql worked" + exec.sql);

                if (err) {
                    console.log("sql error happen");
                    console.dir(err);
                    return;
                }

                if (result) {
                    console.dir(result);
                    console.log("inserted success");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h2>Data saving successful</h2>");
                    res.end();
                } else {
                    console.log("inserted failed");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>Data saving failed</h1>");
                    res.end();
                }
            }
        );
    });
});

app.listen(5500, () => {
    console.log("Listening on port 5500");
});