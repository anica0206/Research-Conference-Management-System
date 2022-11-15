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

//view bid list
const viewBidList = (req, res) => {
    console.log("/B/viewBidList called" + req);

    const paramUid = req.body.userid;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select * from db.bid where uId = ?",
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
                    console.log("bid found success");


                    //view bid list
                    for (var i = 0; i < result.length; i++) {
                        res.write("<h1>" + "ID : " + result[i].ID + " | PaperId : " + result[i].pId + " | userId : " + result[i].uId + 
                        " | status : " + result[i].status + "</h1><br>");
                    }

                } else {
                    console.log("bid not found");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>no bid exist</h1>");
                    res.end();
                }
            }
        );
    });
};

// Allocate Automatically
// Bids all accepted or all rejected
const allocateBidAuto = (req, res) => {
    console.log("/B/allocateBidAuto called" + req);
    // check if the user exists
    const paramUid = req.body.userid;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select * from db.bid where uId = ?",
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

                    //start paper status update
                    pool.getConnection((err, conn) => {
                        if (err) {
                            conn.release();
                            console.log("Mysql getConnetion error.");
                            return;
                        }

                        const x = Math.floor(Math.random() * 2);

                        if(x == 0){
                            const exec = conn.query(
                                "update db.bid set status = 'Accepted' where uId = ?",
                                [paramUid],
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
                                    res.write("<h2>Allocate automatically update success</h2>");
                                    res.end();
                                }

                            }
                        );}
                        else if(x == 1){
                            const exec = conn.query(
                                "update db.bid set status = 'Rejected' where uId = ?",
                                [paramUid],
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
                                    res.write("<h2>Allocate automatically update success</h2>");
                                    res.end();
                                }

                            }
                        );
                        }
                    })

                }
                else {
                    console.log("no user found");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>allocate bid manually failed</h1>");
                    res.end();
                }
            }
        );
    });
};


// Allocate Manually
// Status 'Accepted' => Allocated, 'Rejected' => Unallocated
const allocateBidManual = (req, res) => {

    console.log("/B/allocateBidManual called" + req);

    // check if the user exists
    const paramUid = req.body.userid;
    const paramStatus = req.body.status;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select * from db.bid where uId = ?",
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
                    console.log("paper found success");

                    pool.getConnection((err, conn) => {
                        if (err) {
                            conn.release();
                            console.log("Mysql getConnetion error.");
                            return;
                        }
                        // update 'accepted' status
                        if(paramStatus == "accept")
                        {  
                            const exec = conn.query(
                                "update db.bid set status = 'Accepted' where uId = ?",
                                [paramUid],
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
                                        res.write("<h2>Bid accept success</h2>");
                                        res.end();
                                    }

                                }
                            );
                            
                            const exec1 = conn.query(
                                // if maxPaper == 0, stop to decrease maxPaper value
                                "select maxPaper from db.users",
                                (err1, result1) => {
                                    conn.release();
                                    console.log("sql worked" + exec1.sql);

                                if(result1 != 0)
                                {
                                    // if maxPaper !=, update decreased maxPaper value
                                    "update db.users set maxPaper = ? where ID = ?",
                                    [(Number(rows[0].maxPaper) + Number(-1)), paramUid],
                                    (err, result) => {
                                        conn.release();
                                        console.log("sql worked" + exec1.sql);

                                    if (err) {
                                        console.log("sql error happen");
                                        console.dir(err);
                                    } else {
                                        console.dir(result);
                                        console.log("update success");

                                        res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                                        res.write("<h2>maximum number of paper decreased success</h2>");
                                        res.end();
                                    }
                                }
                                }
                            }
                            );


                        }
                        // update 'rejected' status
                        else if(paramStatus == "reject")
                        {
                            const exec = conn.query(
                                "update db.bid set status = 'Rejected' where uId = ?",
                                [paramUid],
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
                                        res.write("<h2>Paper update success</h2>");
                                        res.end();
                                    }

                                }
                            );
                        }
                    })

                }
                else {
                    console.log("no user found");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>Paper search faile no user match</h1>");
                    res.end();
                }

            }


        );
    });

};

// view review and rating
const viewReviewRating = (req, res) => {
    console.log("/B/viewReviewRating called" + req);

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select * from review",
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
                            + result[i].pId + " | Rating : " + result[i].rating + " | Content : " + result[i].content + "</h1><br>");
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
};

// update paper status
// After reviewing process completed, Conference Chair makes a decision
const updatePaperStatus = (req, res) => {

    console.log("/B/updatePaperStatus called" + req);   
    // check if the user exists
    const paramPid = req.body.id;
    const paramAid = req.body.userid;
    const paramStatus = req.body.status;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select * from db.paper where ID = ? and aId = ?",
            [paramPid, paramAid],
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
                    console.log("paper found success");

                    // check if the user exists
                    pool.getConnection((err, conn) => {
                        if (err) {
                            conn.release();
                            console.log("Mysql getConnetion error.");
                            return;
                        }
                        if(paramStatus == "accept")
                        {
                            const exec = conn.query(
                                "update db.paper set status = 'Accepted' where aId = ?",
                                [paramAid],
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
                                        res.write("<h2>Paper update success</h2>");
                                        res.end();
                                    }

                                }
                            );
                        } else if(paramStatus == "reject")
                        {
                            const exec = conn.query(
                                "update db.paper set status = 'Rejected' where aId = ?",
                                [paramAid],
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
                                        res.write("<h2>Paper update success</h2>");
                                        res.end();
                                    }

                                }
                            );
                        }
                    })

                }
                else {
                    console.log("no user found");

                    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
                    res.write("<h1>Paper search faile no user match</h1>");
                    res.end();
                }

            }


        );
    });

};

// view paper list
// with its status
const viewPaperList = (req, res) => {
    console.log("/B/viewPaperList called" + req);

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnetion error.");
            return;
        }

        console.log("Database connection success");

        const exec = conn.query(
            "select * from db.paper",
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


                    // view paper list and its status
                    for (var i = 0; i < result.length; i++) {
                        res.write("<h1>" + "ID : " + result[i].ID + " | Topic : " + result[i].topic + " | authorId : " + result[i].aId + 
                        " | Paper title : " + result[i].paper + " | Status : " + result[i].status +"</h1><br>");
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



module.exports = {
    viewBidList, allocateBidAuto, allocateBidManual, viewReviewRating,
    updatePaperStatus, viewPaperList
};  