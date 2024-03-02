const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const session = require('express-session');
const {redirect} = require("server/reply");
const multer = require('multer');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
const WEB_SERVER_HOME = 'C:\\JWLEE\\Util\\nginx-1.24.0\\html';
app.use('/', express.static(WEB_SERVER_HOME+ '/'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

const dbConfig = {
    user: 'open_source',
    password: '1111',
    connectString: '192.168.0.3:1521/xe'
};

oracledb.initOracleClient({ libDir: '../../../instantclient_21_13' });
oracledb.autoCommit = true;

app.use(session({
    secret: 'mySecretKey', // 세션을 암호화하기 위한 임의의 키
    resave: false,
    saveUninitialized: true,
}));

//
app.use('/editComLJW', require('./routes/editComLJW'));  // 댓글 수정
app.use('/addComment', require('./routes/addComment'));  // 댓글 추가.
app.use('/boardMain', require('./routes/boardMain'));   // 게시판 화면
app.use('/create', require('./routes/create'));  // 글쓰기
app.use('/deletePost', require('./routes/deletePost'));  // 글삭제
app.use('/detailPost', require('./routes/detailPost'));  // 글 상세페이지
app.use('/editPost', require('./routes/editPost'));  // 글 수정
app.use('/login', require('./routes/login'));  // 로그인
app.use('/loginFail', require('./routes/loginFail'));   //  로그인실패
app.use('/logout', require('./routes/logout'));   // 로그아웃
app.use('/deleteComment', require('./routes/deleteComment'));   // 댓글 삭제
// 게시판 메인 페이지 렌더링
//


// 게시판 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/boardMain`);
});
