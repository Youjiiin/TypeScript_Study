interface Admin {
    name: string;
    privileges: string[];
};

interface Employee {
    name: string;
    startDate: Date;
};

interface ElevatedEmployee extends Employee, Admin {}

// 교차타입
//type ElevatedEmployee = Admin & Employee;

const e1: ElevatedEmployee = {
    name: 'Yujin',
    privileges: ['create-server'],
    startDate: new Date()
};

type Combinable = string | number;
type Numberic = number | boolean;

// 교차 연산자는 여러 타입을 교차시키는 데 쓸 수 있고 교차되는 타입들에 공통적으로 있는 타입을 교차시키는 것이다.
// 유니언 타입을 교차시킨다면 해당 타입들에 공통적으로 있는 것이 교차 (위의 예시에서는 number)
// 객체 타입을 교차시킨다면 각 객체의 속성을 모두 조합한 게 교차 결과 (ex: ElevatedEmployee)
type Universal = Combinable & Numberic;

function add(a: Combinable, b: Combinable) {
    if (typeof a === 'string' || typeof b === 'string') {
        return a.toString() + b.toString();
    }
    return a + b;
}

type UnknownEmployee = Employee | Admin;

function printEmployeeInfo(emp: UnknownEmployee) {
    console.log('Name: ' + emp.name);
    if ('privileges' in emp) {
        //typeof 로는 객체내 요소를 파악할 수 없어서 'in' 키워드를 사용하도록 한다.
        console.log('Privileges: ' + emp.privileges);
    }
    if ('startDate' in emp) {
        console.log('startDate: ' + emp.startDate);
    }
}
printEmployeeInfo({name: 'Yujiiin', startDate: new Date()});


class Car {
    drive() {
        console.log('Driving...');
    }
}

class Truck {
    drive() {
        console.log('Driving truck!!!');
    }

    loadCargo(amount: number) {
        console.log('Loading cargo...' + amount);
    }
}

type Vehicle = Car | Truck;

const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle: Vehicle) {
    vehicle.drive();
    if (vehicle instanceof Truck) {
        //Truck 인스턴스인지 확인
        vehicle.loadCargo(1000);
    }
}

useVehicle(v1);
useVehicle(v2);