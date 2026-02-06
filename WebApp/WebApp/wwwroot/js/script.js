const listaCharSpec = ["!", "@", "#", "$", "%", "^", "&", "*", "-", "_", "+", "=", "?"];

function iscrizione() {
    if (!checkEmail() || !checkPsw()) {
        console.log("false");
    }
    else {
        richiestaIscrizione();
    }  
}

function checkEmail() {
    const email = document.getElementById("inputEmail");
    const errSpanEmail = document.getElementById("errEmailReg");

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
    if (!IsEmptyPswLogin(psw)) {
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
            .then(id => {
                if (id.id == -1) {
                    alert("Password errata");
                }
                else if (id.id == -2) {
                    alert("Non è stato trovato nessun utente con questa mail/username");
                }
                else if (id.id == -3) {
                    alert("Utente nullo");
                }
                else {
                    localStorage.setItem("idUtenteLoggato", id.id);
                    window.location.href = '../html/PersonalArea.html';
                }
            });  
    }
    catch(error){
        alert(error);
    }
}

function IsEmptyPswLogin(psw) {
    if (psw == "") {
        alert("Inserire una password");
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
    try {
        const response = await fetch(`/api/personalArea/${localStorage.getItem("idUtenteLoggato")}`)
        if (!response.ok) {
            console.log(response.status);
            return;
        }
        const data = await response.json();
        if (data.length == 0) {
            document.getElementById("tableBodyProj").innerHTML = `<tr class="rowNoProject"><td colspan="4" id="colNoProject">Nessun progetto caricato</td></tr>`;
        }
        else {
            data.forEach(element => {
                document.getElementById("tableBodyProj").innerHTML += `<tr class="rows">
                <td class="tableTitle">${element.title}</td>
                <td class="tableDesc">${element.description}</td>
                <td class="tableDate">${element.scadenza}</td>
                <td class="tableHour">${element.orarioScadenza}</td>
                </tr>`;
            });
        } 
    }
    catch (error) {
        console.log(error);
    }
}

async function uploadWork() {
    const idUtenteLoggato = localStorage.getItem("idUtenteLoggato");
    let progetto ={
        IdProprietario:idUtenteLoggato,
        title : document.getElementById("inputTitle").value,
        description : document.getElementById("inputDesc").value,
        scadenza : document.getElementById("inputData").value,
        orarioScadenza : document.getElementById("inputOra").value
    }
    try{
        fetch("/api/uploadWork", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
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
    const response = await fetch(`/api/messages/getMsg/${localStorage.getItem("idUtenteLoggato")}`);
    if (!response.ok) {
        console.log(response.status);
        return;
    }
    const data = await response.json();
    if (data.length == 0) {
        document.getElementById("tableBodyMsg").innerHTML = `<tr class="rowNoMsg"><td colspan="3" id="colNoMsg">Nessun messaggio ricevuto</td></tr>`;
        return;
    }
    data.forEach(element => {
        document.getElementById("tableBodyMsg").innerHTML += `<tr class="rows">
        <td class="tableMsgMit">${element.mittente}</td>
        <td class="tableMsgTitle">${element.titolo}</td>
        <td class="tableMsgData">${element.dataInvio}</td>
        </tr>`
    });
    return;
}

async function sendMessage() {
    const currentDate = new Date();
    const mailMit = await getMailMittente();
    let messaggio = {
        titolo: document.getElementById("inputMsgTitle").value,
        contenuto: document.getElementById("inputMsgContent").value,
        dataInvio: currentDate.toISOString(),
        mittente: mailMit,
        destinatario: document.getElementById("inputMsgDest").value
    }
    try {
        fetch("/api/messages/sendMsg", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
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
}

async function getMailMittente() {
    const response = await fetch(`/api/messages/getMailMit/${localStorage.getItem("idUtenteLoggato")}`);
    if (!response.ok) {
        console.log(response.status);
        return;
    }
    const responseData = await response.json();
    if (responseData.mail == "") {
        console.log("Nessun utente trovato");
        return;
    }
    return responseData.mail;
}

function goToUploadWorkPage(){
    window.location.href = '../html/uploadWork.html';
}