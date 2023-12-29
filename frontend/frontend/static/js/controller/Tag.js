async function saveTag() {
    await save("/tag", 
    resp =>{
        window.open(`/tag/list`,"_self");
    }
    )
}

async function addTag(_super, name, file) {
    console.log('addTag chamado com', _super, name, file); // Adicionado aqui
    const formData = new FormData();
    formData.append('super', _super);
    formData.append('name', name);
    try {
        const response = await fetch('/tag', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Resposta do servidor:', data); // Adicionado aqui
        } else {
            console.error('Erro na solicitação:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Erro durante a solicitação:', error);
    }
}





async function addProduct(_keyUser) {

    console.log("entramos na função addProduct")
    let tag = {
        name: "",
        role: "",
    }

    tag.name = document.getElementById("tag_name").value;
    tag.role = document.getElementById("tag_role").value;

    document.getElementById("product").value = JSON.stringify(tag);

    let newElement = document.createElement('div');
    newElement.classList.add('product-item'); // Adicione uma classe para aplicar estilos

    newElement.innerHTML = `
        <div class="btn-group">
            <button type="button" disabled class="btn btn-sm btn-primary">${tag.name}</button>
            <button type="button" disabled class="btn btn-sm btn-secondary">${tag.role}</button>
            <button type="button" class="btn btn-sm btn-x" onclick="removeElement()">X</button>
        </div>`;

    // Adicione o novo elemento à lista
    document.getElementById("list_tag").appendChild(newElement);
    
    fetchData(`/user/add-tag/${_keyUser}`, "PUT", tag)
    .then(data => console.log(data))
    .catch(error => console.error(error));
}


async function searchTagName(element) {

    if(element.value == "") {
        return
    }
    const resp = await fetchData(`/tag/name?name=${element.value}`,"GET");

    const target_element = document.getElementById("list_tag_name");

    target_element.innerHTML = ""
    for(let i=0;i<resp.length;i++) {

        let tag = resp[i];

        let new_element = `
                <div class="btn-group">
                    <button onclick='selectTag(${JSON.stringify(tag)})' type="button" class="btn btn-sm btn-primary">${tag.name}</button>
                    <button type="button" class="btn btn-sm"
                </div>`

        if(element.value!= "") {
    
            const b = document.createElement("span")
            b.id = tag.name;
            b.innerHTML = new_element;
            target_element.appendChild(b)
    
        }
    
    }


}

function selectTag(tag) {

    document.getElementById("tag_key").value = tag._key;
    document.getElementById("tag_name").value = tag.name;
    document.getElementById("list_tag_name").innerHTML = ""

}

function removeTagElement(_keyUser, _keyTag) {
  
    const element = document.getElementById(_keyTag);

    const target_element = document.getElementById("list_tag");

    target_element.removeChild(element)

    fetchData(`/user/${_keyUser}/tag/${_keyTag}`, "PUT")
    .then(data => console.log(data))
    .catch(error => console.error(error));
}