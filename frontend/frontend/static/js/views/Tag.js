import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    result = "No Result"
    
    constructor(params) {
        super(params);
        this.setTitle("Tag");

        this.doc = {
            _key: "",
            name:""
        };

    }

    async handleAddTagInput(event) {
        console.log('handleAddTagInput chamado'); // Adicionado aqui
        if (event.key === 'Enter' && event.target.value.trim() !== '') {
            console.log('Chamando addTag'); // Adicionado aqui
            await addTag(this.doc._key, event.target.value.trim());
            console.log('addTag chamado'); // Adicionado aqui
            event.target.value = '';
            event.preventDefault();
        }
    }
    
    

    async getMenu() {

        /**ini */
        let row = `
            <ul class="nav nav-tabs justify-content-center">
                <li class="nav-item">
                    <a class="nav-link" href="/">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/tag/list">Tags</a>
                </li>`
        if(this.doc._key) {
        row += `<li class="nav-item">
                    <a class="nav-link active" href="#">${this.doc.name}</a>
                </li>`
        } else {
        row += `<li class="nav-item">
                    <a class="nav-link active" href="#">Tag</a>
                </li>`
                }
            if(this.doc._key!="") {

            row+=    `<a class="nav-link" href="/tag/${this.doc._key}/process/list">Processos</a>`
                } else {
            row+= `<a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Xs</a>`
                }
        row+= `
            </ul>
            `

            /**fim */
        return row; 
    }

    async init() {
        if (this.params._key !== undefined) {
            window.addEventListener('load', () => {
                const addTagButton = document.getElementById('adicionarTagBotao');
                addTagButton.addEventListener('click', async () => {
                    const addTagInput = document.getElementById('seuInputDeAdicionarNovaTag');
                    if (addTagInput.value.trim() !== '') {
                        await addTag(this.doc._key, addTagInput.value.trim());
                        addTagInput.value = '';
                    }
                });
            });

            try {
                const tagDetails = await fetchData(`/tag/${this.params._key}`, "GET");
    
                if (tagDetails) {
                    this.doc = {
                        _key: tagDetails._key,
                        _super: tagDetails._super,
                        name: tagDetails.name
                    };
    
                    // Obter as tags superiores
                    let superiorResponse = [];
                    if (this.doc._super){
                        superiorResponse = await fetchData(`/tag/tags/${this.doc._super}/superiors`, "GET");
                    }
                    if (Array.isArray(superiorResponse.superiors)) {
                        // Adicionar as tags superiores à classe para uso posterior
                        this.superiors = superiorResponse.superiors.reverse();
                    } else {
                        console.error(`/tag/tags/${this.params._key}/superiors did not return an array:`, superiorResponse);
                    }
    
                    // Obter as tags subordinadas
                    const subordinateResponse = await fetchData(`/tag/tags/${this.params._key}/subordinates`, "GET");

                    console.log(subordinateResponse)
                    console.log(this.doc)

                    if (Array.isArray(subordinateResponse.subordinates)) {
                        this.subordinates = subordinateResponse.subordinates;
                    } else {
                        console.error(`/tag/tags/${this.params._key}/subordinates did not return an array:`, subordinateResponse);
                    }
                    
                }
            } catch (error) {
                console.error("Error in init:", error);
            }
        }
    }    
    
    async getHtml() {
        let row = "";
        
        row += `<input type="hidden" class="aof-input" id="_key" value=${this.doc._key}>`;
    
        // Adicionar as opções das tags superiores ao menu abaixo da card-header
        row += `
        <div class="card">
            <div class="card-header pb-0 border-0"> 
                <ul class="nav nav-tabs justify-content-center">
        `
        // Adicionar os superiores ao menu
        if (this.superiors && this.superiors.length > 0) {
            for (const superior of this.superiors) {
                row += `<li class="nav-item">
                            <a class="nav-link" href="/tag/${superior._key}">${superior.name}</a>
                        </li>`;
            }
        }
        
        row += `
                        <li class="nav-item">
                            <a class="nav-link active" href="#">${this.doc.name}</a>
                        </li>
                    <li class="nav-item">
                </ul>
            </div>`
        
        
        //CardBody
        row += `<div class="card-body">`;

        // Adicionar os superiores ao corpo do card
        if (this.superiors && this.superiors.length > 0) {
            this.superiors.forEach(superior => {
                row += `
                    <div class="card">
                        <div class="card-head">
                            <a id="${superior._key}" class="btn btn-primary form-control" href="/tag/${superior._key}">${superior.name}</a>
                        </div>
                    </div>`
            });
        }
        
        //Opções do cardbody

        row += `
                <div class="card">
                    <div class="card-head">
                        <a id="${this.doc._key}" class="btn btn-primary form-control" href="/tag/${this.doc._key}">${this.doc.name}</a>
                    </div>
                </div>
        `
        
        row += `
    <div class="form-floating">
        <input class="form-control needs-validation aof-input" type="text" value="" 
            autocomplete="off" id="seuInputDeAdicionarNovaTag" placeholder="nova tag subordinada" required>
        <button id="adicionarTagBotao" class="btn btn-primary">Adicionar Tag</button>
        <div id="name-validation" class=""></div>                
        <label for="org_name">Adicionar tag subordinada</label>
    </div>`;


        // Adicionar os subordinados ao corpo do card
        if (this.subordinates && this.subordinates.length > 0) {
            this.subordinates.forEach(subordinate => {
                row += `
                    <div class="card">
                        <div class="card-head">
                            <a id="${subordinate._key}" class="btn btn-outline-primary form-control" href="/tag/${subordinate._key}">${subordinate.name}</a>
                        </div>
                    </div>`;
            });
        }
    
        row += `</div>
                <div class="card-footer">
                    <div class="footer"></div>
                </div>
                </div>`;

                /*<div class="row">
                    <div class="col">
                        <button aof-view class="btn btn-primary btn-lg form-control submit" onclick="saveTag()">Salvar</button>
                    </div>*/
    
        return row;
    }
}