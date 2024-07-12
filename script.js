var selectedrow = null; 
// Initialise la variable selectedrow à null pour suivre la ligne sélectionnée.

// Fonction pour afficher une alerte sous le champ concerné
function showAlert(message, element) {
    // Sélectionne l'élément DOM où l'alerte sera affichée.
    const errorElement = document.querySelector(element); 
    // Définit le message d'alerte comme le texte de l'élément sélectionné.
    errorElement.textContent = message; 
    // Efface le message d'alerte après 2 secondes.
    setTimeout(() => errorElement.textContent = "", 2000); 
}

// Fonction pour afficher un message de succès
function showSuccessMessage(message) {
    // Sélectionne l'élément DOM pour le message de succès.
    const successMessageElement = document.querySelector("#successMessage"); 
    // Définit le message de succès comme le texte de l'élément sélectionné.
    successMessageElement.textContent = message; 
    // Affiche l'élément du message de succès.
    successMessageElement.style.display = "block"; 
    // Cache le message de succès après 3 secondes.
    setTimeout(() => successMessageElement.style.display = "none", 3000); 
}

// Fonction pour effacer tous les champs du formulaire
function clearField() {
    // Réinitialise la valeur du champ libelle à une chaîne vide.
    document.querySelector("#libelle").value = ""; 
    // Réinitialise la valeur du champ categorie à une chaîne vide.
    document.querySelector("#categorie").value = ""; 
    // Réinitialise la valeur du champ description à une chaîne vide.
    document.querySelector("#description").value = ""; 
}

// Fonction pour valider la longueur d'une chaîne de caractères
function validateLength(input, min, max) {
    // Supprime les espaces au début et à la fin de la chaîne de caractères.
    const value = input.trim(); 
    // Vérifie si la longueur de la chaîne de caractères est comprise entre min et max.
    return value.length >= min && value.length <= max; 
}

// Fonction pour échapper les caractères spéciaux (prévention des scripts)
function escapeHTML(str) {
    // Remplace les caractères spéciaux par leurs entités HTML.
    return str.replace(/[&<>"'\/]/g, function (s) {
        // Dictionnaire de mappage des caractères spéciaux vers leurs entités HTML.
        const entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;'
        };
        // Retourne l'entité HTML correspondante au caractère spécial.
        return entityMap[s];
    });
}

// Ajout d'une idée
document.querySelector("#myForm").addEventListener("submit", (event) => {
    // Empêche le comportement par défaut du formulaire (soumission de la page).
    event.preventDefault();

    // Échappe les caractères spéciaux et récupère la valeur du champ libelle.
    const libelle = escapeHTML(document.querySelector("#libelle").value); 
    // Échappe les caractères spéciaux et récupère la valeur du champ categorie.
    const categorie = escapeHTML(document.querySelector("#categorie").value); 
    // Échappe les caractères spéciaux et récupère la valeur du champ description.
    const description = escapeHTML(document.querySelector("#description").value); 

    // Initialise une variable de validation à true.
    let isValid = true;

    // Valide la longueur du libelle.
    if (!validateLength(libelle, 5, 100)) {
        // Affiche un message d'erreur si la validation échoue.
        showAlert("Le libellé doit avoir entre 5 et 100 caractères", "#libelleError"); 
        // Met à jour la variable de validation à false.
        isValid = false;
    } else {
        // Valide que la catégorie n'est pas vide.
        if (categorie === "") {
            // Affiche un message d'erreur si la validation échoue.
            showAlert("Veuillez sélectionner une catégorie", "#categorieError"); 
            // Met à jour la variable de validation à false.
            isValid = false;
        }
        // Valide la longueur de la description.
        if (!validateLength(description, 5, 255)) {
            // Affiche un message d'erreur si la validation échoue.
            showAlert("La description doit avoir entre 10 et 5000 caractères", "#descriptionError"); 
            // Met à jour la variable de validation à false.
            isValid = false;
        }
    }

    // Si toutes les validations ont réussi.
    if (isValid) {
        // Sélectionne l'élément de la liste des idées.
        const list = document.querySelector("#ideelist"); 
        // Crée un nouvel élément div pour la nouvelle idée.
        const col = document.createElement("div"); 
        // Définit les classes CSS de la nouvelle idée.
        col.className = "col-md-4 mb-4"; 
        // Définit le contenu HTML de la nouvelle idée.
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
        // Ajoute la nouvelle idée à la liste.
        list.appendChild(col); 
        // Affiche un message de succès.
        showSuccessMessage("L'idée a été ajoutée avec succès"); 
        // Efface les champs du formulaire.
        clearField(); 
        // Réinitialise la variable selectedrow à null.
        selectedrow = null; 
    }
});

// Suppression d'une idée
document.querySelector("#ideelist").addEventListener("click", (event) => {
    // Vérifie si l'élément cliqué est un bouton de suppression ou une icône de suppression.
    if (event.target.classList.contains("delete-btn") || event.target.classList.contains("fa-trash")) {
        // Supprime la colonne contenant l'idée.
        event.target.closest(".col-md-4").remove(); 
        // Affiche un message de succès.
        showSuccessMessage("Idée supprimée"); 
    }
});

// Approuver une idée
document.querySelector("#ideelist").addEventListener("click", (event) => {
    // Vérifie si l'élément cliqué est un bouton d'approbation.
    if (event.target.classList.contains("approve-btn")) {
        // Sélectionne l'élément parent contenant l'idée.
        const card = event.target.closest(".card"); 
        // Ajoute les classes CSS pour indiquer l'approbation.
        card.classList.add("bg-success", "text-white"); 
        // Désactive le bouton d'approbation.
        event.target.classList.add("disabled"); 
        // Désactive le bouton de désapprobation.
        card.querySelector(".disapprove-btn").classList.add("disabled"); 
        // Affiche un message de succès.
        showSuccessMessage("Idée approuvée"); 
    }
});

// Désapprouver une idée
document.querySelector("#ideelist").addEventListener("click", (event) => {
    // Vérifie si l'élément cliqué est un bouton de désapprobation.
    if (event.target.classList.contains("disapprove-btn")) {
        // Sélectionne l'élément parent contenant l'idée.
        const card = event.target.closest(".card"); 
        // Ajoute les classes CSS pour indiquer la désapprobation.
        card.classList.add("bg-danger", "text-white"); 
        // Désactive le bouton de désapprobation.
        event.target.classList.add("disabled"); 
        // Désactive le bouton d'approbation.
        card.querySelector(".approve-btn").classList.add("disabled"); 
        // Affiche un message de succès.
        showSuccessMessage("Idée inapprouvée"); 
    }
});
