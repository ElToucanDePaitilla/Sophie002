//####################################################################################
//RECUPERATION DU DOM
//####################################################################################

document.addEventListener("DOMContentLoaded", async function () {


  //##################################################################################
  //CREATION DE LA GALERIE PRINCIPALE
  //##################################################################################

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

  // Fonction pour récupérer les projets depuis l'API, puis les ajouter dans la galerie principale
  async function fetchAndDisplayWorks(categoryId = "all") {
    try {
      // Récupération des works depuis l'API.
      const response = await fetch(getWorksUrl);
      const works = await response.json();
      // Afficher le tableau complet des works dans la console

      const galleryDiv = document.querySelector(".gallery");
      clearGallery();

      // Utilisation d'une boucle for pour créer et ajouter les éléments de la galerie principale
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


  //####################################################################################
  // BOUTONS FILTRES
  //####################################################################################

  //Fonction pour récupérer les catégories depuis l'API
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

  // Appel des fonctions pour récupérer les catégories et créer les boutons.
  fetchCategories().then((categories) => {
    createFilterButtons(categories);
  });

  fetchAndDisplayWorks();

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
  //FORMULAIRE DE CONNEXION POUR ACCEDER AU MODE "EDITION"
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

    
});
