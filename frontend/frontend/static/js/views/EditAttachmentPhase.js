import AbstractView from "./AbstractView.js";
export default class extends AbstractView {
    result = "No Result"

    constructor(params) {
        super(params);
        this.setTitle("Juntada de documentos");

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
        this.phaseViews = {
            "attachmentPhase": AttachDocuments,
            "opinionPhase": opinionPhase,
            "decisionPhase": decisionPhase,
            "implementationPhase": implementationPhase
        };

        this.faseAtual = "attachmentPhase";
    }

    async getMenu() {

        let row = `
            <ul class="nav nav-tabs justify-content-center">
                <li class="nav-item">
                    <a class="nav-link" href="/">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/process/list">Processos</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/process/${this.doc._key}">${this.doc.name}</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link active">Documentação</a>
                </li>
            </ul>
            `
        return row;
    }

    async init() {
        if (this.params._key) {
            this.doc = await fetchData(`/process/${this.params._key}`, "GET")
            this.currentPhaseView = this.doc.currentPhase;

            //this.doc.tags = await fetchData(`/process/tags/${this.params._key}`, "GET");

        }
    }
    async getHtml() {

        let row = ``

        row += `<input type="hidden" class="aof-input" id="_key" value=>`
        row += `<input type="hidden" class="aof-input" id="farm_key" value=}>`

        row += `
        <div class="card">            
            `


        if (this.doc._key) {
            row += `
                <h3 class=" card-header h-100 d-flex justify-content-center">Documentação</h3>
                <div class="card-body">
                    <div class="card mb-3">
                        <div class="card-header">
                            <div>Documentação</div>
                        </div>
                        <div class="card-body">
                            <div class="input-group mb-3">
                                <input type="file" class="form-control" id="inputGroupFile01">
                            </div>
                            <div id="list_doc"></div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div>Observações</div>
                        </div>
                        <div class="card-body">
                            <div class="form-floating">
                                <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px"></textarea>
                                <label for="floatingTextarea2">Comentários</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="buttonEdit" class="card-footer">`
                if (this.doc.currentPhase == 0){
                    row += `<button aof-view class="btn btn-primary btn-lg form-control" onclick='submitAttachmentPhase(${this.doc._key})' >Finalizar</button>`
                }
                row += `</div>`
        }
        return row;
    }

}