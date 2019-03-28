
const express = require('express');
const app = express();
const session = require('express-session');

// 解析 req.body
const bodyParser = require('body-parser');

// 解析 application/json, 將 request 進來的 data 轉成 json()
app.use(bodyParser.json());

// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false}));

const userController = require('./controller/user');
const postController = require('./controller/post')
const adminController = require('./controller/admin')
const tagController = require('./controller/tags')

// const api = require('./controller/api')

app.set('view engine', 'ejs');

app.use(session({
    name: 'Blog-Username',
    secret:'blog',
    saveUninitialized: false,  // 是否是自動保存未初始化的 session 建議 false
    resave: false,  // 是否每次都重新保存 session，建議 false
    cookie: {
        maxAge: 24*60*60*30*1000
    }
}))

app.use(express.static('public'))
app.use(express.static(__dirname + '/node_modules/jquery/dist/'))


    /** 首頁 */
app.get('/', userController.index)

    /** 顯示登入與註冊會員的頁面 */
app.get('/login', userController.login)

    /** 處理的登入的行為 */
app.post('/handle-login', userController.handleLogin)

    /** 處理註冊的行為 */
app.post('/handle-register', userController.handleRegister)

    /** 處理登出的行為 */
app.get('/logout', userController.logout)

    /** 顯示關於我的畫面 */
app.get('/about', userController.about)

    /** 搜尋文章 */
app.get('/search', postController.searchPost)


    /** 管理文章(顯示所有文章(包括草稿)) */
app.get('/admin/archives', adminController.archivesAdmin)

    /** 管理分類 */
app.get('/admin/categories', adminController.categoriesAdmin)



    /** 顯示所有文章(除了草稿) */
app.get('/archives', postController.archives)

    /** 顯示單篇文章 */
app.get('/posts/:id', postController.posts)

    /** 刪除單篇文章 */
app.get('/posts/:id/delete', postController.postDelete)

    /** 刪除單篇文章 */
app.get('/posts/:id/delete', postController.postDelete)

    /** 顯示新增文章的畫面 */
app.get('/posts', postController.newPost)

    /** 處理創建文章的行為 */
app.post('/posts', postController.createNewPost)

    /** 顯示編輯文章的畫面 */
app.get('/posts/:id/edit', postController.postEdit)

    /** 處理編輯文章 */
app.post('/posts/:id/edit', postController.handlePostEdit)

    /** 文章底下的評論 */
app.post('/comments', postController.comments)


    /** 顯示新增分類的行為 */
app.get('/category', tagController.newTag)

    /** 顯示所有分類 */
app.get('/categories', tagController.categories)

    /** 顯示某分類底下的文章 */
app.get('/categories/:tagName', tagController.getPostByTagName)

    /** 顯示編輯分類 */
app.get('/category/:id/edit', tagController.tagNameEdit)

    /** 處理編輯分類 */
app.post('/category/:id/edit', tagController.handleTagNameEdit)

    /** 處理刪除分類 */
app.get('/category/:id/delete', tagController.handleTagNameDelete)

    /** 處理創建分類的行為 */
app.post('/category', tagController.createNewTag)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server has started on ${PORT}!`))