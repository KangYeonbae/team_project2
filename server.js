const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
// const cookieParser = require('cookie-parser');
const oracledb = require("oracledb");
// const fs = require('fs');

// app.use(cookieParser());

oracledb.initOracleClient({ libDir: 'D:\\instantclient_21_13' });
oracledb.autoCommit = true;

const port = 3000;

app.set('view engine', 'ejs');
const WEB_SERVER_HOME = 'C:\\KYB\\Util\\nginx-1.24.0\\html';

app.use(express.static(__dirname)); // 서버를 구동시켰을 때 기준되는 폴더 구조 :(__dirname) > 현재 폴더 : index.html을 기본으로 잡아줌

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// Oracle 데이터베이스 연결 설정
const dbConfig = {
    user: 'open_source',
    password: '1111',
    connectString: 'localhost:1521/xe'
};


app.use(session({
    secret: 'mySecretKey', // 세션을 암호화하기 위한 임의의 키
    resave: false,
    saveUninitialized: true,
}));

app.get('/main', async (req, res) => {
    const loggedInUserId = req.session.loggedInUserId;
    const loggedInUserName = req.session.loggedInUserName;
    const loggedInUserRealName = req.session.loggedInUserRealName;
    res.render('main',{ userId: loggedInUserId,
        username: loggedInUserName,
        userRealName: loggedInUserRealName,});
});



app.get('/video', async (req, res) => {
    const loggedInUserId = req.session.loggedInUserId;
    const loggedInUserName = req.session.loggedInUserName;
    const loggedInUserRealName = req.session.loggedInUserRealName;
    res.render('video',{ userId: loggedInUserId,
        username: loggedInUserName,
        userRealName: loggedInUserRealName,});
});


app.get('/Myeong-dong', async (req, res) => {
    const loggedInUserId = req.session.loggedInUserId;
    const loggedInUserName = req.session.loggedInUserName;
    const loggedInUserRealName = req.session.loggedInUserRealName;
    res.render('Myeong-dong',{ userId: loggedInUserId,
        username: loggedInUserName,
        userRealName: loggedInUserRealName,});
});


app.get('/gangnam', async (req, res) => {
    const loggedInUserId = req.session.loggedInUserId;
    const loggedInUserName = req.session.loggedInUserName;
    const loggedInUserRealName = req.session.loggedInUserRealName;
    res.render('gangnam',{ userId: loggedInUserId,
                                       username: loggedInUserName,
                                       userRealName: loggedInUserRealName,});
    });


// 라우팅 설정
app.use('/login', require('./routes/login'));  // 로그인페이지 연결
app.use('/logout', require('./routes/logout')); // 로그아웃페이지
app.use('/subway', require('./routes/subwaychart_kyb')); // 차트페이지
app.use('/chartKYB', require('./routes/chartKYB'));  // 강연배 차트페이지 연결
app.use('/total', require('./routes/totaltop12')); // 재우님 차트페이지연결
app.use('/sliedChart', require('./routes/slideTest_chartKYB')); //슬라이드바 되어져있는 차트페이지
app.use('/boardkyb', require('./routes/board_KYB'));// // 강연배 게시판메인페이지
app.use('/boarDetailkyb', require('./routes/detail_KYB')); //강연베 게시판 세부내용페이지
app.use('/create_kyb', require('./routes/createKYB')); //강연배 게시글작성페이지
app.use('/deletnotice', require('./routes/deletnotice')); //강연배 글삭제페이지
app.use('/editKYB', require('./routes/editKYB')); //강연배 글수정
app.use('/addComment', require('./routes/commentKYB')); //강연배 덧글
app.use('/deleteComKYB', require('./routes/deleteComKYB')) //강연배 덧글 삭제
app.use('/editComKYB', require('./routes/editComKYB')) //강연배 덧글 수정
app.use('/testchart_kyb', require('./routes/testchart_kyb')) //강연배 덧글 수
app.use('/signup', require('./routes/signup'))//이재우님 회원가입


app.use('/totalKYB', require('./routes/totalKYB'))


app.use('/detailLikesLJW', require('./routes/detailLikesLJW'));  // 좋아요 추가
app.use('/editComLJW', require('./routes/editComLJW'));  // 댓글 수정
app.use('/addComLJW', require('./routes/addComLJW'));  // 댓글 추가를 불러옵니다.
app.use('/boardLJW', require('./routes/boardLJW'));   // 게시판 화면
app.use('/createLJW', require('./routes/createLJW'));  // 글쓰기
app.use('/deletePostLJW', require('./routes/deletePostLJW'));  // 글삭제
app.use('/detailPostLJW', require('./routes/detailPostLJW'));  // 글 상세페이지
app.use('/editPostLJW', require('./routes/editPostLJW'));  // 글 수정


app.use('/HJ_boardMain', require('./routes/HJ_boardMain')); //게시판 메인 페이지 렌더링
app.use('/HJ_addComment', require('./routes/HJ_addComment')); //댓글 페이지 렌더링
app.use('/HJ_create', require('./routes/HJ_create')); // 글 작성 페이지 렌더링
app.use('/HJ_detailPost', require('./routes/HJ_detailPost')); // 상세 페이지 렌더링
app.use('/HJ_editPost', require('./routes/HJ_editPost')); // 수정 페이지 렌더링
app.use('/HJ_deletePost', require('./routes/HJ_deletePost')); // 삭제 처리
app.use('/HJ_deleteComment', require('./routes/HJ_deleteComment')); // 댓글 삭제 처리
app.use('/HJ_editComment', require('./routes/HJ_editComment')); // 댓글 수정 엔드포인트 추가


app.use('/md_mainBoard', require('./routes/md_mainBoard'));
app.use('/md_create', require('./routes/md_create'));
app.use('/md_detailPost', require('./routes/md_detailPost'));
app.use('/md_editPost', require('./routes/md_editPost'));
app.use('/md_deletePost', require('./routes/md_deletePost'));
app.use('/md_addComment', require('./routes/md_addComment'));
app.use('/md_deleteComment', require('./routes/md_deleteComment'));



const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/main`);
});
