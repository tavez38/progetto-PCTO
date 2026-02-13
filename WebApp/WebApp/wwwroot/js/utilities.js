export const listaCharSpec = ["!", "@", "#", "$", "%", "^", "&", "*", "-", "_", "+", "=", "?"];

export function checkEmail(email, errSpanEmail) {
    const val = email.value.trim(); // Puliamo subito

    // 1. Nessun spazio consentito
    if (val.includes(" ")) {
        setError(email, errSpanEmail, "L'email non può contenere spazi");
        return false;
    }

    const parts = val.split("@");

    // 2. Deve esserci esattamente una @
    if (parts.length !== 2 || parts[0] === "" || parts[1] === "") {
        setError(email, errSpanEmail, "Formato email non valido (manca @ o nome)");
        return false;
    }

    const domainPart = parts[1];

    // 3. Il dominio deve contenere almeno un punto e non all'inizio o alla fine
    if (!domainPart.includes(".") || domainPart.startsWith(".") || domainPart.endsWith(".")) {
        setError(email, errSpanEmail, "Dominio non valido");
        return false;
    }

    const domainPieces = domainPart.split(".");
    // 4. Controlliamo che ogni pezzo del dominio (es. 'gmail', 'com') non sia vuoto
    // Usiamo .some() che abbiamo imparato prima!
    const haPezziVuoti = domainPieces.some(piece => piece.length === 0);

    if (haPezziVuoti) {
        setError(email, errSpanEmail, "Punti consecutivi nel dominio");
        return false;
    }

    // Se tutto passa
    errSpanEmail.innerHTML = "";
    email.style.borderColor = "";
    return true;
}

// Funzione di supporto per non ripetere codice
function setError(el, span, msg) {
    span.innerText = msg;
    el.style.border = "1px solid red";
}


export function checkPsw(psw, errSpanPsw) {

    let number = 0;
    let charSpec = 0;
    let char = 0;

    psw.style.borderColor = "";
    errSpanPsw.innerHTML = "";

    //caso psw vuota
    if (psw.value.trim().length == 0) {
        psw.style.borderColor = "red";
        errSpanPsw.innerText = "La password non rispetta i requisiti minimi";
        return false;
    }
    //caso se psw contiene spazi
    if (psw.value.includes(" ")) {
        psw.style.borderColor = "red";
        errSpanPsw.innerText = "La password non può contenere spazi";
        return false;
    }
    //caso lunghezza psw non negli standard
    if (psw.value.length < 5 || psw.value.length > 10) {
        psw.style.borderColor = "red";
        errSpanPsw.innerText = "Lunghezza password non valida: (5-10 caratteri)";
        console.log("false");
        return false;
    }

   
    //validazione con requisiti minimi
    for (let i = 0; i < psw.value.length; i++) {
        //check se char = num
        if (psw.value[i] >= "0" && psw.value[i] <= "9") {
            number++;
        }
        //check se c'è char speciale
        else if (checkCharSpec(psw.value[i])) {
            charSpec++;
        }
        //check se char != da " "
        else if (psw.value[i] != " ") {
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

export async function sendOllamaRequest() {
    const domanda = document.getElementById("requestChatOllama").value;
    const textAreaResponse = document.getElementById("responseChatOllama");
    document.getElementById("requestChatOllama").value = "";
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
        if (res.status == 500) {
            textAreaResponse.value = "c'e stato un errore nel server, riprova piu tardi";
        }
        else if (!res.ok) {
            console.log(res.status);
            return;
        }
        const data = await res.json();
        textAreaResponse.value = data.response;
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

export function deleteInput(container) {
    if (!container) return; // gestisce chiamate con null
    const inputs = container.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
    }
    const textareas = container.getElementsByTagName("textarea");
    for (let i = 0; i < textareas.length; i++) {
        textareas[i].value = "";
    }
}
export function goToMessaggiPage(){
    window.location.href = '../html/Messaggi.html';
}

export function logout() {
    localStorage.removeItem("idUtenteLoggato");
    localStorage.removeItem("token");
    window.location.href = '../html/Index.html';
}
export function generateOpzionForm(){
        if(document.getElementById("divChatBot") == null){
            document.getElementsByClassName("home")[0].style.width = "75%";
            const div = document.createElement("div");
            div.id = "divChatBot";
            div.style.width = "20%";
            document.getElementsByClassName("flex")[0].appendChild(div);
            const hr =document.createElement("hr");
            hr.id = "hrChat";
            div.appendChild(hr);
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
                icona1.className = "fas fa-id-card-alt";
                div.appendChild(icona1);
                const icona2 = document.createElement("a");
                icona2.id ="uploadIcon";
                icona2.href ="uploadWork.html";
                icona2.className = "fas fa-upload";
                div.appendChild(icona2);
                const icona3 = document.createElement("a");
                icona3.id ="messaggiIcon";
                icona3.href = "Messaggi.html";
                icona3.innerHTML = "&#9993;";
                div.appendChild(icona3);
            }
            else{
            document.getElementById("iconBar").remove();
            }
}
export function goToPersonalArea() {
    window.location.href = '../html/PersonalArea.html';
}
export function revalForm(idFormale){
    let opacityBox = document.getElementsByClassName("opacityBox")[0];
    let scriviMail = idFormale;

   scriviMail.style.display = "block";
   opacityBox.style.opacity = "0.4";
   opacityBox.style.pointerEvents = "none";
}
export function hideForm(idFormale){
    let opacityBox = document.getElementsByClassName("opacityBox")[0];
    let scriviMail = idFormale;

    scriviMail.style.display = "none";
    opacityBox.style.opacity = "1";
    opacityBox.style.pointerEvents = "all";

    deleteInput(idFormale);
}

export function menuFigo(x) {
  if (!x || !x.classList) return; // evita eccezioni se chiamata con null
  x.classList.toggle("change");
}
