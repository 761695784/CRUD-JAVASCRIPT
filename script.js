// Déclare une variable globale qui sera utilisée pour suivre la ligne sélectionnée
var selectedrow = null;

// Fonction pour afficher une alerte sous le champ concerné
function showAlert(message, element) {
    // Sélectionne l'élément d'erreur spécifié par le paramètre "element"
    const errorElement = document.querySelector(element);
    // Définit le texte de l'élément d'erreur comme étant le message passé en paramètre
    errorElement.textContent = message;
    // Supprime le message d'erreur après 2 secondes
    setTimeout(() => errorElement.textContent = "", 2000);
}


// Fonction pour effacer tous les champs du formulaire
function clearField() {
    document.querySelector("#libelle").value = "";
    document.querySelector("#categorie").value = "";
    document.querySelector("#description").value = "";
}

// Fonction pour valider la longueur du champ// Fonction pour valider la longueur d'une chaîne de caractères
function validateLength(input, min, max) {
    // Supprime les espaces au début et à la fin de la chaîne de caractères d'entrée
    const value = input.trim();
    
    // Vérifie si la longueur de la chaîne de caractères est comprise entre min et max (inclus)
    return value.length >= min && value.length <= max;
}

// Fonction pour échapper les caractères spéciaux (prévention des scripts)
function escapeHTML(str) {
    // Utilise la méthode replace pour remplacer les caractères spéciaux dans la chaîne
    return str.replace(/[&<>"'\/]/g, function (s) {
        // Crée une table de mappage des caractères spéciaux aux entités HTML
        const entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;'
        };
        // Retourne l'entité HTML correspondante pour chaque caractère spécial
        return entityMap[s];
    });
}


// Ajout d'une idée
document.querySelector("#myForm").addEventListener("submit", (event) => {
    event.preventDefault();

    // Récupération et échappement des valeurs des champs de formulaire
    const libelle = escapeHTML(document.querySelector("#libelle").value);
    const categorie = escapeHTML(document.querySelector("#categorie").value);
    const description = escapeHTML(document.querySelector("#description").value);

    // Initialisation d'une variable pour vérifier la validité des champs
    let isValid = true;

    // Validation du champ "libelle"
    if (!validateLength(libelle, 10, 100)) {
        showAlert("Le libellé doit avoir entre 10 et 100 caractères", "#libelleError");
        isValid = false;
    } else {
        // Validation du champ "categorie"
        if (categorie === "") {
            showAlert("Veuillez sélectionner une catégorie", "#categorieError");
            isValid = false;
        }

        // Validation du champ "description"
        if (!validateLength(description, 40, 5000)) {
            showAlert("La description doit avoir entre 40 et 5000 caractères", "#descriptionError");
            isValid = false;
        }
    }

    // Si tous les champs sont valides
    if (isValid) {
        // Si aucune ligne n'est sélectionnée, ajouter une nouvelle idée
        if (selectedrow === null) {
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
            selectedrow = null;
            // showAlert("L'idée a été ajoutée avec succès", "#categorieError");
        } else {
            // Si une ligne est sélectionnée, mettre à jour l'idée existante
            selectedrow.cells[0].textContent = libelle;
            selectedrow.cells[1].textContent = categorie;
            selectedrow.cells[2].textContent = description;
            showAlert("L'idée a été mise à jour avec succès", "#categorieError");
            selectedrow = null;
        }
        // Effacer les champs du formulaire
        clearField();
    }
});

// Suppression d'une idée
document.querySelector("#ideelist").addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
        event.target.parentElement.parentElement.remove();
        showAlert("Idée supprimée", "#categorieError");
    }
});
// Approuver une idée
document.querySelector("#ideelist").addEventListener("click", (event) => {
    // Vérifie si l'élément cliqué contient la classe "approve-btn"
    if (event.target.classList.contains("approve-btn")) {
        // Sélectionne la ligne parente de l'élément cliqué
        const row = event.target.parentElement.parentElement;
        // Ajoute la classe "table-success" à la ligne pour indiquer qu'elle est approuvée
        row.classList.add("table-success");
        // Désactive le bouton "Approuver" en ajoutant la classe "disabled"
        event.target.classList.add("disabled");
        // Désactive le bouton "Inapprouver" correspondant en ajoutant la classe "disabled"
        row.querySelector(".disapprove-btn").classList.add("disabled");
        // Affiche un message indiquant que l'idée a été approuvée
        showAlert("Idée approuvée", "#categorieError");
    }
});

// Désapprouver une idée
document.querySelector("#ideelist").addEventListener("click", (event) => {
    // Vérifie si l'élément cliqué contient la classe "disapprove-btn"
    if (event.target.classList.contains("disapprove-btn")) {
        // Sélectionne la ligne parente de l'élément cliqué
        const row = event.target.parentElement.parentElement;
        // Ajoute la classe "table-danger" à la ligne pour indiquer qu'elle est désapprouvée
        row.classList.add("table-danger");
        // Désactive le bouton "Désapprouver" en ajoutant la classe "disabled"
        event.target.classList.add("disabled");
        // Désactive le bouton "Approuver" correspondant en ajoutant la classe "disabled"
        row.querySelector(".approve-btn").classList.add("disabled");
        // Affiche un message indiquant que l'idée a été désapprouvée
        showAlert("Idée inapprouvée", "#categorieError");
    }
});
