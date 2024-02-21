const express = require('express');
const oracledb = require('oracledb');
const app = express();
const port = 3000;
const cors = require('cors');

oracledb.autoCommit = true;


app.use(cors());
app.use(express.static('public'));


async  function getTotalData() {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: 'open_source',
            password: '1111',
            connectString:'localhost:1521/xe'
        });
        const result = await connection.execute(
            `select total from project`,
             );
            return result.rows;
    }finally {
        if(connection){
            await connection.close();
        }
    }
}

oracledb.initOracleClient({ libDir: 'C:\\instantclient_21_13' });
app.get('/api/total', async (req, res) => {
    try {
        const data = await getTotalData();

        res.json(data);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/api/total`);
});