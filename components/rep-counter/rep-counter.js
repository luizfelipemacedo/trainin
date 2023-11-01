//carrega o arquivo html como string e inicializa o menu depois de carregado
export async function loadRepCounterComponent(parentDivId, confirmCounterCallback){
        fetch('/components/rep-counter/rep-counter.html').then(function (response) {      
                return response.text();
        }).then(function (html) {
                initializeRepCounter(html, parentDivId, confirmCounterCallback);
        }).catch(function (err) {
                console.warn('Something went wrong.', err);
        });
}

var counterValue = 1;

function initializeRepCounter(htmlContent, parentDivId, confirmCounterCallback) {
        const parentDivElement = document.getElementById(parentDivId);

        parentDivElement.innerHTML = htmlContent;

        const decreaseCounterButton = document.querySelector("#counter-area #selector-area #decrease");
        const increaseCounterButton = document.querySelector("#counter-area #selector-area #increase");
        const confirmCounterButton = document.querySelector("#counter-area #selector-area #confirm");
        const counterText = document.querySelector("#counter-area #ring-area .ring-area-text");
        counterValue = 1;
        
        decreaseCounterButton.addEventListener('click', decreaseCounter);
        increaseCounterButton.addEventListener('click', increaseCounter);
        confirmCounterButton.addEventListener('click', confirmCounter);
        counterValue = 1;
        updateCounter();
    
        function increaseCounter(){
                counterValue = clamp(counterValue + 1, 0, 99);
                updateCounter();
        }
        function decreaseCounter(){
                counterValue = clamp(counterValue - 1, 0, 99);
                updateCounter();
        }
        function updateCounter(){
                counterText.innerHTML = counterValue;
        }
        function confirmCounter(){
                counterValue = clamp(counterValue, 0, 99);
                confirmCounterCallback(counterValue);
        }
        const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
}
    
  