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

//ProjectList 클래스
class ProjectList {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;

    constructor(private type: 'active' | 'finished') {
        this.templateElement = <HTMLTemplateElement>document.getElementById('project-list')!;
        this.hostElement = <HTMLDivElement>document.getElementById('app')!;

        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as HTMLElement;
        this.element.id = `${this.type}-projects`;
        this.attach();
        this.renderContent();
    }

    private renderContent() {
        const listId = `${this.type}-project-list`;
        this.element .querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    private attach() {
        this.hostElement.insertAdjacentElement('beforeend', this.element);
    }
}

// 프로젝트 input 클래스
class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        this.templateElement = <HTMLTemplateElement>document.getElementById('project-input')!;
        // === this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = <HTMLDivElement>document.getElementById('app')!;

        const importedNode = document.importNode(this.templateElement.content, true);
        // 위는 생성자 안에 있고, DocumentFragment이기 때문에 삽입할 수 없다.(insertAdjacentElement)에
        // HTMLFormElement가 될 것이라고 알려줘야 한다. 
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = 'user-input';

        // 요소에 접근
        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

        this.configure();
        this.attach();
    }

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
            console.log(title, desc, people);
            this.clearInputs();
        }
    }

    private configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }

    private attach() {
        // insertAdjacentElement : HTML 요소를 삽입할 때 사용(JS)
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');