function getBotResponse(input){
    console.log("Input:", input);


    if (input === "지하철"){
        console.log("지하철")
        return "서울 지하철은 1호선~9호선이 있습니다."
    } else if (input === "지하철 명소"){
        console.log("지하철명소")
        return "대표적으로 2호선에 강남역, 4호선에 명동역이 있습니다."
    } else if (input ==="강남역") {
        console.log("강남역")
        return "강남역 추천명소 1.봉은사 2.가로수길 "
    } else if(input === "봉은사") {
        console.log("봉은사")
        return "봉은사 페이지를 안내해드릴께요^^<br>" +
            "<a href = 'https://www.tripadvisor.co.kr/Attraction_Review-g294197-d592486-Reviews-Bongeunsa_Temple-Seoul.html' style='color: royalblue'>봉은사 홈페이지 바로가기 <i class=\"fa-solid fa-arrow-pointer\"></i></a>"
    }else if(input === "명동성당") {
            console.log("명동성당")
            return "명동성당 페이지를 안내해드릴께요^^<br>" +
                "<a href = 'https://www.tripadvisor.co.kr/Attraction_Review-g294197-d609340-Reviews-Myeong_dong_Cathedral-Seoul.html' style='color: royalblue'>명동성당 홈페이지 바로가기 <i class=\"fa-solid fa-arrow-pointer\"></i></a>"
    } else if(input === "명동역") {
        console.log("명동역")
        return "명동역 추천명소 1.명동성당 2.남산케이블카"
    }  else if(input === "강남 맛집"){
        console.log("강남 맛집")
        return "강남역 추천맛집 1.뱅뱅 막국수 2.돝고기506"
    } else if (input === "명동 맛집"){
        console.log("명동 맛집")
        return "명동역 추천맛집 1.명동교자 본점 2.애성회관 한우곰탕"
    } else {
        console.log("끝")
        return "^^"
    }
}

// 강남 봉은사
// https://www.tripadvisor.co.kr/Attraction_Review-g294197-d592486-Reviews-Bongeunsa_Temple-Seoul.html
//
//     강남 가로수길
// https://www.tripadvisor.co.kr/Attraction_Review-g294197-d1604009-Reviews-Garosu_gil-Seoul.html
//
//     명동 명동성당
// https://www.tripadvisor.co.kr/Attraction_Review-g294197-d609340-Reviews-Myeong_dong_Cathedral-Seoul.html
//
//     명동 남산케이블카
// https://www.tripadvisor.co.kr/Attraction_Review-g294197-d3600495-Reviews-Namsan_Cable_Car-Seoul.html
//
//     명동 명동교자 본점
// https://www.diningcode.com/profile.php?rid=L4miF0diqkcW
//
//     명동 애성회관 한우곰탕
// https://www.diningcode.com/profile.php?rid=7hVyqU2qXf1W
//
//     강남 뱅뱅막국수
// https://www.diningcode.com/profile.php?rid=tvf3NHXWbzVU
//
//     강남 돝고기506(BTS가 회식함)
// https://www.diningcode.com/profile.php?rid=S8xMj5biQtny


