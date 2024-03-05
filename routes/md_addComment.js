// routes/addComment.js
const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const dbConfig = require('../dbConfig');
const session = require('express-session');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/', async (req, res) => {
    const postId = req.query.post_id; // postId 가져오기
    const userId = req.session.loggedInUserId;
    const username = req.session.loggedInUserName;
    const userRealName = req.session.loggedInUserRealName;
    res.render('md_addComment',{postId:postId, userId:userId, username:username, userRealName:userRealName});
});

// POST 요청 처리
router.post('/', async (req, res) => {
    // 로그인 여부 확인
    if (!req.session.loggedIn) {
        return res.redirect('/login'); // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    }

    const post_id = req.body.post_id;
    const author_id = req.session.loggedInUserId;
    const comment_id = req.body.comment_id;
    const { content } = req.body;

    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);

        // 댓글 추가
        await conn.execute(
            `insert into md_comments (id, post_id, author_id, content, parent_comment_id)
             values (md_comment_id_seq.nextval, :post_id, :author_id, :content, :parent_id)`, // parent_comment_id를 parent_id로 수정
            [post_id, author_id, content, comment_id]
        );

        await conn.commit();

        res.redirect(`/md_detailPost/${post_id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

module.exports = router;
