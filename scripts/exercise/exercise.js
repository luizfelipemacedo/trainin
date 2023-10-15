const tutorialImage = document.querySelector("#instruction img.tutorial-img");
const tutorialPath = "/src/imgs/exercise/tutorial/";

loadExerciseInfo();

function loadExerciseInfo(){
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const exerciseName = urlParams.get('exercise');
        console.log(exerciseName);

        tutorialImage.src = tutorialPath + exerciseName + ".gif";
}