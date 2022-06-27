let enteringName = {
    name: prompt("Digite o seu user: ")
}

function getName() {
    enteringName.name = prompt("User em uso! Digite um nome diferente: ");
}

let messages = [];

let names = [];

//pegar lista de participantes
let participantsPromise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
participantsPromise.then(getParticipants);

function getParticipants(response) {
    names = names.data;
    console.log(response.data);
}

//cadastrar usuario na lista
let namePromise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', enteringName);
namePromise.then(enterRoom);
namePromise.catch(getName);

function enterRoom(response) {
    console.log(response.data);
}

//refresh
function connectionRefresh() {
    let conectionPromise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', enteringName);
    conectionPromise.then(connectionLog);
}

function connectionLog(response) {
    console.log(response.data);
}

//pegar mensagem
let messagePromise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
messagePromise.then(getMessage);


function getMessage(response) {
    console.log(response.data)
    messages = response.data;
    messageRenderizer();
}


//enviar mensagem
function sendMessage() {
    const textValue = document.querySelector('input').value;
    console.log(textValue);
    let newMessage = {
        from: enteringName.name,
        to: "Todos",
        text: textValue,
        type: "message"
    };

    console.log(newMessage);
    let sendPromise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', newMessage);
    sendPromise.then(messageSent);
    sendPromise.catch(fail);
}

function messageSent(response) {
    document.querySelector('input').value = "";
}

function fail(response) {
    alert("erro! iremos atualizar a pagina");
    setInterval(window.location.reload(), 2000);
}

function messageRenderizer() {
    //if message===true
    const messageContainer = document.querySelector('.container');
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].type === "status") {
            messageContainer.innerHTML += `<div class="status">
            <div class="message">
            <span class="hours">(${messages[i].time})</span> <span class="bold"> ${messages[i].from}</span> ${messages[i].text}
            </div>
            </div>`
        }
        if (messages[i].type === "message") {
            messageContainer.innerHTML += `<div class="normal-message">
            <div class="message">
            <span class="hours">(${messages[i].time})</span> <span class="bold"> ${messages[i].from}</span> para <span class="bold"> ${messages[i].to}</span>: ${messages[i].text}
            </div>
            </div>`
        }
        if (messages[i].type === "message" && messages[i].to === enteringName) {
            messageContainer.innerHTML += `<div class="private-message">
            <div class="message">
            <span class="hours">(${messages[i].time})</span> <span class="bold"> ${messages[i].from}</span> para <span class="bold"> ${messages[i].to}</span>: ${messages[i].text}
            </div>
            </div>`
        }
    }

}

//press-enter
const textInput = document.querySelector('.message-box');
textInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.querySelector('.my-button').click();
    }
});

function refreshMessages() {
    let messagePromise2 = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    messagePromise2.then(lastMessageSent);
}

function lastMessageSent(response) {
    let newMessages = [];
    let allMessage = response.data;
    let i = allMessage.length-1;
    let j = messages.length-1;
    while (messages[j].time != allMessage[i].time) {
        newMessages.push(allMessage[i]);
        i--;
    }
    console.log(newMessages);
    const messageContainer = document.querySelector('.container');
    for (let i = 0; i < newMessages.length; i++) {
        if (newMessages[i].type === "status") {
            messageContainer.innerHTML += `<div class="status">
                <div class="message">
                <span class="hours">(${newMessages[i].time})</span> <span class="bold">${newMessages[i].from}</span> ${newMessages[i].text}
                </div>
                </div>`
        }
        if (newMessages[i].type === "message") {
            messageContainer.innerHTML += `<div class="normal-message">
                <div class="message">
                <span class="hours">(${newMessages[i].time})</span> <span class="bold">${newMessages[i].from}</span> para <span class="bold">${newMessages[i].to}</span>: ${newMessages[i].text}
                </div>
                </div>`
        }
        if (newMessages[i].type === "message" && newMessages[i].to === enteringName) {
            messageContainer.innerHTML += `<div class="private-message">
                <div class="message">
                <span class="hours">(${newMessages[i].time})</span> <span class="bold">${newMessages[i].from}</span> para <span class="bold">${messages[i].to}</span>: ${messages[i].text}
                </div>
                </div>`
        }
    }
    messageContainer.lastElementChild.scrollIntoView({
        behavior: "smooth",
    });
    messages = allMessage;
}


setInterval(connectionRefresh, 5000);
setInterval(refreshMessages, 3000);

