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

document.getElementById("linkLogOutUpWork").addEventListener("click", logout);
document.getElementById("btnUploadWork").addEventListener("click", uploadWork);

async function uploadWork() {
    const idUtenteLoggato = localStorage.getItem("idUtenteLoggato");
    let progetto ={
        
        title : document.getElementById("inputTitle").value,
        description : document.getElementById("inputDesc").value,
        scadenza : document.getElementById("inputData").value,
        orarioScadenza : document.getElementById("inputOra").value
    }
    try{
        fetch("/api/uploadWork", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(progetto)
        })
            .then(res => {
                if (!res.ok) {
                    console.log(res.status);
                }
                else {
                    console.log(res.status);
                }
            });
    }
    catch (error){
        console.log(error)
    }
}