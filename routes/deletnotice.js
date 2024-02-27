// routes/addComment.js
const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');

const router = express.Router();
// GET 요청 처리
// 분리를 한 경우 호출한 쪽의 경로가 prefix 로 처리 되기 때문에
// 아래 별도로 router.get('/addComment' 하지 않아도 된다.
router.get('/:id', async (req, res) => {
    if (!req.session.loggedIn){
        return res.redirect('/login');
    }

    const noticeId = req.params.id;
    const userId = req.session.loggedInUserId;
    const username = req.session.loggedInUserName;
    const userRealName = req.session.loggedInUserRealName;

    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);

        console.log('여기옴1')

        await conn.execute(
            `DELETE FROM notice WHERE id = :noticeId AND author_id = :userId`,
            { noticeId, userId }
        );

        console.log('여기옴2')

        await conn.commit();

        await conn.execute(
            'DELETE FROM notice WHERE id = :noticeId',
            { noticeId: parseInt(noticeId) }
        );
        await conn.commit();
        res.redirect(`/boardkyb?id=${userId}&username=${username}&name=${userRealName}`);
    } catch (err) {
        console.error('게시글 삭제 중 오류 발생:', err);
        res.status(500).send('게시글 삭제 중 오류가 발생했습니다.');
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
