import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Processos");
        
    }

    async getHtml() {
        
        let row = `
        
            <div class="card" style="border-top: none;">
                <div class="card-header">
                </div>                
                <div class="card-body">`
                this.list.forEach((element, index) => {
        row += `
                    <div class="card">
                        <div class="card-head">
                            <a id="${element._key}" class="btn btn-outline-primary form-control d-flex justify-content-between" href="/tag/${this.params._key}/process/${element._key}">
                                <div class="esquerda">
                                    <div class="btn-group btn-group-sm" role="group" aria-label="Small button group">
                                        <button type="button" class="btn btn-info">${element.name}</button>
                                        <button type="button" class="btn btn-info">${element._key}</button>
                                    </div>
                                    ${element.signed ? '<button type="button" class="btn btn-warning btn-sm">Assinado</button>' : ''}
                                </div>
                                <div class="direita">
                                    ${!element.signed ? `
                                    <button type="button" class="btn btn-warning btn-sm" id="sign-this-button-${index}" style="display: none;">Assinar este documento</button>
                                    <button type="button" class="btn btn-warning btn-sm" id="sign-button-${index}" style="display: none;">Assinar selecionados</button>
                                    <input type="checkbox" class="btn-check" id="btn-check-${index}-outlined" autocomplete="off" onchange="handleSelectChange(${index})">
                                    <label class="btn btn-light btn-sm" id="btn-label-${index}" for="btn-check-${index}-outlined">Selecionar</label>
                                    ` : ''}
                                </div>
                            </a>
                        </div>
                    </div>`
                        
                })
                row += `
                </div>
            </div>`
            //<img onload="showStatus('/status/contract')" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==" >`

        return row;

    }

    async getMenu() {

        let row = `
            <ul class="nav nav-tabs justify-content-center">

                <li class="nav-item">
                    <a class="nav-link" href="/">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/tag/list">Unidades Organizacionais</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link active" href="#" style="background-color: #F8F8F8; border-bottom-color: #F8F8F8;">Processos</a>
                </li>
            </ul>
            `
        return row; 
    }

    async init() {
        console.log(this.params._key)
        this.list = await fetchData(`/process/get-process-by-tag-key/${this.params._key}`, "GET")

    }


}