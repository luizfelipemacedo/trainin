import baseUrl from "../../config/baseUrl";
import { loadRepCounterComponent } from "/components/rep-counter/rep-counter.js";
import { updateCounterValue } from "/components/rep-counter/rep-counter.js";

const setsAreaDiv = document.querySelector("#content #info .sets-area");
const workoutWeekSpan = document.querySelector("#exercise-date .week");
const workoutDaySpan = document.querySelector("#exercise-date .day");

var actualSetIndex = 0;
var exerciseName = getExerciseNameFromUrl();

function getExerciseNameFromUrl(){
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get('exercise');
}

function confirmCounterCallback(selectedValue){
        console.log("Counter confirmado: " + selectedValue);
        //Esta função é o callback do botão de confirmar o counter
        //Aqui deve ser o entrypoint da funcionalidade para registrar este valor no backend 
        //----------------------------

        if(actualSetIndex == window.currentWorkout.sets.length-1)
        {
                alert("Treino finalizado!");
                return;
        }

        actualSetIndex++;
        var nextSetValue = window.currentWorkout.sets[actualSetIndex];
        updateCounterValue(nextSetValue);
        updateSetsInfo(window.currentWorkout.sets, actualSetIndex);
}


function initializeWorkoutInfo(workoutInfo){           
        loadRepCounterComponent("counter-area-insert", confirmCounterCallback, false, workoutInfo.sets[0]);
        updateSetsInfo(workoutInfo.sets, 0);
        workoutWeekSpan.innerHTML = `Semana ${workoutInfo.weekNumber}`;
        workoutDaySpan.innerHTML = `Dia ${workoutInfo.dayNumber}`;
}

function updateSetsInfo(setsArray, targetSetIndex){
        setsAreaDiv.innerHTML = "";

        //Clamp
        if(targetSetIndex < 0) targetSetIndex = 0;
        if(targetSetIndex >= setsArray.length) targetSetIndex = setsArray.length - 1;

        setsArray.forEach((setItem, index, arr) => {
                var lastItem = index == arr.length - 1;
                var currentItem = targetSetIndex == index;
                var inactiveItem = index > targetSetIndex;

                var setDiv = document.createElement('div');
                setDiv.classList.add('reps');
                setDiv.innerHTML = setItem;
                if(lastItem)
                        setDiv.innerHTML += "+";

                if(currentItem)
                        setDiv.classList.add('active');
                else if (inactiveItem)
                        setDiv.classList.add('inactive');

                setsAreaDiv.appendChild(setDiv);
        });
}

//Funções de teste---------------------------------
simulateWorkoutList();
function simulateWorkoutList(){
        window.currentWorkout = {
                dayIndex: 0,
                weekNumber: "1",
                dayNumber: "2",
                sets: [2, 3, 4, 5, 4]
        };

        initializeWorkoutInfo(window.currentWorkout);
}