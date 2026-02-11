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
    goToPersonalArea,
    iconBarGenerator,
    revalForm,
    hideForm
} from "../js/utilities.js";


document.addEventListener("DOMContentLoaded", loadWorks);
document.getElementById("linkLogOutPA").addEventListener("click", logout);
document.getElementById("btnAddWork").addEventListener("click", goToUploadWorkPage);
document.getElementById("btnMsg").addEventListener("click", goToMessaggiPage);
document.getElementById("toChatBot").addEventListener("click", generateOpzionForm);
document.getElementById("btnNavBar").addEventListener("click", iconBarGenerator);

var vWorks = [];

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
        data.forEach(element => {
            vWorks.push(element);
        });
        createWorksTable();
        
    }
    catch (error) {
        console.log(error);
    }
}

function createWorksTable() {
    const tableBody = document.getElementById("tableBodyProj");
    const fragment = document.createDocumentFragment();
    vWorks.forEach(element => {
        const tr = document.createElement("tr");
        tr.className = "rows";

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

function myFunction() {
document.body.style.backgroundImage ="none";
document.getElementsByClassName("menuButton")[0].classList.toggle("change");
}