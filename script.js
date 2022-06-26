const enteringName = {
    name: "alguem mudou a api kkkk"
}

let messages = [];

let names = [];

let namePromise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', enteringName);
namePromise.then(enterRoom);

function enterRoom(response) {
    console.log(response.data);
}

let messagePromise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
messagePromise.then(getMessage);


function getMessage(response) {
    console.log(response.data)
    messages = response.data;
    messageRenderizer();
}

let participantsPromise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
participantsPromise.then(getParticipants);

function getParticipants(response){
    names = names.data;
}


function sendMessage(response){

}
function sucessOrFail(response) {

}

function messageRenderizer() {
    //if message===true
    const messageContainer = document.querySelector('.container');
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].type === "status") {
            messageContainer.innerHTML += `<div class="status">(${messages[i].time}) ${messages[i].from} para ${messages[i].to}: ${messages[i].text}</div>`
        }
        if (messages[i].type === "message"){
            messageContainer.innerHTML += `<div class="normal-message">(${messages[i].time}) <strong>${messages[i].from}</strong> para <strong>${messages[i].to}</strong>: ${messages[i].text}</div>`
        }
        if (messages[i].type === "message" && messages[i].to != "Todos"){
            messageContainer.innerHTML += `<div class="private-message">(${messages[i].time}) ${messages[i].from} para ${messages[i].to}: ${messages[i].text}</div>`
        }
    }
    
}




function refreshMessages() {

}

