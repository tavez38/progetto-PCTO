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

async function loadWorks() {
    const token = localStorage.getItem("token");
    const tableBody = document.getElementById("tableBodyProj");
    try {
        const response = await fetch(`/api/personalArea`, {
            method: "GET",
            headers: {
                "authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
                }
        });
        if (response.status == 401) {
            localStorage.removeItem("idUtenteLoggato");
            localStorage.removeItem("token");
            window.location.href = '../html/AccessoNegato.html';
            return;
        }
        else if (!response.ok) {
            console.log(response.status);
            return;
        }
        const data = await response.json();

        tableBody.innerHTML = "";
        if (data.length == 0) {
            document.getElementById("tableBodyProj").innerHTML = `<tr class="rowNoProject"><td colspan="4" id="colNoProject">Nessun progetto caricato</td></tr>`;
            return;
        }
        const fragment = document.createDocumentFragment();

        data.forEach(element => {
            const tr = document.createElement("tr");
            tr.className = "rows";

            // Creazione manuale sicura delle celle
            const tdTitle = document.createElement("td");
            tdTitle.className = "tableTitle";
            tdTitle.textContent = element.title;
            tr.appendChild(tdTitle);

            const tdDesc = document.createElement("td");
            tdDesc.className = "tableDesc";
            tdDesc.textContent = element.description;
            tr.appendChild(tdDesc);

            const tdDate = document.createElement("td");
            tdDate.className = "tableDate";
            tdDate.textContent = element.scadenza;
            tr.appendChild(tdDate);

            const tdHour = document.createElement("td");
            tdHour.className = "tableHour";
            tdHour.textContent = element.orarioScadenza;
            tr.appendChild(tdHour);

            fragment.appendChild(tr);
        });

        tableBody.appendChild(fragment);
    }
    catch (error) {
        console.log(error);
    }
}
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