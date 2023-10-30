import { loadRepCounterComponent } from "/components/rep-counter/rep-counter.js";

loadRepCounterComponent("counter-area-insert", confirmCounterCallback);

function confirmCounterCallback(selectedValue){
        console.log("Counter confirmado: " + selectedValue);
        //Esta função é o callback do botão de confirmar o counter
        //Aqui deve ser o entrypoint da funcionalidade para registrar este valor no backend 
        //----------------------------

}