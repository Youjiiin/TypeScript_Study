// -- 관찰모드(감시모드) --
// tsc app.ts -w / tsc app.ts --watch
// tsc --init : 모든 파일 실행
// 이후 tsc를 터미널에 입력 -> 컴파일 됨
// 감시모드와 결합: tsc -w / tsc --watch
const userName = "Yujiiin";
console.log(userName);

const button = document.querySelector("button")!; //!: 버튼이 연결되어 있음을 알려 줌

function add(n1: number, n2: number) {
    if (n1 + n2 > 0) {
        return n1 + n2;
    }
    return;
}

function clickHandler(message: string) {
  console.log("Clicked!" + message);
}

if (button) {
  button.addEventListener("click", clickHandler.bind(null, 'You!')); //bind: 첫번째 인수를 bind
}