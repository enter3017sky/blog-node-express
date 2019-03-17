# enter3017sky Express Blog

用 Express(Node.js) 實作個人 Blog ，藉此熟悉後端操作。

![Imgur](https://i.imgur.com/YqjYSWm.gif)

### Blog 結構

```
- 首頁: 顯示所有文章
    |
    *- Archives - 顯示所有文章標題(除了草稿)
    *- Categories - 顯示所有分類以及文章數量
    |       |
    |       *- 選擇某一分類的文章
    |---- About - 關於我
    |---- Admin - 使用者登入
    |       |
    |       *- 文章管理
    |       *- 分類管理
    |       *- 新增文章
    |       *- 新增分類
    |       *- 編輯關於我
    *- 登入/登出
```

---

### 目的

- 透過 Node.js、express 學習後端的概念，以及練習 JavaScript。
- 透過 Sequelize 學習 ORM 架構。
- 基礎的 MVC 架構。

### 功能描述

- 可使用 markdown 撰寫文章。
- 單一文章選擇多項分類。
- 可設定分佈或草稿的狀態。
- 使用者透過 session 機制登入。
- 密碼經過 hash 處理。

### 工具

- AWE EC2
- Nginx
- Express
- Sequelize
- Bootstrap
- EJS
- MySQL
