const listaCharSpec = ["!", "@", "#", "$", "%", "^", "&", "*", "-", "_", "+", "=", "?"];

function iscrizione() {
    if (!checkEmail(r) || !checkPsw()) {
        console.log("false");
    }
    else {
        richiestaIscrizione();
    }  
}

function checkEmail(use) {
    if(use == r){
    const email = document.getElementById("inputEmail");
    const errSpanEmail = document.getElementById("errEmailReg");
    }
    else{
    const email = document.getElementById("inputMsgDest");
    const errSpanEmail = document.getElementById("mailError");
    }

    const parts = email.value.split("@");

    if (parts.length == 2 && parts[1].includes(".")) {
        errSpanEmail.innerHTML = "";
        email.style.borderColor = "";
        return true;
    }     
    errSpanEmail.innerHTML = "Email non valida; controllare la parte a destra del simbolo @";
    email.style, borderColor = "red";
    console.log("false");
    return false;
}

function checkPsw() {

    let number = 0;
    let charSpec = 0;
    let char = 0;

    const psw = document.getElementById("inputPassword");
    const errSpanPsw = document.getElementById("errPswReg");
    if (psw.value.length < 5 || psw.value.length > 10) {
        psw.style.borderColor = "red";
        errSpanPsw.innerHTML = "Lunghezza password non valida: (5-10 caratteri)";
        console.log("false");
        return false;
    }

    else {
        for (let i = 0; i < psw.value.length; i++) {
            if (!isNaN(parseInt(psw.value[i]))) {
                number++;
            } else if (checkCharSpec(psw.value[i])) {
                charSpec++;
            } else {
                char++;
            }
        }

        if (number < 2 || char < 1 || charSpec < 1) {
            psw.style.borderColor = "red";
            errSpanPsw.innerHTML = "La password non rispetta i requisiti minimi";
            console.log("false");
            return false;
        }
        else {
            psw.style.borderColor = "";
            errSpanPsw.innerHTML = "";
            console.log("ttrue");
            return true;
        }
    }
   
}

function checkCharSpec(c) {
    return listaCharSpec.includes(c);
}

function onClickLogin(){ 

    const usMail = document.getElementById("inputUsername").value;
    const psw = document.getElementById("inputPassword").value;
    const pswError = document.getElementById("pswError");
    const userError = document.getElementById("userError");
    if (!IsEmptyPswLogin(psw, usMail)) {
        return;
    }
    let utente = {
        username : usMail,
        password: psw
    };

    try{
        fetch("/index", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(utente)
        })
            .then(response => response.json())
            .then(data => {
                if (data.id == -1) {
                    pswError.innerHTML = "inserire password";
                }
                else if (data.id == -2) {
                    userError.innerHTML = "Non è stato trovato nessun utente con questa mail/username";
                }
                else if (data.id == -3) {
                    userError.innerHTML = "inserire utente";
                }
                else {
                    localStorage.setItem("idUtenteLoggato", data.id);
                    localStorage.setItem("token", data.token);
                    console.log(localStorage.getItem("token"));
                    window.location.href = '../html/PersonalArea.html';
                }
            });  
    }
    catch(error){
        alert(error);
    }
}

function IsEmptyPswLogin(psw, usMail) {
    if (psw == "") {
        alert("Inserire una password");
        return false;
    }
    else if (usMail = "") {
        alert("Inserire una mail o username");
        return false;
    }
    return true;
}

async function richiestaIscrizione() {
    let utente = {
        name : document.getElementById("inputUsername").value,
        password: document.getElementById("inputPassword").value,
        email: document.getElementById("inputEmail").value
    }

    try{
        const res = await fetch("/register",{
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body : JSON.stringify(utente)
        });
        if (!res.ok) {
            const resDesc = await res.json();
            alert(resDesc.desc);
            return;
        }
        else {
            console.log("Registrazione avvenuta con successo");
            window.location.href = '../html/login.html';
            return;
        }
    }
    catch (error) {
        console.log(error);
        return;
    }
}

async function loadWorks() {
    const token = localStorage.getItem("token");
    const tableBody = document.getElementById("tableBodyProj");
    try {
        const response = await fetch(`/api/personalArea`, {
            method: "GET",
            headers: {
                "authorization": `Bearer ${token}`,
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

        tableBody.innerHTML = "";
        if (data.length == 0) {
            document.getElementById("tableBodyProj").innerHTML = `<tr class="rowNoProject"><td colspan="4" id="colNoProject">Nessun progetto caricato</td></tr>`;
            return;
        }
        const fragment = document.createDocumentFragment();

        data.forEach(element => {
            const tr = document.createElement("tr");
            tr.className = "rows";

            // Creazione manuale sicura delle celle
            const tdTitle = document.createElement("td");
            tdTitle.className = "tableTitle";
            tdTitle.textContent = element.title;
            tr.appendChild(tdTitle);

            const tdDesc = document.createElement("td");
            tdDesc.className = "tableDesc";
            tdDesc.textContent = element.description;
            tr.appendChild(tdDesc);

            const tdDate = document.createElement("td");
            tdDate.className = "tableDate";
            tdDate.textContent = element.scadenza;
            tr.appendChild(tdDate);

            const tdHour = document.createElement("td");
            tdHour.className = "tableHour";
            tdHour.textContent = element.orarioScadenza;
            tr.appendChild(tdHour);

            fragment.appendChild(tr);
        });

        tableBody.appendChild(fragment);
    }
    catch (error) {
        console.log(error);
    }
}

async function uploadWork() {
    const idUtenteLoggato = localStorage.getItem("idUtenteLoggato");
    let progetto ={
        
        title : document.getElementById("inputTitle").value,
        description : document.getElementById("inputDesc").value,
        scadenza : document.getElementById("inputData").value,
        orarioScadenza : document.getElementById("inputOra").value
    }
    try{
        fetch("/api/uploadWork", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(progetto)
        })
            .then(res => {
                if (!res.ok) {
                    console.log(res.status);
                }
                else {
                    console.log(res.status);
                }
            });
    }
    catch (error){
        console.log(error)
    }
}

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

        // Creiamo le celle e usiamo textContent (SICUREZZA XSS)
        const tdMit = document.createElement("td");
        tdMit.className = "tableMsgMit";
        tdMit.textContent = element.mittente; // <--- Qui neutralizziamo l'hacker

        const tdTitle = document.createElement("td");
        tdTitle.className = "tableMsgTitle";
        tdTitle.textContent = element.titolo; // <--- Sicuro

        const tdData = document.createElement("td");
        tdData.className = "tableMsgData";
        tdData.textContent = element.dataInvio; // <--- Sicuro

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

function goToUploadWorkPage(){
    window.location.href = '../html/uploadWork.html';
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
    document.body.style.overflow = "scroll";
    opacityBox.style.pointerEvents = "all";

    deleteInput();
}
function deleteInput(){
    document.getElementsByTagName("input").value = "";
}
function goToMessaggiPage(){
    window.location.href = '../html/Messaggi.html';
}

function logout() {
    localStorage.removeItem("idUtenteLoggato");
    localStorage.removeItem("token");
    window.location.href = '../html/Index.html';
}

async function sendOllamaRequest() {
    const domanda = document.getElementById("requestChatOllama").value;
    const textAreaRisposta = document.getElementById("responseChatOllama");
    textAreaRisposta.removeAttribute("readonly");
    textAreaRisposta.value = "Caricamento in corso...";

    try {
        const res = await fetch("/api/ollama/sendOllamaReq", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(domanda)
        });

        if (res.status == 401) {
            localStorage.removeItem("idUtenteLoggato");
            localStorage.removeItem("token");
            window.location.href = '../html/AccessoNegato.html';
            return;
        }

        if (!res.ok) {
            console.log("HTTP error", res.status);
            textAreaRisposta.value = `Errore server: ${res.status}`;
            textAreaRisposta.setAttribute("readonly", "readonly");
            return;
        }
        let data = await res.json();
        textAreaRisposta.value = data.response;
        textAreaRisposta.setAttribute("readonly", "readonly");
    }
    catch (error) {
        console.error("Fetch error:", error);
        textAreaRisposta.value = "Errore nella richiesta";
        textAreaRisposta.setAttribute("readonly", "readonly");
    }
}