async function saveService(_key, doc) {
    /*await save("/service",
        /*resp => {    
            window.open(`/piquete/${_key}/service/list`, "_self");
        }
                        
    )*/
    console.log(doc)
}

async function addListTag(tagName, tagRole) {

    console.log("entramos na função addListTag")
    let tag = {
        name: tagName,
        role: tagRole
    }

    let newElement = document.createElement('div');
    newElement.classList.add('product-item'); // Adicione uma classe para aplicar estilos

    newElement.innerHTML = `
        <div class="btn-group">
            <button type="button" disabled class="btn btn-sm btn-primary">${tag.name}</button>
            <button type="button" disabled class="btn btn-sm btn-secondary">${tag.role}</button>
            <button type="button" class="btn btn-sm" onclick="removeElement()">X</button>
        </div>`;

    // Adicione o novo elemento à lista
    document.getElementById("list_service_producte").appendChild(newElement);


}

async function addProcessTag(_keyProcess, structTags, list) {

    let tag = {
        _key: "",
        name: "",
        role: "",
    }

    //tag._key = document.getElementById("process_id_tag").value;
    tag._key = document.getElementById("tag_key").value;
    console.log(tag._key)
    tag.name = document.getElementById("tag_name").value;
    tag.role = document.getElementById("tag_role").value;

    let newElement = document.createElement('div');
    newElement.classList.add('product-item'); // Adicione uma classe para aplicar estilos

    newElement.innerHTML = `
        <div id="${tag._key}"class="btn-group">
            <button type="button" disabled class="btn btn-sm btn-primary">${tag.name}</button>
            <button type="button" disabled class="btn btn-sm btn-secondary">${tag.role}</button>
            <button type="button" class="btn btn-sm btn-x" onclick="removeProcessElement(${_keyProcess}, ${tag._key})">X</button>
        </div>`;

    // Adicione o novo elemento à lista
    document.getElementById("list_tag").appendChild(newElement);


    fetchData(`/user/add-tag/${_keyProcess}`, "PUT", tag)
        .then(data => console.log(data))
        .catch(error => console.error(error));

    list = await fetchProcesses(structTags);

}

async function searchProcessTagName(element) {

    if (element.value == "") {
        return
    }
    const resp = await fetchData(`/tag/name?name=${element.value}`, "GET");

    const target_element = document.getElementById("list_service_name");

    target_element.innerHTML = ""
    for (let i = 0; i < resp.length; i++) {

        let service = resp[i];

        let new_element = `
                <div class="btn-group">
                    <button onclick='selectService(${JSON.stringify(service)})' type="button" class="btn btn-sm btn-primary">${service.name}</button>
                    <button type="button" class="btn btn-sm" 
                </div>`

        if (element.value != "") {

            const b = document.createElement("span")
            b.id = service.name;
            b.innerHTML = new_element;
            target_element.appendChild(b)

        }

    }


}

function selectProcessTagService(service) {


    document.getElementById("name").value = service.name;

    document.getElementById("list_service_name").innerHTML = ""

}


function removeProcessElement(_keyUser, _keyTag) {

    const element = document.getElementById(_keyTag);

    const target_element = document.getElementById("list_tag");

    target_element.removeChild(element)

    fetchData(`/process/${_keyUser}/tag/${_keyTag}`, "PUT")
        .then(data => console.log(data))
        .catch(error => console.error(error));
}

async function fetchProcesses(structTags) {
    try {
        let corpo = {
            structTags: structTags,
        };

        const response = await fetch('http://localhost:3001/process/find-process-by-tags', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(corpo),
        });

        if (response.ok) {
            return await response.json(); // Retorna os dados JSON
        } else {
            console.error('Erro na solicitação:', response.status, response.statusText);
            return null;
        }

    } catch (error) {
        console.error('Erro durante a solicitação:', error);
        return null;
    }
}


async function moveProcess(_keyProcess) {
    let data = {
        _key: _keyProcess.toString(),
        structTag: document.getElementById("tag_key").value
    }
    console.log(data)

    try {
        let response = await fetch(`http://localhost:3001/process/move-process/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            let jsonResponse = await response.json();
            console.log(jsonResponse);
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation: ' + error.message);
    }
}


async function AttachDocuments(doc) {
    return (`
    
        <div class="card mb-3">
            <div class="card-header">
                <div>Documentação</div>
            </div>
            <div class="card-body">
                <div id="list_doc"></div>
            </div>
        </div>
        <div class="card">
            <div class="card-header">
                <div>Observações</div>
            </div>
            <div class="card-body">
                <a>${doc.listPhase[0].obs}</a>
            </div>
        </div>
    `)
}

async function SaveDocuments(_key) {
    let data = new FormData();
    data.append('_key', _key);
    data.append('file', document.getElementById("inputGroupFile01").files[0]);

    try {
        let response = await fetch('http://localhost:3001/process/attach-documents', {
            method: 'PUT',
            body: data
        });

        let responseData = await response.json();
        console.log(responseData);
    } catch (error) {
        console.error(error);
    }
}



async function FetchAndDisplayDocuments(_key) {
    fetch(`http://localhost:3001/process/fetch-documents?_key=${_key}`)
    .then(response => response.json())
    .then(data => {
        let listDoc = document.getElementById('list_doc');
        data.forEach((base64String, index) => {
            let binaryString = window.atob(base64String);
            let len = binaryString.length;
            let bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            let blob = new Blob([bytes.buffer]);
            let url = window.URL.createObjectURL(blob);
            let link = document.createElement('a');
            link.href = url;
            link.download = `document${index + 1}.pdf`; // Substitua '.pdf' pelo tipo de arquivo correto
            link.textContent = `Download Document ${index + 1}`;
            listDoc.appendChild(link);
            // Adicione uma quebra de linha após cada link, se desejar
            //listDoc.appendChild(document.createElement('br'));
        });
    });
}




async function opinionPhase(doc) {
    return (`
    <div class="card">
        <div class="card-header">
            <div>Observações</div>
        </div>
        <div class="card-body">
            <div class="form-floating">
                <a>${doc.listPhase[1].obs}</a>
            </div>
        </div>
    </div>
    `)

}

async function decisionPhase(doc) {
    return (`
    <div class="card">
            <div class="card-header">
                <div>Observações</div>
            </div>
            <div class="card-body">
                <div class="form-floating">
                    <a>${doc.listPhase[2].obs}</a>
                </div>
            </div>
        </div>
    `)
}

async function implementationPhase(doc) {
    return (`
    <div class="card">
            <div class="card-header">
                <div>Observações</div>
            </div>
            <div class="card-body">
                <div class="form-floating">
                    <a>${doc.listPhase[3].obs}</a>
                </div>
            </div>
        </div>
    `)
}


async function RenderTimeline(doc, currentPhaseView, cargo) {
    let row = `
        <style>
            .container-tl {
                font-size: xx-small!important;
            }
            .container-nb {
                font-size: xx-large!important;
            }
            .col-tl {
                width: 70px!important;
                height: 65px!important;
                padding: 0!important;
                box-sizing: border-box;
            }
            .line-tl {
                width: 50px;
                height: 1px;
                background: var(--bs-primary);
            }
        </style>
        
        <div class="d-flex text-center mb-3 justify-content-center align-items-center">`;

    for (let i = 0; i < doc.listPhase.length; i++) {
        //let phaseKey = Object.keys(doc.listPhase[i])[0]; // Pega a chave da fase
        let phaseNames = [
            "Documentação",
            "Opinião",
            "Decisão",
            "Implementação"
        ];
        let phaseName = phaseNames[i]; // Pega o nome da fase do objeto phaseNames

        // Determina a classe do botão com base no índice da fase atual
        let buttonClass = i === currentPhaseView ? "btn btn-primary" : "btn btn-outline-primary";

        // Adiciona o atributo disabled se o índice for maior que indexPhase
        let disabled = i > doc.currentPhase ? "disabled" : "";

        row += `
            <button type="button" class="col-tl ${buttonClass} d-flex flex-column justify-content-between" ${disabled} data-doc='${JSON.stringify(doc)}' onclick="(function() { RerenderTimeline(JSON.parse(this.getAttribute('data-doc')), ${i}, '${cargo}'); }).call(this);">
                <div class="d-flex row container-tl">
                    <div class="container-nb align-self-center">${i + 1}</div>         
                    <div class="container-tl align-self-end">${phaseName}</div>
                </div>
            </button>
        `;


        if (i < doc.listPhase.length - 1) {
            row += `<div class="line-tl"></div>`;
        }
    }
    row +=`</div>`
   
    //row += await PhaseView(currentPhaseView)

    return row;
}


async function RerenderTimeline(doc, i, cargo) {
    let phaseKeys = ['attachmentPhase', 'opinionPhase', 'decisionPhase', 'implementationPhase'];

    const time_line = document.getElementById("timeline");
    const bodyphase = document.getElementById("bodyphase");
    const buttonEdit = document.getElementById("buttonEdit");
    
    time_line.innerHTML = "";
    bodyphase.innerHTML = "";
    buttonEdit.innerHTML = "";

    let div = document.createElement('div');
    let div2 = document.createElement('div');
    let div3;

    div.innerHTML = await RenderTimeline(doc, i, cargo);
    if(phaseKeys[i]=='attachmentPhase') {
        div2.innerHTML = await PhaseView(doc, i)
        await FetchAndDisplayDocuments(doc._key)
    } else {
        div2.innerHTML = await PhaseView(doc, i)
    }

    time_line.appendChild(div);
    bodyphase.appendChild(div2);

    if (cargo === phaseKeys[i]) {
        div3 = document.createElement('div');
        if (phaseKeys[doc.currentPhase] !== cargo) {
            // Renderiza um botão desabilitado
            div3.innerHTML = `<button class="btn btn-primary btn-lg form-control submit" disabled>Editar</button>`;
        } else {
            // Renderiza o link normal
            div3.innerHTML = `<a aof-view class="btn btn-primary btn-lg form-control submit" href="/process/${doc._key}/${phaseKeys[i]}">Editar</a>`;
        }
        buttonEdit.appendChild(div3);
    }    
}


async function PhaseView(doc, i) {
    let phaseKeys = ["attachmentPhase", "opinionPhase", "decisionPhase", "implementationPhase"];
    let phaseViews = {
        "attachmentPhase": AttachDocuments,
        "opinionPhase": opinionPhase,
        "decisionPhase": decisionPhase,
        "implementationPhase": implementationPhase
    };

    return await phaseViews[phaseKeys[i]](doc);
}

async function addObs(_key, phase, obs){
    let data = {
        _key: _key,
        phase: phase,
        obs: obs,
    }

    fetchData('/process/add-obs', "PUT", data)
        .then(data => console.log(data))
        .catch(error => console.error(error));
}



async function submitAttachmentPhase(_key){
    try {
        let data = {
            _key: _key.toString(),
            accept: true,
            obs: ""
        }

        data.obs = document.getElementById("floatingTextarea2").value;

        if(data.obs){
            console.log(data.obs)
        }
        await SaveDocuments(_key)
            .then(() => {
                return fetchData("/process/add-obs", "PUT", data);
            })
            .then(() => {
                return fetchData("/process/submitPhase", "PUT", data);
            });
    } catch {
        console.log("Houve algum erro para salvar o arquivo ou atualizar seu status")
    }
}

async function submitPhase(_key, accept){
    try {
        let data = {
            _key: _key.toString(),
            accept: accept,
            obs: ""
        }

        data.obs = document.getElementById("floatingTextarea2").value;
        let radioChecked = document.querySelector('input[name="btnradio"]:checked');
        data.accept = radioChecked ? radioChecked.value === 'true' : null;

        fetchData("/process/add-obs", "PUT", data)
        .then(() => {
            return fetchData("/process/submitPhase", "PUT", data);
        })
        .then(() => {
            window.location.href = `/process/${_key}`;
        });
    
    } catch {
        console.log("Houve algum erro para atualizar seu status")
    }
}




