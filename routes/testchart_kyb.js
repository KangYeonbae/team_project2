// routes/addComment.js
const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');

const router = express.Router();
// GET 요청 처리
// 분리를 한 경우 호출한 쪽의 경로가 prefix 로 처리 되기 때문에
// 아래 별도로 router.get('/addComment' 하지 않아도 된다.
router.get('/', async (req, res) => {
    let conn;

    const loggedInUserId = req.session.loggedInUserId;
    const loggedInUserName = req.session.loggedInUserName;
    const loggedInUserRealName = req.session.loggedInUserRealName;

    res.render('kybTest', {
        userId: loggedInUserId,
        username: loggedInUserName,
        userRealName: loggedInUserRealName,
    });

});

// POST 요청 처리

module.exports = router;
