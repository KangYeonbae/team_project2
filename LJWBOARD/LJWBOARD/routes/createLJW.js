const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');
const path = require("path");
const fs = require("fs");
const multer = require('multer');
const router = express.Router();
const WEB_SERVER_HOME = 'C:\\JWLEE\\Util\\nginx-1.24.0\\html';
const UPLOADS_FOLDER = path.join(WEB_SERVER_HOME,'uploads');
const upload = multer({ dest: path.join(__dirname, 'temp'), encoding: 'utf8' });
router.get('/', async (req, res) => {
    // 로그인 여부 확인 로직 작성
    res.render('createLJW', {
        userId: req.session.userId,
        username: req.session.username,
        userRealName: req.session.userRealName
    });
});

router.post('/',upload.array('files',5), async (req, res) => {
    console.log('Debug: post create');
    const { title, content } = req.body;
    const files = req.files.map(file => {
        return {
            originalName: file.originalname,
            storedName: file.filename
        };
    });
    const authorId = req.session.loggedInUserId; // 현재 로그인한 사용자의 ID
    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);

        // 게시글을 위한 시퀀스에서 새로운 ID 가져오기
        const result = await conn.execute(
            `SELECT requirement_posts_id_seq.NEXTVAL FROM DUAL`
        );
        const postId = result.rows[0][0];
        console.log(JSON.stringify({postId, authorId, title, content}))
        // 게시글 삽입
        await conn.execute(
            `INSERT INTO requirement_posts (id, author_id, title, content, file_original_name, file_stored_name) 
             VALUES (:id, :authorId, :title, :content,:file_original_name, :file_stored_name)`,
            {
                id: postId,
                authorId: authorId,
                title: title,
                content: content,
                file_original_name: files.map(file => file.originalName).join(';'), // 파일의 원본 이름을 세미콜론으로 구분하여 저장
                file_stored_name: files.map(file => file.storedName).join(';') // 파일의 변환된 이름을 세미콜론으로 구분하여 저장
            }
        );

        // 변경 사항 커밋
        await conn.commit();

        for (const file of req.files) {
            const tempFilePath = file.path;
            const targetFilePath = path.join(UPLOADS_FOLDER, file.filename);
            fs.renameSync(tempFilePath, targetFilePath);
        }

        // 게시글 작성 후 게시판 메인 페이지로 리다이렉트
        res.redirect('/boardLJW');
    } catch (err) {
        console.error('글 작성 중 오류 발생:', err);
        res.status(500).send('글 작성 중 오류가 발생했습니다.');
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