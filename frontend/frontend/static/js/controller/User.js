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


function removeElement(_keyUser, _keyTag) {
    
    if (!_keyUser || !_keyTag){
        console.log("chave do usuário ou tag inválidas\n", _keyUser, _keyTag)
    } else {
        console.log("", _keyUser, _keyTag)
    const element = document.getElementById(_keyTag);

    const target_element = document.getElementById("list_tag");

    target_element.removeChild(element)

    fetchData(`/user/${_keyUser}/tag/${_keyTag}`, "PUT")
    .then(data => console.log(data))
    .catch(error => console.error(error));
    }
}




