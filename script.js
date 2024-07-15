// Catégories autorisées
const validCategories = ["Sport", "Politique", "Santé", "Education"];

// Variable pour stocker la ligne sélectionnée dans le formulaire
var selectedrow = null;

// Fonction pour afficher une alerte sous le champ concerné
function showAlert(message, element) {
    // Sélectionne l'élément pour afficher le message d'erreur
    const errorElement = document.querySelector(element);
    // Affiche le message d'erreur
    errorElement.textContent = message;
    // Efface le message après 2 secondes
    setTimeout(() => errorElement.textContent = "", 2000);
}

// Fonction pour afficher un message de succès
function showSuccessMessage(message) {
    // Sélectionne l'élément pour afficher le message de succès
    const successMessageElement = document.querySelector("#successMessage");
    // Affiche le message de succès
    successMessageElement.textContent = message;
    // Affiche le message de succès pendant 3 secondes
    successMessageElement.style.display = "block";
    setTimeout(() => successMessageElement.style.display = "none", 3000);
}

// Fonction pour effacer tous les champs du formulaire
function clearField() {
    // Efface le champ du libellé
    document.querySelector("#libelle").value = "";
    // Efface le champ de la catégorie
    document.querySelector("#categorie").value = "";
    // Efface le champ de la description
    document.querySelector("#description").value = "";
}

// Fonction pour valider la longueur d'une chaîne de caractères
function validateLength(input, min, max) {
    // Supprime les espaces en début et fin de chaîne
    const value = input.trim();
    // Vérifie si la longueur est comprise entre les valeurs min et max
    return value.length >= min && value.length <= max;
}

// Fonction pour échapper les caractères spéciaux (prévention des scripts)
function escapeHTML(str) {
    // Remplace les caractères spéciaux par leurs entités HTML
    return str.replace(/[&<>"'\/]/g, function (s) {
        const entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;'
        };
        return entityMap[s];
    });
}

// Fonction pour sauvegarder une idée dans le localStorage
function saveIdeaToLocalStorage(libelle, categorie, description, status) {
    // Récupère les idées existantes dans le localStorage ou initialise un tableau vide
    let ideas = JSON.parse(localStorage.getItem("ideas")) || [];
    // Ajoute la nouvelle idée avec son statut
    ideas.push({ libelle, categorie, description, status });
    // Sauvegarde le tableau d'idées dans le localStorage
    localStorage.setItem("ideas", JSON.stringify(ideas));
}

// Fonction pour charger les idées depuis le localStorage
function loadIdeasFromLocalStorage() {
    // Récupère les idées depuis le localStorage ou initialise un tableau vide
    let ideas = JSON.parse(localStorage.getItem("ideas")) || [];
    // Sélectionne l'élément pour afficher les idées
    const list = document.querySelector("#ideelist");
    // Parcourt chaque idée et l'ajoute à la liste
    ideas.forEach(idea => {
        // Crée un nouvel élément div pour l'idée
        const col = document.createElement("div");
        col.className = "col-md-4 mb-4";
        col.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${idea.libelle}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${idea.categorie}</h6>
                    <p class="card-text">${idea.description}</p>
                    <a href="#" class="btn btn-success btn-sm approve-btn ${idea.status === 'approved' ? 'disabled' : ''}">Approuver</a>
                    <a href="#" class="btn btn-warning btn-sm disapprove-btn ${idea.status === 'disapproved' ? 'disabled' : ''}">Inapprouver</a>
                    <a href="#" class="btn btn-danger btn-sm delete-btn">
                        <i class="fas fa-trash"></i>
                    </a>
                </div>
            </div>
        `;
        // Ajoute une bordure verte si l'idée est approuvée
        if (idea.status === 'approved') {
            col.querySelector('.card').style.border = "15px solid green";
        } 
        // Ajoute une bordure rouge si l'idée est désapprouvée
        else if (idea.status === 'disapproved') {
            col.querySelector('.card').style.border = "15px solid red";
        }
        // Ajoute l'idée à la liste
        list.appendChild(col);
    });
}

// Fonction pour mettre à jour le statut d'une idée dans le localStorage
function updateIdeaStatusInLocalStorage(libelle, status) {
    // Récupère les idées depuis le localStorage
    let ideas = JSON.parse(localStorage.getItem("ideas")) || [];
    // Met à jour le statut de l'idée correspondante
    ideas = ideas.map(idea => {
        if (idea.libelle === libelle) {
            idea.status = status;
        }
        return idea;
    });
    // Sauvegarde les idées mises à jour dans le localStorage
    localStorage.setItem("ideas", JSON.stringify(ideas));
}

// Fonction pour supprimer une idée du localStorage
function deleteIdeaFromLocalStorage(libelle) {
    // Récupère les idées depuis le localStorage
    let ideas = JSON.parse(localStorage.getItem("ideas")) || [];
    // Filtre et supprime l'idée correspondante
    ideas = ideas.filter(idea => idea.libelle !== libelle);
    // Sauvegarde les idées mises à jour dans le localStorage
    localStorage.setItem("ideas", JSON.stringify(ideas));
}

// Charge les idées depuis le localStorage lorsque la page est chargée
document.addEventListener("DOMContentLoaded", loadIdeasFromLocalStorage);

// Ajout d'une idée
document.querySelector("#myForm").addEventListener("submit", (event) => {
    // Empêche l'envoi du formulaire
    event.preventDefault();

    // Récupère et échappe les valeurs des champs du formulaire
    const libelle = escapeHTML(document.querySelector("#libelle").value);
    const categorie = escapeHTML(document.querySelector("#categorie").value);
    const description = escapeHTML(document.querySelector("#description").value);

    // Variable pour vérifier la validité du formulaire
    let isValid = true;

    // Valide la longueur du libellé
    if (!validateLength(libelle, 5, 100)) {
        showAlert("Le libellé doit avoir entre 5 et 100 caractères", "#libelleError");
        isValid = false;
    } 
    // Valide la catégorie
    else {
                // Validation de la catégorie
            if (!validCategories.includes(categorie)) {
                showAlert("Catégorie invalide", "#categorieError");
                isValid = false;
            }
        // Valide la longueur de la description
        if (!validateLength(description, 10, 5000)) {
            showAlert("La description doit avoir entre 10 et 5000 caractères", "#descriptionError");
            isValid = false;
        }
    }

    // Si le formulaire est valide, ajoute l'idée à la liste
    if (isValid) {
        // Sélectionne l'élément pour afficher les idées
        const list = document.querySelector("#ideelist");
        // Crée un nouvel élément div pour l'idée
        const col = document.createElement("div");
        col.className = "col-md-4 mb-4";
        col.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${libelle}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${categorie}</h6>
                    <p class="card-text">${description}</p>
                    <a href="#" class="btn btn-success btn-sm approve-btn">Approuver</a>
                    <a href="#" class="btn btn-warning btn-sm disapprove-btn">Inapprouver</a>
                    <a href="#" class="btn btn-danger btn-sm delete-btn">
                        <i class="fas fa-trash"></i>
                    </a>
                </div>
            </div>
        `;
        // Ajoute l'idée à la liste
        list.appendChild(col);
        // Sauvegarde l'idée dans le localStorage
        saveIdeaToLocalStorage(libelle, categorie, description, "");
        // Affiche un message de succès
        showSuccessMessage("L'idée a été ajoutée avec succès");
        // Efface les champs du formulaire
        clearField();
        // Réinitialise la variable selectedrow
        selectedrow = null;
    }
});

// Suppression d'une idée
document.querySelector("#ideelist").addEventListener("click", (event) => {
    // Vérifie si l'élément cliqué est un bouton de suppression ou une icône de suppression
    if (event.target.classList.contains("delete-btn") || event.target.classList.contains("fa-trash")) {
        // Sélectionne la carte contenant l'idée
        const card = event.target.closest(".card");
        // Récupère le libellé de l'idée à supprimer
        const libelle = card.querySelector(".card-title").textContent;
        // Supprime la colonne contenant l'idée
        event.target.closest(".col-md-4").remove();
        // Supprime l'idée du localStorage
        deleteIdeaFromLocalStorage(libelle);
        // Affiche un message de succès
        showSuccessMessage("Idée supprimée");
    }
});

// Approuver une idée
document.querySelector("#ideelist").addEventListener("click", (event) => {
    // Vérifie si l'élément cliqué est un bouton d'approbation
    if (event.target.classList.contains("approve-btn")) {
        // Sélectionne la carte contenant l'idée
        const card = event.target.closest(".card");
        // Récupère le libellé de l'idée à approuver
        const libelle = card.querySelector(".card-title").textContent;
        // Ajoute une bordure verte à la carte
        card.style.border = "15px solid green";
        // Désactive les boutons d'approbation et de désapprobation
        event.target.classList.add("disabled");
        card.querySelector(".disapprove-btn").classList.add("disabled");
        // Met à jour le statut de l'idée dans le localStorage
        updateIdeaStatusInLocalStorage(libelle, "approved");
        // Affiche un message de succès
        showSuccessMessage("Idée approuvée");
    }
});

// Désapprouver une idée
document.querySelector("#ideelist").addEventListener("click", (event) => {
    // Vérifie si l'élément cliqué est un bouton de désapprobation
    if (event.target.classList.contains("disapprove-btn")) {
        // Sélectionne la carte contenant l'idée
        const card = event.target.closest(".card");
        // Récupère le libellé de l'idée à désapprouver
        const libelle = card.querySelector(".card-title").textContent;
        // Ajoute une bordure rouge à la carte
        card.style.border = "15px solid red";
        // Désactive les boutons d'approbation et de désapprobation
        event.target.classList.add("disabled");
        card.querySelector(".approve-btn").classList.add("disabled");
        // Met à jour le statut de l'idée dans le localStorage
        updateIdeaStatusInLocalStorage(libelle, "disapproved");
        // Affiche un message de succès
        showSuccessMessage("Idée inapprouvée");
    }
});
