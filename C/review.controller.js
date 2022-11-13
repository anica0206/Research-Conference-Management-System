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


const createBid = (req, res, next) => {
    console.log("/B/bidPaper called" + req);

    const paramPnum = req.body.paperid;
    const paramUid = req.body.userid;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select * from paper where ID = ?",
            [paramPnum],
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


                    // bid add start
                    pool.getConnection((err, conn) => {
                        if (err) {
                            conn.release();
                            console.log("Mysql getConnetion error.");
                            return;
                        }
                        const exec = conn.query(
                            "insert into bid (pId,uId) values(?,?)",
                            [paramPnum, paramUid],
                            (err, result) => {
                                conn.release();
                                console.log("sql worked" + exec.sql);

                                if (err) {
                                    console.log("sql error happen");
                                    console.dir(err);
                                } else {
                                    console.dir(result);
                                    console.log("bid add success");

                                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                                    res.write("<h2>Bid add success</h2>");
                                    res.end();
                                }

                            }
                        );
                    })


                } else {
                    console.log("inserted faile");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>bid add faile no such paper num</h1>");
                    res.end();
                }
            }
        );
    });
}

const viewBid = (req, res, next) => {
    console.log("/B/viewBid called" + req);

    const paramUid = req.body.userid;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select * from bid where uId = ?",
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
                    console.log("user found success");


                    // view bid
                    pool.getConnection((err, conn) => {
                        if (err) {
                            conn.release();
                            console.log("Mysql getConnetion error.");
                            return;
                        }
                        const exec = conn.query(
                            "select * from bid where uId = ?",
                            [paramUid],
                            (err, result) => {
                                conn.release();
                                console.log("sql worked" + exec.sql);

                                if (err) {
                                    console.log("sql error happen");
                                    console.dir(err);
                                } else {
                                    console.dir(result);
                                    console.log("view bid success");

                                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                                    res.write("<h2>Bid view success</h2>");

                                    for (var i = 0; i < result.length; i++) {
                                        res.write("<h1>" + "ID : " + result[i].ID + " | PaperId : " + result[i].pId + " | UserId : "
                                            + result[i].uId + " | Status : " + result[i].status + "</h1><br>");
                                    }

                                    res.end();
                                }

                            }
                        );
                    })


                } else {
                    console.log("bid not found");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>no bid exist</h1>");
                    res.end();
                }
            }
        );
    });
}

const updateBid = (req, res, next) => {

    // 유저가 있는지 확인
    const paramUid = req.body.userid;
    const paramBid = req.body.bidid;
    const paramPid = req.body.paperid

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select * from bid where ID = ? and uId = ?",
            [paramBid, paramUid],
            (err, rows) => {
                conn.release();
                console.log("sql worked" + exec.sql);

                if (err) {
                    console.log("sql error happen");
                    console.dir(err);
                    return;
                }

                //bid exist
                if (rows.length > 0) {

                    console.dir(rows);
                    console.log("bid found success");

                    // check paper exist
                    pool.getConnection((err, conn) => {
                        if (err) {
                            conn.release();
                            console.log("Mysql getConnetion error.");
                            return;
                        }

                        const exec = conn.query(
                            "select * from paper where ID = ?",
                            [paramPid],
                            (err, result) => {
                                conn.release();
                                console.log("sql worked" + exec.sql);

                                if (err) {
                                    console.log("sql error happen");
                                    console.dir(err);
                                }

                                if (result.length > 0) {
                                    console.dir(result);
                                    console.log("Paper found success");


                                    // change pid
                                    pool.getConnection((err, conn) => {
                                        if (err) {
                                            conn.release();
                                            console.log("Mysql getConnetion error.");
                                            return;
                                        }
                                        const exec = conn.query(
                                            "update bid set pId = ? where ID = ? and uId = ?",
                                            [paramPid, paramBid, paramUid],
                                            (err, result) => {
                                                conn.release();
                                                console.log("sql worked" + exec.sql);

                                                if (err) {
                                                    console.log("sql error happen");
                                                    console.dir(err);
                                                } else {
                                                    console.dir(result);
                                                    console.log("bid update success");

                                                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                                                    res.write("<h2>Bid update success</h2>");

                                                    res.end();
                                                }

                                            }
                                        );
                                    })


                                } else {
                                    console.dir(result);
                                    console.log("paper not exist");

                                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                                    res.write("<h2>paper not exist</h2>");

                                    res.end();
                                }




                            }
                        );
                    })

                }
                else {
                    console.log("no bid found");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>Bid search faile no bid match</h1>");
                    res.end();
                }

            }


        );
    });
}

const deleteBid = (req, res, next) => {
    console.log("/B/delete bid called" + req);

    const paramUid = req.body.userid;
    const paramBid = req.body.bidid;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select * from bid where ID = ? and uId = ?",
            [paramBid, paramUid],
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
                    console.log("bid found success");


                    // bid add start
                    pool.getConnection((err, conn) => {
                        if (err) {
                            conn.release();
                            console.log("Mysql getConnetion error.");
                            return;
                        }
                        const exec = conn.query(
                            "delete from bid where ID = ? and uId = ?",
                            [paramBid, paramUid],
                            (err, result) => {
                                conn.release();
                                console.log("sql worked" + exec.sql);

                                if (err) {
                                    console.log("sql error happen");
                                    console.dir(err);
                                } else {
                                    console.dir(result);
                                    console.log("bid delete success");

                                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                                    res.write("<h2>Bid delete success</h2>");
                                    res.end();
                                }

                            }
                        );
                    })


                } else {
                    console.log("inserted faile");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>bid delte faile</h1>");
                    res.end();
                }
            }
        );
    });
}

const searchBid = (req, res, next) => {
    console.log("/B/searchBid called" + req);

    const paramUid = req.body.userid;
    const paramBid = req.body.bidid;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select * from bid where ID = ? and uId = ?",
            [paramBid, paramUid],
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
                    console.log("bid search success");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h2>User search success</h2>");

                    for (var i = 0; i < rows.length; i++) {
                        res.write("<h1>" + "BidID : " + rows[i].ID + " | UserID : " + rows[i].uId + " | Status : "
                            + rows[i].status + "</h1><br>");
                    }

                    res.end();
                    return;
                }
                else {
                    console.log("bid search faile");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>bid search faile no bid match</h1>");
                    res.end();
                }

            }


        );
    });
}

const createReviewRate = (req, res, next) => {
    console.log("/B/createReview called" + req);

    const paramUid = req.body.userid;
    const paramPid = req.body.paperid;
    const paramRating = req.body.rating;
    const paramContent = req.body.content;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select * from bid where pId = ? and uId = ? and status = ?",
            [paramPid, paramUid, "accept"],
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
                    console.log("bid found success");

                    // add review and rating
                    pool.getConnection((err, conn) => {
                        if (err) {
                            conn.release();
                            console.log("Mysql getConnetion error.");
                            return;
                        }
                        const exec = conn.query(
                            "insert into review (uId,pId,rating,content) values(?,?,?,?)",
                            [paramUid, paramPid, paramRating, paramContent],
                            (err, result) => {
                                conn.release();
                                console.log("sql worked" + exec.sql);

                                if (err) {
                                    console.log("sql error happen");
                                    console.dir(err);
                                } else {
                                    console.dir(result);
                                    console.log("Review and rating add success");

                                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                                    res.write("<h2>Review and rating add success</h2>");

                                    res.end();
                                }

                            }
                        );
                    })

                } else {
                    console.log("inserted faile");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>Review and rating add faile</h1>");
                    res.end();
                }
            }
        );
    });
}

const viewMyReview = (req, res, next) => {
    console.log("/B/viewMyReview called" + req);

    const paramUid = req.body.userid;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select * from review where uId = ?",
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
                    console.log("review found success");


                    //view review
                    for (var i = 0; i < result.length; i++) {
                        res.write("<h1>" + "ID : " + result[i].ID + " | UserId : " + result[i].uId + " | PaperId : "
                            + result[i].pId + " | Rating : " + result[i].rating + " | Content : " + result[i].content +
                            +" | Author Rating : " + result[i].aRating + "</h1><br>");
                    }

                } else {
                    console.log("review not found");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>no review exist</h1>");
                    res.end();
                }
            }
        );
    });
}

const updateMyReview = (req, res, next) => {
    // 유저가 있는지 확인
    const paramUid = req.body.userid;
    const paramRid = req.body.reviewid;
    const paramContent = req.body.content;
    const paramRating = req.body.rating
        ;


    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select * from review where ID = ? and uId = ?",
            [paramRid, paramUid],
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
                    console.log("review found success");

                    //유저 업데이트 시작
                    pool.getConnection((err, conn) => {
                        if (err) {
                            conn.release();
                            console.log("Mysql getConnetion error.");
                            return;
                        }
                        const exec = conn.query(
                            "update review set content = ?, rating = ? where Id =? and uId = ?",
                            [paramContent, paramRating, paramRid, paramUid],
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
                                    res.write("<h2>Review update success</h2>");
                                    res.end();
                                }

                            }
                        );
                    })

                }
                else {
                    console.log("no user found");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>Review search faile no review match</h1>");
                    res.end();
                }

            }


        );
    });
}

const deleteMyReview = (req, res, next) => {
    console.log("/B/deleteMyReview called" + req);

    const paramUid = req.body.userid;
    const paramRid = req.body.reviewid;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select * from review where ID = ? and uId = ?",
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

const searchMyReview = (req, res, next) => {
    console.log("/B/searchMyReview called" + req);

    const paramUid = req.body.userid;
    const paramRid = req.body.reviewid;


    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select * from review where ID = ? and uId = ?",
            [paramRid, paramUid],
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
                        res.write("<h1>" + "ID : " + rows[i].ID + " | UserID : " + rows[i].uId + " | PaperId : "
                            + rows[i].pId + " | Rating : " + rows[i].rating + " | Content : " + rows[i].content +
                            " | Author Review : " + rows[i].aRating + "</h1><br>");
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

const viewOtherReview = (req, res, next) => {
    console.log("/B/viewOtherReview called" + req);

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
            "select * from review where uId = ? and pId = ?",
            [paramUid, paramPid],
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
                    console.log("Other review found success");


                    //view review
                    pool.getConnection((err, conn) => {
                        if (err) {
                            conn.release();
                            console.log("Mysql getConnetion error.");
                            return;
                        }

                        console.log("Database connection success");

                        const exec = conn.query(
                            "select * from review where pId = ? and not uId = ?",
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
                                    console.log("other review search success");

                                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                                    res.write("<h2>Other review search success</h2>");

                                    for (var i = 0; i < rows.length; i++) {
                                        res.write("<h1>" + "ID : " + rows[i].ID + " | UserId : " + rows[i].uId + " | PaperId : "
                                            + rows[i].pId + " | Rating : " + rows[i].rating + " | Content : " + rows[i].content +
                                            + " | Author Rating : " + rows[i].aRating + "</h1><br>");
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
                    console.log("other review not found");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>no other review exist</h1>");
                    res.end();
                }
            }
        );
    });
}

// create comment

const createComment = (req, res) => {
    console.log("/B/createComment called" + req);

    const paramUid = req.body.userid;
    const paramRid = req.body.reviewid;
    const paramComment = req.body.comment;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "insert into comment (uId,rId,comment) values(?,?,?)",
            [paramUid, paramRid, paramComment],
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
                    console.log("Review found");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>comment add success</h1>");
                    res.end();
                } else {
                    console.log("create failed");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>comment craete failed</h1>");
                    res.end();
                }
            }
        );
    });
};


// read comment (view comment)

const viewMyComment = (req, res) => {
    console.log("/B/viewMyComment called" + req);

    const paramUid = req.body.userid;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select * from comment where uId = ?",
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
                    console.log("Comment found");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>comment found success</h1>");

                    for (var i = 0; i < result.length; i++) {
                        res.write("<h1>" + "ID : " + result[i].ID + " | UserId : " + result[i].uId + " | ReviewId : "
                            + result[i].rId + " | Comment : " + result[i].comment + "</h1><br>");
                    }

                    res.end();
                } else {
                    console.log("comment not found");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>comment found failed</h1>");
                    res.end();
                }
            }
        );
    });
};


// update comment

const updateMyComment = (req, res) => {
    console.log("/B/updateMyComment called" + req);

    const paramCid = req.body.commentid;
    const paramUid = req.body.userid;
    const paramComment = req.body.comment;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select * from comment where ID = ? and uId = ?",
            [paramCid, paramUid],
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
                    console.log("Comment found");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>comment found success</h1>");

                    // update comment start
                    pool.getConnection((err, conn) => {
                        if (err) {
                            conn.release();
                            console.log("Mysql getConnetion error.");
                            return;
                        }
                        const exec = conn.query(
                            "update comment set comment = ? where ID =? and uId = ?",
                            [paramComment, paramCid, paramUid],
                            (err, result) => {
                                conn.release();
                                console.log("sql worked" + exec.sql);

                                if (err) {
                                    console.log("sql error happen");
                                    console.dir(err);
                                } else {
                                    console.dir(result);
                                    console.log("update success");

                                    res.write("<h2>Comment update success</h2>");
                                    res.end();
                                }

                            }
                        );
                    })



                    res.end();
                } else {
                    console.log("comment not found");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>comment found failed</h1>");
                    res.end();
                }
            }
        );
    });
};


// delete comment

const deleteMyComment = (req, res) => {
    console.log("/B/deleteMyComment called" + req);

    const paramCid = req.body.commentid;
    const paramUid = req.body.userid;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select * from comment where ID = ? and uId = ?",
            [paramCid, paramUid],
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
                    console.log("Comment found");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>comment found success</h1>");

                    // delete comment start
                    pool.getConnection((err, conn) => {
                        if (err) {
                            conn.release();
                            console.log("Mysql getConnetion error.");
                            return;
                        }
                        const exec = conn.query(
                            "delete from comment where ID = ? and uId = ?",
                            [paramCid, paramUid],
                            (err, result) => {
                                conn.release();
                                console.log("sql worked" + exec.sql);

                                if (err) {
                                    console.log("sql error happen");
                                    console.dir(err);
                                } else {
                                    console.dir(result);
                                    console.log("delte success");

                                    res.write("<h2>Comment delete success</h2>");
                                    res.end();
                                }

                            }
                        );
                    })



                    res.end();
                } else {
                    console.log("comment not found");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>comment found failed</h1>");
                    res.end();
                }
            }
        );
    });
};


// search my comment

const searchMyComment = (req, res) => {
    console.log("/B/searchMyComment called" + req);

    const paramCid = req.body.commentid
    const paramUid = req.body.userid;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select * from comment where ID =? and uId = ?",
            [paramCid, paramUid],
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
                    console.log("Comment found");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>comment found success</h1>");

                    for (var i = 0; i < result.length; i++) {
                        res.write("<h1>" + "ID : " + result[i].ID + " | UserId : " + result[i].uId + " | ReviewId : "
                            + result[i].rId + " | Comment : " + result[i].comment + "</h1><br>");
                    }


                    res.end();
                } else {
                    console.log("comment not found");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>comment found failed</h1>");
                    res.end();
                }
            }
        );
    });
};

const updateMaxPaperNum = (req, res) => {
    console.log("/B/UpdateMaxPaperNum" + req);

    const paramUid = req.body.userid;
    const paramPnum = req.body.maxpaper;

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
                    res.write("<h1>User found success</h1>");

                    // update comment start
                    pool.getConnection((err, conn) => {
                        if (err) {
                            conn.release();
                            console.log("Mysql getConnetion error.");
                            return;
                        }
                        const exec = conn.query(
                            "update users set maxPaper = ? where userId = ?",
                            [(Number(result[0].maxPaper) + Number(paramPnum)), paramUid],
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
                    console.log("user not found");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>user found failed</h1>");
                    res.end();
                }
            }
        );
    });
};





module.exports = {
    createBid, viewBid, updateBid, deleteBid, searchBid,
    createReviewRate, viewMyReview, updateMyReview, deleteMyReview,
    searchMyReview, viewOtherReview, createComment, viewMyComment,
    updateMyComment, deleteMyComment, searchMyComment, updateMaxPaperNum
};
