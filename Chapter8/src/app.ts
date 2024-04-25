// Decorate

// 필수는 아니지만 데코레이터의 이름은 대문자로 시작하는 경우가 많다.
// function Logger(constructor: Function) {
//     console.log('Logging...');
//     console.log(constructor);
// }
//데코레이터 팩토리 : 데코레이터 함수를 반환하는데, 이를 데코레이터로 추가할 때 원하는 값으로 설정할 수 있다.
function Logger(logString: string) {
    console.log('LOGGER FACTORY');
    return function(constructor: Function) {
        console.log(logString);
        console.log(constructor);
    }
}

function WithTemplate(tempalte: string, hookId: string) {
    console.log('TEMPLATE FACTORY');
    return function(constructor: any) { // _ : 인자가 들어오는 걸 알지만 필요는 없음
        console.log('rendering template');
        const hookEl = document.getElementById(hookId);
        const p = new constructor();
        if (hookEl) {
            hookEl.innerHTML = tempalte;
            hookEl.querySelector('h1')!.textContent = p.name;
        }
    }
}

// 데코레이터는 클래스가 인스턴스화될 때가 아니라 정의될 때 실행된다. (자바스크립트가 클래스 정의와 생성자 함수 정의를 만난 시점)
// @Logger

//@Logger('LOGGING - PERSON') // 팩토리는 함수형식으로 실행: 외부 함수를 실행해 반환 값인 내부 함수를 적용할 수 있으므로
// 데코레이터 함수가 실행될 때 사용할 값을 팩토리 함수를 통해 지정할 수 있다.

// 여러개의 데코레이터를 추가할 수 있다.
// 실행 순서 : 상향식(아래 -> 위)
// 팩토리는 또 다름
// 함수이기에 위 -> 아래
@Logger('LOGGING')
@WithTemplate('<h1>안뇽</h1>', 'app')
class Person {
    name = 'Yujin';

    constructor() {
        console.log('Creating Person object...');
    }
}

const pers = new Person();

console.log(pers);