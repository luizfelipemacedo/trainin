import baseUrl from "../config/baseUrl";

export function initializeBackButton(pagePath){
        var backButton = document.querySelector("#header > .back");
        if(backButton){
                backButton.addEventListener('click', function (event) {
                        
                        const url = new URL(`${baseUrl}/${pagePath}`);
                        window.location.assign(url.toString());

                });
        }
}