const listaCharSpec = ["!", "@", "#", "$", "%", "^", "&", "*", "-", "_", "+", "=", "?"];

export function checkEmail(use) {
    if(use == "r"){
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
    email.style.borderColor = "red";
    console.log("false");
    return false;
}

export function checkPsw() {

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

export function checkCharSpec(c) {
    return listaCharSpec.includes(c);
}

export function goToUploadWorkPage(){
    window.location.href = '../html/uploadWork.html';
}
export function deleteInput(){
    document.getElementsByTagName("input").value = "";
}
export function goToMessaggiPage(){
    window.location.href = '../html/Messaggi.html';
}

export function logout() {
    localStorage.removeItem("idUtenteLoggato");
    localStorage.removeItem("token");
    window.location.href = '../html/Index.html';
}


export function changeLightColor(){
    const light = document.getElementsByClassName("light");
    for(let i = 0; i < light.length; i++){
    light[i].style.backgroundColor = "#f60404";
    light[i].style.boxShadow ="0 0 10px #ff2525,-5px 0 15px 2px #a40000, -20px 0 20px #cc0303";
    }
}
export function changeFormColor(){
    const form = document.getElementsByClassName("divFormLogin")[0];
    form.style.borderColor = "#f60404";
    form.style.boxShadow = "0px 0px 15px #f60404";
}
export function wrongAnswordEffect(){
    const form = document.getElementsByClassName("divFormLogin")[0];

    const animazione = [
        {transform: 'translateX(0)' },
        { transform: 'translateX(-8px)' },
        { transform: 'translateX(8px)' },
        { transform: 'translateX(-8px)' },
        { transform: 'translateX(8px)' },
        { transform: 'translateX(-8px)' },
        { transform: 'translateX(0)' },
        { backgroundColor: 'red' },
        { backgroundColor: 'blue' }
    ];

    const opzioni ={
        duration: 200,
    };

    form.animate(animazione, opzioni);

    changeLightColor();
    changeFormColor();
}
export function generateOpzionForm(){
    const div = document.createElement("div");
    div.id = "divChatBot";
    document.body.appendChild(div);
    const chatName = document.createElement("h2");
    chatName.id = "divChatName";
    chatName.textContent = "ciaoooo";
    div.appendChild(chatName);
    const form = document.createElement("form");
    form.id = "chatBot";
    div.appendChild(form);
    const response = document.createElement("textarea");
    response.id = "responseChatOllama";
    form.appendChild(response);
    const prompt = document.createElement("input");
    prompt.id = "requestChatOllama";
    prompt.placeholder = "prompt richiesta";
    form.appendChild(prompt);
}
function myFunction() {
document.body.style.backgroundImage ="none";
document.getElementsByClassName("menuButton")[0].classList.toggle("change");
}
document.getElementsByClassName("menuButton")[0].addEventListener("click", myFunction());