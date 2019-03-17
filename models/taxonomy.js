/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('taxonomy', {
        article_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
        },
        category_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        }
    }, {
        tableName: 'taxonomy',
    });
};
