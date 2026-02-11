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
let vMsgsigned=[];
document.addEventListener("DOMContentLoaded", loadMessages);
document.getElementById("linkLogOutMsg").addEventListener("click", logout);
document.getElementById("write").addEventListener("click", function() {
  revalForm(document.getElementById("scriviMail"))});
document.getElementsByClassName("exit")[0].addEventListener("click", function() {
  hideForm(document.getElementById("scriviMail"))});
document.getElementById("send").addEventListener("click", sendMessage);
document.getElementById("cancell").addEventListener("click", deleteInput);
document.getElementById("toChatBot").addEventListener("click", generateOpzionForm);
document.getElementById("btnNavBar").addEventListener("click", iconBarGenerator);
document.getElementById("ordina").addEventListener("change", ordinamento);
document.getElementById("btnDelMsg").addEventListener("click", delAllMsgSigned);
document.getElementById("btnSignAsReadAll").addEventListener("click",signAsReadAll)

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

        const tdLetto = document.createElement("td");
        tdLetto.className = "tableLetto";
        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.checked = element.letto;
        checkBox.className = "checkLettoMsg";
        checkBox.id = element.id;
        checkBox.addEventListener("change", () => {
            //inserimento msg nel vet msg segnati
            vMsgsigned.push(element);
        });
        tdLetto.appendChild(checkBox);

        const tdMit = document.createElement("td");
        tdMit.className = "tableMsgMit";
        tdMit.textContent = element.mittente;
        
        const tdTitle = document.createElement("td");
        tdTitle.className = "tableMsgTitle";
        tdTitle.textContent = element.titolo;

        const tdData = document.createElement("td");
        tdData.className = "tableMsgData";
        tdData.textContent = element.dataInvio;

        tr.appendChild(tdLetto);
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
        destinatario: document.getElementById("inputMsgDest").value,
        letto : false
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
function ordinamento() {
    document.getElementById("tableBodyMsg").innerHTML = "";
    const ordinamentoSelect = document.getElementById("ordina").value;
    switch (ordinamentoSelect) {
        case "Alfabetico: A-Z":
            ordinaPerAlfabetico("A-Z");
            break;
        case "Alfabetico: Z-A":
            ordinaPerAlfabetico("Z-A");
            break;
        case "Piu recente":
            ordinaPerData("recente"); 
            break;
        case "Piu vecchio":
            ordinaPerData("vecchio");
            break;
        case "Da leggere":
            ordinamentoLetto("da");
            break;
        case "Letti":
            ordinamentoLetto("letti");
            break;
        default:
            createMsgTable();
            break;
    }
}

function ordinaPerData(verso) {
    vMsg.sort((a, b) => {
        const dataA = new Date(a.dataInvio);
        const dataB = new Date(b.dataInvio);

        verso == "recente" ? dataB - dataA : dataA - dataB;
    });
    createMsgTable();
}

function ordinaPerAlfabetico(verso) {
    vMsg.sort((a, b) => {
        const titoloA = a.titolo.toLowerCase();
        const titoloB = b.titolo.toLowerCase();

        verso == "A-Z" ? titoloA.localeCompare(titoloB) : titoloB.localeCompare(titoloA);
    });
    createMsgTable();
}

function ordinamentoLetto(verso) {
    vMsg.sort((a, b) => {
        if (verso == "da") {
            if (a.letto && !b.letto) {
                let indexB= vMsg.indexOf(b);
                let copia = a;
                vMsg[vMsg.indexOf(a)] = b;
                vMsg[indexB] = copia;
            }
        }
        else {
            if (!a.letto && b.letto) {
                let indexB = vMsg.indexOf(b);
                let copia = a;
                vMsg[vMsg.indexOf(a)] = b;
                vMsg[indexB] = copia;
            }
        }
    });
    createMsgTable();
}

async function signAsReadAll() {
    for(const msg of vMsgsigned){
        const res = await segnaLetto(msg, !msg.letto);
        if (res) {
            console.log("success");
        }
        else {
            console.log("error");
        }
    }
    window.location.reload();
}

async function delAllMsgSigned(){
   for(const msg of vMsgsigned){
        const res = await eliminaMsg(msg);
        if (res) {
            console.log("success");
        }
        else {
            console.log("error");
        }
    }
    window.location.reload();
}
async function segnaLetto(msg, lettoMsg) {
    const request = {
        id: msg.id,
        letto: lettoMsg
    }
    const res = await fetch("/api/messages/markAsRead", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(request)
    });
    if (!res.ok) {
        console.log(res.status);
        return false;
    }
    const data = await res.json();
    console.log(data.res);  
    return true;
}

async function eliminaMsg(msg) {
    const request = {
        idMsg: msg.id
    }
    const res = await fetch("/api/messages/deleteMsg", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(request)
    });
    if (res.status == 401) {
        localStorage.removeItem("idUtenteLoggato");
        localStorage.removeItem("token");
        window.location.href = '../html/AccessoNegato.html';
        return false;
    }
    if (!res.ok) {
        console.log(res.status);
        return false;
    }
    const data = await res.json();
    console.log(data.res);
    return true;
}