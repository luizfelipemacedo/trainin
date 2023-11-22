import api from "../config/api.js";
import baseUrl from "../config/baseUrl";
import { getUserData } from "../auth/userData.js";
import { showLoadingComponent } from "/components/loading/loading.js";
import { hideLoadingComponent } from "/components/loading/loading.js";

initializeOptions();

function initializeOptions() {
  const exercises = ["flexao", "abdominal", "agachamento", "triceps"];

  exercises.forEach((exercise) => {
    const element = document.getElementsByClassName(`workout ${exercise}`)[0];
    element.addEventListener("click", () => exerciseClickEvent(exercise));
  });
};

async function exerciseClickEvent(exerciseName) {
  try {
    const { id } = await getUserData();

    showLoadingComponent();
    const response = await api.get(`/workout/${id}/${exerciseName}`);
    hideLoadingComponent();
    
    const hasWorkout = !!response.data.length;
    const redirectPage = hasWorkout ? "sets.html" : "leveling.html";

    const url = new URL(`${baseUrl}/pages/exercise/${redirectPage}`);
    url.searchParams.append("exercise", exerciseName);

    window.location.assign(url.toString());
  } catch (error) {
    console.log(error);
    alert("Erro ao buscar rotina");
  }
}
