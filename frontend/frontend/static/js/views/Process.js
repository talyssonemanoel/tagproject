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
        this.phaseKeys = ['attachmentPhase', 'opinionPhase', 'decisionPhase', 'implementationPhase']  
    }

    async getMenu() {

        let row = `
            <ul class="nav nav-tabs justify-content-center">
                <li class="nav-item">
                    <a class="nav-link" href="/">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/tag/list">Unidade Organizacional</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/tag/${this.params.tag_key}/process/list">Processos</a>
                </li>`
        if (this.doc._key) {
            row += `<li class="nav-item">
                        <a class="nav-link active" href="#" style="background-color: #F8F8F8; border-bottom-color: #F8F8F8;">${this.doc.name}</a>
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
        if (this.params.process_key) {
            console.log(this.params.process_key)
            this.doc = await fetchData(`/process/${this.params.process_key}`, "GET")
            this.currentPhaseView = this.doc.currentPhase;
            this.user = await fetchData(`/user/getUser`, "GET")

            //this.doc.tags = await fetchData(`/process/tags/${this.params._key}`, "GET");

        }
    }
    async getHtml() {

        let row = ``

        row += `<input type="hidden" class="aof-input" id="_key" value=${this.doc._key}>`
        row += `<input type="hidden" class="aof-input" id="farm_key" value=}>`

        if (this.doc._key) {
            row += `
                <div class="card" style="border-top: none;">
                    <div class="card-header">
                        <div>
                        <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                            <input type="radio" class="btn-check" name="btnradioaba" id="btnradioaba1" autocomplete="off" checked onclick='ShowIntegra("${this.doc.listPage.join(",")}")'>
                            <label class="btn btn-outline-primary" for="btnradioaba1">Integra</label>

                            <input type="radio" class="btn-check" name="btnradioaba" id="btnradioaba2" autocomplete="off" onclick="ShowEdit()">
                            <label class="btn btn-outline-primary" for="btnradioaba2">Parecer</label>
                            <input type="radio" class="btn-check" name="btnradioaba" id="btnradioaba3" autocomplete="off" onclick='ShowUpload("${this.doc.listClassDocument.join(",")}", "${this.doc._key}")'>
                            <label class="btn btn-outline-primary" for="btnradioaba3">Upload</label>
                            <input type="radio" class="btn-check" name="btnradioaba" id="btnradioaba4" autocomplete="off" onclick=" ShowDispach()">
                            <label class="btn btn-outline-primary" for="btnradioaba4">Despacho</label>
                        </div>
                        </div>
                    </div>
                    <div id = "card-body-process" class="card-body">
                    </div>`
                    
                    /*row += `<div class="card-footer">
                                <button aof-view class="btn btn-primary btn-lg form-control submit" id="saveButton" onclick="SavePage()" style="display: none;">Salvar</button>
                            </div>`*/
                row += `</div>`
                setTimeout(() => ShowIntegra(this.doc.listPage.join(",")), 0);     
        } else {
            row +=
                `<div class="card-body">
                        <div class="form-floating">
                            <input class="form-control needs-validation aof-input" 
                                type="text" 
                                value='${this.doc.name}'
                                oninput=""
                                autocomplete="off" 
                                id="" 
                                placeholder="Nome do Serviço" 
                                required>
                                <div id="name-validation" class=""></div>                
                            <label for="name">Nome do Serviço:</label>
                        </div>
                        <hr>
                        `

            if (1 < 2) {
                row += `
                            <div class="card">
                                <div class="card-header">
                                   Mover processo
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col">         
                                            <div class="form-floating">
                                                <input type="hidden" id="tag_key">
                                                <input class="form-control needs-validation" 
                                                    type="text" 
                                                    value=''
                                                    oninput="searchTagName(this)"
                                                    autocomplete="off" 
                                                    id="tag_name"
                                                    placeholder="aqui" 
                                                    required>
                                                    <div id="name_validation" class=""></div>                
                                                <label for="name">Nome da tag:</label>
                                            </div>
                                            <div id="list_tag_name1"></div>
                                        </div>
                                        
                                        <div class="col">
                                            <button aof-view class="btn btn-primary h-100" onclick="moveProcess(${this.doc._key})">Mover</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer text-center">
                                    <h6 class="card-text">Tags</h6>
                                    <div id="list_tag" class="d-flex flex-wrap justify-content-center">
                                    `
                /*for (let i = 0; i < this.doc.tags.length; i++) {
                    row += `<div class="btn-group" id="${this.doc.tags[i]._key}">
                         <button type="button" disabled class="btn btn-sm btn-primary">${this.doc.tags[i].name}</button>
                         <button type="button" disabled class="btn btn-sm btn-secondary">${this.doc.tags[i].role}</button>
                         <button type="button" class="btn btn-sm" onclick="removeProcessElement('${this.doc._key}', '${this.doc.tags[i]._key}')">X</button>
                     </div>`
                 }*/

                row += `
                        </div>
                    </div>
                </div>`


                row += `<input type="hidden" class="aof-input-json" id="product" value=${this.doc.tag}>`


                row += `<hr>`
                row += ` 
                <div class="card">
                    <div class="card-header">
                        Atribuir responsabilidade
                    </div>                
                    <div class="card-body">
                                    <div class="row">
                                        <div class="col">         
                                            <div class="form-floating">
                                                <input class="form-control needs-validation" 
                                                    type="text" 
                                                    value=''
                                                    oninput="searchServiceProduct(this)"
                                                    autocomplete="off" 
                                                    id="user_name"
                                                    placeholder="Nome do usuário" 
                                                    required>
                                                    <div id="name_validation" class=""></div>                
                                                <label for="name">Nome do usuário:</label>
                                            </div>
                                            <div id="list_service_product"></div>
                                        </div>
                                        <div class="col">
                                            <button aof-view class="btn btn-primary button-add-service h-100" onclick="addUser(document.getElementById('user_name').value, document.getElementById('roleSelect').value)" >Atribuir</button>
                                        </div>
                                    </div>
                                </div>
                    <div class="card-footer text-center">
                        <h6 class="card-text">Usuários</h6>
                        <div id="list_users" class="d-flex flex-wrap justify-content-center">
                    </div>
                </div>
                </div>
        `
            }

            row += `
            </div>
            <div class="card-footer">`
            row += ` </div>
        </div>`
            //row += `<img onload='updateStockInputForm(${JSON.stringify(this.doc)})' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==' >`

        }
        
        return row;
    }

}