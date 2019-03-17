const { User, Post, AboutInfo } = require('../models/sequelize')

// 引入 utils - markdown, checkObjHaveValue
const { markedAndMomentFormat, checkObjHaveValue } = require('../public/utils')

// markdown
const marked = require('marked')

// password hash
const bcrypt = require('bcrypt');

module.exports = {

    index: function(req, res) {
        user = req.session.username
        Post.findAll({
            where:  {
                draft: 0
            },
            // 測試用 取消 content log 出來才不會太多資料
            // attributes: ['created_at', 'title', 'id'],
            order: [
                ['created_at', 'DESC']
            ],
            raw: true // 把撈出來的 instance 變成 object
        }).then(originPosts => {
            // 將撈出物件(post)中的文章轉成 markdown 
            const mdPosts = markedAndMomentFormat(originPosts)
            res.render('index', {
                user: user ? user : null,
                posts: mdPosts,
                title: 'enter3017sky Express Blog'
            })
        })

    },

    /** 登入與註冊的畫面 */
    login: function(req, res) {
        user = req.session.username;
        res.render('loginAndRegister', {
            user: user ? user : null,
            title: 'Login & Sign up',
        })
    },

    /** 處理登入 */
    handleLogin: function(req, res) {
        if(req.body.submit === 'login' && req.body.username !== '' && req.body.password !== '') {
            /**
             * 當使用者點擊 login 時，檢查 user 是否存在，然後取得 data.password(從 DB 拿到的資料 as hashPwd)
             *  bcrypt.compare(使用者輸入, hashPwd in DB, 做些啥)
            */
            User.findOne({
                where:{
                    username: req.body.username
                }
            }).then(data => {
                const hash = data.password;
                const myPlaintextPassword = req.body.password;
                bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
                    if(result === true) {
                        req.session.username = data.username
                        user = req.session.username
                        res.redirect('/')
                    } else {
                        console.log('帳號或密碼錯誤！！！')
                        res.redirect('/login')
                    }
                });
            }).catch(err => {
                console.log(password)
                console.error('******************** \n error Message: \n', err, '\n********************\n')
                console.log('帳號或密碼錯誤！')
                res.redirect('/login')
            });
        } else {
            console.log('是否忘記輸入什麼了？')
            res.redirect('/login')
        }
    },

    /** 處理註冊 */
    handleRegister: function(req, res) {

        const saltRounds = 10; // 加鹽的等級
        const myPlaintextPassword = req.body.password; // 使用者輸入的密碼
        // 點擊 "register" && req.body 都不為空才執行
        if(req.body.submit === 'register' && checkObjHaveValue(req.body) ) {
            // hash password -> store in DB
            bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
                if(!err) {
                    const insertValue = {
                        username: req.body.username,
                        password: hash,
                        email: req.body.email,
                    }
                    User.create(insertValue).then(() => {
                        req.session.username = req.body.username;
                        user = req.session.username
                        res.redirect('/')
                    }).catch((err) => {
                        console.log(err)
                    })
                } else {
                    console.log(err)
                }
            });
        } else {
            console.log('是否忘記輸入什麼了？')
            res.redirect('/login')
        }

    },

    /** 登出 */
    logout: function(req, res) {
        // 清除 session 後導去首頁
        req.session.destroy();
        res.redirect('/')
    },

    /** 關於我頁面 */
    about: function(req, res) {
        user = req.session.username;
        AboutInfo.findOne({
            where: {
                id: 1
            }
        }).then(aboutInst => {
            return aboutInst.get()
        }).then(data => {
            const aboutTextInfo = marked(data.introduction)
            res.render('about', {
                aboutTextInfo,
                user,
                title: 'About Me'
            })
        })

    },

}