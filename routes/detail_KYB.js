// routes/addComment.js
const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');

const router = express.Router();
// GET 요청 처리
// 분리를 한 경우 호출한 쪽의 경로가 prefix 로 처리 되기 때문에
// 아래 별도로 router.get('/addComment' 하지 않아도 된다.
router.get('/:id', async (req, res) => {
    if (!req.session.loggedIn) {
        return res.redirect('/login'); // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    }

    const noticeId = req.params.id;
    const userId = req.session.loggedInUserId;
    const userName = req.session.loggedInUserName;
    const userRealName = req.session.loggedInUserRealName;
    console.log(`username: ${userName}`);
    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);
        console.log('여기옴1'+noticeId)
        // 조회수 증가 처리
        await conn.execute(
            `UPDATE notice SET views = views + 1 WHERE id = :id`,
            {'id':noticeId}
        );
        console.log('여기옴2')

        // 게시글 정보 가져오기
        const noticeResult = await conn.execute(
            `SELECT n.id, n.title, u.username AS author, n.content, TO_CHAR(n.created_at, 'YYYY-MM-DD') AS created_at, n.views, n.class_post
             FROM notice n
                      JOIN users u ON n.author_id = u.id
             WHERE n.id = :id`,
            [noticeId],
            { fetchInfo: { CONTENT: { type: oracledb.STRING } } }
        );
        console.log('noticeId ' + noticeId)
        console.log('noticeResult '+ JSON.stringify(noticeResult))

        // 댓글 가져오기
        const commentResult = await conn.execute(
            `SELECT c.id, c.author_id, c.content, u.username AS author, TO_CHAR(c.created_at, 'YYYY-MM-DD HH:MM') AS created_at, c.parent_comment_id 
            FROM notice_comments c
            JOIN users u ON c.author_id = u.id
            WHERE c.post_id = :id
            ORDER BY c.id`,
            [noticeId],
            { fetchInfo: { CONTENT: { type: oracledb.STRING } } }
        );

        // 댓글과 댓글의 댓글을 구성
        const comments = [];
        const commentMap = new Map(); // 댓글의 id를 key로 하여 댓글을 맵으로 저장

        commentResult.rows.forEach(row => {
            const comment = {
                id: row[0],
                author_id: row[1],
                content: row[2],
                author: row[3],
                created_at: row[4],
                children: [], // 자식 댓글을 저장할 배열
            };

            const parentId = row[5]; // 부모 댓글의 id

            if (parentId === null) {
                // 부모 댓글이 null이면 바로 댓글 배열에 추가
                comments.push(comment);
                commentMap.set(comment.id, comment); // 맵에 추가
            } else {
                // 부모 댓글이 있는 경우 부모 댓글을 찾아서 자식 댓글 배열에 추가
                const parentComment = commentMap.get(parentId);
                parentComment.children.push(comment);
            }
        });
        console.table(noticeResult.rows)
        const notice = {
            id: noticeResult.rows[0][0],
            title: noticeResult.rows[0][1],
            username: noticeResult.rows[0][2],
            content: noticeResult.rows[0][3],
            created_at: noticeResult.rows[0][4],
            views:noticeResult.rows[0][5],
            class_post : noticeResult.rows[0][6],
        };

        console.log(`notice: ${notice}, comments: ${comments}`);
        console.log(`id: ${noticeResult.rows[0][0]}, content: ${noticeResult.rows[0][2]},
         login username: ${userName} login userRealName: ${userRealName}`);

        res.render('boarDetailkyb', {
            notice: notice,
            userId: userId,
            username: userName,
            userRealName: userRealName,
            comments: comments
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

// // POST 요청 처리
// router.post('/', async (req, res) => {
//     // 로그인 여부 확인
// });
module.exports = router;
