// ✅ Clé API TMDb (ne pas exposer publiquement sur un vrai site)
const API_KEY = "c19b6d04ac70bcca1e91626de3e59f0d";

document.getElementById("btn-recherche").addEventListener("click", () => { // qd btn recherche cliqué
    const titre = document.getElementById("titre").value.trim(); //recup titre
    const errorDiv = document.getElementById("error"); 
    const resultDiv = document.getElementById("result"); 

    errorDiv.style.display = "none"; 
    resultDiv.style.display = "none"; //cacher erreur/resultats

    if (!titre) {
        errorDiv.textContent = "Veuillez entrer un titre de film."; //si vide
        errorDiv.style.display = "block"; //afficher erreur
        return;
    }

    // 1️⃣ Recherche du film en français
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(titre)}&language=fr-FR`)
        .then(res => res.json()) //convrt rep json
        .then(data => {
            if (!data.results.length) {
                errorDiv.textContent = "Film introuvable."; //Si ps film
                errorDiv.style.display = "block"; //aff err
                return;
            }

            // premier res
            const film = data.results[0];
            const id = film.id; //recup id film

            return fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=fr-FR`);
        })
        .then(res => res?.json()) 
        .then(film => {
            if (!film) return;

            document.getElementById("titreFilm").textContent = film.title;  //titre
            const genreList = film.genres.map(g => g.name).join(", ");  // genres
            document.getElementById("annee-genre").textContent = `${film.release_date?.slice(0,4)} • ${genreList}`; //année + genres
            document.getElementById("synopsis").textContent = film.overview || "Aucun synopsis disponible en français."; //synopsis
            document.getElementById("note").textContent = `Notes : ${film.vote_average.toFixed(1)}/10`; //note
 
            const posterDiv = document.getElementById("poster"); //photo
            posterDiv.innerHTML = "";
            if (film.poster_path) {
                const img = document.createElement("img");
                img.src = `https://image.tmdb.org/t/p/w300${film.poster_path}`; //url img
                img.alt = `Affiche du film ${film.title}`; //alt img
                img.style.maxWidth = "200px";
                img.style.borderRadius = "8px";
                posterDiv.appendChild(img);
            } else {
                posterDiv.textContent = "Aucune affiche disponible"; //si ps img
            }

            resultDiv.style.display = "flex"; 
        })
        .catch(err => {
            errorDiv.textContent = "Erreur lors de la recherche."; 
            errorDiv.style.display = "block";
            console.error(err);
        });
});
