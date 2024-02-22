// 웹 서버를 위한 Express 모듈과 Oracle 데이터베이스 작업을 위한 oracledb 모듈을 불러옵니다.
const express = require('express');
const oracledb = require("oracledb");
// Express 애플리케이션을 초기화합니다.
const app = express();
// 서버가 사용할 포트 번호를 정의합니다.
const port = 3000;

// 'public' 디렉토리에서 정적 파일(예: CSS, JavaScript, 이미지 파일 등)을 제공합니다.
app.use(express.static('public'));
// 뷰를 렌더링하기 위해 EJS 템플릿 엔진을 설정합니다.
app.set('view engine', 'ejs');

// SQL 작업 후 자동으로 데이터베이스 변경사항을 커밋하도록 설정합니다.
oracledb.autoCommit = true;
// Oracle 클라이언트 라이브러리가 위치한 디렉토리로 Oracle 클라이언트를 초기화합니다.
oracledb.initOracleClient({ libDir: 'C:\\instantclient_21_13' });

// 루트 경로('/')에 대한 라우트를 정의합니다. 이 비동기 함수는 들어오는 GET 요청을 처리합니다.


// ...

app.get('/', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: 'open_source',
            password: '1111',
            connectString: 'localhost:1521/xe'
        });

        // 역 이름, 총 승객 수, 월별 승객 수를 검색하는 쿼리를 실행합니다.
        const result = await connection.execute(
            `SELECT station, total, January, February, March, April, May, June, July, August, September, October, November, December FROM project`
        );


        const chartData = Object.fromEntries(
            //

            result.rows.map(row => [row[0], row.slice(1)])
        );



        res.render('top12', {
            chartData: JSON.stringify(chartData)
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching data');
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

// ...



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});