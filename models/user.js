const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Product = require("./product")

const User = sequelize.define("user",{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    name:Sequelize.STRING,
    email:Sequelize.STRING,
    age:Sequelize.INTEGER
})

module.exports = User