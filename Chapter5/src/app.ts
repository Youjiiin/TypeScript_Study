class Department {
    // private id: string;
    // private name: string;
    protected employees: string[] = [];
    //protected는 private와 유사하지만 이는 상속받은 클래스에서도 사용 가능하다. 

    constructor(private readonly id: string, public name: string) { //생성자
        // 정의 + 할당
        // readonly : 읽기 전용 ->  한번 생성하면 수정금지
        // this.id = id;
        // this.name = n;
    }

    describe(this: Department) { //메서드
        //this 키워드가 항상 Department 클래스 객체를 참조
        console.log(`Department(${this.id}): ${this.name}`);
    }

    addEmployee(employee: string) {
        this.employees.push(employee);
    }

    printEmployeeInformation() {
        console.log(this.employees.length);
        console.log(this.employees);
    }
}

class ITDepartment extends Department {
    admins: string[];
    constructor(id: string, admins: string[]) {
        super(id, 'IT');
        //super: 기본 클래스의 생성자를 호출(부모 클래스의 생성자 인수를 받는다. + 값 전달)
        this.admins = admins;
    }
}

class AccountingDepartment extends Department {
    private lastReport: string;

    get mostRecentReport() {
        if (this.lastReport) {
            return this.lastReport;
        }
        throw new Error('No report found.');
    }

    set mostRecentReport(value: string) {
        if (!value) {
            throw new Error('No report found.');
        }
        this.addReport(value);
    }

    constructor(id: string, private reports: string[]){
        super(id, 'Accounting');
        this.lastReport = reports[0];
    }

    addEmployee(name: string) {
        if (name === 'Max') {
            return;
        }
        this.employees.push(name);
    }

    addReport(text: string) {
        this.reports.push(text);
        this.lastReport = text;
    }

    printReports() {
        console.log(this.reports);
    }
}

const department = new Department('a', 'Accounting');
const it = new ITDepartment('a', ['Yujin']);
const accounting = new AccountingDepartment('d2', [])

department.addEmployee('Max');
department.addEmployee('Manu');
//accounting.employees[2] = 'Anna';
//private면 설정 안됨

department.describe();
department.printEmployeeInformation();

console.log(it);

accounting.mostRecentReport = '하하';
accounting.addReport('클났다..');
accounting.addEmployee('Max');
accounting.addEmployee('Yujin');
accounting.printEmployeeInformation();
accounting.printReports();
console.log(accounting.mostRecentReport);

//const accountingCopy = { name: 'DUMMY', describe: accounting.describe };
//accountingCopy.describe(); 
// 호출한 객체를 참조만하고 있을 뿐, 메서드를 실행하는 것이 아니다. 값을 전달하지 않는다.
//메서드에 this키워드를 작성해주면 오류 발생 -> 프로퍼티 전달해주면 됨