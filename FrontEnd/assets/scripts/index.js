//####################################################################################
//RECUPERATION DES API
//####################################################################################

const apiUrl = "http://localhost:5678/api";
const getWorksUrl = `${apiUrl}/works`;
const getCategoriesUrl = `${apiUrl}/categories`;
const loginUrl = `${apiUrl}/users/login`;
const deleteWorksUrl = `${apiUrl}/works`;
const postWorksUrl = `${apiUrl}/works`;
const baseImageUrl = "http://localhost:5678/images/"; // URL de base

//####################################################################################
//RECUPERATION DU DOM
//####################################################################################

document.addEventListener("DOMContentLoaded", async function () {

  //####################################################################################
  //RECUPERATION DES CATEGORIES DEPUIS l'API
  //####################################################################################

  async function fetchCategories() {
    try {
      const response = await fetch(getCategoriesUrl);
      const categories = await response.json();
      return categories;
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
      return [];
    }
  }

  //####################################################################################
  //CREATION DE LA GALERIE
  //####################################################################################

  //Vidage du container .gallery de tous ses projets présents
  function clearGallery() {
    const galleryDiv = document.querySelector(".gallery"); // Sélectionner la div .gallery.
    while (galleryDiv.firstChild) {
      galleryDiv.removeChild(galleryDiv.firstChild); // Supprimer chaque enfant de la galerie
    }
  }

  // Créer les éléments de la galerie Projets.
  function createGalleryProject(project) {
    const figure = document.createElement("figure");
    figure.dataset.id = project.id; // Ajouter l'ID du projet (pour plus tard synchroniser la galerie principale avec la delete gallery)

    const img = document.createElement("img");
    img.src = project.imageUrl;
    img.alt = project.title;
    img.style.width = "366px";
    img.style.height = "490px";
    img.style.objectFit = "cover";

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = project.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);

    return figure;
  }

  // Fonction pour récupérer les projets depuis l'API, puis les ajouter dans la galerie
  async function fetchAndDisplayWorks(categoryId = "all") {
    try {
      // Récupération des works depuis l'API.
      const response = await fetch(getWorksUrl);
      const works = await response.json();
      // Afficher le tableau complet des works dans la console

      const galleryDiv = document.querySelector(".gallery");
      clearGallery();

      // Utilisation d'une boucle for pour créer et ajouter les éléments de la galerie.
      works.forEach((project) => {
        if (categoryId === "all" || project.categoryId == categoryId) {
          const galleryProject = createGalleryProject(project);
          galleryDiv.appendChild(galleryProject);
        }
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  }

  // Appel des fonctions pour récupérer les catégories et créer les boutons.
  fetchCategories().then((categories) => {
    createFilterButtons(categories);
  });

  fetchAndDisplayWorks();

  //####################################################################################
  // BOUTONS FILTRES
  //####################################################################################

  //Fonction pour créer les boutons de filtrage des projets.
  function createFilterButtons(categories) {
    const filterButtonsContainer = document.getElementById(
      "filter-buttons-container"
    );

    // Créer et ajouter le bouton "Tous"
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.classList.add("active"); // Ajouter une classe pour le style
    allButton.style.backgroundColor = "#1d6154";
    allButton.style.color = "white";
    allButton.dataset.categoryId = "all";
    filterButtonsContainer.appendChild(allButton);

    // Créer et ajouter les autres boutons de catégorie
    categories.forEach((category) => {
      const button = document.createElement("button");
      button.textContent = category.name;
      button.dataset.categoryId = category.id;
      filterButtonsContainer.appendChild(button);
    });

    // Ajouter des écouteurs d'événements pour les boutons
    const buttons = filterButtonsContainer.querySelectorAll("button");
    buttons.forEach((button) => {
      button.addEventListener("click", handleFilterClick);
    });
  }

  // Fonction pour gérer les clics sur les boutons de filtrage.
  function handleFilterClick(event) {
    const categoryId = event.target.dataset.categoryId;
    const buttons = document.querySelectorAll(
      "#filter-buttons-container button"
    );

    // Mettre à jour le style des boutons
    buttons.forEach((button) => {
      if (button === event.target) {
        button.classList.add("active");
        button.style.backgroundColor = "#1d6154";
        button.style.color = "white";
      } else {
        button.classList.remove("active");
        button.style.backgroundColor = "white";
        button.style.color = "#1d6154";
      }
    });

    // Filtrer les projets en fonction de la catégorie sélectionnée
    fetchAndDisplayWorks(categoryId);
  }

  //####################################################################################
  //FORMULAIRE DE CONNEXION
  //####################################################################################

  // Vérification de l'authentification
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  if (isAuthenticated === "true") {
    // Appliquer les changements de style après la redirection
    document.querySelector(".title-mode-edition .opening-modal").style.display =
      "flex";
    document.getElementById("link-login").style.display = "none";
    document.getElementById("bandeau-edition").style.display = "flex";
    document.getElementById("link-logout").style.display = "flex";
  } else {
    localStorage.removeItem("isAuthenticated");
  }

  //Fonction pour gérer la déconnexion
  function handleLogout() {
    localStorage.removeItem("authToken"); // Supprimer le token
    localStorage.removeItem("isAuthenticated"); // Supprimer l'état d'authentification
    window.location.href = "login.html"; // Rediriger vers la page de connexion
  }

  // Ajouter un écouteur d'événement au bouton de déconnexion
  const logoutButton = document.getElementById("link-logout");
  if (logoutButton) {
    logoutButton.addEventListener("click", function (event) {
      event.preventDefault(); // Empêcher le comportement par défaut du lien
      handleLogout(); // Appeler la fonction de déconnexion
    });
  }

  //####################################################################################
  //FENETRE MODALE - GALERIE PHOTO
  //####################################################################################

  function initializeModal() {
    //Récupération des éléments du DOM (modal, ainsi que bouton croix uniquement)
    const modal = document.getElementById("modal");
    const openModalButton = document.getElementById("open-modal-button");
    const closeModalButton = document.getElementById("close-modal-button");
    //const returnModalButton = document.getElementById("return-modal-button");

    // ouvrir la modale
    openModalButton.addEventListener("click", function (event) {
      event.preventDefault(); // Empêcher le comportement par défaut
      modal.style.display = "block";
    });

    // fermer la modale
    closeModalButton.addEventListener("click", function (event) {
      event.preventDefault(); // Empêcher le comportement par défaut
      modal.style.display = "none";
    });

    // fermer la modale en cliquant en dehors de celle-ci
    window.addEventListener("click", function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    });
  }

  // Appel de la fonction pour initialiser la modale
  initializeModal();

  // Fonction pour vider #delete-gallery de tous ses éléments
  function clearDeleteGallery() {
    const deleteGallery = document.getElementById("delete-gallery");
    while (deleteGallery.firstChild) {
      deleteGallery.removeChild(deleteGallery.firstChild);
    }
  }

  // Fonction pour importer les works depuis l'API
  async function fetchWorks() {
    try {
      const response = await fetch(getWorksUrl);
      const works = await response.json();
      return works.map((work) => ({ id: work.id, imageUrl: work.imageUrl }));
    } catch (error) {
      console.error("Erreur lors de la récupération des works:", error);
      return [];
    }
  }

  // Fonction pour afficher toutes les imageUrl dans #delete-gallery
  async function displayWorksDeleteInGallery() {
    const works = await fetchWorks();
    const deleteGallery = document.getElementById("delete-gallery");
    works.forEach((work) => {
      const elementFusionne = document.createElement("div");
      elementFusionne.id = "element-fusionne";
      elementFusionne.dataset.id = work.id; // Stocker l'ID de l'objet

      const img = document.createElement("img");
      img.className = "images";
      img.src = work.imageUrl;
      img.alt = "Image";
      
      const fondIcone = document.createElement("div");
      fondIcone.className = "fond-icone";

      const icon = document.createElement("i");
      icon.className = "fa-solid fa-trash-can icone";
      icon.style.color = "#ffffff";

      fondIcone.appendChild(icon);
      elementFusionne.appendChild(img);
      elementFusionne.appendChild(fondIcone);
      deleteGallery.appendChild(elementFusionne);

      // Ajouter l'événement de clic sur "fondIcone" pour supprimer l'objet
      fondIcone.addEventListener("click", async (event) => {
        event.preventDefault(); // Empêcher le comportement par défaut
        await deleteWork(work.id, elementFusionne);
      });
    });
  }

  // Fonction pour vérifier l'authentification et supprimer un work via l'API
  async function deleteWork(id, element) {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("Erreur : Accès non autorisé à l'API 'delete'");
      return;
    }

    try {
      const response = await fetch(`${deleteWorksUrl}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log(`L'objet avec l'id ${id} a été supprimé.`);

        // Supprimer l'élément de la modale
        element.remove(); // Supprimer l'élément de la galerie dans la modale

        // Supprimer l'élément de la galerie principale
        const galleryDiv = document.querySelector(".gallery");
        const galleryItem = galleryDiv.querySelector(`figure[data-id='${id}']`);
        if (galleryItem) {
          galleryItem.remove();
        }
      } else {
        console.error(
          `Erreur de suppression pour l'objet avec l'id ${id}:`,
          response.status
        );
      }
    } catch (error) {
      console.error(
        `Erreur lors de la suppression de l'objet avec l'id ${id}:`,
        error
      );
    }
  }

  // Appeler les fonctions pour initialiser la galerie
  clearDeleteGallery();
  displayWorksDeleteInGallery();

  function initializeAddPhotoButton() {
    // Sélectionner le bouton 'ajouter-une-photo'
    const addPhotoButton = document.getElementById("ajouter-une-photo");

    if (addPhotoButton) {
      addPhotoButton.addEventListener("click", function () {
        showReturnButton(); // Afficher le bouton de retour
        hideModalDelete(); // Masque le container "modal-delete"
        displayModalAjout(); // Afficher le container "modal-ajout"

        /*
        displayCreaValidationButton(); // Afficher le bouton "Valider"
        */
      });
    } else {
      console.error("Le bouton 'Ajouter une photo' n'a pas été trouvé.");
    }
  }
  initializeAddPhotoButton();

  //####################################################################################
  //FENETRE MODALE - AJOUT PHOTO
  //####################################################################################

  //INITIALISATION DU CONTENU DE LA "MODAL AJOUT-PHOTO" ################################

  // Fonction pour afficher le bouton de retour lorsque le bouton "Ajouter une photo" est cliqué
  function showReturnButton() {
    const returnButton = document.getElementById("return-modal-button");
    if (returnButton) {
      returnButton.style.visibility = "visible";
    } else {
      console.error("Le bouton de retour n'a pas été trouvé.");
    }
  }

  // Fonction pour masquer le container "modal-delete"
  function hideModalDelete() {
    const modalDelete = document.getElementById("modal-delete");
    if (modalDelete) {
      modalDelete.style.display = "none";
    } else {
      console.error("Le container 'modal-delete' n'a pas été trouvé.");
    }
  }

  // Fonction pour afficher le container "modal-ajout"
  function displayModalAjout() {
    const modalAjout = document.getElementById("modal-ajout");
    if (modalAjout) {
      modalAjout.style.display = "flex";
    } else {
      console.error("Le container 'modal-delete' n'a pas été trouvé.");
    }
  }

  //Fonction pour récupérer les catégories depuis l'API et les placer dans la liste déroulante Catégorie du formulaire
  async function fetchCategories() {
    const apiUrl = "http://localhost:5678/api";
    const getCategoriesUrl = `${apiUrl}/categories`;

    try {
      const response = await fetch(getCategoriesUrl);
      if (!response.ok) {
        throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
      }
      const categories = await response.json();

      return categories;
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
      return [];
    }
  }

  //Fonction pour créer les éléments <option> et les ajouter au <select> de la liste déroulante Catégorie du formulaire
  async function populateCategoryOptions() {
    const categories = await fetchCategories();
    const categorySelect = document.getElementById("categorie");

    if (categorySelect) {
      // Vider le <select> avant d'ajouter de nouvelles options
      categorySelect.innerHTML =
        '<option value="" disabled selected>Sélectionnez une catégorie</option>';

      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
    } else {
      console.error(
        "L'élément <select> avec l'ID 'categorie' n'a pas été trouvé."
      );
    }
  }

  // Appel de la fonction pour remplir les options de catégories
  populateCategoryOptions();

  //GESTION DU BOUTON RETURN MODAL######################################################

  // Appel de la fonction pour configurer le bouton `return-modal-button`
  setupReturnModalButton();

  // Fonction pour configurer le bouton `return-modal-button` et gérer l'ouverture de la modale
  function setupReturnModalButton() {
    // Vérifier si l'information pour ouvrir la modale est stockée dans le localStorage
    const openModal = localStorage.getItem("openModal");
    if (openModal === "true") {
      // Supprimer l'information du localStorage
      localStorage.removeItem("openModal");
      // Ouvrir la modale
      document.getElementById("modal").style.display = "block";
    }

    // Fonction pour gérer le clic sur le bouton `return-modal-button`
    function handleReturnModalButtonClick(event) {
      event.preventDefault();
      // Stocker une information dans le localStorage pour indiquer que la modale doit être ouverte
      localStorage.setItem("openModal", "true");
      // Rediriger vers index.html
      window.location.href = "index.html";
    }

    // Écouteur d'événement pour le bouton `return-modal-button`
    const returnModalButton = document.getElementById("return-modal-button");
    if (returnModalButton) {
      returnModalButton.addEventListener("click", handleReturnModalButtonClick);
    } else {
      console.error("Le bouton return-modal-button n'a pas été trouvé.");
    }
  }

// GESTION DU PHOTO UPLOAD ET DES MESSAGES D'ERREUR ########################################################

// Fonction pour gérer l'upload de la photo
function handlePhotoUpload() {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".jpg,.png";
  fileInput.style.display = "none";

  fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    const sizeErrorMessageElement = document.getElementById(
      "file-size-error-message"
    ); // Élément pour afficher les erreurs de taille
    const typeErrorMessageElement = document.getElementById(
      "file-type-error-message"
    ); // Élément pour afficher les erreurs de type

    // Vider les messages d'erreur avant chaque validation
    sizeErrorMessageElement.innerHTML = "";
    typeErrorMessageElement.innerHTML = "";

    let isValid = true; // Variable pour suivre la validité du fichier

    if (file) {
      // Vérification du type de fichier
      const validFileTypes = ["image/jpeg", "image/png"];
      if (!validFileTypes.includes(file.type)) {
        // Vérifier si le type du fichier est valide
        // Afficher un message d'erreur en rouge si le type du fichier est incorrect
        typeErrorMessageElement.textContent =
          "Le fichier doit être de type .jpg ou .png";
        typeErrorMessageElement.style.color = "red";
        isValid = false; // Marquer le fichier comme invalide
      }

      // Vérification de la taille du fichier
      if (file.size > 4 * 1024 * 1024) {
        // Limite de taille de fichier à 4 Mo
        // Afficher un message d'erreur en rouge si le fichier est trop volumineux
        sizeErrorMessageElement.textContent =
          "La taille du fichier doit faire moins de 4 Mo";
        sizeErrorMessageElement.style.color = "red";
        isValid = false; // Marquer le fichier comme invalide
      }

      // Ne procéder à l'affichage de l'image que si le fichier est valide
      if (isValid) {
        const fileUrl = URL.createObjectURL(file);
        const img = document.createElement("img");
        img.src = fileUrl;
        img.style.height = "100%";
        img.style.width = "auto";
        img.style.display = "block";
        img.style.margin = "auto";

        const fenetreAjoutPhoto = document.getElementById(
          "fenetre-ajout-photo"
        );
        fenetreAjoutPhoto.innerHTML = "";
        fenetreAjoutPhoto.appendChild(img);
      }
    } else {
      // Si aucun fichier n'est sélectionné (ce cas est déjà géré par le type d'input)
      alert("Le fichier doit être au format .jpg ou .png");
    }

    validateFormFields(); // Appeler la validation des champs du formulaire après l'upload
  });

  fileInput.click(); // Ouvrir la boîte de dialogue de sélection de fichier
}

document
  .getElementById("bouton-plus-ajouter-photo")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Empêcher la soumission du formulaire par défaut
    handlePhotoUpload();
  });

// CONTROLE ET VALIDATION DU REMPLISSAGE DE TOUS LES CHAMPS DU FORMULAIRE D'AJOUT DE PHOTO #########

// Fonction pour contrôler le remplissage des champs du formulaire
function validateFormFields() {
  const title = document
    .querySelector('input[name="crea-titre-projet"]')
    .value.trim();
  const category = document.querySelector('select[name="categorie"]').value;
  const imageUploaded = document.querySelector("#fenetre-ajout-photo img");
  const validateButton = document.getElementById("bouton-valider-crea");
  const errorMessageElement = document.getElementById("error-message");

  if (title === "" || category === "" || !imageUploaded) {
    if (!errorMessageElement) {
      const newErrorMessage = document.createElement("p");
      newErrorMessage.id = "error-message";
      newErrorMessage.style.color = "red";
      newErrorMessage.style.textAlign = "center";
      newErrorMessage.textContent =
        "Merci de compléter chacun des champs du formulaire.";
      validateButton.insertAdjacentElement("beforebegin", newErrorMessage);
    }
    validateButton.style.backgroundColor = "#A7A7A7";
    validateButton.disabled = true;

    // Réinitialiser l'effet de survol
    validateButton.onmouseover = function () {
      validateButton.style.backgroundColor = "#A7A7A7";
    };
    validateButton.onmouseout = function () {
      validateButton.style.backgroundColor = "#A7A7A7";
    };
  } else {
    if (errorMessageElement) {
      errorMessageElement.remove();
    }
    validateButton.style.backgroundColor = "#1D6154";
    validateButton.disabled = false;

    // Changer la couleur au survol si activé
    validateButton.onmouseover = function () {
      validateButton.style.backgroundColor = "#0E2F28";
    };
    validateButton.onmouseout = function () {
      validateButton.style.backgroundColor = "#1D6154";
    };
  }
}

// Ajouter des écouteurs d'événement pour vérifier le formulaire lors de la saisie
document
  .querySelector('input[name="crea-titre-projet"]')
  .addEventListener("input", validateFormFields);
document
  .querySelector('select[name="categorie"]')
  .addEventListener("change", validateFormFields);
document
  .getElementById("bouton-plus-ajouter-photo")
  .addEventListener("click", function () {
    setTimeout(validateFormFields, 500); // Utiliser un timeout pour laisser le temps à l'image de s'afficher
  });


//####################################################################################
//POST VERS L'API
//####################################################################################

// Fonction principale pour poster un nouveau projet
async function postNewWork() {
  console.log("Début de la fonction postNewWork");

  const imageElement = document.querySelector("#fenetre-ajout-photo img");
  const fileUrl = imageElement ? imageElement.src : null;
  const title = document.querySelector('input[name="crea-titre-projet"]').value;
  const categoryId = parseInt(document.querySelector('select[name="categorie"]').value);

  // Suppression de la fonction validateForm et vérification directe dans le DOM
  // Le code qui contrôle les champs remplis est déjà en place avant ce point

  const formData = new FormData();

  if (fileUrl && fileUrl.startsWith("blob:")) {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      formData.append("image", blob);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'image:", error);
      return;
    }
  } else {
    console.error("Erreur : L'image n'a pas été correctement sélectionnée ou n'est pas valide.");
    return;
  }

  formData.append("title", title);
  formData.append("category", categoryId);

  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Erreur : Accès non autorisé à l'API 'post'");
      return;
    }

    const response = await fetch(apiUrl + "/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorMessage = `Erreur HTTP : ${response.status}`;
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log("Projet posté avec succès :", result);
    alert("Le projet a été ajouté avec succès !");

    // Étape 1 : Simuler le clic sur le bouton #return-modal-button
    setTimeout(() => {
      const returnModalButton = document.getElementById('return-modal-button');
      if (returnModalButton) {
          returnModalButton.click();
          console.log("Clic simulé sur #return-modal-button pour fermer la modale.");
      } else {
          console.error('Le bouton #return-modal-button n\'a pas été trouvé.');
      }
    }, 0); // Délai pour s'assurer que l'alerte a bien été fermée avant de cliquer

  } catch (error) {
    console.error("Erreur lors du post du nouveau projet : ", error);
  }
}

// Attacher un événement au bouton de validation pour déclencher la fonction postNewWork
document.getElementById("bouton-valider-crea").addEventListener("click", async function (event) {
  event.preventDefault();
  await postNewWork();
});










});
