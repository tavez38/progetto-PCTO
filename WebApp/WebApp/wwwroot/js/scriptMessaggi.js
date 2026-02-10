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
    menuFigo
} from "../js/utilities.js";

document.addEventListener("DOMContentLoaded", loadMessages);
document.getElementById("linkLogOutMsg").addEventListener("click", logout);
document.getElementById("write").addEventListener("click", revalSendForm);
document.getElementById("exit").addEventListener("click", hideSendForm);
document.getElementById("send").addEventListener("click", sendMessage);
document.getElementById("cancell").addEventListener("click", deleteInput);

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
    const fragment = document.createDocumentFragment();
    data.forEach(element => {
        const tr = document.createElement("tr");
        tr.className = "rows";

        const tdMit = document.createElement("td");
        tdMit.className = "tableMsgMit";
        tdMit.textContent = element.mittente; 

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
    return;
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
    hideSendForm();
}
function revalSendForm(){
    let opacityBox = document.getElementById("opacityBox");
    let scriviMail = document.getElementById("scriviMail");

   scriviMail.style.display = "block";
   opacityBox.style.opacity = "0.4";
   document.body.style.overflow = "hidden";
   opacityBox.style.pointerEvents = "none";
}
function hideSendForm(){
    let opacityBox = document.getElementById("opacityBox");
    let scriviMail = document.getElementById("scriviMail");

    scriviMail.style.display = "none";
    opacityBox.style.opacity = "1";
    document.body.style.overflow = "auto";
    opacityBox.style.pointerEvents = "all";

    deleteInput();
}