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



// create paper
const createPaper = (req, res) => {
  console.log("/B/createPaper" + req);

  const paramTopic = req.body.topic;
  const paramPaper = req.body.paper;

  pool.getConnection((err, conn) => {
    if (err) {
      conn.release();
      console.log("Mysql getConnetion error.");
      return;
    }

    console.log("Database connection success");

    const exec = conn.query(
      "select * from session where not loginId = ?",
      ["null"],
      (err, result) => {
        conn.release();
        console.log("sql worked" + exec.sql);

        if (err) {
          console.log("sql error happen");
          console.dir(err);
          return;
        } else {
          var paramUid = result[0].loginId;

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
                  res.send(
                    "<script>alert('Paper added successfully');location.href='/B/author.html';</script>"
                  );
                } else {
                  console.log("create failed");
                  res.send(
                    "<script>alert('Paper create failed');location.href='/B/author.html';</script>"
                  );
                }
              }
            );
          });
        }
      }
    );
  });
};

// read(view) my paper
const viewPaper = (req, res) => {
  console.log("/B/viewPaper called" + req);

  pool.getConnection((err, conn) => {
    if (err) {
      conn.release();
      console.log("Mysql getConnetion error.");
      return;
    }

    console.log("Database connection success");

    const exec = conn.query(
      "select * from session where not loginId = ?",
      ["null"],
      (err, result) => {
        conn.release();
        console.log("sql worked" + exec.sql);

        if (err) {
          console.log("sql error happen");
          console.dir(err);
          return;
        } else {
          var paramUid = result[0].loginId;

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
                  res.json(result);
                } else {
                  console.log("paper not found");
                  res.json("");
                }
              }
            );
          });
        }
      }
    );
  });
};

// update My paper
const updatePaper = (req, res) => {
  console.log("/B/authorUpdateMyPaper called" + req);

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
      "select * from session where not loginId = ?",
      ["null"],
      (err, result) => {
        conn.release();
        console.log("sql worked" + exec.sql);

        if (err) {
          console.log("sql error happen");
          console.dir(err);
          return;
        } else {
          var paramUid = result[0].loginId;

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
                  console.log("Paper found");

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
                          res.send(
                            "<script>alert('Paper update successed');location.href='/B/author.html';</script>"
                          );
                        }
                      }
                    );
                  });
                } else {
                  console.log("comment not found");
                  res.send(
                    "<script>alert('Paper not found');location.href='/B/author.html';</script>"
                  );
                }
              }
            );
          });
        }
      }
    );
  });
};

// delete my paper
const deleteMyPaper = (req, res) => {
  console.log("/B/deleteMyPaper called" + req);

  const paramPid = req.body.paperid;

  pool.getConnection((err, conn) => {
    if (err) {
      conn.release();
      console.log("Mysql getConnetion error.");
      return;
    }

    console.log("Database connection success");

    const exec = conn.query(
      "select * from session where not loginId = ?",
      ["null"],
      (err, result) => {
        conn.release();
        console.log("sql worked" + exec.sql);

        if (err) {
          console.log("sql error happen");
          console.dir(err);
          return;
        } else {
          var paramUid = result[0].loginId;

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
                          res.send(
                            "<script>alert('Paper deleted');location.href='/B/author.html';</script>"
                          );
                        }
                      }
                    );
                  });
                } else {
                  console.log("paper delete failed");
                  res.send(
                    "<script>alert('Wrong paper id');location.href='/B/author.html';</script>"
                  );
                }
              }
            );
          });
        }
      }
    );
  });
};

// search my paper
const searchMyPaper = (req, res) => {
  console.log("/B/searchMyPaper called" + req);

  const paramPid = req.body.pId;

  pool.getConnection((err, conn) => {
    if (err) {
      conn.release();
      console.log("Mysql getConnetion error.");
      return;
    }

    console.log("Database connection success");

    const exec = conn.query(
      "select * from session where not loginId = ?",
      ["null"],
      (err, result) => {
        conn.release();
        console.log("sql worked" + exec.sql);

        if (err) {
          console.log("sql error happen");
          console.dir(err);
          return;
        } else {
          var paramUid = result[0].loginId;

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
                  console.log("paper found success");
                  res.json(rows);
                } else {
                  console.log("paper not found");
                  res.json("");
                }
              }
            );
          });
        }
      }
    );
  });
};

// view review on paper (author)
const viewReviewOnPaper = (req, res) => {
  console.log("/B/viewReviewOnPaper" + req);

  const paramPid = req.body.pId;

  pool.getConnection((err, conn) => {
    if (err) {
      conn.release();
      console.log("Mysql getConnetion error.");
      return;
    }

    console.log("Database connection success");

    const exec = conn.query(
      "select * from session where not loginId = ?",
      ["null"],
      (err, result) => {
        conn.release();
        console.log("sql worked" + exec.sql);

        if (err) {
          console.log("sql error happen");
          console.dir(err);
          return;
        } else {
          var paramUid = result[0].loginId;

          pool.getConnection((err, conn) => {
            if (err) {
              conn.release();
              console.log("Mysql getConnetion error.");
              return;
            }

            console.log("Database connection success");

            const exec = conn.query(
              "select * from paper where ID = ? and aId = ? and  not status = ?",
              [paramPid, paramUid, "Upcomming"],
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

                          res.json(rows);
                        } else {
                          console.log("review search faile");
                          res.json("");
                        }
                      }
                    );
                  });
                } else {
                  console.log("paper not found");
                  res.json("");
                }
              }
            );
          });
        }
      }
    );
  });
};

// creat rating on review
const rateOnReview = (req, res) => {
  console.log("/B/rateOnReview called" + req);

  const paramRid = req.body.reviewid;
  const paramPid = req.body.pid;
  const paramRating = req.body.rating;

  pool.getConnection((err, conn) => {
    if (err) {
      conn.release();
      console.log("Mysql getConnetion error.");
      return;
    }

    console.log("Database connection success");

    const exec = conn.query(
      "select * from paper where not status = ?",
      ['Upcomming'],
      (err, result) => {
        conn.release();
        console.log("sql worked" + exec.sql);

        if (err) {
          console.log("sql error happen");
          console.dir(err);
          return;
        }

        if (result.length > 0) {

          pool.getConnection((err, conn) => {
            if (err) {
              conn.release();
              console.log("Mysql getConnetion error.");
              return;
            }

            console.log("Database connection success");

            const exec = conn.query(
              "select * from review where ID = ? and pId = ?",
              [paramRid, paramPid],
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

                  // update comment start
                  pool.getConnection((err, conn) => {
                    if (err) {
                      conn.release();
                      console.log("Mysql getConnetion error.");
                      return;
                    }
                    const exec = conn.query(
                      "update review set aRating = ? where ID = ?",
                      [paramRating, paramRid],
                      (err, result) => {
                        conn.release();
                        console.log("sql worked" + exec.sql);

                        if (err) {
                          console.log("sql error happen");
                          console.dir(err);
                          res.send(
                            "<script>alert('Wrong paper id');location.href='/B/author.html';</script>"
                          );
                        } else {
                          console.dir(result);
                          console.log("update success");
                          res.send(
                            "<script>alert('Rated');location.href='/B/author.html';</script>"
                          );
                        }
                      }
                    );
                  });
                } else {
                  console.log("Review not found");
                  res.send(
                    "<script>alert('Review not found');location.href='/B/author.html';</script>"
                  );
                }
              }
            );
          });


        }
        else {

          console.log("no processed paper!");

        }
      }
    )
  }
  )

};

module.exports = {
  createPaper,
  viewPaper,
  updatePaper,
  deleteMyPaper,
  searchMyPaper,
  viewReviewOnPaper,
  rateOnReview,
};
