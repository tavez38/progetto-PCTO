import {  
    checkEmail, 
    checkPsw, 
} from "../js/utilities.js";

document.getElementById("sendRegisterForm").addEventListener("click", iscrizione);

function iscrizione() { 
    const username = document.getElementById("inputUsername");
    const email = document.getElementById("inputEmail");
    const errSpanEmail = document.getElementById("errEmailReg");
    const psw = document.getElementById("inputPassword");
    const errSpanPsw = document.getElementById("errPswReg");
    const errSpanGen = document.getElementById("errGen");
    errSpanEmail.innerText = "";
    errSpanPsw.innerText = "";
    errSpanGen.innerText = "";
    username.style.border = "";
    email.style.border = "";
    psw.style.border = "";
    if (checkIsEmpty(username, email, psw)) {
        errSpanGen.innerText = "Compilare tutti i campi";
        errSpanGen.style.color = "red";
        username.style.border = "1px solid red";
        email.style.border = "1px solid red";
        psw.style.border = "1px solid red";
        return;
    }
    if (checkSpazi(username, email, psw)) {
        errSpanGen.innerText = "Nessuno dei campi puo contenere spazi";
        errSpanGen.style.color = "red";
        username.style.border = "1px solid red";
        email.style.border = "1px solid red";
        psw.style.border = "1px solid red";
        return;
    }

    if (!checkEmail(email,errSpanEmail) || !checkPsw(psw,errSpanPsw)) {
        errSpanGen.innerText = "Ricompila il form e riprova";
        errSpanGen.style.color = "red";
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

function checkIsEmpty(username, email, psw) {
    if (username.value=="" ||email.value == "" || psw.value == "" ) {
        return true;
    }
    return false;
}
function checkSpazi(username, email, psw) {
    if ( username.value.includes(" ") || email.value.includes(" ") || psw.value.includes(" ")) {
        return true;
    }
    return false;
}