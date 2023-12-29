import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Tags");
        
    }

    async getHtml() {
        
        let row = `
        
            <div class="card">
                <div class="card-header">
                </div>                
                <div class="card-body">`
                this.list.forEach(element => {
        row += `
                    <div class="card">
                        <div class="card-head">
                            <a id="${element._key}" class="btn btn-outline-primary form-control" href="/tag/${element._key}">${element.name}</a>
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
                ${this.user && (this.user.role === "strategic" || this.user.role === "tactical") ?
                    `<li class="nav-item">
                        <a class="nav-link" href="/tag/list">Tags</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/user/list">Usuários</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/process/list">Processos</a>
                    </li>
                    ` : ''}
            </ul>
            `
        return row; 
    }




}