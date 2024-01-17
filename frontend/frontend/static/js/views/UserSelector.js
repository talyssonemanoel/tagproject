import AbstractView from "./AbstractView.js";
export default class extends AbstractView {
    result = "No Result"

    constructor(params) {
        super(params);
        this.setTitle("Processos");

        this.doc = {
            _key: "",
            name: "",
            structTag: "",
            tag: {
                _key: "",
                role: ""
            },
            tags: [],
        };
        this.currentPhaseView;
        this. phaseKeys = ['attachmentPhase', 'opinionPhase', 'decisionPhase', 'implementationPhase']
    }

    async getMenu() {

        let row = `
            <ul class="nav nav-tabs justify-content-center">
                <li class="nav-item">
                    <a class="nav-link" href="/">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/tag/list">Tags</a>
                </li>`
        if (this.doc._key) {
            row += `<li class="nav-item">
                        <a class="nav-link active" href="#">${this.doc.name}</a>
                    </li>`
        } else {
            row += `<li class="nav-item">
                        <a class="nav-link active" href="#">Novo Processo</a>
                    </li>`
        }

        row += `</ul>
            `
        return row;
    }

    async init() {

            this.user = await fetchData(`/user/getUser`, "GET")

    }
    async getHtml() {
        let row = `
        <div class="card">     
                <div class="card-body">
                <div class="mb-3">`
                console.log(this.user)
                if (this.user) {
                    console.log(this.user)
                row += `<h4>Usuário atual: ${this.user.cargo}</h4>`
            }
                row += `</div>
                <ul class="list-group">
                    <li class="list-group-item">
                        <button type="button" class="btn btn-primary" onclick="updateUser('attachmentPhase')">Cidadão</button>
                    </li>
                    <li class="list-group-item">
                        <button type="button" class="btn btn-primary" onclick="updateUser('opinionPhase')">Opinião</button>
                    </li>
                    <li class="list-group-item">
                        <button type="button" class="btn btn-primary" onclick="updateUser('decisionPhase')">Decisão</button>
                    </li>
                </ul>
                <div>
            </div>
        `
        return row;
    }
    
    // Call this function after the HTML from getHtml is added to the DOM
    
     
}