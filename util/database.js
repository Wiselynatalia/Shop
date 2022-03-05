const mysql = require("mysql2");

//multiple connections
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node-complete", //schema name
  password: "helloworld",
});

module.exports = pool.promise();
//promises handle asnyc data instead of callbacks
