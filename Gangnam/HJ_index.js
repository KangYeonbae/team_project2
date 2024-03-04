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

app.use('/HJ_boardMain', require('./routes/HJ_boardMain')); //게시판 메인 페이지 렌더링
app.use('/HJ_addComment', require('./routes/HJ_addComment')); //댓글 페이지 렌더링
app.use('/login', require('./routes/HJ_login')); // 로그인 처리
app.use('/HJ_loginFail', require('./routes/HJ_loginFail')); // 로그인 실패 처리
app.use('/HJ_logout', require('./routes/HJ_logout')); // 로그아웃 처리
app.use('/HJ_create', require('./routes/HJ_create')); // 글 작성 페이지 렌더링
app.use('/HJ_detailPost', require('./routes/HJ_detailPost')); // 상세 페이지 렌더링
app.use('/HJ_editPost', require('./routes/HJ_editPost')); // 수정 페이지 렌더링
app.use('/HJ_deletePost', require('./routes/HJ_deletePost')); // 삭제 처리
app.use('/HJ_deleteComment', require('./routes/HJ_deleteComment')); // 댓글 삭제 처리
app.use('/HJ_editComment', require('./routes/HJ_editComment')); // 댓글 수정 엔드포인트 추가

// 게시판 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/HJ_boardMain`);
});
