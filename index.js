var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "314_testdb",
});

connection.connect();

connection.query("select * from users", function (error, results, fields) {
  if (error) throw error;
  console.log("users: ", results);
});

connection.query(
  "select role from users where id = 1",
  function (error, results, fields) {
    if (error) throw error;
    console.log("users: ", results);
  }
);

connection.query(
  "INSERT INTO `314_testdb`.`users` (`id`, `userName`, `password`, `role`) VALUES ('4', 'marco', '1234','html');",
  function (error, results, fields) {
    if (error) throw error;
    console.log("users: ", results);
  }
);

connection.end();
