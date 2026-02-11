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

document.getElementById("sendRegisterForm").addEventListener("click", iscrizione);

function iscrizione() { 

    const email = document.getElementById("inputEmail");
    const errSpanEmail = document.getElementById("errEmailReg");
    const psw = document.getElementById("inputPassword");
    const errSpanPsw = document.getElementById("errPswReg");

    if (checkIsEmpty(email, psw)) {
        alert("Compilare tutti i campi");
        return;
    }

    if (!checkEmail(email,errSpanEmail) || !checkPsw(psw,errSpanPsw)) {
        console.log("false");
        return;
    }
    else {
        richiestaIscrizione(psw,email);
    }
}
async function richiestaIscrizione(psw,email) {
    let utente = {
        name : document.getElementById("inputUsername").value,
        password: psw.value,
        email: email.value
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
            window.location.href = '../html/Index.html';
            return;
        }
    }
    catch (error) {
        console.log(error);
        return;
    }
}

function checkIsEmpty(email, psw) {
    if (email.value == null || psw.value == null || email.value.includes(" ") || psw.value.includes(" ")) {
        return true;
    }
    return false;
}