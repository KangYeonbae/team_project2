function getBotResponse(input){
    console.log("Input:", input);


    if (input === "서울"){
        console.log("서울메뉴")
        return "서울홈, 경복궁, 광장시장, 남산, 롯데월드, DDP 메뉴가있습니다."
    } else if (input === "강릉"){
        console.log("강릉메뉴")
        return "강릉홈, 맛집 메뉴가 있습니다."
    } else if (input ==="군산"){
        console.log("군산메뉴")
        return "군산홈, 고군산군도, 시간태마여행, 개정/임피 메뉴가 있습니다."
    } else if(input === "부산") {
        console.log("부산메뉴")
        return "부산홈, 해운대, 감천마을, 광안리가 있습니다."
    }  else if(input === "상위메뉴"){
        console.log("처음으로")
        return "안녕하세요, 여행이야기입니다. 저희 여행이야기는 여행관련 자료안내사이트입니다. 어디로 떠나가볼까요? 1. 서울 2. 강릉 3. 군산 4. 부산"
    } else if (input === "맛집"){
        console.log("맛집")
        return "어느지역의 맛집을 원하실까요? 경복궁맛집, 강릉맛집, 군산맛집, 해운대맛집, 감천마을맛집, 광안리맛집 이 있습니다. "
    } else if (input === "관광"){
        console.log("관광")
        return "관광지를 안내드리겠습니다. 원하시는 지역의 관광지를 말씀해주세요."
    } else if (input === "경복궁"){
        console.log("경복궁")
        return "태조가 조선을 건국하고 가장 먼저지은 조선의 정궁(법궁)입니다.<br>." +
            "입장료는 25세~64세 : 3,000원, 24세이하, 65세이상은 무료,<br>" +
            "입장시간 : 9시~18시 (동절기 17시, 하절기 18:30),<br>"+
            "주차료는 2시간에 2,000원, 15분에 500원입니다.<br>" +
            "음성안내서비스 대여가능하니 관람시 참고하세요."
    } else if (input.includes("경복궁맛집") ) {
        console.log("경복궁맛집")
        return "황생가 칼국수<br>" +
            "★4.32 / 2023 서울 미슐랭가이드<br>" +
            "주소 : 서울 종로구 북촌로5길 78<br> " +
            "======================<br>" +
            "스미스가 좋아하는 한옥" +
            "★4.39 / 파스타를파는 예쁜 한옥레스토랑 " +
            "주소 : 서울 종로구 삼청로 22-7<br>" +
            "=====================<br>" +
            "모도우 광화문점<br>" +
            "★4.63 / 예술작품 데이트 같은경복궁 맛집<br>" +
            "주소 : 서울 종로구 율곡로 6 트윈트리타워 B동 M층"
    }else if (input.includes("강릉맛집") ) {
        console.log("강릉맛집")
        return "마이마이<br>" +
            "★4.86 / 강릉대표 우육면<br>" +
            "주소 : 강원 강릉시 강릉대로 152-1 1층<br> " +
            "======================<br>" +
            "리틀다이너<br>" +
            "★4.39 / 강릉속 작은 미국<br>" +
            "주소 : 강원 강릉시 성덕로 105 1층 리틀다이너7<br>" +
            "======================<br>" +
            "동화가든<br>" +
            "★4.63 / 강릉초당순두부 원조집<br>" +
            "주소 :강원 강릉시 초당순두부길77번길 15 동화가든<br>" +
            "======================<br>" +
            "툇마루<br>" +
            "★4.45 / 흑임자커피로 유명한 그곳<br>" +
            "주소 : 강원 강릉시 난설헌로 232 카페 툇마루"
    }else if (input.includes("군산관광") ) {
            console.log("군산관광")
            return "금강미래체험관<br>" +
                "금강의 문화, 생태, 기후변화 전시 및 체험 시설입니다. 아이들과함께해도 좋아요.<br>" +
                "주소 : 전북 군산시 성산면 철새로 120<br> "+
                "======================<br>"+
                "채만식문화관<br>"+
                "재향소설과 백릉 채만식선생의 문화업적을 기리기위한 전시.체험공간입니다.<br>"+
                "주소 : 전북 군산시 강변로 449<br>"+
                "======================<br>"+
                "군산 3.1운동 100주년 기념관<br>"+
                "한강이남 최초로 3.1만세운동의 애국정신을 기리기 위한 현충시설입니다. 역사에 관심있다면 방문필수!<br>"+
                "주소 :강원 강릉시 초당순두부길77번길 15 동화가든<br>"+
                "======================<br>"+
                "경암동 철길마을<br>"+
                "남녀노소 만족하는 7~80년대로의 시간여행공간! 옛날교복입고 추억을 남겨요!<br>"+
                "주소 : 전북 군산시 경촌4길 14"
    } else {
        console.log("지정메뉴외")
        return "준비중입니다. 다른 메뉴를 선택해 주세요^^"
    }
}