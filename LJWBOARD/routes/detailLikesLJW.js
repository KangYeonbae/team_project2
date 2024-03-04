const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');

const router = express.Router();




router.post('/:id/:likes', async (req, res) => {
    // 로그인 여부 확인
    if (!req.session.loggedIn) {
        return res.status(401).send('로그인이 필요한 기능입니다.');
    }
   console.log('detailLikes')
    const postId = req.params.id;
    const userId = req.session.loggedInUserId;
    let conn;

    try {
        conn = await oracledb.getConnection(dbConfig);

        // 좋아요 중복 확인 로직
        const result = await conn.execute(
            `SELECT COUNT(*) FROM post_likes WHERE user_id = :userId AND post_id = :postId`,
            { userId, postId },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        console.log('detailLikes2')
        if (result.rows[0]['COUNT(*)'] === 0) {
            // 좋아요 추가
            await conn.execute(
                `INSERT INTO post_likes (user_id, post_id) VALUES (:userId, :postId)`,
                { userId, postId }
            );
            console.log('detailLikes3')
            // 좋아요 수 업데이트
            await conn.execute(
                `UPDATE requirement_posts SET likes = likes + 1 WHERE id = :postId`,
                { postId }
            );

            await conn.commit();
            res.send('좋아요를 성공적으로 등록했습니다.');
        } else {
            res.status(409).send('이미 좋아요를 눌렀습니다.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('내부 서버 오류');
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