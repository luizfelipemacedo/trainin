const list = document.getElementById("list");

initializeOptions();

function initializeOptions(){
        document.getElementById("flexoes-option").addEventListener("click", (e) => onOptionSelected(e, "flexoes"));
        document.getElementById("abdominais-option").addEventListener("click", (e) => onOptionSelected(e, "abdominais"));
        document.getElementById("agachamentos-option").addEventListener("click", (e) => onOptionSelected(e, "agachamentos"));
        document.getElementById("triceps-option").addEventListener("click", (e) => onOptionSelected(e, "triceps"));
}

function onOptionSelected(event, exerciseName){
        console.log(exerciseName);
        document.querySelectorAll("#selector .option").forEach(option => {
                option.classList.remove('active');
        });
        event.target.classList.add('active');
        requestStatsByExercise(exerciseName);
}

function requestStatsByExercise(exerciseName){
        //Fazer request da lista de stats por exercicio no back-end
        //
        //
        //
        //spawnStatsItems();
        simulateWorkoutList();
}

function spawnStatsItems(statsList){

        list.innerHTML = "";

        statsList.forEach(statItem => {
                //Contrução da div item
                var item = document.createElement('div');
                item.classList.add('stats-item');
        
                //Data
                var date = document.createElement('div');
                date.classList.add('date');

                var dateTitle = document.createElement('div');
                dateTitle.classList.add('title');
                dateTitle.innerHTML = "DATA";
                date.appendChild(dateTitle);

                item.appendChild(date);

                var dateValue = document.createElement('div');
                dateValue.classList.add('value');
                dateValue.innerHTML = statItem.date;
                date.appendChild(dateValue);

                //Reps
                var reps = document.createElement('div');
                reps.classList.add('reps');

                var tempoTitle = document.createElement('div');
                tempoTitle.classList.add('title');
                tempoTitle.innerHTML = "REPS";
                reps.appendChild(tempoTitle);

                var tempoValue = document.createElement('div');
                tempoValue.classList.add('value');
                tempoValue.innerHTML = statItem.reps;
                reps.appendChild(tempoValue);

                item.appendChild(reps);

                //Tempo
                var tempo = document.createElement('div');
                tempo.classList.add('time');

                var tempoTitle = document.createElement('div');
                tempoTitle.classList.add('title');
                tempoTitle.innerHTML = "TEMPO";
                tempo.appendChild(tempoTitle);

                var tempoValue = document.createElement('div');
                tempoValue.classList.add('value');
                tempoValue.innerHTML = statItem.time;
                tempo.appendChild(tempoValue);

                item.appendChild(tempo);
        
                //Geral
                list.appendChild(item);
        });
}

//Funções de teste---------------------------------
simulateWorkoutList();
function simulateWorkoutList(){
        var stat1 = {
                date: "02/11/2023",
                reps: "56",
                time: "10:35"
        };
        var stat2 = {
                date: "15/12/2023",
                reps: "73",
                time: "12:35"
        };
        var stat3 = {
                date: "27/12/2023",
                reps: "86",
                time: "17:47"
        };
        var testStatsList = [stat1, stat2, stat3,stat1, stat2, stat3,stat1, stat2, stat3,stat1, stat2, stat3];
        spawnStatsItems(testStatsList);
}