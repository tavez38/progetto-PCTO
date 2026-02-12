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
let vMsgsigned = [];
document.addEventListener("DOMContentLoaded", loadMessages);

document.getElementById("linkLogOutMsg").addEventListener("click", logout);

document.getElementById("write").addEventListener("click", function () {
    revalForm(document.getElementById("scriviMail"))
});

document.getElementsByClassName("exit")[0].addEventListener("click", function () {
    hideForm(document.getElementById("scriviMail"))
});

document.getElementById("send").addEventListener("click", sendMessage);

document.getElementById("cancell").addEventListener("click", function () {
    deleteInput(document.getElementById("scriviMail"))
});

document.getElementById("toChatBot").addEventListener("click", generateOpzionForm);

document.getElementById("btnNavBar").addEventListener("click", iconBarGenerator);

document.getElementById("ordina").addEventListener("input", ordinamento);

document.getElementById("btnDelMsg").addEventListener("click", delAllMsgSigned);

document.getElementById("btnSignAsReadAll").addEventListener("click", signAsReadAll);

document.getElementById("btnNavBar").addEventListener("click", function () {
    menuFigo(this)
});

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
        tr.classList.add("rows");
        tr.addEventListener("click", () => {
            letturaMessaggio(element);
        });

        const tdLetto = document.createElement("td");
        tdLetto.classList.add("selezionaMsg");
        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.checked = false;
        checkBox.classList.add("btnSelezionaMsg");
        checkBox.id = element.id;
        checkBox.addEventListener("change", () => {
            vMsgsigned.push(element);
        });
        tdLetto.appendChild(checkBox);

        const tdMit = document.createElement("td");
        tdMit.classList.add("tableMsgMit");
        tdMit.textContent = element.mittente;

        const tdTitle = document.createElement("td");
        tdTitle.classList.add("tableMsgTitle");
        tdTitle.textContent = element.titolo;

        const tdData = document.createElement("td");
        tdData.classList.add("tableMsgData");
        tdData.textContent = element.dataInvio.slice(0, 16).replace("T", " ");

        const tdDelSignAsRead = document.createElement("td");
        tdDelSignAsRead.classList.add("tableSettingMsg");

        const buttonDel = document.createElement("button");
        buttonDel.classList.add("cestino");
        buttonDel.innerHTML = "&#128465;";
        buttonDel.addEventListener("click", () => {
            if (confirm("sei sicuro di voler eliminare il messaggio? (dopo l'eliminazione non potrai piu recuperarlo)")) {
                eliminaMsg(element);
            }
        });
        buttonDel.style.marginLeft = "20px";

        const buttonRead = document.createElement("button");
        buttonRead.classList.add("checkRead");
        buttonRead.innerHTML = "&#10004;";
        buttonRead.addEventListener("click", () => {
            segnaLetto(element, !element.letto);
        });
        buttonRead.style.marginLeft = "15px";
        buttonRead.style.width = "50px";

        tdDelSignAsRead.appendChild(buttonDel);
        tdDelSignAsRead.appendChild(buttonRead);

        tr.appendChild(tdLetto);
        tr.appendChild(tdMit);
        tr.appendChild(tdTitle);
        tr.appendChild(tdData);
        tr.appendChild(tdDelSignAsRead);
        fragment.appendChild(tr);
    });
    tableBody.appendChild(fragment);
}

async function sendMessage() {
    const mailDestEl = document.getElementById("inputMsgDest");
    mailDestEl.style.border = "";
    const mailDest = mailDestEl.value;
    if (mailDest == "" || mailDest.includes(" ")) {
        mailDestEl.style.border = "1px solid red";
        alert("Impossibile inviare un messaggio al destinatario; controlla la mail del destinatario");
        return;
    }
    const currentDate = new Date();

    let titoloInput = document.getElementById("inputMsgTitle").value;
    if (titoloInput == null || titoloInput == "") {
        titoloInput = "[nessun oggetto]";
    }
    let messaggio = {
        titolo: titoloInput,
        contenuto: document.getElementById("inputMsgContent").value,
        dataInvio: currentDate.toISOString(),
        destinatario: document.getElementById("inputMsgDest").value,
        letto: false
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
                if (res.status == 404) {
                    alert("Non esiste nessun utente associato a questa email");
                    return;
                }
                if (!res.ok) {
                    console.log(res.status);
                }
                else {
                    console.log("Messaggio inviato con successo" + res.status);
                }
            });

    }
    catch (err) {
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

        return verso == "recente" ? dataB - dataA : dataA - dataB;
    });
    createMsgTable();
}

function ordinaPerAlfabetico(verso) {
    vMsg.sort((a, b) => {
        const titoloA = a.titolo.toLowerCase();
        const titoloB = b.titolo.toLowerCase();

        return verso == "A-Z" ? titoloA.localeCompare(titoloB) : titoloB.localeCompare(titoloA);
    });
    createMsgTable();
}

function ordinamentoLetto(verso) {
    vMsg.sort((a, b) => {
        return verso == "da" ? a.letto - b.letto : b.letto - a.letto;
    });
    createMsgTable();
}

async function signAsReadAll() {
    if (vMsgsigned.length == 0) {
        return;
    }
    for (const msg of vMsgsigned) {
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

async function delAllMsgSigned() {
    if (vMsgsigned.length == 0) {
        return;
    }
    if (confirm("sei sicuro di voler eliminare tutti i messaggi? (dopo la cancellazione non saranno piu disponibili)")) {
        for (const msg of vMsgsigned) {
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
function letturaMessaggio(msg) {
    if (document.getElementById("formMessaggio") == null) {
        const opacityBox = document.getElementsByClassName("opacityBox")[0];
        opacityBox.style.pointerEvents = "none";
        const form = document.createElement("div");
        form.id = "formMessaggio";
        document.body.insertBefore(form, document.body.children[0]);
        const button = document.createElement("p");
        button.classList = "exit";
        button.innerHTML = "&times";
        button.addEventListener("click", () => {
            document.getElementById("formMessaggio").remove();
            opacityBox.style.pointerEvents = "all";
        });
        form.appendChild(button);
        msg.dataInvio.trim();
        const gg = msg.dataInvio.slice(0, 10).replaceAll("-", "/");
        const ora = msg.dataInvio.slice(11, 16);
        const data = document.createElement("h3");
        data.id = "dataMessaggio";
        data.innerHTML = gg + "<br>" + ora;
        form.appendChild(data)
        const mittente = document.createElement("h3");
        mittente.id = "mittenteMessaggio";
        mittente.innerText = msg.mittente;
        form.appendChild(mittente);
        const titolo = document.createElement("h1");
        titolo.id = "titoloMessaggio";
        titolo.innerText = msg.titolo;
        form.appendChild(titolo);
        form.appendChild(document.createElement("hr"));
        const corpo = document.createElement("p");
        corpo.id = "corpoMessaggio";
        corpo.innerText = msg.contenuto;
        form.appendChild(corpo);
    }

}


