// 로그인 실패 처리
const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../HJ_dbconfig');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('/HJ_loginFail');
});

// POST 요청 처리
router.post('/', async (req, res) => {

});

module.exports = router;
