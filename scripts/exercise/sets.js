// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.js';
import baseUrl from "../../config/baseUrl";

var exerciseName = getExerciseNameFromUrl();
function getExerciseNameFromUrl(){
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get('exercise');
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

//Gera os itens de carousel baseados na lista providenciada (workoutList: lista de workouts, lastCompletedDayIndex: index do último workout concluído)
function spawnWorkoutItems(workoutList, lastCompletedDayIndex){
        list.innerHTML = "";

        //previne valores inesperados
        if(lastCompletedDayIndex < -1 || lastCompletedDayIndex >= workoutList.length -1)
                lastCompletedDayIndex = -1;

        workoutList.forEach((workoutItem, index, arr) => {
                var isNextWorkout = index == lastCompletedDayIndex + 1;
                var isCompletedWorkout = index < lastCompletedDayIndex + 1;
                var isLockedWorkout = index > lastCompletedDayIndex + 1;

                //Contrução da div item
                var carouselItem = document.createElement('div');
                carouselItem.classList.add('carousel-item');
                if(isNextWorkout)
                        carouselItem.classList.add('active');
        
                var exerciseItem = document.createElement('div');
                exerciseItem.classList.add('exercise-item');
                if(isCompletedWorkout || isLockedWorkout)
                        exerciseItem.classList.add('locked');
                carouselItem.appendChild(exerciseItem);
        
                var weekSpan = document.createElement('span');
                weekSpan.classList.add('week');
                weekSpan.innerHTML = `Semana ${workoutItem.weekNumber}`;
                exerciseItem.appendChild(weekSpan);
        
                var daySpan = document.createElement('span');
                daySpan.classList.add('day');
                daySpan.innerHTML = `Dia ${workoutItem.dayNumber}`;
                exerciseItem.appendChild(daySpan);
        
                var setsAreaDiv = document.createElement('div');
                setsAreaDiv.classList.add('sets-area');
                exerciseItem.appendChild(setsAreaDiv);
        
                workoutItem.sets.forEach((setItem, index, arr) => {
                        var setDiv = document.createElement('div');
                        setDiv.classList.add('reps');
                        setDiv.innerHTML = setItem;
                        if(index == arr.length - 1)
                                setDiv.innerHTML += "+";
                        setsAreaDiv.appendChild(setDiv);
                });
        
                if(isCompletedWorkout || isLockedWorkout)
                {
                        var lockedDiv = document.createElement('div');
                        lockedDiv.classList.add('locked-item');
                        lockedDiv.innerHTML = isCompletedWorkout ? "Concluído" : "Indisponível";
                        exerciseItem.appendChild(lockedDiv);

                        carouselItem.addEventListener("startWorkoutEvent", () => lockedWorkoutWarning(
                                isCompletedWorkout ? 
                                "Este treino já foi concluído." :
                                "Você possuí um treino anterior incompleto."));
                }
                else //no momento, permita iniciar apenas workouts atuais
                        carouselItem.addEventListener("startWorkoutEvent", () => startWorkout(workoutItem.dayIndex));
                //futuramente talvez desbloquear para refazer workouts concluídos e futuros

                list.appendChild(carouselItem);
        });

        list.insertAdjacentHTML("afterbegin", carouselControls);
}

//Evento de clique do botão "Iniciar"
function onConfirmButtonClick(){
        //Encontra o item de carousel atualmente selecionado
        var activeCarouselItem = document.querySelectorAll(".carousel-item.active")[0];
        //Dispara um evento customizado que foi previamente adicionado à este item com seu devido index
        activeCarouselItem.dispatchEvent( new CustomEvent("startWorkoutEvent"));
}

//Evento disparado pelo item carousel contendo o index do workout
function startWorkout(workoutDayIndex){
        //alert(`Start workout index ${workoutDayIndex}`);
        console.log(`Start workout index ${workoutDayIndex}`);

        //AQUI VEM A LÓGICA PARA INICIAR O TREINO A PARTIR DO INDEX
        //
        //
        //
        //
        const url = new URL(`${baseUrl}/pages/exercise/workout.html`);
        url.searchParams.append('exercise', exerciseName);      
        window.location.assign(url.toString());
}

function lockedWorkoutWarning(message){
        alert(message);
        console.log(message);
}


//Funções de teste---------------------------------
simulateWorkoutList();
function simulateWorkoutList(){
        var workout1 = {
                dayIndex: 0,
                weekNumber: "1",
                dayNumber: "1",
                sets: [1, 2, 3, 2, 2]
        };
        var workout2 = {
                dayIndex: 1,
                weekNumber: "1",
                dayNumber: "2",
                sets: [2, 3, 4, 5, 4]
        };
        var workout3 = {
                dayIndex: 2,
                weekNumber: "1",
                dayNumber: "3",
                sets: [3, 4, 5, 6, 5]
        };
        var workout4 = {
                dayIndex: 3,
                weekNumber: "2",
                dayNumber: "1",
                sets: [4, 5, 6, 7, 6]
        };
        var workout5 = {
                dayIndex: 4,
                weekNumber: "2",
                dayNumber: "2",
                sets: [5, 6, 7, 8, 7]
        };
        var workout6 = {
                dayIndex: 5,
                weekNumber: "2",
                dayNumber: "3",
                sets: [6, 7, 8, 9, 8]
        };
        var testWorkoutList = [workout1, workout2, workout3, workout4, workout5, workout6];
        var lastCompletedDayIndex = 1; //-1 significa que nenhum dia foi concluído ainda
        spawnWorkoutItems(testWorkoutList, lastCompletedDayIndex);
}