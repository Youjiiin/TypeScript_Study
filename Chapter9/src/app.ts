enum ProjectStatus { Active, Finished }
// 프로젝트 타입
class Project {   
    constructor(
        public id: string, 
        public title: string, 
        public descriptioin: string, 
        public people: number, 
        public status: ProjectStatus) {}
}

// 커스텀 타입
type Listener<T> = (items: T[]) => void;

class State<T> {
    protected listeners: Listener<T>[] = [];

    addListeners(listenrFn: Listener<T>) {
        this.listeners.push(listenrFn);
    }
}

// 프로젝트 상태관리
class ProjectState extends State<Project>{
    private projects: Project[] = [];
    private static instance: ProjectState;

    // private 생성자를 사용해서 싱글톤 클래스임을 보장
    private constructor() {
        super();
    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addProject(title: string, description: string, numOfPeople: number) {
        const newProject = new Project(
            Math.random().toString(),
            title,
            description,
            numOfPeople,
            ProjectStatus.Active
        );
        this.projects.push(newProject);
        for (const listenrFn of this.listeners) {
            //원본참조를 전달하면 버그발생 우려
            listenrFn(this.projects.slice());
        }
    }
}

//addProject를 사용하기 위해 전역 인스턴스 생성
const projectState = ProjectState.getInstance();

// 유효성 검증
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(validatableInput: Validatable) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }

    if (
        validatableInput.minLength != null &&
        typeof validatableInput.value === 'string'
        ) {
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
    }
    if (
        validatableInput.maxLength != null && 
        typeof validatableInput.value === 'string'
    ) {
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
    }

    if (
        validatableInput.min != null && 
        typeof validatableInput.value === 'number'
    ) {
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if (
        validatableInput.max != null && 
        typeof validatableInput.value === 'number'
    ) {
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }

    return isValid;
}

// 자동 바인드 데코레이터
function autobind(
    target: any,
    methodName: string,
    descriptor: PropertyDescriptor
    ) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}

// 컴포넌트 베이스 클래스
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;

    constructor(
        templateId: string, 
        hostElementId: string, 
        insertAtStart: boolean,
        newElementId?: string | undefined,
    ) {
        this.templateElement = <HTMLTemplateElement>document.getElementById(templateId)!;
        this.hostElement = document.getElementById(hostElementId)! as T;

        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as U;
        if(newElementId) {
            this.element.id = newElementId;
        }
        this.attach(insertAtStart);
    }

    private attach(insertAtBeginning: boolean) {
        this.hostElement.insertAdjacentElement(
            insertAtBeginning ? 'beforeend' : 'beforeend', 
            this.element
        );
    }

    abstract configure(): void;
    abstract renderContent(): void;
}

//ProjectItem Class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
    private project: Project;

    // 보통 필드 아래, 생성자 위에 게터를 넣어준다.
    get persons() {
        if (this.project.people === 1) {
            return '단 1명'
        } else {
            return `무려 ${this.project.people}명`
        }
    }

    constructor(hostId: string, project: Project) {
        super('single-project', hostId, false, project.id);
        this.project = project;

        this.configure();
        this.renderContent();
    }

    configure(): void {}
    renderContent(): void {
        this.element.querySelector('h2')!.textContent = this.project.title;
        this.element.querySelector('h3')!.textContent = this.persons;
        this.element.querySelector('p')!.textContent = this.project.descriptioin;
    }
}

//ProjectList 클래스
class ProjectList extends Component<HTMLDivElement, HTMLElement>{
    assignedProjects: Project[];

    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', false, `${type}-projects`);
        this.assignedProjects = [];

        // 상속받는 클래스의 생성자는 베이스 클래스 생성자가 실행을 완료한 후에 설정되므로 configure/renderContent는 그것에 의존해서 자식 클래스에서 호출하는 것이 안전하다
        this.configure();
        this.renderContent();
    }

    configure(): void {
        projectState.addListeners((projects: Project[]) => {
            // true리턴 : 생성된 배열에 그 항목을 유지
            // flase리턴 : relevantProjects에서 항목 삭제
            const relevantProjects = projects.filter(prj => {
                if (this.type === 'active') {
                    return prj.status === ProjectStatus.Active;
                }
                return prj.status === ProjectStatus.Finished;
            });
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
    }

    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-project-list`)! as HTMLUListElement;

        // 모든 콘텐츠를 지워서 중복 렌더링을 방지
        listEl.innerHTML = '';

        for (const prjItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector('ul')!.id, prjItem);
        }
    }

    renderContent() {
        const listId = `${this.type}-project-list`;
        this.element .querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }
}


// 프로젝트 input 클래스
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        super('project-input', 'app', true, 'user-input');

        // 요소에 접근
        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

        this.configure();
    }

    configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }

    renderContent(): void {}

    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true,
        };
        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        };
        const peopleValidatable: Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        };

        if (
            !validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)
        ) {
            alert('유효하지 않은 입력입니다.');
            return;
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }

    private clearInputs() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }

    @autobind
    private submitHandler(event: Event) {
        event.preventDefault();
    
        // this가 이벤트의 현재 타깃에 바인딩 되기 때문에 vlaue값을 가져오지 못한다. -> submitHandler 호출할 때 .bind(this)를 해주거나, 데코레이터를 만든다.
        //console.log(this.titleInputElement.value); 

        const userInput = this.gatherUserInput();
        // 튜플은 타입스크립트에만 있는 것, 자바스크립트에서는 그냥 배열취급
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            projectState.addProject(title, desc, people);
            this.clearInputs();
        }
    }
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');