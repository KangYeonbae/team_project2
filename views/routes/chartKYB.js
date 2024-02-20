// app.js

const oracledb = require('oracledb');
const Chart = require('chart.js');
const express = require('express');

const app = express();

// Oracle 데이터베이스 연결 정보
const dbConfig = {
    user: 'your_username',
    password: 'your_password',
    connectString: 'localhost:1521/your_service_name' // 데이터베이스 연결 문자열
};

// 라우트 설정
app.get('/', async (req, res) => {
    try {
        // Oracle 데이터베이스에 연결
        const connection = await oracledb.getConnection(dbConfig);

        // SQL 쿼리 실행
        const result = await connection.execute('SELECT category, value FROM chart_data');

        // 차트 데이터 생성
        const labels = result.rows.map(row => row[0]);
        const values = result.rows.map(row => row[1]);

        // 차트 생성
        const chartData = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Chart Data',
                    data: values,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };

        // 차트 HTML 전송
        res.send(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Chart.js Example</title>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js"></script>
      </head>
      <body>
          <canvas id="myChart" width="400" height="400"></canvas>

          <script>
              var ctx = document.getElementById('myChart').getContext('2d');
              var myChart = new Chart(ctx, ${JSON.stringify(chartData)});
          </script>
      </body>
      </html>
    `);

        // 연결 닫기
        await connection.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching data');
    }
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
