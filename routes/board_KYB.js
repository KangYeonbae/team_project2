// routes/addComment.js
const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');

const router = express.Router();
// GET 요청 처리
// 분리를 한 경우 호출한 쪽의 경로가 prefix 로 처리 되기 때문에
// 아래 별도로 router.get('/addComment' 하지 않아도 된다.
router.get('/boarkyb', async (req, res) => {
    let conn;

    const loggedInUserId = req.session.loggedInUserId;
    const loggedInUserName = req.session.loggedInUserName;
    const loggedInUserRealName = req.session.loggedInUserRealName;
    try{
        conn = await oracledb.getConnection(dbconfig);
        let result = await conn.execute(
            //execute : 오라클과  nodejs 상호작용시킬때 필요한 함수.
            `select cont`
        );
    }
});

// POST 요청 처리
router.post('/', async (req, res) => {
    // 로그인 여부 확인
});
module.exports = router;
