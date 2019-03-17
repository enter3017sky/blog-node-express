/* jshint indent: 2 */

const moment = require('moment')

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('articles', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            get: function() {
                return moment(this.getDataValue('DateTime')).format('YYYY-MM-DD HH:MM')
            }
        },
        draft: {
            type: DataTypes.INTEGER(1),
            allowNull: false
        }
    }, {
        tableName: 'articles',
    });
};
