class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;

    constructor() {
        this.templateElement = <HTMLTemplateElement>document.getElementById('project-input')!;
        // === this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = <HTMLDivElement>document.getElementById('app')!;

        const importedNode = document.importNode(this.templateElement.content, true);
        // 위는 생성자 안에 있고, DocumentFragment이기 때문에 삽입할 수 없다.(insertAdjacentElement)에
        // HTMLFormElement가 될 것이라고 알려줘야 한다. 
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.attach();
    }

    private attach() {
        // insertAdjacentElement : HTML 요소를 삽입할 때 사용(JS)
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}

const prjInput = new ProjectInput();