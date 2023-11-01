initializeBackButton();

function initializeBackButton(){
        var backButton = document.querySelector("#header > .back");
        if(backButton){
                backButton.addEventListener('click', function (event) {
                        history.back();
                });
        }
}