const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');

const router = express.Router();

router.get('/:id', async (req, res) => {
    // 로그인 여부 확인
    if (!req.session.loggedIn) {
        return res.redirect('/login'); // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    }
    console.log("params : "+JSON.stringify(req.params))
    console.log("query : "+JSON.stringify(req.query))

    const postId = req.params.id;
    const userId = req.session.loggedInUserId;
    const userName = req.session.loggedInUserName;
    const userRealName = req.session.loggedInUserRealName;
    console.log(`username: ${userName}`);
    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);

        // 조회수 증가 처리
        console.log(postId)
        await conn.execute(
            `UPDATE requirement_posts SET views = views + 1 WHERE id = :id`,
            [postId]
        );

        console.log('여기옴')
        // 변경 사항을 커밋
        await conn.commit();

        // 게시글 정보 가져오기
        const requirement_postResult = await conn.execute(
            `SELECT p.id, p.title, u.username AS author, p.content, TO_CHAR(p.created_at, 'YYYY-MM-DD') AS created_at,
                    p.views, p.likes, p.file_original_name, p.file_stored_name
            FROM requirement_posts p
            JOIN team_users u ON p.author_id = u.id
            WHERE p.id = :id`,
            [postId],
            { fetchInfo: { CONTENT: { type: oracledb.STRING } } }
        );

        console.log('여기옴2')
        // 댓글 가져오기
        const commentResult = await conn.execute(
            `SELECT c.id,c.author_id, c.content, u.username AS author, TO_CHAR(c.created_at, 'YYYY-MM-DD') AS created_at, c.parent_comment_id 
            FROM requirement_comments c
            JOIN team_users u ON c.author_id = u.id
            WHERE c.post_id = :id
            ORDER BY c.id`,
            [postId],
            { fetchInfo: { CONTENT: { type: oracledb.STRING } } }
        );

        console.log('여기옴3')
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
                // isAuthor: row[1] === userId // 댓글 작성자가 현재 로그인한 사용자인지 확인
            };
            console.log(JSON.stringify(comment))

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
        // console.log(postResult.rows[0]);
        const post = {
            id: requirement_postResult.rows[0][0],
            title: requirement_postResult.rows[0][1],
            author: requirement_postResult.rows[0][2],
            content: requirement_postResult.rows[0][3],
            created_at: requirement_postResult.rows[0][4],
            views: requirement_postResult.rows[0][5],
            likes: requirement_postResult.rows[0][6],
            file_original_name: requirement_postResult.rows[0][7],
            file_stored_name: requirement_postResult.rows[0][8]
        };
        console.log(`post: ${post}, comments: ${comments}`);
        console.log(`id: ${requirement_postResult.rows[0][0]}, content: ${requirement_postResult.rows[0][2]},
         login username: ${userName} login userRealName: ${userRealName}`);

        // console.log(`post: ${post}, comments: ${comments}, content: ${requirement_postResult.rows[0][2]}`);
        res.render('detailPost', {
            post: post,
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


module.exports = router;