import AbstractView from "./AbstractView.js";
export default class extends AbstractView {
    result = "No Result"

    constructor(params) {
        super(params);
        this.setTitle("Implementação");

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
                    <a class="nav-link active">Implementação</a>
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
                <h3 class=" card-header h-100 d-flex justify-content-center">Implementação</h3>
                <div class="card-body">
                    <div class="mb-3">
                        <div class="d-flex justify-content-center">
                            <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                                <input type="radio" class="btn-check" name="btnradio" id="btnradio1" value="false" autocomplete="off" onclick="document.getElementById('saveButton').disabled = false;">
                                <label class="btn btn-outline-primary" for="btnradio1">Rejeitar</label>
                                
                                <input type="radio" class="btn-check" name="btnradio" id="btnradio3" value="true" autocomplete="off" onclick="document.getElementById('saveButton').disabled = false;">
                                <label class="btn btn-outline-primary" for="btnradio3">Aprovar</label>                                                        
                            </div>
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
                if (this.doc.currentPhase == 3){
                    row += `<button id="saveButton" aof-view class="btn btn-primary btn-lg form-control" onclick='submitPhase(${this.doc._key})' disabled>Salvar</button>`
                }                
                row += `</div>`
        }
        return row;
    }

}