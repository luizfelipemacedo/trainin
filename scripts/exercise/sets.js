import api from "../../config/api.js";
import baseUrl from "../../config/baseUrl";
import { getUserData } from "../../auth/userData.js";
import { showLoadingComponent } from "/components/loading/loading.js";
import { hideLoadingComponent } from "/components/loading/loading.js";

var exerciseName = getExerciseNameFromUrl();
let exerciseId = '';
let currentExercice = {};

function getExerciseNameFromUrl() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get("exercise");
}

const carouselControls = `
<button class="carousel-control-prev" type="button" data-target="#list" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
</button>
<button class="carousel-control-next" type="button" data-target="#list" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
</button>
`;

const list = document.getElementById("list");
const confirmButton = document.getElementById("confirm");
confirmButton.addEventListener("click", () => onConfirmButtonClick());


const confirmResetButton = document.getElementById("confirm-reset-button");
confirmResetButton.addEventListener("click", () => onResetWorkoutButtonClick());

async function onResetWorkoutButtonClick(){
  try {
    const { id } = await getUserData();
    const exerciseName = getExerciseNameFromUrl();

    showLoadingComponent();
    const response = await api.delete(`/workout/delete/${id}/${exerciseName}`);
    hideLoadingComponent();

    if (response.status === 200 && response.data.message) alert(response.data.message);
      
    const url = new URL(`${baseUrl}/pages/exercise/leveling.html`);
    url.searchParams.append("exercise", exerciseName);
    window.location.assign(url.toString());
    
  } catch (error) {
    console.log(error);
    alert("Erro ao reiniciar treino");
  }
}

//Gera os itens de carousel baseados na lista providenciada (workoutList: lista de workouts, lastCompletedDayIndex: index do último workout concluído)
function spawnWorkoutItems(workoutList, lastCompletedDayIndex) {
  list.innerHTML = "";

  //previne valores inesperados
  if (
    lastCompletedDayIndex < -1 ||
    lastCompletedDayIndex >= workoutList.length - 1
  )
    lastCompletedDayIndex = -1;

  workoutList.forEach((workoutItem, index, arr) => {
    var isNextWorkout = index == lastCompletedDayIndex + 1;
    var isCompletedWorkout = index < lastCompletedDayIndex + 1;
    var isLockedWorkout = index > lastCompletedDayIndex + 1;

    //Contrução da div item
    var carouselItem = document.createElement("div");
    carouselItem.classList.add("carousel-item");
    if (isNextWorkout) carouselItem.classList.add("active");

    var exerciseItem = document.createElement("div");
    exerciseItem.classList.add("exercise-item");
    if (isCompletedWorkout || isLockedWorkout)
      exerciseItem.classList.add("locked");
    carouselItem.appendChild(exerciseItem);

    var weekSpan = document.createElement("span");
    weekSpan.classList.add("week");
    weekSpan.innerHTML = `Semana ${workoutItem.weekNumber}`;
    exerciseItem.appendChild(weekSpan);

    var daySpan = document.createElement("span");
    daySpan.classList.add("day");
    daySpan.innerHTML = `Dia ${workoutItem.dayNumber}`;
    exerciseItem.appendChild(daySpan);

    var setsAreaDiv = document.createElement("div");
    setsAreaDiv.classList.add("sets-area");
    exerciseItem.appendChild(setsAreaDiv);

    workoutItem.sets.forEach((setItem, index, arr) => {
      var setDiv = document.createElement("div");
      setDiv.classList.add("reps");
      setDiv.innerHTML = setItem;
      if (index == arr.length - 1) setDiv.innerHTML += "+";
      setsAreaDiv.appendChild(setDiv);
    });

    var lockedDiv = document.createElement("div");      
    lockedDiv.classList.add("locked-item");

    if (isCompletedWorkout || isLockedWorkout) {
      lockedDiv.innerHTML = isCompletedWorkout ? "Concluído" : "Indisponível";
      
      carouselItem.addEventListener("startWorkoutEvent", () =>
        lockedWorkoutWarning(
          isCompletedWorkout
            ? "Este treino já foi concluído."
            : "Você possuí um treino anterior incompleto."
        )
      );
    } //no momento, permita iniciar apenas workouts atuais
    else{
      carouselItem.addEventListener("startWorkoutEvent", () =>
        startWorkout(workoutItem.dayIndex)
      );
      lockedDiv.classList.add("empty");
    }
    exerciseItem.appendChild(lockedDiv);

    //futuramente talvez desbloquear para refazer workouts concluídos e futuros

    list.appendChild(carouselItem);
  });

  list.insertAdjacentHTML("afterbegin", carouselControls);
}

//Evento de clique do botão "Iniciar"
function onConfirmButtonClick() {
  //Encontra o item de carousel atualmente selecionado
  var activeCarouselItem = document.querySelectorAll(
    ".carousel-item.active"
  )[0];
  //Dispara um evento customizado que foi previamente adicionado à este item com seu devido index
  activeCarouselItem.dispatchEvent(new CustomEvent("startWorkoutEvent"));
}

//Evento disparado pelo item carousel contendo o index do workout
function startWorkout(workoutDayIndex) {
  //alert(`Start workout index ${workoutDayIndex}`);
  console.log(`Start workout index ${workoutDayIndex}`);

  //AQUI VEM A LÓGICA PARA INICIAR O TREINO A PARTIR DO INDEX
  const url = new URL(`${baseUrl}/pages/exercise/workout.html`);
  url.searchParams.append("exercise", exerciseName);
  url.searchParams.append("exerciseId", exerciseId);
  url.searchParams.append("currentExercice", currentExercice);
  window.location.assign(url.toString());
}

function lockedWorkoutWarning(message) {
  alert(message);
  console.log(message);
}

//Funções de teste---------------------------------
//simulateWorkoutList();
function simulateWorkoutList() {
  var workout1 = {
    dayIndex: 0,
    weekNumber: "1",
    dayNumber: "1",
    sets: [1, 2, 3, 2, 2],
  };
  var workout2 = {
    dayIndex: 1,
    weekNumber: "1",
    dayNumber: "2",
    sets: [2, 3, 4, 5, 4],
  };
  var workout3 = {
    dayIndex: 2,
    weekNumber: "1",
    dayNumber: "3",
    sets: [3, 4, 5, 6, 5],
  };
  var workout4 = {
    dayIndex: 3,
    weekNumber: "2",
    dayNumber: "1",
    sets: [4, 5, 6, 7, 6],
  };
  var workout5 = {
    dayIndex: 4,
    weekNumber: "2",
    dayNumber: "2",
    sets: [5, 6, 7, 8, 7],
  };
  var workout6 = {
    dayIndex: 5,
    weekNumber: "2",
    dayNumber: "3",
    sets: [6, 7, 8, 9, 8],
  };
  var testWorkoutList = [
    workout1,
    workout2,
    workout3,
    workout4,
    workout5,
    workout6,
  ];
  var lastCompletedDayIndex = 1; //-1 significa que nenhum dia foi concluído ainda
  spawnWorkoutItems(testWorkoutList, lastCompletedDayIndex);
}

(async () => {
  try {
    const { id } = await getUserData();
    const exercise = getExerciseNameFromUrl();

    const response = await api.get(`/workout/${id}/${exercise}`);

    const workoutList = response.data.map((workout, index) => {
      return {
        ...workout,
        dayIndex: index,
        weekNumber: workout.semana,
        dayNumber: workout.dia_semana,
        sets: workout.repeticoes,
      };
    });

    const filterLastCompleted = workoutList.filter((workout) => workout.concluido === true);
    const lastCompletedDayIndex = !filterLastCompleted.length ? -1 : filterLastCompleted.at(-1).dayIndex;

    if (lastCompletedDayIndex === workoutList.length - 1) {
      // Se todos os workouts já foram concluídos, reinicia o treino
      onResetWorkoutButtonClick();
      return;
    };

    // Seta o id do exercício para ser usado na página de workout
    exerciseId = workoutList[lastCompletedDayIndex + 1].id;

    // Seta os dados do exercício para ser usado na página de workout
    currentExercice = JSON.stringify(workoutList[lastCompletedDayIndex + 1]);

    spawnWorkoutItems(workoutList, lastCompletedDayIndex);
  } catch (error) {
    console.log(error);
    alert("Erro ao carregar treinos");
  }
})();