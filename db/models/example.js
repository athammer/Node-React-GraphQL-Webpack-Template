const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
    let Example = sequelize.define('example', {
        example_id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
        }
    });
    Market.sync({ alter: true }); //Better way to do this?
    return Market;
}
