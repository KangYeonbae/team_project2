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

//

app.use('/addComment', require('./routes/addComment'));
app.use('/boardMain', require('./routes/boardMain'));
app.use('/create', require('./routes/create'));
app.use('/deletePost', require('./routes/deletePost'));
app.use('/detailPost', require('./routes/detailPost'));
app.use('/editPost', require('./routes/editPost'));
app.use('/login', require('./routes/login'));
app.use('/loginFail', require('./routes/loginFail'));
app.use('/logout', require('./routes/logout'));
// 게시판 메인 페이지 렌더링



// 게시판 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/boardMain`);
});
