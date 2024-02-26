const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
// const cookieParser = require('cookie-parser');
const oracledb = require("oracledb");

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
app.use('/chartKYB', require('./routes/chartKYB'));  // 게시판 연결
app.use('/total', require('./routes/totaltop12'));
app.use('/sliedChart', require('./routes/slideTest_chartKYB'))
app.use('/boardkyb', require('./routes/board_KYB'));// 게시판 js 에는  마지막에 module.exports = router; 를 입력해주면 끝(단, 게시판에는 포트넘버를 입력하지 않거나, 3000번과 다른 포트넘버를 사용하여야함)
app.use('/boarDetailkyb', require('./routes/detail_KYB'))
app.use('/subway', require('./routes/testchart_kyb'))

const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/subway`);
});