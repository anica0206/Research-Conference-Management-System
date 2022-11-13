const dbconfig = require("../config/dbconfig.json");
const mysql = require("mysql");
const path = require("path");
const b = path.join(__dirname, '../B');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
    debug: false
});

// create paper
const createPaper = (req, res) => {
    console.log("/B/authorCreatePaper" + req);

    const paramTopic = req.body.topic;
    const paramUid = req.body.userid;
    const paramPaper = req.body.paper;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "insert into paper (topic,aId,paper) values(?,?,?)",
            [paramTopic, paramUid, paramPaper],
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
                    console.log("paper add success");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h2>Paper add successfully</h2>");
                    res.end();
                } else {
                    console.log("create failed");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>Paper create failed</h1>");
                    res.end();
                }
            }
        );
    });
};


// read(view) my paper
const authorViewPaper = (req, res) => {
    console.log("/B/authorViewPaper called" + req);

    const paramUid = req.body.userid;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select * from paper where aId = ?",
            [paramUid],
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
                    console.log("paper found success");


                    //view review
                    for (var i = 0; i < result.length; i++) {
                        res.write("<h1>" + "ID : " + result[i].ID + " | Topic : " + result[i].topic + " | Author : "
                            + result[i].aId + " | Paper : " + result[i].paper + "</h1><br>");
                    }

                } else {
                    console.log("paper not found");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>no paper exist</h1>");
                    res.end();
                }
            }
        );
    });
};

// update My paper
authorUpdatePaper = (req, res) => {
    console.log("/B/updateMyPaper called" + req);

    const paramPid = req.body.paperid;
    const paramPaper = req.body.paper;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select * from paper where ID = ?",
            [paramPid],
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
                    console.log("Paper found");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>Paper found success</h1>");

                    // update comment start
                    pool.getConnection((err, conn) => {
                        if (err) {
                            conn.release();
                            console.log("Mysql getConnetion error.");
                            return;
                        }
                        const exec = conn.query(
                            "update paper set paper = ? where ID =?",
                            [paramPaper, paramPid],
                            (err, result) => {
                                conn.release();
                                console.log("sql worked" + exec.sql);

                                if (err) {
                                    console.log("sql error happen");
                                    console.dir(err);
                                } else {
                                    console.dir(result);
                                    console.log("update success");

                                    res.write("<h2>Paper update success</h2>");
                                    res.end();
                                }

                            }
                        );
                    })



                    res.end();
                } else {
                    console.log("comment not found");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>Paper found failed</h1>");
                    res.end();
                }
            }
        );
    });
};

// delete my paper
const deleteMyPaper = (req, res) => {
    console.log("/B/deleteMyPaper called" + req);

    const paramPid = req.body.paperid;
    const paramUid = req.body.userid;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select * from paper where ID = ? and aId = ?",
            [paramPid, paramUid],
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
                    console.log("paper found success");


                    // bid delete start
                    pool.getConnection((err, conn) => {
                        if (err) {
                            conn.release();
                            console.log("Mysql getConnetion error.");
                            return;
                        }
                        const exec = conn.query(
                            "delete from paper where ID = ? and aId = ?",
                            [paramPid, paramUid],
                            (err, result) => {
                                conn.release();
                                console.log("sql worked" + exec.sql);

                                if (err) {
                                    console.log("sql error happen");
                                    console.dir(err);
                                } else {
                                    console.dir(result);
                                    console.log("Paper delete success");

                                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                                    res.write("<h2>Paper delete success</h2>");
                                    res.end();
                                }

                            }
                        );
                    })


                } else {
                    console.log("paper delete failed");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>delete paper failed</h1>");
                    res.end();
                }
            }
        );
    });
};

// search my paper
const searchMyPaper = (req, res) => {
    console.log("/B/searchMyPaper called" + req);

    const paramUid = req.body.userid;
    const paramPid = req.body.paperid;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select * from paper where ID = ? and aId = ?",
            [paramPid, paramUid],
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
                    console.log("paper search successed");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h2>Paper search success</h2>");

                    for (var i = 0; i < rows.length; i++) {
                        res.write("<h1>" + "ID : " + rows[i].ID + " | Topic : " + rows[i].topic + " | AuthorID : "
                            + rows[i].aId + " | Paper : " + rows[i].paper + "</h1><br>");
                    }

                    res.end();
                    return;
                }
                else {
                    console.log("paper search failed");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>paper search faile no paper match</h1>");
                    res.end();
                }

            }


        );
    });
};


// view review on paper (author)
const viewReviewOnPaper = (req, res) => {
    console.log("/B/viewReviewOnPaper" + req);

    const paramUid = req.body.userid;
    const paramPid = req.body.paperid;


    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select * from paper where ID = ? and aId = ? and status = ?",
            [paramPid, paramUid, "accepted"],
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
                    console.log("paper found success");


                    //view review on paper

                    pool.getConnection((err, conn) => {
                        if (err) {
                            conn.release();
                            console.log("Mysql getConnetion error.");
                            return;
                        }

                        console.log("Database connection success");

                        const exec = conn.query(
                            "select * from review where pId = ?",
                            [paramPid],
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
                                    console.log("review on paper search success");

                                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                                    res.write("<h2>Review on paper search success</h2>");

                                    for (var i = 0; i < rows.length; i++) {
                                        res.write("<h1>" + "ID : " + rows[i].ID + " | UserId : " + rows[i].uId + " | PaperId : "
                                            + rows[i].pId + " | Rating : " + rows[i].rating + " | Content : " + rows[i].content +
                                            " | Author Rating" + rows[i].aRating + "</h1><br>");
                                    }


                                    res.end();
                                    return;
                                }
                                else {
                                    console.log("review search faile");

                                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                                    res.write("<h1>Review search faile</h1>");
                                    res.end();
                                }

                            }


                        );
                    });




                } else {
                    console.log("paper not found");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>no paper exist</h1>");
                    res.end();
                }
            }
        );
    });
};

// creat rating on review on my 
const rateOnReview = (req, res) => {
    console.log("/B/rateOnReview called" + req);

    const paramRid = req.body.reviewid;
    const paramRerid = req.body.reviewerid;
    const paramRating = req.body.rating;


    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select * from review where ID = ? and uId = ?",
            [paramRid, paramRerid],
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
                    console.log("Review found");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>Review found success</h1>");

                    // update comment start
                    pool.getConnection((err, conn) => {
                        if (err) {
                            conn.release();
                            console.log("Mysql getConnetion error.");
                            return;
                        }
                        const exec = conn.query(
                            "update review set aRating = ? where ID = ? and uId = ?",
                            [paramRating, paramRid, paramRerid],
                            (err, result) => {
                                conn.release();
                                console.log("sql worked" + exec.sql);

                                if (err) {
                                    console.log("sql error happen");
                                    console.dir(err);
                                } else {
                                    console.dir(result);
                                    console.log("update success");

                                    res.write("<h2>Review rating update success</h2>");
                                    res.end();
                                }

                            }
                        );
                    })



                    res.end();
                } else {
                    console.log("Review not found");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>Review found failed</h1>");
                    res.end();
                }
            }
        );
    });
};



module.exports = {
    createPaper, authorViewPaper, authorUpdatePaper, deleteMyPaper, searchMyPaper,
    viewReviewOnPaper, rateOnReview
};
