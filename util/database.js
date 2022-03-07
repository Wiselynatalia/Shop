const Sequalize = require("sequelize").Sequelize;

const sequalize = new Sequalize("node-complete", "root", "helloworld", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequalize;
