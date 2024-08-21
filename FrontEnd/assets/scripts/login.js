const apiUrl = "http://localhost:5678/api";
const getWorksUrl = `${apiUrl}/works`;
const getCategoriesUrl = `${apiUrl}/categories`;
const loginUrl = `${apiUrl}/users/login`;
const deleteWorksUrl = `${apiUrl}/works`; 

document.addEventListener("DOMContentLoaded", async function () {

 
 // Gérer la soumission du formulaire de connexion
 function handleLoginFormSubmit(event) {
    event.preventDefault(); // Empêcher le rechargement de la page

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorElement = document.getElementById("login-error");

  // Fonction pour envoyer la requête de connexion
  async function loginUser(email, password) {
    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token); //Stocker le token
        localStorage.setItem("isAuthenticated", "true");            // Rediriger l'utilisateur vers la page index.html
        window.location.href = "index.html";
      } else {
        errorElement.style.display = "block";
        console.error("Erreur de connexion:", response.status);
      }
    } catch (error) {
      console.error("Erreur lors de la requête:", error);
    }
  }

  // Appel de la fonction loginUser avec les valeurs du formulaire
  loginUser(email, password);
}

  // Ajout de l'écouteur d'événement de soumission au formulaire
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginFormSubmit);
  } else {
    /*console.error("Le formulaire de connexion n'a pas été trouvé."); bug à corriger ???????????????*/
  }







});
