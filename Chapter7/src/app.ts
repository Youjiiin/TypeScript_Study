// 제네릭
const names : any[] = [];
//Array 타입으로 명시하면 오류 -> any[] / Array<string>과 같이 명시
names[0].split(' ');

// promise 타입도 배열처럼 작동한다.  <>안에는 반환타입
const promise: Promise<string> = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('This is done!');
    }, 2000)
});

promise.then(data => {
    data.split(' ');
})

// 제네릭 타입 정보를 줌으로써 반환 타입 / 배열 타입을 미리 알려주고, 작업을 더 유연하게 할 수 있다. 