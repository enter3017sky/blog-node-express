/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('comments', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
            article_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
            name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
            content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
            created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, {
        tableName: 'comments',
    });
};
