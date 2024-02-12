let listDocumentsToSign = [];

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
            "Parecer",
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
    row += `</div>`

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
    if (phaseKeys[i] == 'attachmentPhase') {
        div2.innerHTML = await PhaseView(doc, i)
        await FetchAndDisplayDocuments(doc._key)
    } else {
        div2.innerHTML = await PhaseView(doc, i)
    }

    time_line.appendChild(div);
    bodyphase.appendChild(div2);

    if (cargo === phaseKeys[i]) {
        div3 = document.createElement('div');
        if (phaseKeys[doc.currentPhase] === cargo) {
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

async function addObs(_key, phase, obs) {
    let data = {
        _key: _key,
        phase: phase,
        obs: obs,
    }

    fetchData('/process/add-obs', "PUT", data)
        .then(data => console.log(data))
        .catch(error => console.error(error));
}



async function submitAttachmentPhase(_key) {
    try {
        let data = {
            _key: _key.toString(),
            accept: true,
            obs: ""
        }

        data.obs = document.getElementById("floatingTextarea2").value;

        if (data.obs) {
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

async function submitPhase(_key, accept) {
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




async function newIsenIPTU() {
    try {
        let response = await fetchData("/process/isenIPTU", "POST");
        let _key = response
        console.log(_key)
        if (_key) {
            let stringKey = _key.toString();
            window.location.href = `/process/${stringKey}/attachmentPhase`;
        }

    } catch {
        console.log("Houve algum erro para atualizar seu status");
    }
}



async function ShowTextarea() {
    //const textArea = document.getElementById("text-area");

    let div = document.createElement('div');
    div.setAttribute('id', 'editor');
    div.setAttribute('class', 'form-control mt-3');

    CKEDITOR.replace('editor');

    // Adicione um ouvinte de evento para 'change'
    CKEDITOR.instances.editor.on('change', function () {
        // Verificar se o editor está vazio
        if (this.getData().trim() === '') {
            // Ocultar o botão "Salvar" se o editor estiver vazio
            document.getElementById('saveButton').style.display = 'none';
        } else {
            // Mostrar o botão "Salvar" se o editor não estiver vazio
            document.getElementById('saveButton').style.display = 'block';
        }
    });
}




async function ShowIntegra(listPage) {
    listPage = listPage.split(",");
    listDocumentsToSign.length = 0;
    const cardBody = document.getElementById("card-body-process");

    // Cria um novo array com a chave do documento e se ele está assinado ou não
    const signedDocuments = await Promise.all(listPage.map(async (_key) => {
        const response = await fetchData(`/document/getSignedDocument/${_key}`, "GET");
        const isSigned = response.result // Converte a string 'true' ou 'false' para um booleano
        return { _key, signed: isSigned };
    }));

    if (cardBody) {
        cardBody.innerHTML = "";

        let div = document.createElement('div');

        signedDocuments.forEach((document, index) => {
            div.innerHTML += `
                <div id="card${document._key}">
                        <input type="checkbox" class="btn-check" id="btncheck${index}" autocomplete="off" onchange="handleCheckboxChange(${index})" value=${document._key}>
                        <label class="btn btn-outline-primary w-100 d-flex justify-content-sm-between" for="btncheck${index}">
                            <div class="esquerda">
                                <div class="btn-group btn-group-sm" role="group" aria-label="Small button group">
                                    <button type="button" class="btn btn-info">P</button>
                                    <button type="button" class="btn btn-info">${index + 1}</button>
                                </div>
                                ${document.signed ? '<button type="button" class="btn btn-warning btn-sm">Assinado</button>' : ''}
                            </div>
                            <div class="direita d-flex">
                                ${!document.signed ? `
                                <div class="dropdown ms-2 ">
                                    <a class="btn btn-warning btn-sm" href="#" id="sign-this-button-${index}" style="display: none;" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Asssinar este documento
                                    </a>

                                    <div class="dropdown-menu" style="height: auto!important;">
                                        <div class="input-group input-group-sm mb-3">
                                            <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
                                            <button type="button" class="btn btn-primary" onClick="SignDoc(${document._key}, ${index})">ok</button>
                                        </div>
                                    </div>
                                    </div>
                                <button type="button" class="ms-2 btn btn-warning btn-sm" id="sign-button-${index}" style="display: none;">Assinar selecionados</button>
                                <input type="checkbox" class="ms-2 btn-check" id="btn-check-${index}-outlined" autocomplete="off" onchange="handleSelectChange(${index})">
                                <label class="ms-2 btn btn-light btn-sm" id="btn-label-${index}" for="btn-check-${index}-outlined">Selecionar</label>
                                ` : ''}
                            </div>
                        </label>
                    <div id="details-page-${index}"></div>
                </div>`;
        });


        cardBody.appendChild(div);
        document.getElementById('saveButton').style.display = 'none';
    } else {
        console.log("Elemento 'card-body-process' não encontrado");
    }
}

async function SignDoc(_key, index) {

    await fetchData(`/document/sign-doc/${_key}`, "PUT")

    const response2 = await fetchData(`/document/getSignedDocument/${_key}`, "GET"); 
    const isSigned = response2.result

    console.log(isSigned)

    var element = document.getElementById(`card${_key}`);
    element.parentNode.removeChild(element);

    let newDiv = document.createElement('div');

    newDiv.innerHTML = `
    <div id="card${_key}">
            <input type="checkbox" class="btn-check" id="btncheck${index}" autocomplete="off" value=${_key}>
            <label class="btn btn-outline-primary w-100 d-flex justify-content-sm-between" for="btncheck${index}">
                <div class="esquerda">
                    <div class="btn-group btn-group-sm" role="group" aria-label="Small button group">
                        <button type="button" class="btn btn-info">P</button>
                        <button type="button" class="btn btn-info">${index + 1}</button>
                    </div>
                    ${isSigned.signed ? '<button type="button" class="btn btn-warning btn-sm">Assinado</button>' : ''}
                </div>
                <div class="direita d-flex">
                    ${!isSigned.signed ? `
                    <div class="dropdown ms-2 ">
                        <a class="btn btn-warning btn-sm" href="#" id="sign-this-button-${index}" style="display: none;" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Asssinar este documento
                        </a>

                        <div class="dropdown-menu" style="height: auto!important;">
                            <div class="input-group input-group-sm mb-3">
                                <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
                            </div>
                        </div>
                        </div>
                    <button type="button" class="ms-2 btn btn-warning btn-sm" id="sign-button-${index}" style="display: none;">Assinar selecionados</button>
                    <input type="checkbox" class="ms-2 btn-check" id="btn-check-${index}-outlined" autocomplete="off" onchange="handleSelectChange(${index})">
                    <label class="ms-2 btn btn-light btn-sm" id="btn-label-${index}" for="btn-check-${index}-outlined">Selecionar</label>
                    ` : ''}
                </div>
            </label>
        <div id="details-page-${index-1}"></div>
    </div>`;
    let position = index-1;
    let containerDiv = document.getElementById("card-body-process");
    containerDiv.insertBefore(newDiv, containerDiv.children[position]);
    
}

function handleSelectChange(index) {
    const checkbox = document.getElementById(`btn-check-${index}-outlined`);
    const label = document.getElementById(`btn-label-${index}`);
    const signButton = document.getElementById(`sign-button-${index}`);
    let _key
    if (document.getElementById(`btncheck${index}`)) {
        _key = document.getElementById(`btncheck${index}`).value;
    }

    if (checkbox.checked) {
        label.textContent = 'Selecionado';
        signButton.style.display = 'inline-block';
        if (_key) {
            listDocumentsToSign.push(_key);
        }
        console.log(listDocumentsToSign)
    } else {
        label.textContent = 'Selecionar';
        signButton.style.display = 'none';
        if (_key) {
            listDocumentsToSign.splice(index, 1);
        }
        console.log(listDocumentsToSign)
    }
}

function handleProcessSelectChange(index) {
    const label = document.getElementById(`btn-label-${index}`);

    if (label.textContent = 'Selecionar') {
        label.textContent = 'Selecionado';
    } else {
        label.textContent = 'Selecionar';
    }
}

function handleLabelClick(index) {
    const label = document.getElementById(`btncheck${index}`);
    const signThisButton = document.getElementById(`sign-this-button-${index}`);
    if (label.classList.contains('active')) {
        signThisButton.style.display = 'inline-block';
    } else {
        signThisButton.style.display = 'none';
    }
}

async function handleCheckboxChange(index) {
    const checkbox = document.getElementById(`btncheck${index}`);
    const signThisButton = document.getElementById(`sign-this-button-${index}`);
    if (checkbox.checked) {
        await ShowDetails(index);
        signThisButton.style.display = 'inline-block';
    } else {
        const detailsBody = document.getElementById(`details-page-${index}`);
        if (detailsBody) {
            detailsBody.innerHTML = "";
            signThisButton.style.display = 'none';  // Limpa o conteúdo quando a caixa de seleção é desmarcada
        }
    }
}


async function ShowDetails(index) {
    const detailsBody = document.getElementById(`details-page-${index}`);
    const keyDoc = document.getElementById(`btncheck${index}`).value;
    const documentoo = await fetchData(`/document/${keyDoc}`, "GET")

    if (detailsBody) {
        detailsBody.innerHTML = ""; // Limpe o conteúdo existente

        if (documentoo.type === 'text') {
            detailsBody.innerHTML = `<div class="p-3 h-100 w-100">${documentoo.content}</div>`;
        } else if (documentoo.type === 'doc') {
            if (documentoo.formatDoc === 'text/plain') {
                detailsBody.innerHTML = `<div class="p-3 h-100 w-100">${documentoo.content}</div>`;
            } else if (['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'].includes(documentoo.formatDoc)) {
                // Se o documento for um PDF, Word, Excel ou PowerPoint, crie um Blob e exiba-o em um elemento <embed>
                let fileData = atob(documentoo.content);
                let byteArray = new Uint8Array(fileData.length);
                for (let i = 0; i < fileData.length; i++) {
                    byteArray[i] = fileData.charCodeAt(i);
                }
                let blob = new Blob([byteArray.buffer], { type: documentoo.formatDoc });
                let url = URL.createObjectURL(blob);

                let embed = document.createElement('embed');
                embed.src = url;
                embed.type = documentoo.formatDoc;
                embed.style.width = "100%";
                embed.style.height = "100%";

                detailsBody.appendChild(embed);
            } else if (documentoo.formatDoc.startsWith('image/')) {
                // Se o documento for uma imagem, exiba-a em um elemento <img>
                let img = document.createElement('img');
                img.src = `data:${documentoo.formatDoc};base64,${documentoo.content}`;
                img.style.width = "100%";
                img.style.height = "auto";

                detailsBody.appendChild(img);
            } else if (documentoo.formatDoc.startsWith('video/')) {
                // Se o documento for um vídeo, exiba-o em um elemento <video>
                let video = document.createElement('video');
                video.src = `data:${documentoo.formatDoc};base64,${documentoo.content}`;
                video.style.width = "100%";
                video.style.height = "auto";
                video.controls = true;

                detailsBody.appendChild(video);
            }
        }
    } else {
        console.log("Elemento 'card-body-process' não encontrado");
    }
}



async function ShowEdit() {

    const cardBody = document.getElementById("card-body-process");

    // Verifique se o elemento existe antes de tentar acessar suas propriedades
    if (cardBody) {
        cardBody.innerHTML = "";

        let div = document.createElement('div');

        div.innerHTML = `<div class="d-flex justify-content-center mb-3">
                            <div><h4><strong>Parecer</strong></h4></div>
                        </div>
                        <div id="editor" class="">
                        </div>
                        `

        cardBody.appendChild(div);

        CKEDITOR.replace('editor');

        CKEDITOR.instances.editor.on('change', function () {
            // Verificar se o editor está vazio
            if (this.getData().trim() === '') {
                // Ocultar o botão "Salvar" se o editor estiver vazio
                document.getElementById('saveButton').style.display = 'none';
            } else {
                // Mostrar o botão "Salvar" se o editor não estiver vazio
                document.getElementById('saveButton').style.display = 'block';
            }
        });

    } else {
        console.log("Elemento 'card-body-process' não encontrado");
    }
}

async function ShowDispach() {

    const cardBody = document.getElementById("card-body-process");
    const footer = document.getElementById("fter");

    // Verifique se o elemento existe antes de tentar acessar suas propriedades
    if (cardBody) {
        cardBody.innerHTML = "";

        let div = document.createElement('div');

        div.innerHTML = `<div class="d-flex justify-content-center mb-3">
                            <div><h4><strong>Despacho</strong></h4></div>
                        </div>
                        <div id="editor" class="">
                        </div>
                        `


        cardBody.appendChild(div);

        CKEDITOR.replace('editor');

        CKEDITOR.instances.editor.on('change', function () {
            // Verificar se o editor está vazio
            if (this.getData().trim() === '') {
                // Ocultar o botão "Salvar" se o editor estiver vazio
                document.getElementById('saveButton').style.display = 'none';
            } else {
                // Mostrar o botão "Salvar" se o editor não estiver vazio
                document.getElementById('saveButton').style.display = 'block';
            }
        });

    } else {
        console.log("Elemento 'card-body-process' não encontrado");
    }
}

async function ShowUpload(listClassDoc, key) {

    listClassDoc = listClassDoc.split(",");

    console.log(key)

    const cardBody = document.getElementById("card-body-process");

    // Verifique se o elemento existe antes de tentar acessar suas propriedades
    if (cardBody) {
        cardBody.innerHTML = "";

        let div = document.createElement('div');

        for (let i = 0; i < listClassDoc.length; i++) {
            div.innerHTML += `<div class="mb-3">
                            <label for="formFile" class="form-label">${listClassDoc[i]}</label>
                            <input class="form-control" type="file" id="file${listClassDoc[i]}">
                        </div>`
        }

        div.innerHTML += `<button type="button" class="btn btn-primary" onclick='SaveDocuments("${listClassDoc.join(",")}", "${key}")'>Enviar</button>`

        cardBody.appendChild(div);
    } else {
        console.log("Elemento 'card-body-process' não encontrado");
    }
}

async function SaveDocuments(listClassDoc, _key) {
    listClassDoc = listClassDoc.split(",");
    let data = new FormData();
    data.append('_key', _key);
    data.append('type', 'doc');

    for (let i = 0; i < listClassDoc.length; i++) {
        console.log(listClassDoc[i])
        if (document.getElementById(`file${listClassDoc[i]}`).files[0]) {
            data.append('classDocument', `${listClassDoc[i]}`);
            data.append('file', document.getElementById(`file${listClassDoc[i]}`).files[0]);

            try {
                let response = await fetch('http://localhost:3001/process/attach-documents', {
                    method: 'POST',
                    body: data
                });

                let responseData = await response.json();
                console.log(responseData);
            } catch (error) {
                console.error(error);
            }
        }
    }

}


async function SaveDocumentation(_key) {
    let data = new FormData();
    data.append('_key', _key);
    data.append('type', 'doc');
    data.append('classDocument', 'CPF');
    data.append('file', document.getElementById("fileCPF").files[0]);

    try {
        let response = await fetch('http://localhost:3001/process/attach-documents', {
            method: 'POST',
            body: data
        });

        let responseData = await response.json();
        console.log(responseData);
    } catch (error) {
        console.error(error);
    }
}


async function SavePage() {
    // Obter a instância do CKEditor
    const editor = CKEDITOR.instances.editor;
    let key = document.getElementById("_key").value

    // Obter o conteúdo do CKEditor
    const pageItem = editor.getData();


    // Enviar uma solicitação POST ao seu servidor Express
    //fetchData("/process/add-obs", "PUT", data)
    const response = await fetch(`http://localhost:3001/process/${key}/page`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: 'text', content: pageItem })
    });

    if (!response.ok) {
        console.error('Erro ao salvar a página:', response.statusText);
    } else {
        console.log('Página salva com sucesso');
    }
}


async function getDocument() {
    // Obter a instância do CKEditor
    const editor = CKEDITOR.instances.editor;
    let key = document.getElementById("_key").value

    // Obter o conteúdo do CKEditor
    const pageItem = editor.getData();


    // Enviar uma solicitação POST ao seu servidor Express
    //fetchData("/process/add-obs", "PUT", data)
    const response = await fetch(`http://localhost:3001/document/${key}`, {
        method: 'GET',
    });

    if (!response.ok) {
        console.error('Erro ao salvar a página:', response.statusText);
    } else {
        console.log('Página salva com sucesso');
    }
}

async function NextProcess(key) {

    const _key = key.toString()

    const response = await fetch(`http://localhost:3001/process/next-tag/${_key}`, {
        method: 'PUT',
    });

    if (!response.ok) {
        console.error('Erro ao enviar processo:', response.statusText);
    } else {
        console.log('Processo enviado com sucesso');
    }
}









