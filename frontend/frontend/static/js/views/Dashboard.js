import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Home");
        
    }

    async init() {
        if (this.params._key) {
            this.user = await fetchData(`/user/getUset`, "GET") 
        }
    }

    async getHtml() {
        
        let row = `
        
            <div class="card" style="border-top: none;">
                <div class="card-header">
                </div>                
                <div class="card-body">
                
                </div>
            </div>`
            //<img onload="showStatus('/status/contract')" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==" >`

        return row;

    }

    async getMenu() {

        let row = `
            <ul class="nav nav-tabs justify-content-center">
                <li class="nav-item">
                    <a class="nav-link active" href="/" style="background-color: #F8F8F8; border-bottom-color: #F8F8F8;">Home</a>
                </li>
                <li class="nav-item">
                        <a class="nav-link" href="/tag/list">Unidades Organizacionais</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/user">Usuários</a>
                </li>
                ${this.user && (this.user.role === "strategic" || this.user.role === "tactical") ?
                    `<li class="nav-item">
                        <a class="nav-link" href="/tag/list">Unidades Organizacionais</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/user/list">Usuários</a>
                    </li>
                    ` : ''}
            </ul>
            `
        return row; 
    }




}