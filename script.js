// //
// document.addEventListener('DOMContentLoaded', function () {
//     //rekuperation du formulaire par son id 
//     let myForm = document.getElementById('myForm');
//     let successMessage = document.getElementById('successMessage');

//     // Ajout d'un écouteur d'événement sur le formulaire pour le soumission
//     myForm.addEventListener('submit', function (event) {
//         // Empêcher le comportement par défaut du formulaire (soumission immédiate)
//         event.preventDefault();
//         // Récupération des données du formulaire
//         let libelle= document.getElementById('libelle').value.trim();
//         let categorie = document.getElementById('categorie').value.trim();
//         let description = document.getElementById('description').value.trim();



//         // Validation de la longueur des champs prénom et nom
//         if (libelle.length < 50 || libelle.length > 4000) {
//             document.getElementById('libelleError').innerText = "Le libelledoit comporter entre 10 et 50 caractères";
//             return;
//         }
        
//         // Validation de la categorie
//         if (categorie.length < 10 || categorie.length > 50) {
//             document.getElementById('categorieError').innerText = "La catégorie doit comporter entre 10 et 50 caractères";
//             return;
//         }

//         // Validation du mot de passe
//         if (description.length < 8 || description.length > 4000) {
//             document.getElementById('descriptionError').innerText = "La description doit comporter entre 100 et 40000 caractères";
//             return;
//         }

//         //
//         myForm.style.display = 'none';
//         successMessage.style.display = 'block';

//     });
// });
// function closePopup() {
//     let successMessage = document.getElementById('successMessage');
//     successMessage.style.display = 'none';
//     let myForm = document.getElementById('myForm');
//     myForm.style.display = 'block';
//     myForm.reset();
// }

//Show alert
var selectedrow=null;
function showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#myForm");
    container.insertBefore(div, form);

    setTimeout(() => document.querySelector(".alert").remove(), 2000);
}

//Clear All Field 
function clearField (){
    document.querySelector("#libelle").value = "";
    document.querySelector("#categorie").value = "";
    document.querySelector("#description").value = "";

}

// Add Idée
document.querySelector("#myForm").addEventListener("submit", (event) => {
    event.preventDefault();
    // Récupération des données
    const libelle = document.querySelector("#libelle").value;
    const categorie = document.querySelector("#categorie").value;
    const description = document.querySelector("#description").value;

    // Vérification des champs
    if (libelle == "" || categorie == "" || description == "") {
        showAlert("Veuillez remplir tous les champs", "danger");
    } else {
        if (selectedrow == null) {
            const list = document.querySelector("#ideelist");
            const row = document.createElement("tr");
            row.innerHTML = `
                <td></td>
                <td>${libelle}</td>
                <td>${categorie}</td>
                <td>${description}</td>
                <td>
                <a href="#" class="btn btn-success btn-sm approve-btn">Approuver</a>
                <a href="#" class="btn btn-warning btn-sm disapprove-btn">Inapprouver</a>
                <a href="#" class="btn btn-danger btn-sm delete-btn">Delete</a>
                </td>
                `;
            list.appendChild(row);
            selectedrow = null ;
            showAlert("L'idée a été ajoutée avec succès", "success");
        } else {
            selectedrow.cells[0].textContent = libelle;
            selectedrow.cells[1].textContent = categorie;
            selectedrow.cells[2].textContent = description;
            showAlert("L'idée a été mise à jour avec succès", "info");
            selectedrow = null;
        }
        clearField();
    }
});




 // Suppression d'une idée
document.querySelector("#ideelist").addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
        event.target.parentElement.parentElement.remove();
        showAlert("Idée supprimée", "warning");
    }
});

//Approuver une idée 
document.querySelector("#ideelist").addEventListener("click", (event) => {
    if (event.target.classList.contains("approve-btn")) {
        event.target.parentElement.parentElement.classList.add("table-success");
        showAlert("Idée approuvée", "success");
    }
});

// Inapprouver une idée
document.querySelector("#ideelist").addEventListener("click", (event) => {
    if (event.target.classList.contains("disapprove-btn")) {
        event.target.parentElement.parentElement.classList.add("table-danger");
        showAlert("Idée inapprouvée", "danger");
    }
});
