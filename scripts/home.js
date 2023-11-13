import api from "../config/api.js";
import baseUrl from "../config/baseUrl";
import { getUserData } from "../auth/userData.js";

initializeOptions();

function initializeOptions() {
  const exercises = ["flexao", "abdominal", "agachamento", "triceps"];

  exercises.forEach((exercise) => {
    const element = document.getElementsByClassName(`workout ${exercise}`)[0];
    element.addEventListener("click", () => exerciseClickEvent(exercise));
  });
}

const convertExerciseName = {
  flexao: "FLEXÃO",
  agachamento: "AGACHAMENTO",
  abdominal: "ABDOMINAL",
  triceps: "TRÍCEPS",
};

async function exerciseClickEvent(exerciseName) {
  try {
    const { id } = await getUserData();
    const exercise = convertExerciseName[exerciseName];

    const response = await api.get(`/workout/${id}/${exercise}`);

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
