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
    return function<T extends {new(...args: any[]): {name: string}}>(originalConstructor: T) { // _ : 인자가 들어오는 걸 알지만 필요는 없음
        // 객체의 인스턴스가 생성될 때만 렌더링됨
        return class extends originalConstructor {
            constructor(..._: any[]) {
                //originalConstructor 호출
                super();
                console.log('rendering template');
                const hookEl = document.getElementById(hookId);
                if (hookEl) {
                    hookEl.innerHTML = tempalte;
                    hookEl.querySelector('h1')!.textContent = this.name;
                }
            }
        }
    };
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

// 첫 번째 인자 : 프로퍼티의 타겟 - 인스턴스 프로퍼티 같은 경우에 타깃 인자로 생성된 객체의 프로토타입이 들어오게 된다.
// 두 번째 인자 : 프로퍼티의 이름

// 데코레이터 함수는 프로퍼티가 정의되는 시점에서 실행
function Log(target: any, propertyName: string | Symbol) {
    console.log('Property decorater!');
    console.log(target, propertyName);
}

// target: 프로토타입, 인스턴스 접근자, 정적 접근자일 경우 생성자 함수일 수도 있다.
// name : 접근자의 이름
// descriptor: 프로퍼티 설명자
function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
    console.log('Accessor decorator!');
    console.log(target);
    console.log(name);
    console.log(descriptor);
}

// target: 인스턴스 메서드 또는 객체 프로토 타입 | 정적 메서드일 경우, 생성자 함수
// name: 메서드 이름
// descriptor: 설명자
function Log3(target: any, name: string | Symbol, descriptor: PropertyDescriptor) {
    console.log('Method decorator!');
    console.log(target);
    console.log(name);
    console.log(descriptor);
}

// name: 매개변수를 사용하는 메서드의 이름
// position: 매개변수의 위치값(몇번재 매개변수 인가)
function Log4(target: any, name: string | Symbol, position: number) {
    console.log('parameter decorator!');
    console.log(target);
    console.log(name);
    console.log(position);
}

class Product {
    @Log
    title: string;
    private _price: number;

    @Log2
    set price(val: number) {
        if (val > 0) {
            this._price = val;
        } else {
            throw new Error('Invalid price');
        }
    }

    constructor(t: string, p: number) {
        this.title = t;
        this._price = p;
    }

    @Log3
    getPriceWithTax(@Log4 tax: number) {
        return this._price * (1 + tax);
    }
}
//데코레이터가 product를 인스턴스화 하지 않아도 된다.
//해도 실행되는 횟수는 변하지 않음 -> 클래스를 정의한느 시점에 실행된다.
//데코레이터를 사용해 배후 작업을 수행할 수 있는 것, 데코레이터가 실행되는 시점에 수행할 코드만 구성하면됨
const p1 = new Product('Book', 19);
const p2 = new Product('Book 2', 29);

function Autobind(_: any, _2: string | Symbol | number, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            // this: 게터 메서드를 실행시킨 대상
            // 게터 메서드는 언제나 자신이 속한 실제 객체에 의해 실행된다.
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return adjDescriptor;
}

class Printer {
    message = 'This works!'

    @Autobind
    showMessage() {
        console.log(this.message);
    }
}

const p = new Printer();

const button = document.querySelector('button')!;
button.addEventListener('click', p.showMessage);
// p.showMessage가이벤트 리스너에서 호출되는 경우 this가 이벤트의 대상을 가리킨다. (이벤트 대상에 바인딩)
// p에 바인딩하도록 .bind(p)

interface ValidatorConfig  {
    [property: string]: {
        [validatableProp: string]: string[] // ['required', 'positive']
    }
}

const registeredValidators: ValidatorConfig = {};
 
function Required(target: any, propName: string) {
    registeredValidators[target.constructor.name] = {
        ...registeredValidators[target.constructor.name],
        [propName]: [...(registeredValidators[target.constructor.name]?.[propName] ?? []), 'required']
    };
}
 
function PositiveNumber(target: any, propName: string) {
    registeredValidators[target.constructor.name] = {
        ...registeredValidators[target.constructor.name],
        [propName]: [...(registeredValidators[target.constructor.name]?.[propName] ?? []), 'positive']
    };
}

function validate(obj: any) {
    const objValidatorConfig = registeredValidators[obj.constructor.name];
    if (!objValidatorConfig) {
        return true;
    }
    let isValid = true;
    for (const prop in objValidatorConfig) {
        for (const validator of objValidatorConfig[prop]) {
            switch (validator) {
                case 'required':
                    isValid = isValid && !!obj[prop];
                    break;
                case 'positive':
                    isValid = isValid && obj[prop] > 0;
                    break;
            }
        }
    }
    return isValid;
}

class Course {
    @Required
    title: string;
    @PositiveNumber
    price: number;

    constructor(t: string, p: number) {
        this.title = t;
        this.price = p;
    }
}

const courseForm = document.querySelector('form')!;
courseForm.addEventListener('submit', event => {
    // 폼 제출 X, http 요청 X
    event.preventDefault();

    const titleEl = document.getElementById('title') as HTMLInputElement;
    const priceEl = document.getElementById('price') as HTMLInputElement;

    const title = titleEl.value;
    const price = +priceEl.value; 

    const createdCourse = new Course(title, price);

    if (!validate(createdCourse)) {
        alert('유효하지 않음');
        return;
    }
    console.log(createdCourse);
})

//참고자료
// ts class validator
// https://github.com/typestack/class-validator