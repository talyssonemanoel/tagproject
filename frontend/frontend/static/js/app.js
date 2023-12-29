const server = "http://localhost:3001";
//const client = "http://localhost:3003";
let form_for_save = {}
let resp_factor = {}

let loadEvent = async () => {

    document.getElementById("listContract").innerHTML = "<p>carregou</p>"
}

async function changeFinishedDate(endpoint,element,_key) {

    await fetchData(endpoint,"PUT",{_key:_key,finishedDate:element.value})
    
}

async function changeStartDate(endpoint,element,_key) {

    await fetchData(endpoint,"PUT",{_key:_key,startDate:element.value})
    
}


function avoidDigit(element) {
    element.value = ""
}
const fetchData = async (route,method="PUT",data={}) => {

    const url = `${server}${route}`;

    let config = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(data)
    }
    if(method === "GET") {
        delete config.body;
    }
    const response = await fetch(url,config);
    const resp = await response.json();
    return resp;
};

const save = async (route,callAfterResponse,callChangeData) =>{

    let elements = document.getElementsByClassName("aof-input");

    let data = {}
    
    for(let i=0;i<elements.length;i++){

        let element = elements[i];
        data[element.id] = element.value;
    } 

    elements = document.getElementsByClassName("aof-input-aggregate");

    for(let i=0;i<elements.length;i++){

        let element = elements[i];

        if(element.checked || element.value!= "") {
            if(data[element.name] == undefined) {
                data[element.name] = []
            }
            data[element.name].push(element.value)            
        }

    } 

    if(callChangeData!=undefined) {

        data = callChangeData(data);
    } 

    let method = "PUT";
    if(data._key === undefined || data._key == "") {
        delete data._key
        method = "POST";
    }
    const resp = await fetchData(route,method,data);
    
    await callAfterResponse(resp);
    
}

const disabledInput = () =>{

    let elements = document.getElementsByClassName("aof-input");

    for(let i=0;i<elements.length;i++){

        elements[i].disabled = true;
    } 

    elements = document.getElementsByClassName("aof-input-aggregate");

    for(let i=0;i<elements.length;i++){

        elements[i].disabled = true;
    } 

}