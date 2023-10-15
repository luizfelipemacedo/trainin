import { loadMenuComponent } from "/components/navigation/navigation.js";

loadMenuComponent();

initializeOptions();

function initializeOptions(){
        var flexaoDiv = document.getElementsByClassName("workout flexao")[0];
        var abdominalDiv = document.getElementsByClassName("workout abdominal")[0];
        var agachamentoDiv = document.getElementsByClassName("workout agachamento")[0];
        var tricepsDiv = document.getElementsByClassName("workout triceps")[0];

        flexaoDiv.addEventListener('click', function (event) { exerciseClickEvent("flexao"); });
        abdominalDiv.addEventListener('click', function (event) { exerciseClickEvent("abdominal"); });
        agachamentoDiv.addEventListener('click', function (event) { exerciseClickEvent("agachamento"); });
        tricepsDiv.addEventListener('click', function (event) { exerciseClickEvent("triceps"); });
}

function exerciseClickEvent(exerciseName){        
        window.location.href="exercise/leveling.html?exercise="+exerciseName;
}