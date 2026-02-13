document.getElementById("btnLogin").addEventListener("click", onClickLogin);
document.getElementById("linkToRegister").addEventListener("click", () => {
    window.location.href = '../html/Registrazione.html';
});

function onClickLogin() {
    const usMail = document.getElementById("inputUsername");
    const psw = document.getElementById("inputPassword");
    const pswError = document.getElementById("pswError");
    const userError = document.getElementById("userError");

    psw.style.border = "";
    usMail.style.border = "";
    userError.innerText = "";
    pswError.innerText = "";

    if (!IsEmptyPswLogin(psw.value.trim(), usMail.value.trim())) {
        return;
    }
    let utente = {
        username: usMail.value.trim(),
        password: psw.value.trim()
    };

    try {
        fetch("/index", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(utente)
        })
            .then(response => {
                if (response.status == 401) {
                    pswError.innerText = "Credenziali errate";
                    pswError.style.color = "red";
                    psw.style.border = "1px solid red";
                }
                else if (response.status == 400) {
                    userError.innerText = "inserire utente";
                    userError.style.color = "red";
                    usMail.style.border = "1px solid red";
                }
            })
            .then(a => {
                const data = a.json();
                localStorage.setItem("idUtenteLoggato", data.id);
                localStorage.setItem("token", data.token);
                console.log(localStorage.getItem("token"));
                window.location.href = '../html/PersonalArea.html';
            });
    }
    catch (error) {
        alert(error);
    }
}
function IsEmptyPswLogin(psw, usMail) {
    if (usMail == " " || usMail == "") {
        alert("Inserire una mail o username");
        return false;
    }
    else if (psw == " " || psw == "") {
        alert("Inserire una password");
        return false;
    }
    return true;
}