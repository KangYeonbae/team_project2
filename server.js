const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
// const cookieParser = require('cookie-parser');
const oracledb = require("oracledb");
// const fs = require('fs');

// app.use(cookieParser());

oracledb.initOracleClient({ libDir: 'C:\\instantclient_21_13' });
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
    res.render('main', {'username':null});
});

app.get('/video', async (req, res) => {
    res.render('video',{'username':null});
});

// 라우팅 설정
app.use('/login', require('./routes/login'));  // 로그인페이지 연결
app.use('/logout', require('./routes/logout')); // 로그아웃페이지
app.use('/chartKYB', require('./routes/chartKYB'));  // 차트페이지연결 연결
app.use('/total', require('./routes/totaltop12')); // 재우님 차트페이지연결
app.use('/subway', require('./routes/testchart_kyb')); // 강연배 차트페이지
app.use('/sliedChart', require('./routes/slideTest_chartKYB')); //슬라이드바 되어져있는 차트페이지
app.use('/boardkyb', require('./routes/board_KYB'));// // 강연배 게시판메인페이지
app.use('/boarDetailkyb', require('./routes/detail_KYB')); //강연베 게시판 세부내용페이지
app.use('/create_kyb', require('./routes/createKYB')); //강연배 게시글작성페이지
app.use('/deletnotice', require('./routes/deletnotice')); //강연배 글삭제페이지
app.use('/editKYB', require('./routes/editKYB')); //강연배 글수정
app.use('/addComment', require('./routes/commentKYB')); //강연배 덧글
app.use('/deleteComKYB', require('./routes/deleteComKYB')) //강연배 덧글 삭제
app.use('/editComKYB', require('./routes/editComKYB')) //강연배 덧글 수정


const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/main`);
});