// -- unknown --
let userInput: unknown; // 사용자가 어떤 값을 입력할지 모르기에
// any보다 제한적

let userName: string;

userInput = 5;
userInput = 'Yujiin';

// unknown 타입의 값을 타입이 정해진 변수에 할당하기 위해서는 별도의 확인작업 필요
if (typeof userInput === 'string') {
    userName = userInput;
}

// -- never --
// never는 절대 반환값을 생성하지 않는다.
function generateError(message: string, code: number): never {
    throw {message: message, errorCode: code};
    //while(true) {} -> 무한루프 함수도 가능
}

generateError('An error occurred!', 500);