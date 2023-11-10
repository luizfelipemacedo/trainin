import baseUrl from "../../config/baseUrl";
import { loadRepCounterComponent } from "/components/rep-counter/rep-counter.js";
loadRepCounterComponent("counter-area-insert", confirmCounterCallback);

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

        //const exerciseName = getExerciseNameFromUrl();
        //window.location.href= "/pages/exercise/sets.html?exercise="+exerciseName;

        const url = new URL(`${baseUrl}/pages/exercise/sets.html`);
        url.searchParams.append('exercise', exerciseName);      
        window.location.assign(url.toString());

}