const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');
const path = require('path');
const chart = require('chart.js');

const router = express.Router();

router.get('/', async (req, res) => {
 try {
     const connection = await oracledb.getConnection(dbConfig);
     const result = await connection.execute('SELECT total,station FROM project');

     const stationName = result.rows.map(row => row[0]);
     const totalData = result.rows.map(row => row[1])

    res.render('total', {"stationName": JSON.stringify(stationName),"totalData":JSON.stringify(totalData)});

     await connection.close();
} catch (err){
    console.error(err);
    res.status(500).send('Error fetching data');
}
});



module.exports = router;