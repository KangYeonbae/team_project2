const express = require('express');
const oracledb = require('oracledb');
const Chart = require('chart.js');
const dbConfig = require('../dbConfig');
const path = require('path');

const router = express.Router();

router.get('/', async (req, res) => {
    const loggedInUserId = req.session.loggedInUserId;
    const loggedInUserName = req.session.loggedInUserName;
    const loggedInUserRealName = req.session.loggedInUserRealName;

    try {
        // Oracle 데이터베이스에 연결
        const connection = await oracledb.getConnection(dbConfig);

        // SQL 쿼리 실행
        const query1 = 'SELECT 서비스업종코드명, 당월매출금액 FROM gangnam';
        const query2 = 'SELECT total, station FROM project';

        const result1 = await connection.execute(query1);
        const result2 = await connection.execute(query2);

        // 결과 데이터 추출
        const labels = result1.rows.map(row => row[0]);
        const data = result1.rows.map(row => row[1]);
        const totalData = result2.rows.map(row => row[0]);
        const stationName = result2.rows.map(row => row[1]);

        // EJS 템플릿 렌더링
        res.render('sliedChart', {
            labels: JSON.stringify(labels),
            data: JSON.stringify(data),
            stationName: JSON.stringify(stationName),
            totalData: JSON.stringify(totalData),
            userId: loggedInUserId,
            username: loggedInUserName,
            userRealName: loggedInUserRealName
        });

        // 연결 닫기
        await connection.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching data');
    }
});

module.exports = router;
