import { 
    listaCharSpec,  
    checkEmail, 
    checkPsw, 
    checkCharSpec, 
    goToUploadWorkPage, 
    deleteInput,
    goToMessaggiPage, 
    logout, 
    generateOpzionForm 
} from "../js/utilities.js";

document.getElementById("sendRegisterForm").addEventListener("click", iscrizione);

function iscrizione() {
    if (!checkEmail(r) || !checkPsw()) {
        console.log("false");
    }
    else {
        richiestaIscrizione();
    }
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