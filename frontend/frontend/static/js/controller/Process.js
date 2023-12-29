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


async function AttachDocuments(_key) {
    return (`
    
        <div class="card mb-3">
            <div class="card-header">
                <div>Documentação</div>
            </div>
            <div class="card-body">
                <div class="input-group mb-3">
                    <input type="file" class="form-control" id="inputGroupFile01">
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-header">
                <div>Observações</div>
            </div>
            <div class="card-body">
                <div class="form-floating">
                    <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px"></textarea>
                    <label for="floatingTextarea2">Comentários</label>
                </div>
            </div>
        </div>
        <button aof-view class="btn btn-primary button-add-service h-100" onclick='SaveDocuments("9096141")'>Salvar doc</button>

    `)
}

async function SaveDocuments(_key) {
    console.log(document.getElementById("inputGroupFile01").files[0])
    let data = new FormData();
    data.append('_key', _key);
    data.append('file', document.getElementById("inputGroupFile01").files[0]);
    

    fetch('http://localhost:3001/process/attach-documents', {
        method: 'PUT',
        body: data
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
}


async function opinionPhase() {
    return (`
    <div class="card">
        <div class="card-header">
            <div>Observações</div>
        </div>
        <div class="card-body">
            <div class="form-floating">
                <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px"></textarea>
                <label for="floatingTextarea2">Comentários</label>
            </div>
        </div>
    </div>
    `)

}

async function decisionPhase() {
    return (`
    <div class="card">
            <div class="card-header">
                <div>Observações</div>
            </div>
            <div class="card-body">
                <div class="form-floating">
                    <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px"></textarea>
                    <label for="floatingTextarea2">Comentários</label>
                </div>
            </div>
        </div>
    `)
}

async function implementationPhase() {
    return (`
    <div class="card">
            <div class="card-header">
                <div>Observações</div>
            </div>
            <div class="card-body">
                <div class="form-floating">
                    <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px"></textarea>
                    <label for="floatingTextarea2">Comentários</label>
                </div>
            </div>
        </div>
    `)
}




