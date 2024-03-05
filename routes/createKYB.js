// routes/addComment.js
const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');
const path = require("path");
const fs = require('fs');
const multer = require('multer');

const router = express.Router();
const UPLOADS_FOLDER = path.join(__dirname, '../','uploads');
const upload = multer({ dest: path.join(__dirname, 'temp'), encoding: 'utf8' });

router.get('/', (req, res) => {
    res.render('create_kyb', {
        userId: req.session.userId,
        username: req.session.username,
        userRealName: req.session.userRealName
    });
});

router.post('/', upload.array('files', 5), async (req, res) => {
    console.log('Debug: post create');
    const { title, content, class_post} = req.body; // Added class_post

    const convertedContent = content.replace(/\n/g, '<br>');

    const files = req.files.map(file => {
        return {
            originalName: file.originalname,
            storedName: file.filename
        };
    });
    const authorId = req.session.loggedInUserId;
    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);

        const result = await conn.execute(
            `SELECT notice_id_seq.NEXTVAL FROM DUAL`
        );

        const noticeId = result.rows[0][0];
        console.log(authorId)
        await conn.execute(
            `INSERT INTO notice (id, author_id,class_post, title, content, file_original_name, file_stored_name)
             VALUES (:id, :author_id, :class_post, :title, :content, :file_original_name, :file_stored_name)`,
            {
                id: noticeId,
                author_id: authorId,
                class_post: class_post, // Used class_post from req.body
                title: title,
                content: convertedContent,
                file_original_name: files.map(file => file.originalName).join(';'),
                file_stored_name: files.map(file => file.storedName).join(';')
            });
        // 변경 사항 커밋
        await conn.commit();

        // for (개별 요소 of 전체요소) : 전체 요소를 순회할 때 향상된 for문
        for (const file of req.files) {
            const tempFilePath = file.path;
            const targetFilePath = path.join(UPLOADS_FOLDER, file.filename);
            fs.renameSync(tempFilePath, targetFilePath);
        }


        // 게시글 작성 후 게시판 메인 페이지로 리다이렉트
        res.redirect('/boardkyb');
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
