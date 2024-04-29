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

    private submitHandler(event: Event) {
        event.preventDefault();
        // this가 이벤트의 현재 타깃에 바인딩 되기 때문에 vlaue값을 가져오지 못한다.
        console.log(this.titleInputElement.value); 
    }

    private configure() {
        this.element.addEventListener('submit', this.submitHandler.bind(this));
    }

    private attach() {
        // insertAdjacentElement : HTML 요소를 삽입할 때 사용(JS)
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}

const prjInput = new ProjectInput();