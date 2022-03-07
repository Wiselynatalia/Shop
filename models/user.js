const Sequalize = require("sequelize"); //for type definition
const sequalize = require("../util/database"); //for db configuration

const User = sequalize.define("user", {
  id: {
    type: Sequalize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequalize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequalize.STRING,
    allowNull: false,
  },
});

module.exports = User;
