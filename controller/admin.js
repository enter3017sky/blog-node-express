
const { Post, sequelize } = require('../models/sequelize')

const { markedAndMomentFormat } = require('../public/utils')

module.exports = {

    /** 跟顯示所有文章列表差不多 */
    archivesAdmin: function(req, res) {
        user = req.session.username;
        if(!user) {
            res.redirect('/')
        } else {
            Post.findAll({
                attributes: ['title', 'id', 'draft', 'created_at'],
                order: [['created_at', 'DESC']],
                raw: true
            }).then(postsData => {
                const posts = markedAndMomentFormat(postsData)
                res.render('archivesAdmin', {
                    posts,
                    user,
                    title: 'Archives'
                })
            }).catch(err => {
                console.log(err)
            })
        }
    },

    /** 管理分類的頁面 */
    categoriesAdmin: function(req, res) {
        user = req.session.username;
        if(!user) {
            res.redirect('/')
        } else {
            const rawQuery = "SELECT * FROM categories ORDER BY id DESC";
            sequelize.query(rawQuery,{
                type: sequelize.QueryTypes.SELECT
            }).then(tags => {
                res.render('categoriesAdmin', {
                    tags,
                    user,
                    title: 'Categories'
                });
            }).catch(err => console.log(err))
        }
    },

}