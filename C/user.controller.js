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
                    res.send("<script>alert('Create user account failed');location.href='/B/admin.html';</script>");
                }

                if (result) {
                    console.log("inserted success");
                    // res.redirect("/B/admin.html");
                    res.send("<script>alert('User account created!');location.href='/B/admin.html';</script>");
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
            "select id, name, userId, password, role  from users",

            (err, rows) => {

                if (!err) {
                    res.json(rows);
                } else {
                    res.json();
                }
            }
        );
    });
};

const updateUser = (req, res, next) => {

     // 유저가 있는지 확인
     const paramUid = req.body.userId;
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
                     res.send("<script>alert('Update user account failed');location.href='/B/admin.html';</script>");
                 }
 
                 if (rows.length > 0) {
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
                                     res.send("<script>alert('Update user account failed');location.href='/B/admin.html';</script>");

                                 } else {
                                     console.dir(result);
                                     console.log("update success");
 
                                     res.send("<script>alert('Password Updated!');location.href='/B/admin.html';</script>");

                                 }
 
                             }
                         );
                     })
 
                 }
                 else {
                     console.log("no user found");
                     res.send("<script>alert('Account not found, Update failed');location.href='/B/admin.html';</script>");

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
                    res.send("<script>alert('Search user account failed');location.href='/B/admin.html';</script>");
                }

                if (rows.length > 0) {
                    
                    console.dir(rows);
                    console.log("search success");

                    res.json(rows);
                                
                }
                else {
                    console.log("search failed");
                    res.json("");
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
                    res.send("<script>alert('Create user profile failed');location.href='/B/admin.html';</script>");
                }

                if (result) {
                    console.dir(result);
                    console.log("inserted success");
                    res.send("<script>alert('User profile created!');location.href='/B/admin.html';</script>");
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

        console.log("Database connection success 11");

        const exec = conn.query(
            "select name, userId, role, DATE_FORMAT(dob, '%d/%m/%Y'), gender from users where dob IS NOT NULL and gender IS NOT NULL",

            (err, rows) => {

                if (!err) {
                    console.log(rows);
                    res.json(rows);
                } else {
                    res.json();
                }
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
            res.send("<script>alert('update user profile failed');location.href='/B/admin.html';</script>");
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
                    res.send("<script>alert('update user profile failed');location.href='/B/admin.html';</script>");
                }

                if (result) {
                    console.dir(result);
                    console.log("inserted success");
                    res.send("<script>alert('update user profile successed');location.href='/B/admin.html';</script>");
                } else {
                    console.log("inserted failed");
                    res.send("<script>alert('update user profile failed');location.href='/B/admin.html';</script>");
                }
            }
        )
    })
}

const searchUserProfile = (req, res, next) => {
    console.log("/B/searchUserProfile called" + req);

    const paramName = req.body.name;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select name, userId, role, DATE_FORMAT(dob, '%d/%m/%Y'), gender from users where name = ? and dob is not null and gender is not null",
            [paramName],
            (err, rows) => {
                conn.release();
                console.log("sql worked" + exec.sql);

                if (err) {
                    console.log("sql error happen");
                    res.send("<script>alert('search user profile failed');location.href='/B/admin.html';</script>");
                }

                if (rows.length > 0) {
                    
                    console.dir(rows);
                    console.log("search success");

                    res.json(rows);
                                
                }
                else {
                    console.log("search failed");
                    res.json("");
                }

            }


        );
    });
}

module.exports = {
                    createUser, viewUser, updateUser, searchUser,
                    createUserProfile, viewUserProfile, updateUserProfile, searchUserProfile
                };
