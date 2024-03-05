// 수정 페이지 렌더링
const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../dbconfig');

const router = express.Router();

router.get('/:id', async (req, res) => {
// 로그인 여부 확인
    if (!req.session.loggedIn) {
        return res.redirect('/login'); // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    }

    const postId = req.params.id;
    const userId = req.params.Team1_id;
    const userName = req.query.username;
    const userRealName = req.query.Team1_realname;
    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);

        // 게시글 정보 가져오기
        const result = await conn.execute(
            `SELECT * FROM Team1_posts WHERE id = :id`,
            [postId],
            { fetchInfo: { CONTENT: { type: oracledb.STRING } } }
        );

        const post = {
            id: result.rows[0][0],
            title: result.rows[0][2],
            content: result.rows[0][3]
        };
        console.log(post.id);

        res.render('HJ_editPost', {
            post: post,
            userId: userId,
            username: userName,
            userRealName: userRealName
        });
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

// POST 요청 처리
router.post('/:id', async (req, res) => {
    const {postId, title, content } = req.body;
    // const postId = req.params.id;

    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);

        console.log("editPost :" + postId);

        // 게시글 수정
        await conn.execute(
            `UPDATE Team1_posts SET title = :title, content = :content WHERE id = :id`,
            [title, content, postId]
        );

        // 변경 사항 커밋
        await conn.commit();

        // 수정 후 상세 페이지로 리다이렉트
        res.redirect(`/HJ_detailPost/${postId}?user_id=${req.session.userId}&username=${req.session.username}&user_realname=${req.session.userRealName}`);
    } catch (err) {
        console.error('게시글 수정 중 오류 발생:', err);
        res.status(500).send('게시글 수정 중 오류가 발생했습니다.');
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (err) {
                console.error('오라클 연결 종료 중 오류 발생:', err);
            }
        }
    }
});

module.exports = router;
