//TO DO:
//Tentar fazer isso ser acessado de forma global em todos scripts que precisem
//para evitar repetição
const exerciseNameDict = {
  flexao: "Flexões",
  abdominal: "Abdominais",
  agachamento: "Agachamentos",
  triceps: "Tríceps",
};

//Sugestão: criar outro dicionario para armazenar os endereços das imagens
//relacionadas a cada exercício ao invés de puxar da maneira atual

loadExerciseInfo();

function loadExerciseInfo() {
  const tutorialImage = document.querySelector("#instruction img.tutorial-img");
  const bannerImage = document.querySelector("#instruction img.banner-img");

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const exerciseName = urlParams.get("exercise");
  console.log(exerciseName);

  if (tutorialImage != null) {
    tutorialImage.src = new URL(
      `/src/imgs/exercise/tutorial/${exerciseName}.gif`,
      import.meta.url
    );
  }

  if (bannerImage != null) {
    bannerImage.src = new URL(
      `/src/imgs/home/${exerciseName}-banner.jpg`,
      import.meta.url
    );
  }

  const exerciseNameDiv = document.querySelector("#instruction #exercise-name");
  if (exerciseNameDiv != null)
    exerciseNameDiv.innerHTML = exerciseNameDict[exerciseName];
}
