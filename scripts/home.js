import baseUrl from "../config/baseUrl";

initializeOptions();

function initializeOptions() {
  const exercises = ["flexao", "abdominal", "agachamento", "triceps"];

  exercises.forEach((exercise) => {
    const element = document.getElementsByClassName(`workout ${exercise}`)[0];
    element.addEventListener("click", () => exerciseClickEvent(exercise));
  });
}

function exerciseClickEvent(exerciseName) {
  const url = new URL(`${baseUrl}/pages/exercise/leveling.html`);
  url.searchParams.append('exercise', exerciseName);

  window.location.assign(url.toString());
}