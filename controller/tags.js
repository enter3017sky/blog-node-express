
const { Tax, Tag, sequelize } = require('../models/sequelize')
const { MomentFormat } = require('../public/utils')

module.exports = {

    /** 顯示新增分類的頁面 */
    newTag: function(req, res) {
        user = req.session.username
        if(!user) res.redirect('./')

        Tag.findAll({
            order: [['name', 'ASC']],
            raw: true
        }).then(allCategories => {
            res.render('newTag', {
                title: '新增分類',
                tags: allCategories,
                user
            })
        }).catch(err => console.error(err.stack));
    },

    /** 新增分類 */
    createNewTag: function(req, res) {
        user = req.session.username;
        const { name } = req.body
        if(!user) res.redirect('./')
        if(!name) {
            res.redirect('back')
        } else {
            Tag.create({
                name
            }).then(() => {
                res.redirect('back')
            }).catch(err => console.error(err.stack))
        }
    },

    /** 分類: 顯示分類及數量 */
    categories: function(req, res) {
        user = req.session.username;
        const rawQuery = "SELECT c.name, t.category_id, count(t.category_id) FROM categories c left join taxonomy t on c.id=t.category_id left join articles a on a.id=t.article_id  WHERE a.draft=0  group BY category_id desc";
        // join 的部分有些複雜，故出此下策
        sequelize.query(rawQuery,{
            type: sequelize.QueryTypes.SELECT
        }).then((tags) => {
            res.render('categories', {
                tags,
                user,
                title: 'Categories'
            });
        }).catch(err => console.error(err.stack))

    },

    /** 透過標籤名稱取得相關文章 */
    getPostByTagName: function(req, res) {
        user = req.session.username;
        const tagRawQuery = "SELECT a.id, a.title, a.created_at , t.category_id FROM articles a LEFT JOIN taxonomy t ON a.id = t.article_id WHERE t.category_id = ? AND a.draft=0 ORDER BY a.created_at ASC"
        // 從 url 參數取得分類的名稱，然後透過分類的名稱取得分類 id (note: 不增加 url 參數的情況下，不知道有沒有更好的方法，想了好久)
        Tag.findOne({
            where: {
                name: req.params.tagName
            }
        }).then(tag => {
            // 取得 category_id 之後，用原本 PHP 的 query 來操作
            sequelize.query(tagRawQuery,{
                replacements: [tag.id],
                type: sequelize.QueryTypes.SELECT 
            }).then(getPostDataByCategoryId => {
                const posts = MomentFormat(getPostDataByCategoryId)
                res.render('category', {
                    posts,
                    title: req.params.tagName,
                    user: req.session.username
                })
            }).catch(err => console.error(err.stack))
        }).catch(err => console.error(err.stack))
    
    },

    /** 顯示編輯分類中 */
    tagNameEdit: function(req, res) {
        user = req.session.username;
        if(!user) res.redirect('/')
        Tag.findOne({
            where: {
                id: req.params.id
            },
            raw: true
        }).then(tag => {
            res.render('editTag', {
                title: '編輯分類',
                tagName: tag.name,
                id: tag.id
            })
        })
    },

    /** 處理編輯分類 */
    handleTagNameEdit: function(req, res) {
        user = req.session.username;
        if(!user) res.redirect('/')
        Tag.findOne({
            where: {
                id: req.body.id
            }
        }).then(tagInstanceData => {
            return tagInstanceData.update({
                name: req.body.name
            })
        }).then(() => res.redirect('/admin/categories'))
        .catch(err => console.error(err.stack))
    },

    //** 處理刪除標籤 */
    handleTagNameDelete: function(req, res) {
        user = req.session.username
        const { id } = req.params
        if(!user) res.redirect('/')
        Tag.destroy({
            where: {
                id
            }
        }).then(() => {
            res.redirect('back')
        }).catch(err => console.error(err.stack))
    }

} // module.exports end.