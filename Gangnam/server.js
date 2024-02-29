const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 3000;



// 기본 미들웨어 장착
const WEB_SERVER_HOME = 'C:\\HJBae\\Util\\nginx-1.24.0\\html';
app.use('/', express.static(WEB_SERVER_HOME+ '/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
oracledb.initOracleClient({ libDir: 'C:\\instantclient_21_13' });
oracledb.autoCommit = true;

app.use('/boardMain', require('./routes/boardMain2')); //게시판 메인 페이지 렌더링
app.use('/addComment', require('./routes/addComment2')); //댓글 페이지 렌더링
app.use('/login', require('./routes/login2')); // 로그인 처리
app.use('/loginFail', require('./routes/loginFail2')); // 로그인 실패 처리
app.use('/logout', require('./routes/logout2')); // 로그아웃 처리
app.use('/create', require('./routes/create2')); // 글 작성 페이지 렌더링
app.use('/detailPost', require('./routes/detailPost2')); // 상세 페이지 렌더링
app.use('/editPost', require('./routes/editPost2')); // 수정 페이지 렌더링
app.use('/deletePost', require('./routes/deletePost2')); // 삭제 처리
// app.use('/deleteComment', require('./routes/deleteComment2')); // 댓글 삭제 처리
// app.use('/editComment', require('./routes/editComment2')); // 댓글 수정 엔드포인트 추가

// 게시판 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/boardMain`);
});
