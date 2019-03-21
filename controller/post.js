const { Post, Tag, Tax, Comments, sequelize } = require('../models/sequelize')

const ejs_helpers = require('../public/ejs_helper') 

// markdown
const { MomentFormat, markedAndMomentFormat } = require('../public/utils')

module.exports = {

    /** 顯示新增文章的頁面 */
    newPost: function(req, res) {
        user = req.session.username
        Tag.findAll({
            order: [['id', 'ASC']],
            raw: true
        }).then(allCategories => {
            res.render('newPost', {
                title: '新增文章',
                tags: allCategories,
                user,
            })
        }).catch(err => {
            console.error(err.stack)
        });
    },

    /** 處理新增文章 */
    createNewPost: function(req, res) {
        const { title, content, draft, category_id } = req.body
        // 先處理新增文章
        Post.create({
            title,
            content,
            draft
        }).then(data => {
            // 判斷單一分類或多項分類(陣列)
            if(Array.isArray(category_id)) {
                 // 利用 forEach 遍歷 tags 這個陣列
                 category_id.forEach(tag => {
                    Tax.create({
                        category_id: tag,
                        article_id: data.id
                    }).then(data=> {
                        console.log('dataByTag:', data)
                    }).catch(err => console.error(err.stack));
                });
            } else {
                Tax.create({
                    category_id,
                    article_id: data.id
                }).then(data=> {
                    console.log('dataByTag:', data)
                }).catch(err => console.error(err.stack));
            }
            res.redirect('/')
        }).catch(err => console.error(err.stack))
    },

    /** 刪除單篇文章 */
    postDelete: function(req, res) {
        user = req.session.username
        const { id } = req.params
        if(user) {
            Tax.destroy({
                where: {
                    article_id: id
                }
            }).then(delCategoriesCount => {
                console.log(`文章 ID 為 ${req.params.id} 的分類, 成功刪除 ${delCategoriesCount} 筆`)
                Comments.destroy({
                    where: {
                        article_id: id
                    }
                }).then(delCommentCount => {
                    console.log(`文章 ID 為 ${req.params.id} 的 Comments, 成功刪除 ${delCommentCount} 筆`)
                    Post.destroy({
                        where: {
                            id
                        }
                    }).then(delPostCount => {
                        console.log(`文章 ID 為 ${req.params.id}, 成功刪除 ${delPostCount} 筆`)
                        res.redirect('back')
                    }).catch(err => console.error(err.stack));
                }).catch(err => console.error(err.stack))
            }).catch(err => console.error(err.stack))
        } else {
            console.log('User Not Login!!!')
            res.redirect('/')
        }
    },

    /** 顯示編輯文章的頁面 */
    postEdit: function(req, res) {
        user = req.session.username
        const { id } = req.params
        if(!user) {
            res.redirect('/')
        } else {
            Post.findOne({
                where: {
                    id
                },
                raw: true
            }).then(postData => {
                Tag.findAll({
                    order: [['id', 'ASC']],
                    raw: true
                }).then(allTags => {
                    Tax.findAll({
                        attributes: ['category_id'],
                        where: {
                            article_id: id
                        },
                        raw: true
                    }).then(category_idObjInArray => {
                        // 將選過的分類 data 轉成 array
                        return category_idObjInArray.map(tag => tag.category_id)
                    }).then(allTagIdInArray => {
                        res.render('editPost', {
                            _:ejs_helpers,
                            allTags,
                            postData,
                            checkedTagArray: allTagIdInArray,
                            user: req.session.username,
                            title: '編輯文章'
                        })
                    }).catch(err => console.error(err.stack))
                }).catch(err => console.error(err.stack))
            }).catch(err => console.error(err.stack))
        }
    },

    /** 處理編輯文章的行為 */
    handlePostEdit: function(req, res) {
        user = req.session.username
        const { id } = req.body
        const categoriesUpdateData = req.body['category_id[]']
        if(!user || !categoriesUpdateData) {
            res.redirect('back')
        } else{
            Post.findOne({
                where: {
                    id: req.body.id
                },
                // attributes: ['id', 'title', 'content', 'draft'],
            }).then(postInstanceData => {
                // 取得文章資料，return 更新後，繼續往下執行
                return postInstanceData.update({
                    title: req.body.title,
                    content: req.body.content,
                    draft: req.body.draft
                })
            }).then(data => {
                return data.get()
            }).then(objectData => {
                Tax.destroy({
                    where: {
                        article_id: id
                    }
                }).then(data => {
                    console.log('已刪除 ', data, '筆分類。')
                })
                if(Array.isArray(categoriesUpdateData)) {
                    categoriesUpdateData.forEach(
                        function(category_id){
                            Tax.create({
                                article_id: id,
                                category_id:category_id
                            }).then(data => {
                                console.log('新增 id: ', data.article_id, '的文章, id: ', data.category_id , '的分類')
                            }).catch( err => console.error(err.stack))
                        })
                } else  {
                    Tax.create({
                        article_id: id,
                        category_id:categoriesUpdateData
                    }).then(data => {
                        console.log('新增 id: ', data.article_id, '的文章, id: ', data.category_id , '的分類')
                    }).catch(err => console.error(err.stack))
                }
                return objectData
            }).then(data => {
                res.redirect('./')
            }).catch(err => console.error(err.stack))
        }
    },

    /** 所有文章列表 */
    archives: function(req, res) {
        user = req.session.username;
        Post.findAll({
            where: { draft: 0 },
            attributes: ['created_at', 'title', 'id'],
            order: [['created_at', 'DESC']],
            raw: true //用了這個之後， moment() 沒有效果?
        }).then(postsList => {
            const posts = MomentFormat(postsList)
            res.render('archives', {
                posts,
                user,
                title: 'Archives'
            })
        }).catch(err => {
            console.error(err.stack)
        })
    },

    /** 顯示單篇文章 */
    posts: function(req, res) {
        user = req.session.username;
        const { id } = req.params

        // 透過 articles_id 撈其他資料(categories, comments)
        Post.findOne({
            where: {
                id
            },
            raw: true
        }).then(post => {
            // 取得文章的分類
            tagRawQuery = "SELECT c.name FROM categories c LEFT JOIN taxonomy t ON c.id=t.category_id WHERE t.article_id = ?";
            sequelize.query(tagRawQuery,{
                replacements: [id],
                type: sequelize.QueryTypes.SELECT
            }).then(categories => {

                console.log('這篇文章的分類選項：', categories, 'This is article ID:', id)
                commentsQuery = "SELECT * FROM comments WHERE article_id = ?";

                sequelize.query(commentsQuery,{
                    replacements: [id],
                    type: sequelize.QueryTypes.SELECT,
                    rew: true
                }).then(comments => {
                    comment = req.session.comment
                    const mdPost = markedAndMomentFormat(post)
                    const time =  mdPost.created_at
                    const content = mdPost.content
                    res.render('post', {
                        categories,
                        user,
                        id,
                        content,
                        title: post.title,
                        time: time,
                        postState: post.draft,
                        comments,
                        comment
                    })
                }).catch(err => console.error(err.stack))
            }).catch(err => console.error(err.stack))
        }).catch(err => console.error(err.stack))
    },

    /** 處理文章底下的留言 */
    comments: function(req, res) {
        comment = req.session.comment
        if(comment) { // 留言者已有暱稱，將 insert 的資料 name 換成使用者輸入的
            Comments.create({
                name: comment,
                content: req.body.content,
                article_id: req.body.article_id
            }).then(CommentsData => {
                req.session.comment = CommentsData.name
                res.redirect('back')
            }).catch(err => console.error(err.stack));
        } else {
            Comments.create(req.body).then(CommentsData => {
                req.session.comment = CommentsData.name // 留言者暱稱存入 session
                comment = req.session.comment
                res.redirect('back') // 重新導向回原本的地方
            }).catch(err => console.error(err.stack));
        }
    },

    /** 處理搜尋文章的行為 */
    searchPost: function(req ,res) {
        user = req.session.username;
        const keywords = req.query.q
        const query = "SELECT * FROM articles A WHERE draft=0 AND (title like CONCAT('%',?, '%') OR content like CONCAT('%',?, '%')) AND content NOT like CONCAT('%```',?, '%') ORDER BY created_at DESC"
        if(keywords) {
            sequelize.query(query,{
                replacements: [keywords, keywords, keywords],
                type: sequelize.QueryTypes.SELECT
            }).then(postsData => {
                // 將 postsData(array) 中的文章轉成 markdown
                const posts = markedAndMomentFormat(postsData)
                res.render('searchResult', {
                    user,
                    posts,
                    keywords,
                    count: posts.length,
                    title: 'Search Blog'
                })
            }).catch(err => console.error(err.stack))
        } else {
            res.redirect('back')
        }
    }

} //module.exports end