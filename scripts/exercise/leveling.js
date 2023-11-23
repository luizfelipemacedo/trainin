import api from "../../config/api.js";
import baseUrl from "../../config/baseUrl";
import { getUserData } from "../../auth/userData.js";
import { showLoadingComponent } from "/components/loading/loading.js";
import { hideLoadingComponent } from "/components/loading/loading.js";
import { loadRepCounterComponent } from "/components/rep-counter/rep-counter.js";
import { initializeBackButton } from "/scripts/general.js";

initializeBackButton("pages/home.html");
loadRepCounterComponent("counter-area-insert", confirmCounterCallback);

var exerciseName = getExerciseNameFromUrl();
function getExerciseNameFromUrl() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get("exercise");
}

async function confirmCounterCallback(selectedValue) {
  console.log("Counter confirmado: " + selectedValue);
  try {
    const { id } = await getUserData();
    const exercise = getExerciseNameFromUrl();

    showLoadingComponent();

    const response = await api.post(`/workout/create-routine`, {
      categoria: exercise,
      usuario_id: id,
      repeticoesIniciais: selectedValue,
    });

    if (response.status !== 200) {
      alert("Erro ao salvar rotina");
      return;
    }

    const url = new URL(`${baseUrl}/pages/exercise/sets.html`);
    url.searchParams.append("exercise", exerciseName);
    window.location.assign(url.toString());
  } catch (error) {
    console.log(error);
    alert("Erro ao salvar rotina");
  }
  finally{
    hideLoadingComponent();
  }
}
