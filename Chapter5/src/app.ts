// 인터페이스는 클래스, 메서드의 구조를 정의
// 객체의 구조와 인터페이스의 구조와 일치하는지 타입을 확인할 수 있다.
// 값은 할당할 수 없다.(고정값 포함)

// 사실 interface 대신 type을 사용해서 커스텀 타입으로 사용해도 되긴한다.
// 하지만, 같은 것이 아니다.
// 인터페이스가 훨씬 명확하다.
// 인터페이스로 정의하면 객체의 구조를 정의하고자 한다는 것을 명확히 할 수 있다.
// + 클래스 안에 인터페이스를 구현할 수 있다.

// 두 클래스에 하나의 메서드가 존재하도록 강제하는 인터페이스를 구현하도록 하는 것이 인터페이스의 존재이유 

//type AddFn = (a: number, b: number) => number;
interface AddFn {
    (a: number, b: number): number;
}

let add: AddFn;

add = (n1: number, n2: number) => {
    return n1 + n2;
}

interface Named {
    // public, private는 불가능하지만 읽기전용은 가능
    readonly name?: string;
    outputName?: string;
    // 이 프로퍼티는 있어도되고 없어도 된다. (?을 붙이기)
}

interface Greetable extends Named{
    greet(pharse: string): void;
}

// 인터페이스는 여러개 상속받을 수 있다.
class Person implements Greetable {
  name?: string;
  age = 25;

  constructor(n?: string) {
    if (n) {
        this.name = n;
    }
  }

  greet(pharse: string) {
    if(this.name) {
        console.log(pharse + " " + this.name);
    } else {
        console.log('hi')
    }
  }
}

// 추상 클래스는 오버라이드할 추상 메서드를 제공하면서도 완전히 구현된 부분도 함께 제공 가능
// 인터페이스는 공통된 구현을 인터페이스를 사용해 클래스에 포함되어야 하는 기능의 구조를 정의할 수 있다. (구현 X)

let user1: Greetable;
// 객체 생성
user1 = new Person();

user1.greet("Hiiiiiiiiiiiiii I'm");
console.log(user1);