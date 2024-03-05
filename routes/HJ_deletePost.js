// 삭제 처리
const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../dbconfig');

const router = express.Router();

router.get('/:id', async (req, res) => {
    // console.log(req.params.id)

    // 로그인 여부 확인
    if (!req.session.loggedIn) {
        return res.redirect('/login'); // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    }

    // 세션, URL(파라미터/쿼리), post의 경우 req.body 등등 데이터를 가져옵니다.
    const postId = req.params.id;
    const userId = req.session.loggedInUserId;
    const userName = req.session.loggedInUserName;
    const userRealName = req.session.loggedInUserRealName;

    // 1. 게시글을 삭제하기 전에, 게시글 내 댓글부터 모두 삭제합니다.
    const resultDeletdComments = await DeleteComments(postId)

    // 2. 댓글이 없는 게시글은 테이블 참조 관계가 사라졌으므로 안전하게 글을 삭제합니다.
    const resultDeletdPosts = await DeletePostst(postId)


    if (resultDeletdComments !== null && resultDeletdPosts !== null) {
        res.redirect(`/HJ_boardMain?id=${userId}&username=${userName}&name=${userRealName}`);
    } else {
        res.send("하.. 에러났나보다..")
    }
})

const DeleteComments = async (post_Id)=>{
    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);

        const sqlDeleteAllCommnetsInPost = `DELETE FROM Team1_comments WHERE post_id = ${post_Id}`
        const resultDeleteComments = await conn.execute(sqlDeleteAllCommnetsInPost)
        // await conn.commit();
        // console.log('댓글부터 골로 갔네요. '+ JSON.stringify(resultDeleteComments,null,2))

       return resultDeleteComments

    } catch (err) {
        console.error('댓글 삭제 중 오류 발생:', err);
        return null
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (err) {
                console.error('오라클 연결 종료 중 오류 발생:', err);
            }
        }
    }
}

const DeletePostst = async (post_Id)=>{
    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);

        const sqlDelteTargetPost =`DELETE FROM Team1_posts WHERE id = ${post_Id}`
        const resultDeletePosts = await conn.execute(sqlDelteTargetPost)
        // await conn.commit();
        // console.log('포스트 지웁니다. :'+ JSON.stringify(resultDeletePosts,null,2))

        return resultDeletePosts

    } catch (err) {
        console.error('게시글 삭제 중 오류 발생:', err);
        return null
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (err) {
                console.error('오라클 연결 종료 중 오류 발생:', err);
            }
        }
    }
}


module.exports = router;