const express = require('express')
const path = require('path')
const app = express()
const port = 3000


app.set('view engine', 'ejs');

// root 폴더는 Proj1 으로 설정
app.use(express.static(__dirname));

// req.body 해독을 위한 미들웨어 장착
app.use(express.urlencoded({ extended: true }));

// views 폴더 경로 변경
app.set('views', path.join(__dirname, 'public', 'views'));


// 메인페이지는 index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname, 'index.html')
})

// 로그인 시도시 데시보드로 이동
app.post('/dashboard',(req,res)=>{
    const {username, password} = req.body

    if (username==='kang' && password==="1111"){
        res.render('dashboard',{username})
    }

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});