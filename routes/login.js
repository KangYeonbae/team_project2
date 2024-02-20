const express = require('express');
const oracledb = require("oracledb");
const bodyParser = require('body-parser');
const dbConfig = require('../dbConfig');

const router = express.Router();

async function varifyID(username, password) {
    let connection;

    try{
        connection = await oracledb.getConnection(dbConfig);
        sql_query = 'select * from users where username = :username and password = :password';
        //execute([SQL 쿼리],[바인딩 정보],[옵션]);
        // 바인딩 정보는 기존 SQL 쿼리에서 자바스크립트 변수를 사용할 수 있게 하는 매핑 정보
        const result = await connection.execute(sql_query, {username,password})

        if(result.rows.length > 0){
            console.log(result.rows[0]);
            // 간단한 쿼리의 경우는 execute 함수에 3번째 인자 생략해도 컬럼명으로 접근 가능.
            return{
                id : result.rows[0].ID,
                username: result.rows[0].USERNAME,
                name: result.rows[0].NAME
            };
        }else {
            return null; //인증이 실패한 경우
        }

    }catch(error){
        console.error('오류발생 : ', error);

    }finally {

    }

}

router.get('/', async (req, res) => {
    // '/' 경로로의 요청은 Nginx에서 login.html을 처리하도록 리다이렉트
    res.redirect('./../public/login_kyb.html');
});
router.post('/', bodyParser.urlencoded({ extended: false }), async (req, res) => {
        // 위에서 app.set('views', path.join(__dirname, 'views')); 이거로 views 폴더위치를 지정해주었기때문에,
        // / 만 적어도 현재폴더 > views 폴더 안에있는 index.ejs 를 잡아준다.
        const {username, password} = req.body;

        // 사용자 인증 작업
        console.log("로그인")
        const authenticatedUser = await varifyID(username, password);

        //인증 성공시 웰컴 페이지로 라우팅
    if (authenticatedUser) {
        req.session.loggedIn = true;
        req.session.loggedInUserId = authenticatedUser.id; // 사용자 테이블의 ID (PK) 저장
        req.session.loggedInUserName = username;           // 사용자 테이블의 username
        req.session.loggedInUserRealName = authenticatedUser.name; // 사용자 테이블에서 실제 이름 저장
            res.render('login',{username});
        }else{
            console.log("여기옴1.2.")
            res.render('loginFail', {username})
        }

    });



module.exports = router;