function add(n1: number, n2: number) {
  return n1 + n2;
}

function logResult(num: number): void {
  console.log('Result: ' + num);
  // 문자열 타입이아닌 void 타입을 반환한다.
  // = 반환 구문이 없다. 
  return; // void를 사용하고, 반환해도 된다.
}


// -- 콜백 함수 정의 --
function addAndHandler(n1: number, n2: number, cb: (num: number) => void) {
  const result = n1 + n2;
  cb(result);
}

console.log(logResult(add(5, 12))); 
// void타입이라 undefined 출력
// = 존재하지 않는 속성, 객체

let someValue: undefined;
// 타입을 선언할 수는 있으나, void대신 쓸 수 없다.
// undefined로 사용하면, 반환 구문이 있지만, 아무것도 반환하지 않음을 뜻한다. 

// 변수에 함수 포인터를 저장할 수 있으며, 이를 함수처럼 실행 가능
// 하지만, any 타입
//let combineValue

// -- 타입 기능을 하는 함수 --
//let combineValue: Function;
let combineValue: (a: number, b: number) => number; 
// 매개 변수 타입 지정
// 반환 타입 화살표 옆에

combineValue = add;

//combineValue = logResult; 
//Error: void' is not assignable to type '(a: number, b: number) => number'. Type 'void' is not assignable to type 'number'.

//combineValue = 5; 
//Error: Type 'number' is not assignable to type '(a: number, b: number) => number'.

console.log(combineValue(8, 8));

addAndHandler(10, 20, (result) => {
  console.log(result);
  return result;
  // 위에서 void를 반환한다고 명시해줬지만, 반환을 해도 오류가 안생긴다.
  // void로 명시함으로써 반환되는 결과를 무시한다.
});