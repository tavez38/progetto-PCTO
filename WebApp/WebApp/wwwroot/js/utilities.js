export const listaCharSpec = ["!", "@", "#", "$", "%", "^", "&", "*", "-", "_", "+", "=", "?"];


export function checkEmail(email, errSpanEmail) {

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

export function checkPsw(psw, errSpanPsw) {

    let number = 0;
    let charSpec = 0;
    let char = 0;


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

export async function sendOllamaRequest() {
    const domanda = document.getElementById("requestChatOllama").value;
    const textAreaResponse = document.getElementById("responseChatOllama");
    textAreaResponse.removeAttribute("readonly"); 
    textAreaResponse.setAttribute("placeholder", "Caricamento...");
    
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
        else if (!res.ok) {
            console.log(res.status);
            return;
        }
        const data = await res.json();
        document.getElementById("responseChatOllama").value = data.response;
        textAreaResponse.setAttribute("readonly", "readonly");
           
    }
    catch (error) {
        console.error("Fetch error:", error);
        textAreaRisposta.value = "Errore nella richiesta";
        textAreaRisposta.setAttribute("readonly", "readonly");
    }
}
export function checkCharSpec(c) {
    return listaCharSpec.includes(c);
}

export function goToUploadWorkPage(){
    window.location.href = '../html/uploadWork.html';
}
export function deleteInput(input){
    input.getElementsByTagName("input").value = "";
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
        if(document.getElementById("divChatBot") == null){
            document.getElementsByClassName("home")[0].style.width = "80%";
            const div = document.createElement("div");
            div.id = "divChatBot";
            div.style.width = "20%";
            document.getElementsByClassName("flex")[0].appendChild(div);
            const chatName = document.createElement("h2");
            chatName.id = "divChatName";
            chatName.textContent = "Chiedi qualsiasi cosa, sono qui per aiutarti";
            div.appendChild(chatName);
            const form = document.createElement("form");
            form.id = "chatBot";
            div.appendChild(form);
            const response = document.createElement("textarea");
            response.id = "responseChatOllama";
            response.readOnly=true;
            form.appendChild(response);
            const prompt = document.createElement("input");
            prompt.id = "requestChatOllama";
            prompt.placeholder = "prompt richiesta";
            form.appendChild(prompt);
            const invio = document.createElement("button");
            invio.type = "button";
            invio.id="sendReqChatbot";
            invio.innerHTML = "invia";
            form.appendChild(invio);
            document.getElementById("sendReqChatbot").addEventListener("click", sendOllamaRequest);
        }
        else{
            document.getElementById("divChatBot").remove();
            document.getElementsByClassName("home")[0].style.width = "100%";
        }
    }
export function iconBarGenerator(){
            if(document.getElementById("iconBar") == null){
                const div = document.createElement("div");
                div.id ="iconBar";
                document.body.insertBefore(div, document.body.children[0]);
                const icona1 = document.createElement("a");
                icona1.id ="homeIcon";
                icona1.href = "PersonalArea.html";
                icona1.innerHTML = "E";
                div.appendChild(icona1);
                const icona2 = document.createElement("a");
                icona2.id ="uploadIcon";
                icona2.href ="uploadWork.html";
                icona2.innerHTML = "E";
                div.appendChild(icona2);
                const icona3 = document.createElement("a");
                icona3.id ="messaggiIcon";
                icona3.href = "Messaggi.html";
                icona3.innerHTML = "E";
                div.appendChild(icona3);
            }
            else{
            document.getElementById("iconBar").remove();
            }
        }
export function menuFigo(x) {
  x.classList.toggle("change");
}

export function goToPersonalArea() {
    window.location.href = '../html/PersonalArea.html';
}
export function revalForm(idFormale){
    let opacityBox = document.getElementsByClassName("opacityBox")[0];
    let scriviMail = idFormale;

   scriviMail.style.display = "block";
   opacityBox.style.opacity = "0.4";
   document.body.style.overflow = "hidden";
   opacityBox.style.pointerEvents = "none";
}
export function hideForm(idFormale){
    let opacityBox = document.getElementsByClassName("opacityBox")[0];
    let scriviMail = idFormale;

    scriviMail.style.display = "none";
    opacityBox.style.opacity = "1";
    document.body.style.overflow = "auto";
    opacityBox.style.pointerEvents = "all";

    deleteInput(idFormale);
}
