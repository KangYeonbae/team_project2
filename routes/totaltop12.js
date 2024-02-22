const express = require('express');
const oracledb = require('oracledb');
const Chart = require('chart.js');
const dbConfig = require('../dbConfig');
const path = require('path');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Oracle 데이터베이스에 연결
        const connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute('SELECT total,station FROM project');


        const totalData = result.rows.map(row => row[0]);
         const stationName = result.rows.map(row => row[1]);


        res.render('totallee', { "stationName":JSON.stringify(stationName), "totalData":JSON.stringify(totalData) });

        // 연결 닫기
        await connection.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching data');
    }
});


module.exports = router;
