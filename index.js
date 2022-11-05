var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rlaxoghks96!",
  database: "db",
});

connection.connect();

connection.query("select * from user", function (error, results, fields) {
  if (error) throw error;
  console.log("users: ", results);
});

connection.query(
  "select role from user where id = 1",
  function (error, results, fields) {
    if (error) throw error;
    console.log("users: ", results);
  }
);

connection.query(
  "INSERT INTO `db`.`user` (`ID`, `name`, `role`) VALUES ('4', 'marco', 'html');",
  function (error, results, fields) {
    if (error) throw error;
    console.log("users: ", results);
  }
);

connection.end();
