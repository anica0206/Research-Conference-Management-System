const dbconfig = require("../config/dbconfig.json");
const mysql = require("mysql");
const path = require("path");
const b = path.join (__dirname, '../B');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
    debug: false
});


const login = (req, res, next) => {

    console.log("/B/login called" + req)

        const paramUid = req.body.userid;
        const paramPassword = req.body.password;

        console.log('login request' + paramUid + '   ' + paramPassword);

        pool.getConnection((err, conn) => {
            if (err) {
                conn.release();
                console.log("Mysql getConnetion error.");
                return;
            }

            console.log("Database connection success");

            const exec = conn.query("select `userId`, `password` , `role` from `users` where `userId`=? and `password`=md5(?)",
                [paramUid, paramPassword],
                (err, rows, fields) => {
                    conn.release();
                    console.log('query runed' + exec.sql);

                    if (err) {
                        console.dir(err);
                        res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                        res.write("<h1>login fail</h1>");
                        return;
                    }

                    if (rows.length > 0) {
                        console.log("ID [%s], password matched found", paramUid);
                        console.log(b);
                        res.sendFile(b + `/${rows[0].role}.html`);
                        // res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                        // res.write("<h1>" + rows[0].role + "</h1>");
                        // res.end()
                        return;
                    }
                    else {
                        console.log("ID [%s], password matched not found", paramUid);
                        res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                        res.write("<h2>login failed, check it again</h2>");
                        res.end();
                        return;
                    }


                }
            )
        })
    };

const logout = (req, res, next) => {
    console.log("/B/logout called")
    res.redirect("/B/login_page.html");
}
module.exports = {login, logout};
