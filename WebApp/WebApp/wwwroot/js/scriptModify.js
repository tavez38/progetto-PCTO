import {
    checkEmail,
    checkPsw
} from "../js/utilities.js";


document.getElementById("btnModUsername").addEventListener("click", modifyUsername);
document.getElementById("btnModEmail").addEventListener("click", modifyEmail);
document.getElementById("btnModPsw").addEventListener("click", modifyPassword);




async function modifyUsername() {
    let newUsername = document.getElementById("inputUsername").value;
    const res = await fetch("/api/modifyAccount/username", {
        method: "PUT", 
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({ request: newUsername })
    });
    if (!res.ok) {
        console.log(res.status);
        const errorData = await res.json();
        console.log(errorData.res);
        return;
    }
    const data = await res.json();
    console.log(data.res);
    return;
}

async function modifyEmail() {
    const newEmail = document.getElementById("inputEmail").value;
    const pswConfirm = document.getElementById("inputPswConfirmMail").value;

    const request = {
        emailNew: newEmail,
        pswConf: pswConfirm
    };

    const res = await fetch("/api/modifyAccount/email", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(request)
    });
    if (!res.ok) {
        console.log(res.status);
        const errorData = await res.json();
        console.log(errorData.res);
        return;
    }
    const data = await res.json();
    console.log(data.res);
    return; 
}
async function modifyPassword() {
    const newPsw = document.getElementById("inputPasswordNew").value;
    const pswConfirm = document.getElementById("inputPasswordOld").value;
    if (!checkNewPsw(newPsw, pswConfirm)) {
        alert("La nuova password deve essere diversa da quella attuale.");
        return;
    }
    const request = {
        pswNew: newPsw,
        pswConf: pswConfirm
    };

    const res = await fetch("/api/modifyAccount/email", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(request)
    });
    if (!res.ok) {
        console.log(res.status);
        const errorData = await res.json();
        console.log(errorData.res);
        return;
    }
    const data = await res.json();
    console.log(data.res);
    return;
}

function checkNewPsw(newPsw, oldPsw) {
    if (oldPsw === newPsw) {
        return false;
    }
    return true;
}