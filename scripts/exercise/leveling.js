loadExerciseInfo();

function loadExerciseInfo(){
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const exerciseName = urlParams.get('exercise');
        console.log(exerciseName);
}