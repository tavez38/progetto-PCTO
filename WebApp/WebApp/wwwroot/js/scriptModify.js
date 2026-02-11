import {
    checkEmail,
    checkPsw,
    generateOpzionForm,
    hideForm,
    iconBarGenerator,
    revalForm
} from "../js/utilities.js";

document.addEventListener("DOMContentLoaded", getUserInfo);
document.getElementById("btnModUsername").addEventListener("click", modifyUsername);
document.getElementById("btnModEmail").addEventListener("click", modifyEmail);
document.getElementById("btnModPsw").addEventListener("click", modifyPassword);
document.getElementsByClassName("openForm")[0].addEventListener("click", function() {
  revalForm(document.getElementById("divModUsername"))});
document.getElementsByClassName("openForm")[1].addEventListener("click", function() {
  revalForm(document.getElementById("divModEmail"))});
document.getElementsByClassName("openForm")[2].addEventListener("click", function() {
  revalForm(document.getElementById("divModPassword"))});
document.getElementsByClassName("exit")[0].addEventListener("click", function() {
  hideForm(document.getElementById("divModUsername"))});
document.getElementsByClassName("exit")[1].addEventListener("click", function() {
  hideForm(document.getElementById("divModEmail"))});
document.getElementsByClassName("exit")[2].addEventListener("click", function() {
  hideForm(document.getElementById("divModPassword"))});

document.getElementById("toChatBot").addEventListener("click", generateOpzionForm);
document.getElementById("btnNavBar").addEventListener("click", iconBarGenerator);

async function getUserInfo() {
    const res = await fetch("/api/modifyAccount/getUserInfo", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });
    if (!res.ok) {
        console.log(res.status);
        const errorData = await res.json();
        console.log(errorData.res);
        return;
    }
    const data = await res.json();
    document.getElementById("usernameUser").textContent += data.username;
    document.getElementById("emailUser").textContent += data.email;
    return;
}

async function modifyUsername() {
    let newUsername = document.getElementById("inputUsernameMod").value;
    let request = {
        usernameNew: newUsername
    };
    const res = await fetch("/api/modifyAccount/username", {
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
    const pswOld = document.getElementById("inputPasswordOld").value;
    const pswConfirm = document.getElementById("inputPasswordNewConf").value;
    if (!checkNewOldPsw(newPsw, pswOld)) {
        alert("La password nuova e quella vecchia coincidono");
        return;
    }
    if (!checkNewPsw(newPsw, pswConfirm)) {
        alert("La password inserita e quella ripetuta nuova non coincidono");
        return;
    }
    const request = {
        pswNew: newPsw,
        pswOld: pswOld
    };

    const res = await fetch("/api/modifyAccount/psw", {
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

function checkNewOldPsw(newPsw, oldPsw) {
    if (newPsw == oldPsw) {
        return false;
    }
    return true;
}

function checkNewPsw(newPsw, pswConfirm) {
    if (pswConfirm != newPsw) {
        return false;
    }
    return true;
}