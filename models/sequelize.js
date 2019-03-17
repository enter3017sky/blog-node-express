/**
 * Sequelize: 插件
 * configure: mysql password
 * UserModel: user schema
 */

const Sequelize = require('sequelize');
const configure = require('./configure');
const UserModel = require('./blog_user');
const PostModel = require('./articles');
const Categories = require('./categories');
const Taxonomy = require('./taxonomy');
const CommentsModel = require('./comments');
const About = require('./about');

// 連線資料庫
const sequelize = new Sequelize(configure.dbName, configure.username, configure.password, {
    host: configure.host,
    dialect: 'mysql',
    operatorsAliases: false,
    // logging: false,
    define: {
        timestamps: false, 
        underscored: true /** createdAt: 'created_at':用底線 ex. articles_id , 不用駝峰命名 articlesId */
    }
});

// 使用者
const User = UserModel(sequelize, Sequelize);

// 文章列表
const Post = PostModel(sequelize, Sequelize);

// 分類列表
const Tag = Categories(sequelize, Sequelize);

// category_id article_id
const Tax = Taxonomy(sequelize, Sequelize);

// 文章底下的 comments
const Comments = CommentsModel(sequelize, Sequelize)

const AboutInfo = About(sequelize, Sequelize);

// sequelize.sync().then(function() {
//     // this is where we continue ...
// })


// 測試連接
sequelize.authenticate()
    .then(() => {
        console.log('\n\t** Connection has been established successfully. **\n');
    })
    .catch((err) => {
        console.error(`
        ------------START-----------
        Unable to connect to the database:
        ${err}
        -------------END------------`);
    });

// 導出
module.exports = {
    User,
    Post,
    Tag,
    Tax,
    AboutInfo,
    Comments,
    sequelize
}