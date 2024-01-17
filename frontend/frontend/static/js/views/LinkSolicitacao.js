import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Usuários");
        
    }

    async getHtml() {
        
        let row = `
            <div class="card col align-items-center vh-100">               
                <div class="card-body align-items-center">
                    <div>
                        <div class="mb-1">Àrea</div>
                        <select class="form-select" aria-label="Default select example">
                            <option selected>Selecione o tipo de serviço</option>
                            <option value="1">Prefeitura</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <div class="mb-1">Serviço</div>
                        <select class="form-select" aria-label="Default select example">
                            <option selected>Selecione o tipo de serviço</option>
                            <option value="1">Isenção de IPTU</option>
                        </select>
                    </div>
                    <button type="button" class="btn btn-primary" onclick="newIsenIPTU()">Avançar</button>
                </div>
            </div>`
            //<img onload="showStatus('/status/contract')" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==" >`

        return row;

    }

    async getMenu() {

        let row = `
            `
        return row; 
    }

    async init() {

        this.list = await fetchData(`/user`, "GET")

    }


}