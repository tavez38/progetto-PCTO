const listaCharSpec = ["!", "@", "#", "$", "%", "^", "&", "*", "-", "_", "+", "=", "?"];
var idUtenteLoggato = null;
function iscrizione() {
    if (!checkEmail() || !checkPsw()) {
        console.log("false");
    }
    else {
        richiestaIscrizione();
        window.location.href = '.. /html/Index.html'; 

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

    let utente = {
        username : usMail,
        password: psw
    };

    try{
        fetch("/index",{
            method:'POST',
            headers : {
                'Content-Type' : 'application/json' 
            },
            body : JSON.stringify(utente)
        })
            .then(response => response.json())
            .then(id => {
                idUtenteLoggato = id;
                if (idUtenteLoggato == -1) {
                    alert("Password errata o Credenziali non valide");
                }
            })
            .then(() => { window.location.href = '../html/PersonalArea.html'; })
    }
    catch(error){
        alert(error);
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
            console.log(res.json());
        }
        else {
            console.log(res.json());
        }
    }
    catch (error) {
         
        console.log(error);
    }
}

function loadWorks(){
    fetch("/login/personalArea")
    .then(response => response.json())
    .then(lista => lista.forEach(element => {
        document.getElementById("tableBodyProj").innerHTML+=`<tr class="rows">
                <td class="tableTitle">${element.title}</td>
                <td class="tableDesc">${element.description}</td>
                <td class="tableDate">${element.scadenza}</td>
                <td class="tableHour">${element.orarioScadenza}</td>
                </tr>`;
    }));

}

function uploadWork() {
    fetch("/login/personalArea/uploadWork", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify()
    });
}