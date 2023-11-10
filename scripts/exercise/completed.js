import baseUrl from "../../config/baseUrl";

const repsSpan = document.querySelector("#stats #reps");
const timeSpan = document.querySelector("#stats #time");
const confirmButton = document.querySelector("button#accept");

initializeStats();

function initializeStats(){
        confirmButton.addEventListener('click', returnToHomePage);

        var totalReps = localStorage.getItem("lastWorkoutReps");
        if(totalReps)
                repsSpan.innerHTML = totalReps;
        
        var durationMs = localStorage.getItem("lastWorkoutDurationMs");
        if(durationMs){
                var seconds = Math.floor(durationMs / 1000);
                var minutes = Math.floor(seconds / 60);
                seconds = seconds % 60;

                var minutes = minutes.toLocaleString('pt-BR', {minimumIntegerDigits: 2, useGrouping: false});
                var seconds = seconds.toLocaleString('pt-BR', {minimumIntegerDigits: 2, useGrouping: false});
                console.log(durationMs);
                console.log(minutes + ":" + seconds);
                timeSpan.innerHTML = `${minutes}:${seconds}`;
        }
}

function returnToHomePage(){
        const url = new URL(`${baseUrl}/pages/home.html`);   
        window.location.assign(url.toString());
}