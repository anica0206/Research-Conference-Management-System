const dbconfig = require("../config/dbconfig.json");
const mysql = require("mysql");
const path = require("path");
const { authorViewPaper } = require("./author.controller");
const b = path.join(__dirname, "../B");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: dbconfig.host,
  user: dbconfig.user,
  password: dbconfig.password,
  database: dbconfig.database,
  debug: false,
});

// view bid list
const viewBid = (req, res) => {
  console.log("/B/viewBid called" + req);

  pool.getConnection((err, conn) => {
    if (err) {
      conn.release();
      console.log("Mysql getConnetion error.");
      return;
    }

    console.log("Database connection success");

    const exec = conn.query("select * from db.bid", (err, result) => {
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
        res.json(result);
      } else {
        console.log("bid not found");
        res.json("");
      }
    });
  });
};

// Allocate Automatically
// Bids all accepted or all rejected

// Allocate Automatically
// Bids all accepted or all rejected
const allocateBidAuto = (req, res) => {
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

            if (x == 0) {
              const exec = conn.query(
                "update db.bid set status = 'Accept' where uId = ?",
                [paramUid],
                (err, result) => {
                  console.log("sql worked" + exec.sql);

                  if (err) {
                    console.log("sql error happen");
                    console.dir(err);
                  } else {
                    console.dir(result);
                    console.log("update success");
                    res.send(
                      "<script>alert('Allocated');location.href='/B/chair.html';</script>"
                    );
                  }

                  const exec1 = conn.query(
                    // if maxPaper == 0, stop to decrease maxPaper value
                    "select * from db.users where userId = ?",
                    [paramUid],
                    (err1, result1) => {
                      console.log("sql worked" + exec1.sql);

                      if (result1 != 0) {
                        // if maxPaper !=0 , update decreased maxPaper value
                        const exec = conn.query(
                          "update db.users set maxPaper = ? where userId = ?",
                          [Number(result1[0].maxPaper) + Number(-1), paramUid],
                          (err, result) => {
                            console.log("sql worked" + exec1.sql);

                            if (err) {
                              console.log("sql error happen");
                              console.dir(err);
                            } else {
                              console.dir(result);
                              console.log("update success");
                            }
                          }
                        );
                      }
                    }
                  );
                }
              );
            } else if (x == 1) {
              const exec = conn.query(
                "update db.bid set status = 'Reject' where uId = ?",
                [paramUid],
                (err, result) => {
                  console.log("sql worked" + exec.sql);

                  if (err) {
                    console.log("sql error happen");
                    console.dir(err);
                  } else {
                    console.dir(result);
                    console.log("update success");
                    res.send(
                      "<script>alert('Allocated');location.href='/B/chair.html';</script>"
                    );
                  }
                }
              );
            }
          });
        } else {
          console.log("no user found");
          res.send(
            "<script>alert('Allocate failed, no user found');location.href='/B/chair.html';</script>"
          );
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

    const exec = conn.query("select * from review", (err, result) => {
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
        res.json(result);
      } else {
        console.log("review not found");
        res.json("");
      }
    });
  });
};

// update paper status
// After reviewing process completed, Conference Chair makes a decision
const updatePaperStatus = (req, res) => {
  // check if the user exists
  const paramPid = req.body.id;
  const paramStatus = req.body.status;

  pool.getConnection((err, conn) => {
    if (err) {
      conn.release();
      console.log("Mysql getConnetion error.");
      return;
    }

    console.log("Database connection success");

    const exec = conn.query(
      "select * from db.paper where ID = ?",
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
          console.log("paper found success");

          // check if the user exists
          pool.getConnection((err, conn) => {
            if (err) {
              conn.release();
              console.log("Mysql getConnetion error.");
              return;
            }
            if (paramStatus == "accept") {
              const exec = conn.query(
                "update db.paper set status = 'Accept' where ID = ?",
                [paramPid],
                (err, result) => {
                  conn.release();
                  console.log("sql worked" + exec.sql);

                  if (err) {
                    console.log("sql error happen");
                    console.dir(err);
                  } else {
                    console.dir(result);
                    console.log("update success");
                    res.send(
                      "<script>alert('Status updated');location.href='/B/chair.html';</script>"
                    );
                  }
                }
              );
            } else if (paramStatus == "reject") {
              const exec = conn.query(
                "update db.paper set status = 'Reject' where ID = ?",
                [paramPid],
                (err, result) => {
                  conn.release();
                  console.log("sql worked" + exec.sql);

                  if (err) {
                    console.log("sql error happen");
                    console.dir(err);
                  } else {
                    console.dir(result);
                    console.log("update success");

                    res.send(
                      "<script>alert('Status updated');location.href='/B/chair.html';</script>"
                    );
                  }
                }
              );
            }
          });
        } else {
          console.log("no user found");
          res.send(
            "<script>alert('No paper found');location.href='/B/chair.html';</script>"
          );
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

    const exec = conn.query("select * from db.paper", (err, result) => {
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
        res.json(result);
      } else {
        console.log("paper not found");
        res.json("");
      }
    });
  });
};

// View list of accepted/rejected papers
const viewAcceptPaper = (req, res) => {
  console.log("/B/viewAcceptPaper called" + req);

  const paramStatus = req.body.status;

  pool.getConnection((err, conn) => {
    if (err) {
      conn.release();
      console.log("Mysql getConnetion error.");
      return;
    }

    console.log("Database connection success");

    const exec = conn.query(
      "select * from db.paper where status = ?",
      [paramStatus],
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

          res.json(result);
        } else {
          console.log("paper not found");

          res.json("");
        }
      }
    );
  });
};

// search bids for paper

const searchBids = (req, res) => {
  console.log("/B/searchBids called" + req);

  const paramUid = req.body.uId;

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
      (err, rows) => {
        conn.release();
        console.log("sql worked" + exec.sql);

        if (err) {
          console.log("sql error happened");
          console.dir(err);
          return;
        }

        if (rows.length > 0) {
          console.dir(rows);
          console.log("search success");

          res.json(rows);
        } else {
          console.log("search failed");
          res.json("");
        }
      }
    );
  });
};

// Allocate Manually
// Status 'Accepted' => Allocated, 'Rejected' => Unallocated
const allocateBidManual = (req, res) => {
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
            if (paramStatus == "accept") {
              const exec = conn.query(
                "update db.bid set status = 'Accept' where uId = ?",
                [paramUid],
                (err, result) => {
                  console.log("sql worked" + exec.sql);

                  if (err) {
                    console.log("sql error happen");
                    console.dir(err);
                  } else {
                    console.dir(result);
                    console.log("update success");
                    res.send(
                      "<script>alert('Allocated');location.href='/B/chair.html';</script>"
                    );
                  }
                }
              );

              const exec1 = conn.query(
                // if maxPaper == 0, stop to decrease maxPaper value
                "select * from db.users where userId = ?",
                [paramUid],
                (err1, result1) => {
                  console.log("sql worked" + exec1.sql);

                  if (result1 != 0) {
                    // if maxPaper !=0 , update decreased maxPaper value
                    const exec = conn.query(
                      "update db.users set maxPaper = ? where userId = ?",
                      [Number(result1[0].maxPaper) + Number(-1), paramUid],
                      (err, result) => {
                        console.log("sql worked" + exec1.sql);

                        if (err) {
                          console.log("sql error happen");
                          console.dir(err);
                        } else {
                          console.dir(result);
                          console.log("update success");
                        }
                      }
                    );
                  }
                }
              );
            }
            // update 'rejected' status
            else if (paramStatus == "reject") {
              const exec = conn.query(
                "update db.bid set status = 'Reject' where uId = ?",
                [paramUid],
                (err, result) => {
                  console.log("sql worked" + exec.sql);

                  if (err) {
                    console.log("sql error happen");
                    console.dir(err);
                  } else {
                    console.dir(result);
                    console.log("update success");
                    res.send(
                      "<script>alert('Allocated');location.href='/B/chair.html';</script>"
                    );
                  }
                }
              );
            }
          });
        } else {
          console.log("no user found");
          res.send(
            "<script>alert('Paper search failed, no use match');location.href='/B/chair.html';</script>"
          );
        }
      }
    );
  });
};

module.exports = {
  viewBid,
  allocateBidAuto,
  allocateBidManual,
  viewReviewRating,
  updatePaperStatus,
  viewPaperList,
  viewAcceptPaper,
  searchBids,
};
