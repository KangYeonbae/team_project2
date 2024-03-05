// routes/addComment.js
const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');

const router = express.Router();

router.get('/:id', async (req, res) => {
    // 로그인 여부 확인
    if (!req.session.loggedIn) {
        return res.redirect('/login'); // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    }

    const postId = req.params.id;
    const userId = req.session.loggedInUserId;
    const userName = req.session.loggedInUserName;
    const userRealName = req.session.loggedInUserRealName;
    console.log(`username: ${userName}`);
    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);

        // 조회수 증가 처리
        await conn.execute(
            `update md_posts set views = views + 1 where id = :id`,
            [postId]
        );

        // 변경 사항을 커밋
        await conn.commit();

        // 게시글 정보 가져오기
        const postResult = await conn.execute(
            `select p.id, p.category, p.title, u.username as author, p.content, to_char(p.created_at, 'YYYY-MM-DD') as created_at, p.views,
                    p.likes, p.file_original_name, p.file_stored_name
            from md_posts p
                join users u on p.author_id = u.id
            where p.id = :id`,
            [postId],
            { fetchInfo: { CONTENT: { type: oracledb.STRING } } }
        );

        // 댓글 가져오기
        // 댓글의 작성자 username을 구하기 위해 users 테이블과 조인한다.
        const commentResult = await conn.execute(
            `select c.id, c.author_id, c.content, u.username as author, to_char(c.created_at, 'YYYY-MM-DD HH:MM') as created_at, c.parent_comment_id
            from md_comments c
            join users u on c.author_id = u.id
            where c.post_id = :id
            order by c.id`,
            [postId],
            { fetchInfo: { CONTENT: { type: oracledb.STRING } } }
        );

        // 댓글과 댓글의 답글을 구성하기 위한 사용자 정의 자료구조 생성
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

            if (parentId === null ) {
                // 부모 댓글이 null이면 바로 댓글 배열에 추가
                comments.push(comment);
                commentMap.set(comment.id, comment); // 맵에 추가
            } else {
                // 부모 댓글이 있는 경우 부모 댓글을 찾아서 자식 댓글 배열에 추가
                const parentComment = commentMap.get(parentId);
                parentComment.children.push(comment);
            }
        });
        const md_posts = {
            id: postResult.rows[0][0],
            category: postResult.rows[0][1],
            title: postResult.rows[0][2],
            author: postResult.rows[0][3],
            content: postResult.rows[0][4],
            created_at: postResult.rows[0][5],
            views: postResult.rows[0][6],
            likes: postResult.rows[0][7],
            file_original_name: postResult.rows[0][8],
            file_stored_name: postResult.rows[0][9]
        };
        res.render('md_detailPost', {
            md_posts: md_posts,
            post: postId,
            userId: userId,
            userName: userName,
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