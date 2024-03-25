// const person: {
//     name: string;
//     age: number;
//     hobbies: string[];
//     role: [number, string]; 
//      -> tuple : 길이와 타입이 정해져있는 타입
// } = {   //{} === object
// => 작성해도 되지만, 추론하도록 두는 편이 낫다.
//     name: 'Youjiiin',
//     age: 25,
//     hobbies: ['sports', 'cooking'],
//     role: [2, 'author'] //tuple
// };


// -- ENUM --
// const ADMIN = 0;
// const READ_ONLY = 1;
// const AUTHOR = 2;
// 위는 관리하기 복잡
// 상수 관리에 유용한 enum사용
// 사람이 읽을 수 있는 식별자가 필요하기에 사용
enum Role { ADMIN = 5, READ_ONLY = 100, AUTHOR = 'AUTHOR' }; 
// 숫자를 매핑해주면 뒤의 것들은 +1
// 각각의 숫자를 지정해줘도 됨
// string으로 지정해줘도 됨

const person = {
    name: 'Youjiiin',
    age: 25,
    hobbies: ['sports', 'cooking'],
    role: Role.ADMIN // enum
};

// -- TUPLE --
//person.role.push('admin'); // 튜플에서 push에 대한 오류는 잡지 못한다. 
//person.role[1] = 10;
//person.role = [0, 'admin', 'user']; // error: Source has 3 element(s) but target allows only 2. 


// -- ANY --
let favoriteActivities: string[];
//any는 유용하지만, 타입스크립트의 장점을 전혀 활용하지 못해서 사용을 지양하는 것이 좋다.
//어떤 값이 들어올지 모르는 상황에서만 사용하도록. -> 이후 런타임 검사
favoriteActivities = ['sprots']; //문자열 배열(string[])로 선언해줘 오류 발생 -> any타입으로 변경

console.log(person);

for (const hobby of person.hobbies) {
    console.log(hobby.toUpperCase()); 
    //hobby가 문자열임을 알아서 문자열 관련 자동완성이 나타난다. 
    //console.log(hobby.map())  //erorr
}

// -- ENUM 활용 --
if (person.role === Role.ADMIN) {
    console.log('is admin');
}