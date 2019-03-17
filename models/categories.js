/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('categories', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(128),
            allowNull: false
        }
    }, {
        tableName: 'categories',
    });
};
