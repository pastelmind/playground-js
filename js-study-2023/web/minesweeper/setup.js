function main() {
  const el = document.getElementById("result")
  // el을 사용하는 코드
}

window.addEventListener("DOMContentLoaded", main)

window.addEventListener("onclick")

// 캡처
document.body.addEventListener(
  "click",
  () => {
    console.log("바디 클릭 캡처")
  },
  { capture: true }
)
// 버블
document.body.addEventListener("click", () => {
  console.log("바디 클릭 버블")
})

const myButton = document.getElementById("mybutton")
// 버블
myButton.addEventListener("click", () => {
  console.log("버튼 클릭 버블")
})
// 캡처
myButton.addEventListener(
  "click",
  () => {
    console.log("버튼 클릭 캡처")
  },
  { capture: true }
)

result.innerHTML = "<span></span>"
