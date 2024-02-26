const express = require('express');
const oracledb = require('oracledb');
const Chart = require('chart.js');
const dbConfig = require('../dbConfig');
const path = require('path');
const {json} = require("express");

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
            `SELECT station, total, January, February, March, April, May, June, July, August, September, October, November, December FROM project`
        );

        const stationName = result.rows.map(row => row[0]);

        const chartData = Object.fromEntries(
            result.rows.map(row => [row[0], row.slice(1)]),
        );


    res.render('totallee', {
        chartData: JSON.stringify(chartData),
        stationName: JSON.stringify(stationName),
        userId: loggedInUserId,
        username: loggedInUserName,
        userRealName: loggedInUserRealName
    });

      // 연결 닫기
      //   await connection.close();
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
