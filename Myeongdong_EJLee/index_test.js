// 실행 전 반드시 설치해야 할 것.
// npm i express
// npm i oracledb
// npm i body-parser
// npm i express-session
// npm i multer
// npm i fs
const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const fs= require('fs');
const path = require('path');
const upload = multer({ dest: path.join(__dirname, 'temp'), encoding: 'utf8' });

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
const WEB_SERVER_HOME = 'C:\\EJLee\\Util\\nginx-1.24.0\\html';
// const WEB_SERVER_HOME = 'D:\\EJLEE\\Util\\nginx-1.24.0\\html'; // 비대면 PC 경로
const UPLOAD_FOLDER = path.join('C:\\EJLee\\Util\\nginx-1.24.0\\html\\uploads', 'uploads');
// const UPLOAD_FOLDER = path.join('D:\\EJLEE\\Util\\nginx-1.24.0\\html\\uploads', 'uploads'); // 비대면 전용 로드
app.use(express.static(WEB_SERVER_HOME + '/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// Oracle 데이터베이스 연결 설정
// const dbConfig = {
//     user: 'open-source',
//     password: '1111',
//     connectString: '192.168.0.17:1521/xe'
// };
const dbConfig = {
    user: 'open_source',
    password: '1111',
    connectString: 'localhost:1521/xe'
}

app.set('view engine', 'ejs');
oracledb.initOracleClient({libDir: 'C:\\instantclient_21_13'});
// oracledb.initOracleClient({libDir: 'D:\\instantclient_21_13'}); // 비대면 전용 oracle 루트입니다

// express-session 미들웨어 설정
app.use(session({
    secret: 'mySecretKey', // 세션을 암호화하기 위한 임의의 키
    resave: false,
    saveUninitialized: true
}));

// 로그인 페이지 렌더링
app.get('/login', (req, res) => {
    // '/' 경로로의 요청은 Nginx에서 login.html을 처리하도록 리다이렉트
    res.redirect('/login.html');
});

// 로그인 처리
app.post('/login', bodyParser.urlencoded({ extended:false }), async (req, res) => {
    const { username, password } = req.body;
    const authenticatedUser = await varifyID(username, password);

    if (authenticatedUser) {
        req.session.loggedIn = true;
        req.session.loggedInUserId = authenticatedUser.id;         // 사용자 테이블의 ID(PK) 저장
        req.session.loggedInUserName = username;                   // 사용자 테이블의 username
        req.session.loggedInUserRealName = authenticatedUser.name; // 사용자 테이블에서 실제 이름 저장
        // res.redirect(`/md_mainBoard?id=${authenticatedUser.id}&username=${authenticatedUser.username}&name=${authenticatedUser.name}`);
        res.redirect(`/md_mainBoard`);
        // res.redirect('welcome', { WEB_SERVER_HOME, username });
    } else {
        res.render('loginFail', { username });
    }
});

// 로그인 실패
app.get('/loginFail', (req, res) => {
    res.render('/loginFail');
});

// 로그아웃 처리
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('세션 삭제 중 오류 발생:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/login'); // 로그아웃 후 로그인 페이지로 리다이렉트
        }
    });
});

async function varifyID(username, password) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
            'select * from users where username = :username and password = :password',
            { username, password }
        );

        if (result.rows.length > 0) {
            return {
                id: result.rows[0][0],
                username: result.rows[0][1],
                name: result.rows[0][3]
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('오류 발생:', error);
        return null;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

// 게시판 메인 페이지 렌더링
app.get('/md_mainBoard', async (req, res) => {
    let conn;

    const loggedInUserId = req.session.loggedInUserId;
    const loggedInUserName = req.session.loggedInUserName;
    const loggedInUserRealName = req.session.loggedInUserRealName;

    try {
        conn = await oracledb.getConnection(dbConfig);
        let result = await conn.execute(
            `select count(*) as total from md_posts`
        );
        const totalPosts = result.rows[0];
        const postsPerPage = 10; // 한 페이지에 표시할 게시글 수
        const totalPages = Math.ceil(totalPosts / postsPerPage); // 총 페이지 수 계산

        let currentPage = req.query.page ? parseInt(req.query.page) : 1; // 현재 페이지 번호
        const startRow = (currentPage - 1) * postsPerPage + 1;
        const endRow = currentPage * postsPerPage;
        console.log(`startRow: ${startRow}, endRow: ${endRow}`);

        // 정렬 방식에 따른 SQL 쿼리 작성
        let orderByClause = 'ORDER BY p.created_at DESC'; // 기본적으로 최신순 정렬

        // 검색 조건에 따른 SQL 쿼리 작성
        let searchCondition = ''; // 기본적으로 검색 조건 없음
        let searchSelectCondition = '';


        if ((req.query.searchType && req.query.searchInput) || req.query.searchSelect) {
            const searchType = req.query.searchType;
            const searchInput = req.query.searchInput;
            const searchSelect = req.query.searchSelect;


            // 검색 조건에 따라 where 절 설정
            if (searchType === 'title') {
                searchCondition = `and p.title like '%${searchInput}%'`;
            } else if (searchType === 'author') {
                searchCondition = `and u.username like '%${searchInput}%'`;
            } else if (searchType === 'content') {
                searchCondition = `and p.content like '%${searchInput}%'`;
            } else if (searchType === 'category') {
                searchSelectCondition = `and p.category = '${searchSelect}'`;
            }
        }

        const sql_query = `SELECT id, category, author, title, TO_CHAR(created_at, 'YYYY-MM-DD'), views,
                                  (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comments_count
                                from ( select p.id, p.category, u.username as author, p.title, p.created_at, p.views,
                                              row_number() over (ORDER BY p.created_at DESC) as rn
                                       from md_posts p join users u on p.author_id = u.id
                                       where 1=1
                                           ${searchCondition} 
                                           ${searchSelectCondition}
                                       ) p
                                where rn between :startRow and :endRow`;
        console.log(sql_query);

        result = await conn.execute(sql_query,
            {
                startRow: startRow,
                endRow: endRow
            }
        );

        const MAX_PAGE_LIMIT = 5;
        const startPage = (totalPages - currentPage) < MAX_PAGE_LIMIT ? Math.max(totalPages - MAX_PAGE_LIMIT + 1, 1) : currentPage;
        const endPage = Math.min(startPage + MAX_PAGE_LIMIT - 1, totalPages);
        console.log(`result.rows: ${JSON.stringify(result.rows)}`);
        console.log(`result.rows[0][0]: ${result.rows[0][0]}`);

        res.render('md_mainBoard', {
            userId: loggedInUserId,
            userName: loggedInUserName,
            userRealName: loggedInUserRealName,
            posts: result.rows,
            startPage: startPage,
            currentPage: currentPage,
            endPage: endPage,
            totalPages: totalPages,
            maxPageNumber: MAX_PAGE_LIMIT
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

// 글 작성 페이지 렌더링
app.get('/md_create', (req, res) => {
    // 로그인 여부 확인 로직 생성
    res.render('md_create', {
        userId: req.session.userId,
        username: req.session.username,
        userRealName: req.session.userRealName
    });
});

// 게시글 작성 처리
app.post('/md_create', upload.array('files', 5), async (req, res) => {
    console.log('Debug: post create');
    const { category, title, content } = req.body;
    /*
    - req.files: 이것은 Multer라는 미들웨어에 의해 추가.
    Multer는 파일 업로드를 처리하기 위한 미들웨어로,
    업로드된 파일에 대한 정보를 req.files 객체에 저장
    - files: req.files의 file객체들의 정보중
     */
    const files = req.files.map(file => {
        return {
            // Multer의 file객체가 관리하는 업로드된 파일의 원본 이름
            originalName: file.originalname,
            // Multer의 file객체가 관리하는 업로드된 파일의 변환된 이름
            storedName: file.filename
        };
    });

    const authorId = req.session.loggedInUserId; // 현재 로그인한 사용자의 ID
    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);

        const result = await conn.execute(
            `select post_id_seq.nextval from dual`
        );

        const postId = result.rows[0][0];
        console.log(authorId)
        await conn.execute(
            `insert into md_posts (id, category, author_id, title, content, file_original_name, file_stored_name) values (:id, :category, :author_id, :title, :content, :file_original_name, :file_stored_name)`,
            {
                id: postId,
                category: category,
                author_id: authorId,
                title: title,
                content: content,
                file_original_name: files.map(file => file.originalName).join(';'),
                file_stored_name: files.map(file => file.storedName).join(';')
            }
        );

        // 변경 사항 커밋
        await conn.commit();

        // 파일 이동 및 임시 폴더의 파일 삭제
        for (const file of req.files) {
            const tempFilePath = file.path;
            const targetFilePath = path.join(UPLOADS_FOLDER, file.filename);
            fs.renameSync(tempFilePath, targetFilePath);
        }

        // 게시글 작성 후 게시판 메인 페이지로 리다이렉트
        res.redirect('/md_mainBoard');
    } catch (err) {
        console.error('글 작성 중 오류 발생:', err);
        res.status(500).send('글 작성 중 오류가 발생했습니다.');
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (err) {
                console.error('오라클 연결 종료 중 오류 발생:', err);
            }
        }
    }
});

// 게시글 자세히 보기
app.get('/md_detailPost/:id', async (req, res) => {
    // 로그인 여부 확인
    if (!req.session.loggedIn) {
        return res.redirect('/login'); // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    }

    const postId = req.params.id;
    const userId = req.session.loggedInUserId;
    const userName = req.session.loggedInUserName;
    const userRealName = req.session.loggedInUserRealName;
    console.log(`username: ${userName}`);
    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);

        // 조회수 증가 처리
        await conn.execute(
            `update md_posts set views = views + 1 where id = :id`,
            [postId]
        );

        // 변경 사항을 커밋
        await conn.commit();

        // 게시글 정보 가져오기
        const postResult = await conn.execute(
            `select p.id, p.category, p.title, u.username as author, p.content, to_char(p.created_at, 'YYYY-MM-DD') as created_at, p.views,
                    p.likes, p.file_original_name, p.file_stored_name
            from md_posts p
                join users u on p.author_id = u.id
            where p.id = :id`,
            [postId],
            { fetchInfo: { CONTENT: { type: oracledb.STRING } } }
        );

        // 댓글 가져오기
        // 댓글의 작성자 username을 구하기 위해 users 테이블과 조인한다.
        const commentResult = await conn.execute(
            `select c.id, c.author_id, c.content, u.username as author, to_char(c.created_at, 'YYYY-MM-DD HH:MM') as created_at, c.parent_comment_id
            from comments c
            join users u on c.author_id = u.id
            where c.post_id = :id
            order by c.id`,
            [postId],
            { fetchInfo: { content: { type: oracledb.STRING } } }
        );

        // 댓글과 댓글의 답글을 구성하기 위한 사용자 정의 자료구조 생성
        const comments = [];
        const commentMap = new Map(); // 댓글의 id를 key로 하여 댓글을 맵으로 저장

        commentResult.rows.forEach(row => {
            const comment = {
                id: row[0],
                author_id: row[1],
                content: row[2],
                author: row[3],
                created_at: row[4],
                children: [], // 자식 댓글을 저장할 배열
            };

            const parentId = row[5]; // 부모 댓글의 id

            if (parentId === null ) {
                // 부모 댓글이 null이면 바로 댓글 배열에 추가
                comments.push(comment);
                commentMap.set(comment.id, comment); // 맵에 추가
            } else {
                // 부모 댓글이 있는 경우 부모 댓글을 찾아서 자식 댓글 배열에 추가
                const parentComment = commentMap.get(parentId);
                parentComment.children.push(comment);
            }
        });
        const md_posts = {
            id: postResult.rows[0][0],
            category: postResult.rows[0][1],
            title: postResult.rows[0][2],
            author: postResult.rows[0][3],
            content: postResult.rows[0][4],
            created_at: postResult.rows[0][5],
            views: postResult.rows[0][6],
            likes: postResult.rows[0][7],
            file_original_name: postResult.rows[0][8],
            file_stored_name: postResult.rows[0][9]
        };
        res.render('C:\\EJLee\\Project\\2_WebProject\\1_FrontEnd\\MyPortpolio\\Myeongdong_EJLee\\views\\md_detailPost.ejs', {
            md_posts: md_posts,
            post: postId,
            userId: userId,
            userName: userName,
            userRealName: userRealName,
            comments: comments
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

// 수정 페이지 렌더링
app.get('/md_editPost/:id', async (req, res) => {
    // 로그인 여부 확인
    if (!req.session.loggedIn) {
        return res.redirect('/login'); // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    }

    const postId = req.params.id;
    const userId = req.params.userId;
    const userName = req.query.userName;
    const userRealName = req.query.userRealName;

    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);

        // 게시글 정보 가져오기
        const result = await conn.execute(
            `select * from md_posts where id = :id`,
            [postId],
            { fetchInfo: { content: { type: oracledb.STRING }}}
        );

        const md_posts = {
            id: result.rows[0][0],
            category: result.rows[0][2],
            title: result.rows[0][3],
            content: result.rows[0][4]
        };

        res.render('md_editPost', {
            md_posts: md_posts,
            post: postId,
            userId: userId,
            userName: userName,
            userRealName: userRealName
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});
// 수정 처리
app.post('/md_editPost/:id', async (req, res) => {
    const { category, title, content } = req.body;
    const postId = req.params.id;

    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);

        // 게시글 수정
        await conn.execute(
            `update md_posts set category = :category, title = :title, content = :content where id = :id`,
            [category, title, content, postId]
        );

        // 변경 사항 커밋
        await conn.commit();

        // 수정 후 상세 페이지로 리다이렉트
        res.redirect(`/md_detailPost/${postId}?user=id=${req.session.userId}&username=${req.session.username}&user_realname=${req.session.userRealName}`);
    } catch (err) {
        console.error('게시글 수정 중 오류 발생:', err);
        res.status(500).send('게시글 수정 중 오류가 발생했습니다.');
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (err) {
                console.error('오라클 연결 종료 중 오류 발생:', err);
            }
        }
    }
});

// 삭제 처리
app.post('/md_deletePost/:id', async (req, res) => {
    // 로그인 여부 확인
    if (!req.session.loggedIn) {
        return res.redirect('/login'); // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    }

    const postId = req.params.id;
    const userId = req.params.userId;
    const userName = req.query.userName;
    const userRealName = req.query.userRealName;

    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);

        // 게시글에 달린 댓글과 답글 삭제
        await conn.execute(
            `delete from comments where post_id = :postId or parent_comment_id in (select id from comments where post_id = :postId)`,
            [postId, postId]
        );
        // 변경 사항 커밋
        await conn.commit();
        // 게시글 삭제
        await conn.execute(
            `delete from md_posts where post_id = :postId`,
            [postId]
        );

        // 변경 사항 커밋
        await conn.commit();

        // 삭제 후 게시판 메인 페이지로 리다이렉트
        res.redirect(`/md_mainBoard?id=${userId}$username=${userName}&name=${userRealName}`);
    } catch (err) {
        console.error('게시글 삭제 중 오류 발생:', err);
        res.status(500).send('게시글 삭제 중 오류가 발생했습니다.');
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (err) {
                console.error('오라클 연결 종료 중 오류 발생:', err);
            }
        }
    }
});

// 댓글 페이지 렌더링
app.get('/md_addComment', (req, res) => {
    const postId = req.query.post_id; // postId 가져오기
    const userId = req.session.loggedInUserId;
    const username = req.session.loggedInUserName;
    const userRealName = req.session.loggedInUserRealName;
    res.render('md_addComment',{postId:postId, userId:userId, username:username, userRealName:userRealName});
});

app.post('/md_addComment', async (req, res) => {
    // 로그인 여부 확인
    if (!req.session.loggedIn) {
        return res.redirect('/login'); // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    }

    const post_id = req.body.post_id;
    const author_id = req.session.loggedInUserId;
    const comment_id = req.body.comment_id;
    const { content } = req.body;

    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);

        // 댓글 추가
        await conn.execute(
            `insert into comments (id, post_id, author_id, content, parent_comment_id) 
             values (comment_id_seq.nextval, :post_id, :author_id, :content, :parent_id)`, // parent_comment_id를 parent_id로 수정
            [post_id, author_id, content, comment_id]
        );

        await conn.commit();

        res.redirect(`/md_detailPost/${post_id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

// 게시판 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/md_mainBoard`);
});