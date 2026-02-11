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

document.getElementById("linkLogOutUpWork").addEventListener("click", logout);
document.getElementById("btnUploadWork").addEventListener("click", uploadWork);
document.getElementById("toChatBot").addEventListener("click", generateOpzionForm);
document.getElementById("btnNavBar").addEventListener("click", iconBarGenerator);
document.getElementById("btnNavBar").addEventListener("click", function(){
    menuFigo(this)});

async function uploadWork() {
    let progetto ={
        
        title : document.getElementById("inputTitle").value,
        description : document.getElementById("inputDesc").value,
        scadenza : document.getElementById("inputData").value,
        orarioScadenza : document.getElementById("inputOra").value
    }
    try{
        const res = await fetch("/api/uploadWork", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(progetto)
        });
        if (!res.ok) {
            console.log(res.status);
        }
        else {
            console.log(res.status);
        }
             
        window.location.href = "../html/PersonalArea.html";
    }
    catch (error){
        console.log(error)
    }
}