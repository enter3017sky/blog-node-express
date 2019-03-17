/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('enter3017sky_user', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        nickname: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(256),
            allowNull: false
        }
    }, {
        tableName: 'enter3017sky_user',
    });
};
