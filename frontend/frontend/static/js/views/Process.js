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
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/process/list">Processos</a>
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
                <h3 class=" card-header h-100 d-flex justify-content-center">${this.doc.name}</h3>
                <div class="card-body">
            `
            row += `<div id="timeline">`
            row += await RenderTimeline(this.doc, this.currentPhaseView, this.user.cargo)
            row += `</div>`
            row +=`<div id="bodyphase">`
            row += await PhaseView(this.doc, this.currentPhaseView)
            row +=`</div>`
            row +=`</div>`
            row += `
                <div id="buttonEdit" class="card-footer">`       
            if(this.phaseKeys[this.doc.currentPhase] == this.user.cargo)
                row += `<a aof-view class="btn btn-primary btn-lg form-control submit" href="/process/${this.doc._key}/${this.phaseKeys[this.doc.currentPhase]}" >Editar</a>`
            row +=`</div>`
            if (this.doc.currentPhase == 0) {
                await FetchAndDisplayDocuments(this.doc._key)
            }
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
        if(this.user.cargo=="attachmentPhase"){
            row += `<button aof-view class="btn btn-primary btn-lg form-control submit" onclick="saveStockInput()" >Editar</button>`
        }
        row += ` </div>
        </div>`
        //row += `<img onload='updateStockInputForm(${JSON.stringify(this.doc)})' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==' >`

    }
        return row;
    }
    
}