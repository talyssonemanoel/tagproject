import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    result = "No Result"

    constructor(params) {
        super(params);
        this.setTitle("User");

        this.doc = {
            _key: "",
            name: "",
            piquete_key: this.params.piquete_key,
            estimated_cost: "",
            real_cost: "",
            estimated_date: "",
            estimated_time: "",
            real_date: "",
            real_time: "",
            tag: {
                _key: "",
                name: "",
                role: ""
            },
            product: {
                _key: "",
                name: "",
                role: ""
            },
            tags: []
        };

    }

    async getMenu() {

        let row = `
                <ul class="nav nav-tabs justify-content-center">
                    <li class="nav-item">
                        <a class="nav-link" href="/">Home</a>
                    </li>
                    ${this.user && (this.user.role === "strategic" || this.user.role === "tactical") ?
                        `<li class="nav-item">
                            <a class="nav-link" href="/user/list">Usuários</a>
                        </li>` : ''}
                    <li class="nav-item">
                        <a class="nav-link active" href="#">Novo Usuário</a>
                    </li>
            </ul>
            `
        return row;
    }

    async init() {
        if (this.params._key) {
            this.doc = await fetchData(`/user/${this.params._key}`, "GET");
            
            if (this.doc.listTag.length > 0) {
            // Cria um array com os _keys de cada item em this.doc.listTag
            this.structTags = this.doc.listTag.map(tag => tag._key);

            // Chama a nova função fetchProcesses e atribui o resultado à sua lista
            this.list = await fetchProcesses(this.structTags);
            console.log(this.list);
        }
        }
    }
    
    
    
    async getHtml() {

        let row = ``

        row += `<input type="hidden" class="aof-input" id="_key" value=>`
        row += `<input type="hidden" class="aof-input" id="farm_key" value=}>`

        row += `
        <div class="card">            
            <div class="card-body">`

        row +=
            `
                    <div class="form-floating">
                        <input class="form-control needs-validation aof-input" 
                            type="text" 
                            value='${this.doc.name}'
                            oninput="searchServiceName(this)"
                            autocomplete="off" 
                            id="name" 
                            placeholder="Nome do Usuário" 
                            required>
                            <div id="name-validation" class=""></div>                
                        <label for="name">Nome do Usuário:</label>
                    </div>`
        row += `<div id="list_service_name"></div>`

        row += `<hr>`

        row += `
                            <div class="card">
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
                                                    placeholder="Nome da tag" 
                                                    required>
                                                    <div id="name_validation" class=""></div>                
                                                <label for="name">Nome da tag:</label>
                                            </div>
                                            <div id="list_tag_name"></div>
                                        </div>
                                        
                                        <div class="col">
                                            <div class="form-floating">
                                                <input class="form-control needs-validation" 
                                                    type="text" 
                                                    value=''
                                                    autocomplete="off"
                                                    id="tag_role" 
                                                    placeholder="Papel" 
                                                required>
                                                <div id="product_quantity-validation" class=""></div>                
                                                <label for="quantity">Papel:</label>
                                            </div>
                                        </div>
                                        <div class="col">
                                            <button aof-view class="btn btn-primary button-add-service h-100" onclick="addProcessTag(${this.doc._key}, ${this.structTags}, ${this.list})" >+</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer text-center">
                                    <h6 class="card-text">Tags</h6>
                                    <div id="list_tag" class="d-flex flex-wrap justify-content-center">
                                    `
        for (let i = 0; i < this.doc.listTag.length; i++) {
            row += `<div class="btn-group" id="${this.doc.listTag[i]._key}">
                                             <button type="button" disabled class="btn btn-sm btn-primary">${this.doc.listTag[i].name}</button>
                                             <button type="button" disabled class="btn btn-sm btn-secondary">${this.doc.listTag[i].role}</button>
                                             <button type="button" class="btn btn-sm" onclick="removeTagElement('${this.doc._key}', '${this.doc.listTag[i]._key}')">X</button>
                                         </div>`
        }

        row += `
                        </div>
                    </div>
                </div>`


        row += `<input type="hidden" class="aof-input-json" id="product" value=${this.doc.tag}>`



        if (this.params._key) {
            row += `<hr>`
            row += ` 
                <div class="card">
                    <div class="card-header">
                        Inbox
                    </div>
                    <div class="card-body">`
        if ((this.list) && (this.list.length>0)) {
            console.log(this.list)
            this.list.forEach(element => {
           
            row += `       
            <a id="${element._key}" class="btn btn-outline-primary form-control" href="/process/${element._key}">${element.name}</a>
                    `
                                
                        })
            
            row+=`
                    </div>   
                </div>`
        }}

        row += `
            </div>
            <div class="card-footer">
                <button aof-view class="btn btn-primary btn-lg form-control submit" onclick="saveStockInput()" >Salvar</button>
            </div>
        </div>`
        //row += `<img onload='updateStockInputForm(${JSON.stringify(this.doc)})' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==' >`


        return row;
    }
}