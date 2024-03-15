fetch("https://www.naver.com/")
  .then((response) => {
    if (response.ok) {
      console.log("네이버 연결 성공");
      return response.text();
    } else {
      throw new Error("네이버 접속 실패함");
    }
  })
  .then((t) => {
    console.log(t);
    if (t.includes("태풍")) {
      // ...
    } else {
      throw new Error("태풍 키워드를 찾을 수 없습니다.");
    }
  })
  .catch((error) => {
    console.log(error);
  });
