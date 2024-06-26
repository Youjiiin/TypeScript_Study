// 제네릭
// 타입 안정성 + 유연성
// const names : any[] = [];
// //Array 타입으로 명시하면 오류 -> any[] / Array<string>과 같이 명시
// names[0].split(' ');

// // promise 타입도 배열처럼 작동한다.  <>안에는 반환타입
// const promise: Promise<string> = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('This is done!');
//     }, 2000)
// });

// promise.then(data => {
//     data.split(' ');
// })
// 제네릭 타입 정보를 줌으로써 반환 타입 / 배열 타입을 미리 알려주고, 작업을 더 유연하게 할 수 있다. 

// 제네릭 함수
// 어떤 타입이 들어올지 모르기에 아래와 같이 지정

// 제약 조건 걸기
// T타입은 어떤 구조의 객체여도 되지만, 어쨋든 객체여야 한다고 한계를 지정 -> extends object (다른 타입 가능)
// -> 무조건 해야하는 것은 아님
function merge<T extends object, U extends object >(objA: T, objB: U) : T & U {
    return Object.assign({}, objA, objB);
} 

console.log(merge({name: 'Yujin'}, {age: 25}));

//merge<{name: string}, {age: number}>를 써줘도 되지만 번거롭기 때문에 생략해도 됨, 타입스크립트는 이를 이미 추론하고 있음
const mergedObj = merge<{name: string}, {age: number}>({name: 'Yujin'}, {age: 25});
const mergedObj2 = merge({name: 'Yujin', hobbies: ['Game']}, {age: 25});
console.log(mergedObj.age);
console.log(mergedObj2.hobbies);

// 다루는 데이터 타입을 구체적으로 명시(일반 함수) -> ex) length
interface Lengthy { //필수
    length: number;
}
// 정확한 타입을 제한하지 않음
function countAndDescribe<T extends Lengthy>(element:T): [T, string] {
    let descriptionText = 'no value'
    if (element.length === 1) {
        descriptionText = 'Got 1 element.'
    } else if (element.length > 1) {
        descriptionText = 'Got ' + element.length + ' elements.'
    }
    return [element, descriptionText];
}

console.log(countAndDescribe([]));

// 제네릭이 없다면, 정말 key가 있는지 보장할 수 없기에 오류 발생
// extends keyof : 속성임을 알려주기
function extractAndConvert<T extends object, U extends keyof T>(obj: T, key: U) {
    return obj[key];
}

console.log(extractAndConvert({name: 'Yujin'}, 'name'));


// 제네릭 클래스
// 클래스 뿐만 아니라 메서드에도 제네릭을 적용할 수 있다.
class DataStorage<T extends string | number | boolean> {
    private data: T[] = [];
    // private data: (string | number | boolean)[] = [];
    // 위와 같이 작성하면 제네릭 방식으로 초기화가 불가능하다.
    // private data: string []| number[] | boolean[] = [];
    // 위와 같이 작성하면, 어떤 타입이든 사용가능하다. -> 원하는 것은 셋 중 하나의 타입을 선택하면 그 타입만 사용가능하토록.

    addItem(item: T) {
        this.data.push(item);
    }

    removeItem(item: T) {
        if (this.data.indexOf(item) === -1) {
            return;
        }
        this.data.splice(this.data.indexOf(item), 1);
    }

    getItems() {
        return [...this.data];
    }
}

const textStorage = new DataStorage<string>();
textStorage.addItem('Yujin');
textStorage.addItem('Yujiiiiiin');
textStorage.removeItem('Yujin');
console.log(textStorage.getItems());

// 숫자만 저장 가능
const numberStorage = new DataStorage<number>();

// 객체와 같이 비원시값(참조값)을 잘 다루지 못한다.
// indexOf로 인해서 -> 주소를 찾을 수 없어서 -1반환, 맨 마지막 요소만을 제거 
// const objStorage = new DataStorage<object>();
// const yujinObj = {name: 'Yujin'};
// objStorage.addItem(yujinObj);
// objStorage.addItem({name: 'Yujiiiiiiiiiiiin'});
// objStorage.removeItem(yujinObj);
// console.log(objStorage.getItems());

// Partial 타입
// 옵션 전환
// Partial<타입> : '타입'이 될것임을 명시
interface CourseGoal {
    title: string;
    description: string;
    completeUntil: Date;
}

function createCourseGoal(title: string, description: string, date: Date): CourseGoal {
    let CourseGoal : Partial<CourseGoal> = {};
    CourseGoal.title = title;
    CourseGoal.description = description;
    CourseGoal.completeUntil = date;

    // 형 변환을 해주어야 한다. 
    return CourseGoal as CourseGoal;
}

// ReadOnly
// 수정 불가능 : 읽기 전용 - 객체, 배열
const names: Readonly<string[]> = ['Yujin', 'name'];
// 수정 불가능 -> names.push('Yuujiin');