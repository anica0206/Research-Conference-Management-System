const dbconfig = require("../config/dbconfig.json");
const mysql = require("mysql");
const path = require("path");
const b = path.join(__dirname, "../B");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: dbconfig.host,
  user: dbconfig.user,
  password: dbconfig.password,
  database: dbconfig.database,
  debug: false,
});

const login = (req, res, next) => {
  console.log("/B/login called" + req);

  const paramUid = req.body.userid;
  const paramPassword = req.body.password;

  console.log("login request" + paramUid + "   " + paramPassword);

  pool.getConnection((err, conn) => {
    if (err) {
      conn.release();
      res.send(
        "<script>alert('login failed');location.href='/B/login.html';</script>"
      );
    }

    console.log("Database connection success");

    const exec = conn.query(
      "select `userId`, `password` , `role` from `users` where `userId`=? and `password`=md5(?)",
      [paramUid, paramPassword],
      (err, rows, fields) => {
        conn.release();
        console.log("query runed" + exec.sql);

        if (err) {
          console.dir(err);
          res.send(
            "<script>alert('login failed');location.href='/B/login.html';</script>"
          );
        }

        if (rows.length > 0) {
          console.log("ID [%s], password matched found", paramUid);
          console.log(b);
          res.sendFile(b + `/${rows[0].role}.html`);

          // set session
          pool.getConnection((err, conn) => {
            if (err) {
              conn.release();
              console.log("Mysql getConnetion error.");
              return;
            } else {
              const exec = conn.query(
                "insert into session (loginId) values(?)",
                [paramUid],
                (err, result) => {
                  conn.release();
                  console.log("sql worked" + exec.sql);

                  if (err) {
                    console.log("sql error happen");
                  }

                  if (result) {
                    console.log("login id inserted success");
                  }
                }
              );
            }

            console.log("Database connection success");
          });
        } else {
          console.log("ID [%s], password matched not found", paramUid);
          res.send(
            "<script>alert('login failed');location.href='/B/login.html';</script>"
          );
        }
      }
    );
  });
};

const logout = (req, res, next) => {
  console.log("/B/logout called");

  //delete session
  pool.getConnection((err, conn) => {
    if (err) {
      conn.release();
      console.log("Mysql getConnetion error.");
      return;
    } else {
      const exec = conn.query(
        "delete from session where not loginId = ?",
        ["null"],
        (err, result) => {
          conn.release();
          console.log("sql worked" + exec.sql);

          if (err) {
            console.log("sql error happen");
          }

          if (result) {
            console.log("delete session success");
          }
        }
      );
    }

    console.log("Database connection success");
  });
};

module.exports = { login, logout };
