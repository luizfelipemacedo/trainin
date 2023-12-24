import api from "../../config/api";
import baseUrl from "../../config/baseUrl";
import { loadRepCounterComponent } from "/components/rep-counter/rep-counter.js";
import { updateCounterValue } from "/components/rep-counter/rep-counter.js";
import { Timer } from "easytimer.js";
import { showLoadingComponent } from "/components/loading/loading.js";
import { hideLoadingComponent } from "/components/loading/loading.js";
import { initializeBackButton } from "/scripts/general.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

initializeBackButton(`pages/exercise/sets.html?exercise=${urlParams.get("exercise")}`);

var timerInstance = new Timer();
const maxRestSeconds = 90;

const setsAreaDiv = document.querySelector("#content #info .sets-area");
const workoutWeekSpan = document.querySelector("#exercise-date .week");
const workoutDaySpan = document.querySelector("#exercise-date .day");

const instructionSpan = document.querySelector("#content #info .title");
const counterAreaDiv = document.querySelector("#counter-area-insert");

const timerAreaDiv = document.querySelector("#timer-area");
const timerTextMinutesSpan = document.querySelector("#timer-text-minutes");
const timerTextSecondsSpan = document.querySelector("#timer-text-seconds");

const fillBarDiv = document.querySelector("#fill-bar");

const timerControlStop = document.querySelector("#controls #stop");
const timerControlIncrement = document.querySelector("#controls #increment");

var actualSetIndex = 0;
var exerciseName = getExerciseNameFromUrl();

var startDateTime = null;
var finishDateTime = null;


const exerciseId = urlParams.get("exerciseId");
const currentExercice = JSON.parse(urlParams.get("currentExercice"));

function getExerciseNameFromUrl() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get("exercise");
}

function confirmCounterCallback(selectedValue) {
  console.log("Counter confirmado: " + selectedValue);
  //Esta função é o callback do botão de confirmar o counter
  //Aqui deve ser o entrypoint da funcionalidade para registrar este valor no backend
  //----------------------------

  if (actualSetIndex == window.currentWorkout?.sets.length - 1) {
    finishWorkout();
    return;
  } else {
    enableTimer();
  }
}

async function registerWorkoutOnDatabase(workoutTotalTimeMs) {
  try {
    const workoutData = {
      id: exerciseId,
      tempo_total: workoutTotalTimeMs,
    };

    showLoadingComponent();
    const response = await api.post("/workout/conclude", workoutData);

    if (response.status != 200) throw new Error(response.data.message);
  } catch (error) {
    console.log(error);
    alert("Erro ao registrar o treino");
  }
  finally{
    hideLoadingComponent();
  }
}

async function finishWorkout() {
  finishDateTime = new Date();
  var datetimeDiffMs = finishDateTime - startDateTime;

  await registerWorkoutOnDatabase(datetimeDiffMs);

  localStorage.setItem("lastWorkoutReps", getTotalWorkoutReps());
  localStorage.setItem("lastWorkoutDurationMs", datetimeDiffMs);

  //mudar para página de treino concluído
  const url = new URL(`${baseUrl}/pages/exercise/completed.html`);
  url.searchParams.append("exercise", exerciseName);
  window.location.assign(url.toString());
}

function initializeWorkoutInfo(workoutInfo) {
  loadRepCounterComponent(
    "counter-area-insert",
    confirmCounterCallback,
    false,
    workoutInfo.sets[0]
  );
  updateSetsInfo(workoutInfo.sets, 0);
  workoutWeekSpan.innerHTML = `Semana ${workoutInfo.weekNumber}`;
  workoutDaySpan.innerHTML = `Dia ${workoutInfo.dayNumber}`;
  timerAreaDiv.style.display = "none";

  timerControlStop.addEventListener("click", stopTimer);
  timerControlIncrement.addEventListener("click", incrementTimer);

  startDateTime = new Date();
}

function getTotalWorkoutReps() {
  var count = 0;
  window.currentWorkout.sets.forEach((set) => {
    count += set;
  });
  return count;
}

function updateSetsInfo(setsArray, targetSetIndex) {
  setsAreaDiv.innerHTML = "";

  //Clamp
  if (targetSetIndex < 0) targetSetIndex = 0;
  if (targetSetIndex >= setsArray.length) targetSetIndex = setsArray.length - 1;

  setsArray.forEach((setItem, index, arr) => {
    var lastItem = index == arr.length - 1;
    var currentItem = targetSetIndex == index;
    var inactiveItem = index > targetSetIndex;

    var setDiv = document.createElement("div");
    setDiv.classList.add("reps");
    setDiv.innerHTML = setItem;
    if (lastItem) setDiv.innerHTML += "+";

    if (currentItem) setDiv.classList.add("active");
    else if (inactiveItem) setDiv.classList.add("inactive");

    setsAreaDiv.appendChild(setDiv);
  });
}

function advanceToNextSet() {
  actualSetIndex++;
  var nextSetValue = window.currentWorkout.sets[actualSetIndex];
  if (actualSetIndex == window.currentWorkout.sets.length - 1)
    nextSetValue = `${nextSetValue}+`;
  updateCounterValue(nextSetValue);
  updateSetsInfo(window.currentWorkout.sets, actualSetIndex);

  instructionSpan.style.display = "";
  timerAreaDiv.style.display = "none";
  counterAreaDiv.style.display = "";
}

//--------------------- TIMER ---------------------

function enableTimer() {
  instructionSpan.style.display = "none";
  timerAreaDiv.style.display = "";
  counterAreaDiv.style.display = "none";

  startNewTimer(maxRestSeconds);
}

function startNewTimer(totalSeconds) {
  timerInstance.removeEventListener("secondsUpdated", updateTimerVisual);
  timerInstance.removeEventListener("targetAchieved", onTimerCountdownFinished);

  timerInstance = new Timer();
  timerInstance.start({
    countdown: true,
    startValues: { seconds: totalSeconds },
  });
  updateTimerVisual();

  timerInstance.addEventListener("secondsUpdated", updateTimerVisual);
  timerInstance.addEventListener("targetAchieved", onTimerCountdownFinished);
}

function updateTimerVisual() {
  var minutes = timerInstance.getTimeValues().minutes.toLocaleString("pt-BR", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  var seconds = timerInstance.getTimeValues().seconds.toLocaleString("pt-BR", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  timerTextMinutesSpan.innerHTML = minutes;
  timerTextSecondsSpan.innerHTML = seconds;

  var progressFactor =
    timerInstance.getTotalTimeValues().seconds / maxRestSeconds;
  var percentage = Math.round(progressFactor * 100);
  fillBarDiv.style.width = `${percentage}%`;
}

function stopTimer() {
  if (timerInstance.getTotalTimeValues().seconds <= 1) return;

  timerInstance.pause();
  onTimerCountdownFinished();
}

function incrementTimer() {
  var remainingSeconds = timerInstance.getTotalTimeValues().seconds;
  if (remainingSeconds <= 1) return;

  startNewTimer(remainingSeconds + 30);
}

function onTimerCountdownFinished() {
  advanceToNextSet();
}

(() => {
  window.currentWorkout = currentExercice;
  initializeWorkoutInfo(window.currentWorkout);
})();
