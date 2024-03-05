// signup.js
const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');
const session = require('express-session');

const router = express.Router();


// signup.js 내에 추가

// 회원가입 폼을 렌더링하는 라우트
router.get('/', (req, res) => {
    res.render('signup');
});






// 기존 회원가입 요청을 처리하는 라우트 코드
router.post('/', async (req, res) => {
    const { nickname, username, password, name } = req.body;
   let conn;
    try {
        const conn = await oracledb.getConnection(dbConfig);
        const result = await conn.execute(
            `INSERT INTO users (ID, USERNAME, PASSWORD, NAME, NICKNAME) VALUES (users_seq.NEXTVAL, :username, :password, :name, :nickname) RETURNING ID INTO :id`,
            {
                nickname,
                username,
                password,
                name,
                id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            },
            { autoCommit: true }
        );

        if (result.rowsAffected === 1) {
            // 회원가입 성공 후, 사용자 세션에 로그인 정보 추가
            const user = { // 이 부분은 데이터베이스의 실제 응답에 따라 조정해야 합니다.
                id: result.outBinds.id[0],
                username: username,
                name: name,
                nickname: nickname
            };

            // 세션에 사용자 정보 저장
            req.session.loggedIn = true;
            req.session.user = user;

            // 로그인 후 화면으로 리디렉션
            res.redirect('/boardLJW');
        } else {
            // 회원가입에 실패한 경우
            res.status(400).send('회원가입에 실패했습니다.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('회원가입 중 오류가 발생했습니다.');
    } finally {
        if (conn) {
            await conn.close();
        }
    }
});
module.exports = router;