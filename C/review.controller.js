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

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "0000",
//   database: "db",
// });

const viewAllocatedPaper = (req, res, next) => {
  console.log("/B/viewAllocatedPaper called" + req);

  pool.getConnection((err, conn) => {
    if (err) {
      conn.release();
      console.log("Mysql getConnetion error.");
      return;
    }

    console.log("Database connection success");

    const exec = conn.query(
      "select * from paper where status = ?",
      ["Accept"],
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

// create bid
const createBid = (req, res, next) => {
  console.log("/B/bidPaper called" + req);

  const paramPid = req.body.paperid;
  // check user is able to bid
  pool.getConnection((err, conn) => {
    if (err) {
      conn.release();
      console.log("Mysql getConnetion error.");
      return;
    }

    console.log("Database connection success");

    conn.query("SELECT * FROM session", (err, result) => {
      console.log(result[0].loginId);
      uId = result[0].loginId;
    });

    const exec = conn.query(
      "select * from users where userId = ? and maxPaper > 0",
      [uId],
      (err, result) => {
        conn.release();
        console.log("sql worked" + exec.sql);

        if (err) {
          console.log("sql error happen");
          console.dir(err);
          return;
        }

        if (result.length > 0) {
          // check paper exist
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
                  console.log("paper found success");

                  // check same bid exist
                  pool.getConnection((err, conn) => {
                    if (err) {
                      conn.release();
                      console.log("Mysql getConnetion error.");
                      return;
                    }

                    console.log("Database connection success");

                    const exec = conn.query(
                      "select * from bid where pId = ? and uId = ?",
                      [paramPid, uId],
                      (err, result) => {
                        conn.release();
                        console.log("sql worked" + exec.sql);

                        if (err) {
                          console.log("sql error happen");
                          console.dir(err);
                          return;
                        }

                        if (result.length == 0) {
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
                              [paramPid, uId],
                              (err, result) => {
                                conn.release();
                                console.log("sql worked" + exec.sql);

                                if (err) {
                                  console.log("sql error happen");
                                  console.dir(err);
                                } else {
                                  console.dir(result);
                                  console.log("bid add success");
                                  res.send(
                                    "<script>alert('Bid add success');location.href='/B/reviewer.html';</script>"
                                  );
                                }
                              }
                            );
                          });
                        } else {
                          console.log("inserted faile");
                          res.send(
                            "<script>alert('bid add failed already bided');location.href='/B/reviewer.html';</script>"
                          );
                        }
                      }
                    );
                  });
                } else {
                  console.log("inserted failed");
                  res.send(
                    "<script>alert('paper not found');location.href='/B/reviewer.html';</script>"
                  );
                }
              }
            );
          });

          // paper not found
        } else {
          console.log("not reviewer");
          res.send(
            "<script>alert('no user found');location.href='/B/reviewer.html';</script>"
          );
        }
      }
    );
  });
};

const viewBid = (req, res, next) => {
  console.log("/B/viewBid called" + req);

  pool.getConnection((err, conn) => {
    if (err) {
      conn.release();
      console.log("Mysql getConnetion error.");
      return;
    }

    console.log("Database connection success");

    // let uId = getUserID();

    const exec = conn.query(
      "select * from bid, users where uId = ?",
      [uId],
      (err, result) => {
        conn.release();
        console.log("sql worked" + exec.sql);

        if (err) {
          res.send(
            "<script>alert('wrong user ID');location.href='/B/reviewer.html';</script>"
          );
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
              [uId],
              (err, result) => {
                conn.release();
                console.log("sql worked" + exec.sql);

                if (!err) {
                  console.log(result);
                  res.json(result);
                } else {
                  res.json("");
                }
              }
            );
          });
        } else {
          console.log("bid not found");
        }
      }
    );
  });
};

const updateBid = (req, res, next) => {
  // 유저가 있는지 확인
  const paramBid = req.body.bidid;
  const paramPid = req.body.paperid;

  pool.getConnection((err, conn) => {
    if (err) {
      conn.release();
      console.log("Mysql getConnetion error.");
      return;
    }

    console.log("Database connection success");

    const exec = conn.query(
      "select * from bid where ID = ? and uId = ?",
      [paramBid, uId],
      (err, rows) => {
        conn.release();
        console.log("sql worked" + exec.sql);

        if (err) {
          console.log("sql error happen");
          res.send(
            "<script>alert('wrong user ID');location.href='/B/reviewer.html';</script>"
          );
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
                  res.send(
                    "<script>alert('wrong paper ID');location.href='/B/reviewer.html';</script>"
                  );
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
                      [paramPid, paramBid, uId],
                      (err, result) => {
                        conn.release();
                        console.log("sql worked" + exec.sql);

                        if (err) {
                          console.log("sql error happen");
                          console.dir(err);
                        } else {
                          console.dir(result);
                          console.log("bid update success");
                          res.send(
                            "<script>alert('bid update success');location.href='/B/reviewer.html';</script>"
                          );
                        }
                      }
                    );
                  });
                } else {
                  console.dir(result);
                  console.log("paper not exist");

                  res.send(
                    "<script>alert('paper not exist');location.href='/B/reviewer.html';</script>"
                  );
                }
              }
            );
          });
        } else {
          console.log("no bid found");
          res.send(
            "<script>alert('no bid found');location.href='/B/reviewer.html';</script>"
          );
        }
      }
    );
  });
};

const deleteBid = (req, res, next) => {
  console.log("/B/delete bid called" + req);

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
      [paramBid, uId],
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
              [paramBid, uId],
              (err, result) => {
                conn.release();
                console.log("sql worked" + exec.sql);

                if (err) {
                  console.log("sql error happen");
                  console.dir(err);
                } else {
                  console.dir(result);
                  console.log("bid delete success");
                  res.send(
                    "<script>alert('bid delete success');location.href='/B/reviewer.html';</script>"
                  );
                }
              }
            );
          });
        } else {
          console.log("inserted failed");
          res.send(
            "<script>alert('bid delete failed');location.href='/B/reviewer.html';</script>"
          );
        }
      }
    );
  });
};

const searchBid = (req, res, next) => {
  console.log("/B/searchBid called" + req);

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
      [paramBid, uId],
      (err, rows) => {
        conn.release();
        console.log("sql worked" + exec.sql);

        if (rows.length > 0) {
          console.dir(rows);
          console.log("bid search success");
          res.json(rows);
        } else {
          console.log("bid search faile");
          res.json("");
        }
      }
    );
  });
};

const createReviewRate = (req, res, next) => {
  console.log("/B/createReview called" + req);

  const paramUid = uId;
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

          // check if review already exist

          pool.getConnection((err, conn) => {
            if (err) {
              conn.release();
              console.log("Mysql getConnetion error.");
              return;
            }

            console.log("Database connection success");

            const exec = conn.query(
              "select * from review where pId = ? and uId = ?",
              [paramPid, paramUid],
              (err, result) => {
                conn.release();
                console.log("sql worked" + exec.sql);

                if (err) {
                  console.log("sql error happen");
                  console.dir(err);
                  return;
                }

                if (result.length == 0) {
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
                          res.send(
                            "<script>alert('Review and rating add success');location.href='/B/reviewer.html';</script>"
                          );
                        }
                      }
                    );
                  });
                } else {
                  res.send(
                    "<script>alert('Review and rating add failed');location.href='/B/reviewer.html';</script>"
                  );
                }
              }
            );
          });
        } else {
          console.log("inserted faile");
          res.send(
            "<script>alert('Review and rating add failed');location.href='/B/reviewer.html';</script>"
          );
        }
      }
    );
  });
};

const viewMyReview = (req, res, next) => {
  console.log("/B/viewMyReview called" + req);

  pool.getConnection((err, conn) => {
    if (err) {
      conn.release();
      console.log("Mysql getConnetion error.");
      return;
    }

    console.log("Database connection success");

    const exec = conn.query(
      "select * from review where uId = ?",
      [uId],
      (err, result) => {
        conn.release();
        console.log("sql worked" + exec.sql);

        if (err) {
          console.log("sql error happen");
          console.dir(err);
          return;
        }

        if (!err) {
          console.log(result);
          res.json(result);
        } else {
          res.json("");
        }
      }
    );
  });
};

const updateMyReview = (req, res, next) => {
  // 유저가 있는지 확인
  const paramRid = req.body.reviewid;
  const paramContent = req.body.content;
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
      [paramRid, uId],
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
              [paramContent, paramRating, paramRid, uId],
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
                    "<script>alert('Review update success');location.href='/B/reviewer.html';</script>"
                  );
                }
              }
            );
          });
        } else {
          console.log("no user found");
          res.send(
            "<script>alert('Review search failed no review match');location.href='/B/reviewer.html';</script>"
          );
        }
      }
    );
  });
};

const deleteMyReview = (req, res, next) => {
  console.log("/B/deleteMyReview called" + req);

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
      [paramRid, uId],
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
              [paramRid, uId],
              (err, result) => {
                conn.release();
                console.log("sql worked" + exec.sql);

                if (err) {
                  console.log("sql error happen");
                  console.dir(err);
                } else {
                  console.dir(result);
                  console.log("review delete success");
                  res.send(
                    "<script>alert('Review delete success');location.href='/B/reviewer.html';</script>"
                  );
                }
              }
            );
          });
        } else {
          console.log("review delete failed");
          res.send(
            "<script>alert('Review delete failed no review match');location.href='/B/reviewer.html';</script>"
          );
        }
      }
    );
  });
};

const searchMyReview = (req, res, next) => {
  console.log("/B/searchMyReview called" + req);

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
      [paramRid, uId],
      (err, rows) => {
        conn.release();
        console.log("sql worked" + exec.sql);

        if (err) {
          console.log("sql error happen");
          console.dir(err);
          return;
        }

        if (!err) {
          console.log(rows);
          res.json(rows);
        } else {
          res.json("");
        }
      }
    );
  });
};

const viewOtherReview = (req, res, next) => {
  console.log("/B/viewOtherReview called" + req);

  const paramPid = req.body.pId;

  pool.getConnection((err, conn) => {
    if (err) {
      conn.release();
      console.log("Mysql getConnetion error.");
      return;
    }

    console.log("Database connection success");

    const exec = conn.query(
      "select * from review where uId = ? and pId = ?",
      [uId, paramPid],
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
              [paramPid, uId],
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
                  res.json(rows);
                } else {
                  console.log("review search faile");
                  res.json("");
                }
              }
            );
          });
        } else {
          console.log("other review not found");
          res.json("");
        }
      }
    );
  });
};

// create comment

const createComment = (req, res) => {
  console.log("/B/createComment called" + req);

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
      [uId, paramRid, paramComment],
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
          res.send(
            "<script>alert('Comment added');location.href='/B/reviewer.html';</script>"
          );
        } else {
          console.log("create failed");
          res.send(
            "<script>alert('Fail to add comment');location.href='/B/reviewer.html';</script>"
          );
        }
      }
    );
  });
};

// read comment (view comment)

const viewMyComment = (req, res) => {
  console.log("/B/viewMyComment called" + req);

  pool.getConnection((err, conn) => {
    if (err) {
      conn.release();
      console.log("Mysql getConnetion error.");
      return;
    }

    console.log("Database connection success");

    const exec = conn.query(
      "select * from comment where uId = ?",
      [uId],
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
          res.json(result);
        } else {
          console.log("comment not found");
          res.json();
        }
      }
    );
  });
};

// update comment

const updateMyComment = (req, res) => {
  console.log("/B/updateMyComment called" + req);

  const paramCid = req.body.commentid;
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
      [paramCid, uId],
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

          // update comment start
          pool.getConnection((err, conn) => {
            if (err) {
              conn.release();
              console.log("Mysql getConnetion error.");
              return;
            }
            const exec = conn.query(
              "update comment set comment = ? where ID =? and uId = ?",
              [paramComment, paramCid, uId],
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
                    "<script>alert('Comment updated');location.href='/B/reviewer.html';</script>"
                  );
                }
              }
            );
          });
        } else {
          console.log("comment not found");
          res.send(
            "<script>alert('Comment not found');location.href='/B/reviewer.html';</script>"
          );
        }
      }
    );
  });
};

// delete comment

const deleteMyComment = (req, res) => {
  console.log("/B/deleteMyComment called" + req);

  const paramCid = req.body.commentid;

  pool.getConnection((err, conn) => {
    if (err) {
      conn.release();
      console.log("Mysql getConnetion error.");
      return;
    }

    console.log("Database connection success");

    const exec = conn.query(
      "select * from comment where ID = ? and uId = ?",
      [paramCid, uId],
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

          // delete comment start
          pool.getConnection((err, conn) => {
            if (err) {
              conn.release();
              console.log("Mysql getConnetion error.");
              return;
            }
            const exec = conn.query(
              "delete from comment where ID = ? and uId = ?",
              [paramCid, uId],
              (err, result) => {
                conn.release();
                console.log("sql worked" + exec.sql);

                if (err) {
                  console.log("sql error happen");
                  console.dir(err);
                } else {
                  console.dir(result);
                  console.log("delte success");
                  res.send(
                    "<script>alert('Comment deleted');location.href='/B/reviewer.html';</script>"
                  );
                }
              }
            );
          });
        } else {
          console.log("comment not found");
          res.send(
            "<script>alert('Comment not found');location.href='/B/reviewer.html';</script>"
          );
        }
      }
    );
  });
};

// search my comment

const searchMyComment = (req, res) => {
  console.log("/B/searchMyComment called" + req);

  const paramCid = req.body.cId;

  pool.getConnection((err, conn) => {
    if (err) {
      conn.release();
      console.log("Mysql getConnetion error.");
      return;
    }

    console.log("Database connection success");

    const exec = conn.query(
      "select * from comment where ID =? and uId = ?",
      [paramCid, uId],
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
          res.json(result);
        } else {
          console.log("comment not found");
          res.json("");
        }
      }
    );
  });
};

const updateMaxPaperNum = (req, res) => {
  console.log("/B/UpdateMaxPaperNum" + req);
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
      [uId],
      (err, result) => {
        conn.release();
        console.log("sql worked" + exec.sql);

        if (err) {
          console.log("sql error happen");
          res.send(
            "<script>alert('fail to set maximum of paper to review');location.href='/B/reviewer.html';</script>"
          );
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
              "update users set maxPaper = ? where userId = ?",
              [Number(result[0].maxPaper) + Number(paramPnum), uId],
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
                    "<script>alert('Success to set maximum number of paper');location.href='/B/reviewer.html';</script>"
                  );
                }
              }
            );
          });
        } else {
          console.log("user not found");
          res.send(
            "<script>alert('fail to set maximum of paper to review');location.href='/B/reviewer.html';</script>"
          );
        }
      }
    );
  });
};

module.exports = {
  createBid,
  viewBid,
  updateBid,
  deleteBid,
  searchBid,
  createReviewRate,
  viewMyReview,
  updateMyReview,
  deleteMyReview,
  searchMyReview,
  viewOtherReview,
  createComment,
  viewMyComment,
  updateMyComment,
  deleteMyComment,
  searchMyComment,
  updateMaxPaperNum,
  viewAllocatedPaper,
};
