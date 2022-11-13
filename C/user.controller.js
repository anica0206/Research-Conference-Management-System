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

//admin - user's account

const createUser = (req, res, next) => {

    console.log("/B/adduser called" + req);

    const paramName = req.body.name;
    const paramUid = req.body.userid;
    const paramPassword = req.body.password;
    const paramRole = req.body.role;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "insert into users (name,userId,password,role) values(?,?,md5(?),?)",
            [paramName, paramUid, paramPassword, paramRole],
            (err, result) => {
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
                    res.redirect("/B/admin.html");
                    //res.send("alert("user created"); window.location.href = "./page_location"; ");
                    //res.sendFile(b + "/login_page.html");
                    //res.send("<script>alert(" + "User created" + "); window.location.href =" + "../B/admin.html" + "; </script>");
                    //res.json({success: true});
                } else {
                    console.log("inserted faile");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>사용자 추가 실패</h1>");
                    res.end();
                }
            }
        )
    })
};

const viewUser = (req, res, next) => {

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select * from users",

            (err, rows) => {

                if (!err) {
                    for (var i = 0; i < rows.length; i++) {
                        res.write("<h1>" + "ID : " + rows[i].ID + " | Name : " + rows[i].name + " | UserId : "
                            + rows[i].userId + " | Password : " + rows[i].password + " | Role : " + rows[i].role + "</h1><br>");

                    }
                    res.end();
                } else {
                    console.log(err);
                }

                console.log('The data from user table : \n', rows);

            }
        );
    });
};

const updateUser = (req, res, next) => {

     // 유저가 있는지 확인
     const paramUid = req.body.userid;
     const paramPassword = req.body.password;
 
     pool.getConnection((err, conn) => {
         if (err) {
             conn.release();
             console.log("Mysql getConnetion error.");
             return;
         }
 
         console.log("Database connection success");
 
         const exec = conn.query(
             "select * from users where userId = ?",
             [paramUid],
             (err, rows) => {
                 conn.release();
                 console.log("sql worked" + exec.sql);
 
                 if (err) {
                     console.log("sql error happen");
                     console.dir(err);
                     return;
                 }
 
                 if (rows.length > 0) {
 
                     console.dir(rows);
                     console.log("user found success");
 
                     //유저 업데이트 시작
                     pool.getConnection((err, conn) => {
                         if (err) {
                             conn.release();
                             console.log("Mysql getConnetion error.");
                             return;
                         }
                         const exec = conn.query(
                             "update users set password = md5(?) where userId = ?",
                             [paramPassword, paramUid],
                             (err, result) => {
                                 conn.release();
                                 console.log("sql worked" + exec.sql);
 
                                 if (err) {
                                     console.log("sql error happen");
                                     console.dir(err);
                                 } else {
                                     console.dir(result);
                                     console.log("update success");
 
                                     res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                                     res.write("<h2>User update success</h2>");
                                     res.end();
                                 }
 
                             }
                         );
                     })
 
                 }
                 else {
                     console.log("no user found");
 
                     res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                     res.write("<h1>User search faile no user match</h1>");
                     res.end();
                 }
 
             }
 
 
         );
     });
    };

const searchUser = (req, res, next) => {
    console.log("/B/searchUser called" + req);

    const paramName = req.body.name;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select * from users where name = ?",
            [paramName],
            (err, rows) => {
                conn.release();
                console.log("sql worked" + exec.sql);

                if (err) {
                    console.log("sql error happen");
                    console.dir(err);
                    return;
                }

                if (rows.length > 0) {
                    
                    console.dir(rows);
                    console.log("search success");
                    

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h2>User search success</h2>");

                    for (var i = 0; i < rows.length; i++) {
                        res.write("<h1>" + "ID : " + rows[i].ID + " | Name : " + rows[i].name + " | UserId : "
                            + rows[i].userId + " | Password : " + rows[i].password + " | Role : " + rows[i].role + "</h1><br>");
                    }

                    res.end();
                    return;
                }
                else {
                    console.log("search faile");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>User search faile no user match</h1>");
                    res.end();
                }

            }


        );
    });
}

//admin - user's profile

const createUserProfile = (req, res, next) => {
    console.log("/B/createUserProfile called" + req);

    const paramUserId = req.body.userId;
    const paramDate = req.body.birthday;
    const paramGender = req.body.gender;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "update users set dob = ?, gender = ? where userId = ?",
            [paramDate, paramGender, paramUserId],
            (err, result) => {
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
                    res.write("<h1>user profile created</h1>");
                    res.end();
                } else {
                    console.log("inserted failed");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>사용자 추가 실패</h1>");
                    res.end();
                }
            }
        )
    })
}

const viewUserProfile = (req, res, next) => {
    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });

        const exec = conn.query(
            "select * from users where dob IS NOT NULL and gender IS NOT NULL",

            (err, rows) => {

                if (!err) {
                    for (var i = 0; i < rows.length; i++) {
                        res.write("<h1>" + "ID : " + rows[i].ID + " | Name : " + rows[i].name + " | UserId : "
                            + rows[i].userId + " | Password : " + rows[i].password + " | Role : " + rows[i].role + 
                            " | Date Of Birth : " + rows[i].dob + " | Gender : " + rows[i].gender + "</h1><br>");

                    }
                    res.end();
                } else {
                    console.log(err);
                }

                console.log('The data from user table : \n', rows);

            }
        );
    });
}

const updateUserProfile = (req, res, next) => {
    console.log("/B/updateUserProfile called" + req);

    const paramUserId = req.body.userId;
    const paramDate = req.body.birthday;
    const paramGender = req.body.gender;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "update users set dob = ?, gender = ? where userId = ?",
            [paramDate, paramGender, paramUserId],
            (err, result) => {
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
                    res.write("<h1>user profile created</h1>");
                    res.end();
                } else {
                    console.log("inserted failed");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>사용자 추가 실패</h1>");
                    res.end();
                }
            }
        )
    })
}

const deleteUserProfile = (req, res, next) => {
    console.log("/B/deleteUserProfile called" + req);

    const paramUid = req.body.userid;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select  from review where ID = ? and uId = ?",
            [paramRid, paramUid],
            (err, result) => {
                conn.release();
                console.log("sql worked" + exec.sql);

                if (err) {
                    console.log("sql error happen");
                    console.dir(err);
                    return;
                }

                if (result.length > 0) {
                    console.dir(result);
                    console.log("review found success");


                    // bid add start
                    pool.getConnection((err, conn) => {
                        if (err) {
                            conn.release();
                            console.log("Mysql getConnetion error.");
                            return;
                        }
                        const exec = conn.query(
                            "delete from review where ID = ? and uId = ?",
                            [paramRid, paramUid],
                            (err, result) => {
                                conn.release();
                                console.log("sql worked" + exec.sql);

                                if (err) {
                                    console.log("sql error happen");
                                    console.dir(err);
                                } else {
                                    console.dir(result);
                                    console.log("review delete success");

                                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                                    res.write("<h2>review delete success</h2>");
                                    res.end();
                                }

                            }
                        );
                    })


                } else {
                    console.log("review delete faile");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>delete review faile</h1>");
                    res.end();
                }
            }
        );
    });
}

module.exports = {
                    createUser, viewUser, updateUser, searchUser,
                    createUserProfile, viewUserProfile, updateUserProfile
                };
