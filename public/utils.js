
const marked = require('marked')
const moment = require('moment')

module.exports = {

    markedAndMomentFormat: function (arr) {
        if(Array.isArray(arr)) {
            for(let i = 0, len = arr.length; i < len; i++) {
                if(arr[i]['content']) {
                    arr[i]['content'] = marked(arr[i]['content'])
                }
                if(arr[i]['created_at']) {
                    arr[i]['created_at'] = moment(arr[i]['created_at']).format("dddd, MMM DD YYYY")
                }
            }
        } else {
            arr['content'] = marked(arr['content'])
            arr['created_at'] = moment(arr['created_at']).format("dddd, MMM DD YYYY")
        }
        return arr
    },

    MomentFormat: function (arr) {
        for(let i = 0, len = arr.length; i < len; i++) {
            arr[i]['created_at'] = moment(arr[i]['created_at']).format("MMM DD")
        }
        return arr
    },

            // 檢查 req.body(使用者輸入的值) 是否都有值
        // req.body: { username: '', password: '', email: '', submit: 'register' }
    checkObjHaveValue: function(object) {
        for (var key in object) {
            if (object[key] === '') {
                return false
            }
        }
        return true;
    }

}