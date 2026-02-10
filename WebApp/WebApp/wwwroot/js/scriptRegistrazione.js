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

document.getElementById("sendRegisterForm").addEventListener("click", iscrizione);

function iscrizione() { 

    const email = document.getElementById("inputEmail");
    const errSpanEmail = document.getElementById("errEmailReg");
    const psw = document.getElementById("inputPassword");
    const errSpanPsw = document.getElementById("errPswReg");

    if (!checkEmail(email,errSpanEmail) || !checkPsw(psw,errSpanPsw)) {
        console.log("false");
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