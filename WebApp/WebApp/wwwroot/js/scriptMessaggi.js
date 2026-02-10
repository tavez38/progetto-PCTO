import { 
    listaCharSpec, 
    checkEmail, 
    checkPsw, 
    checkCharSpec, 
    goToUploadWorkPage, 
    deleteInput, 
    goToMessaggiPage, 
    logout, 
    generateOpzionForm,
    sendOllamaRequest,
    menuFigo,
    iconBarGenerator,
    revalForm,
    hideForm
} from "../js/utilities.js";
let vMsg = [];
document.addEventListener("DOMContentLoaded", loadMessages);
document.getElementById("linkLogOutMsg").addEventListener("click", logout);
document.getElementById("write").addEventListener("click", function(idFormale) {
  revalForm(idFormale)});
document.getElementById("exit").addEventListener("click", function(idFormale) {
  revalForm(idFormale)});
document.getElementById("send").addEventListener("click", sendMessage);
document.getElementById("cancell").addEventListener("click", deleteInput);
document.getElementById("toChatBot").addEventListener("click", generateOpzionForm);
document.getElementById("btnNavBar").addEventListener("click", iconBarGenerator);

async function loadMessages() {
    const token = localStorage.getItem("token");
    const response = await fetch(`/api/messages/getMsg`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    if (response.status == 401) {
        localStorage.removeItem("idUtenteLoggato");
        localStorage.removeItem("token");
        window.location.href = '../html/AccessoNegato.html';
        return;
    }
    else if (!response.ok) {
        console.log(response.status);
        return;
    }
    const data = await response.json();
    const tableBody = document.getElementById("tableBodyMsg");
    tableBody.innerHTML = "";
    if (data.length == 0) {
        document.getElementById("tableBodyMsg").innerHTML = `<tr class="rowNoMsg"><td colspan="3" id="colNoMsg">Nessun messaggio ricevuto</td></tr>`;
        return;
    }
   
    data.forEach(element => {
        vMsg.push(element);
    });
    createMsgTable();

    

    return;
}

function createMsgTable() {
    const tableBody = document.getElementById("tableBodyMsg");
    const fragment = document.createDocumentFragment();
    vMsg.forEach(element => {
        const tr = document.createElement("tr");
        tr.className = "rows";

        const tdMit = document.createElement("td");
        tdMit.className = "tableMsgMit";
        tdMit.textContent = element.mittente;
        tdMit.id = element.id;

        const tdTitle = document.createElement("td");
        tdTitle.className = "tableMsgTitle";
        tdTitle.textContent = element.titolo;

        const tdData = document.createElement("td");
        tdData.className = "tableMsgData";
        tdData.textContent = element.dataInvio;

        tr.appendChild(tdMit);
        tr.appendChild(tdTitle);
        tr.appendChild(tdData);
        fragment.appendChild(tr);
    });
    tableBody.appendChild(fragment);
}

async function sendMessage(){
    const currentDate = new Date();
   
    let titoloInput = document.getElementById("inputMsgTitle").value;
    if(titoloInput == null || titoloInput == "") {
        titoloInput = "[nessun oggetto]";
    }
    let messaggio = {
        titolo: titoloInput,
        contenuto: document.getElementById("inputMsgContent").value,
        dataInvio: currentDate.toISOString(),
        destinatario: document.getElementById("inputMsgDest").value
    }
    try {
        fetch("/api/messages/sendMsg", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(messaggio)
        })
        .then(res => {
            if (!res.ok) {
                console.log(res.status);
            }
            else {
                console.log("Messaggio inviato con successo"+res.status);
            }
        });

    }
    catch(err) {
        console.log(err);
    }
    hideForm(document.getElementById("scriviMail"));
}