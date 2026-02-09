import { 
    listaCharSpec, 
    iscrizione, 
    checkEmail, 
    checkPsw, 
    checkCharSpec, 
    goToUploadWorkPage, 
    deleteInput, 
    goToMessaggiPage, 
    logout, 
    sendOllamaRequest, 
    generateOpzionForm 
} from "../js/utilities";

function onClickLogin(){ 

    wrongAnswordEffect();
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