CREATE TABLE team_users (
                       id NUMBER PRIMARY KEY,  -- PK
                       username VARCHAR2(50),  -- UserID 또는 User 닉네임
                       password VARCHAR2(50),  -- 패스워드
                       name VARCHAR2(100)      -- 실제 사용자 이름
);

INSERT INTO team_users (id, username, password, name) VALUES (1, 'user1', 'password1', '강연배');
INSERT INTO team_users (id, username, password, name) VALUES (2, 'user2', 'password2', '이은진');
INSERT INTO team_users (id, username, password, name) VALUES (3, 'user3', 'password3', '배호진');
INSERT INTO team_users (id, username, password, name) VALUES (4, 'admin', 'password4', '이지우');
drop sequence requirement_posts_id_seq;
-- posts 테이블의 시퀀스 생성
CREATE SEQUENCE requirement_posts_id_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;


drop table requirement_posts;
-- 게시글 테이블 생성
CREATE TABLE requirement_posts (
                       id NUMBER PRIMARY KEY,
                       author_id NUMBER,
                       title VARCHAR2(255), -- 최대 사이즈 4000 바이트
                       content CLOB,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       views NUMBER DEFAULT 0,
                       likes NUMBER DEFAULT 0,
                       FOREIGN KEY (author_id) REFERENCES team_users(id)
);

-- 55개의 더미 글 작성 ver1: 동일 시간에 생성되는 문제가 있다.

BEGIN
FOR i IN 1..55 LOOP
    INSERT INTO requirement_posts (id, title, content, author_id, created_at)
    VALUES (requirement_post_id_seq.nextval,
            '게시글 제목 ' || i,
            '게시글 내용 ' || i,
            ROUND(DBMS_RANDOM.VALUE(1, 3)),
            SYSTIMESTAMP + INTERVAL '0.001' SECOND * i);
END LOOP;
COMMIT;
END;
/

drop sequence requirement_comment_id_seq;
-- comments 테이블의 시퀀스 생성
CREATE SEQUENCE requirement_comment_id_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

drop table requirement_comments;
CREATE TABLE requirement_comments (
                          id NUMBER PRIMARY KEY,
                          post_id NUMBER,
                          author_id NUMBER,
                          content CLOB,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          parent_comment_id number,
                          FOREIGN KEY (post_id) REFERENCES requirement_posts(id),
                          FOREIGN KEY (author_id) REFERENCES team_users(id),
                          FOREIGN KEY (parent_comment_id) REFERENCES requirement_comments(id)
);
CREATE TABLE post_likes (
                            user_id INT NOT NULL,
                            post_id INT NOT NULL,
                            PRIMARY KEY (user_id, post_id),
                            FOREIGN KEY (user_id) REFERENCES team_users(id),
                            FOREIGN KEY (post_id) REFERENCES requirement_posts(id)
);

commit;
