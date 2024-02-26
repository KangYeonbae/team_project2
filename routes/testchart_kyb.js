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
            const result = await connection.execute('SELECT 서비스업종코드명,당월매출금액 FROM gangnam');

            const labels = result.rows.map(row => row[0]);
            const data = result.rows.map(row => row[1])
            // const values = result.rows.map(row => row[1]);

            // EJS 템플릿 렌더링
            res.render('subway', { labels: JSON.stringify(labels),
                                                    data: JSON.stringify(data),
                                                  userId: loggedInUserId,
                                                username: loggedInUserName,
                                                 userRealName: loggedInUserRealName});


            // 연결 닫기
            await connection.close();
        } catch (err) {
            console.error(err);
            res.status(500).send('Error fetching data');
        }
    });


module.exports = router;
