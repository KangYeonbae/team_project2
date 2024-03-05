const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');

const router = express.Router();

router.get('/', async (req, res) => {
    let connection;
    const loggedInUserId = req.session.loggedInUserId;
    const loggedInUserName = req.session.loggedInUserName;
    const loggedInUserRealName = req.session.loggedInUserRealName;



    try {
        // Oracle 데이터베이스에 연결
        const connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
            `select 서비스업종코드명, round(avg(남성_매출금액),2) as 남성매출금액, round(avg(여성_매출_금액),2) as 여성매출금액
             from myeongdong
             GROUP by 서비스업종코드명
            `
        );

        const chartData = result.rows.map(row => ({
            label: row[0],
            maleSales: row[1],
            femaleSales: row[2]
        }));

        console.log(chartData);

        res.render('totalKYB', {
            chartData: JSON.stringify(chartData),
            userId: loggedInUserId,
            username: loggedInUserName,
            userRealName: loggedInUserRealName
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

module.exports = router;
