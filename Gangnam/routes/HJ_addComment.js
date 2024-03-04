// 댓글 페이지 렌더링
// routes/HJ_addComment.js
const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../HJ_dbconfig');

const router = express.Router();

router.get('/', (req, res) => {
    const postId = req.query.post_id; // postId 가져오기
    const userId = req.session.loggedInUserId;
    const username = req.session.loggedInUserName;
    const userRealName = req.session.loggedInUserRealName;
    res.render('HJ_addComment',{postId: postId, userId:userId, userName:username, userRealName:userRealName});
});
// console.log(post_id);
// POST 요청 처리
router.post('/', async (req, res) => {
    // 로그인 여부 확인
    if (!req.session.loggedIn) {
        return res.redirect('/login'); // 로그인되지 않은 경우 로그인 페이지로 리다이렉트게시판 댓글
    }

    // const post_id  = req.query.post_id;
    // const author_id = req.session.loggedInUserId;
    // const { post_id, author_id } = req.query;
    const { content, post_id, author_id } = req.body;
    // const commentId = req.body.comment_id; // req.body에서 comment_id를 가져옴
    // const { content } = req.body;

    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);

        console.log("post_id", post_id);
        console.log("author_id", author_id);
        console.log("content", content);

        // 댓글 추가
        await conn.execute(
            `INSERT INTO Team1_comments (id, post_id, author_id, content) VALUES (Team1_comment_id_seq.nextval, :post_id, :author_id, :content)`, // parend_id를 parent_id로 수정
            [post_id, author_id, content]
        );
        // console.log(comment_id);
        // await conn.commit();

        res.redirect(`/HJ_detailPost/${post_id}`);
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
