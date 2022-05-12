const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete","root","861215Sa@",{dialect:"mysql",host:"localhost"})

module.exports = sequelize