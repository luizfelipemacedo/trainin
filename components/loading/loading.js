export async function showLoadingComponent(){
        if(initialized && loadingWindowDiv != null){
                loadingWindowDiv.style.display = "";
                return;
        }

        fetch('/components/loading/loading.html').then(function (response) {      
                return response.text();
        }).then(function (html) {
                initializeLoadingWindow(html);
        }).catch(function (err) {
                console.warn('Something went wrong.', err);
        });
}

export function hideLoadingComponent(){
        loadingWindowDiv.style.display = "none";
}

var initialized = false;
var loadingWindowDiv = null;

function initializeLoadingWindow(htmlContent) {
        loadingWindowDiv = document.createElement("div");
        loadingWindowDiv.setAttribute("id", "loading-parent");
        loadingWindowDiv.innerHTML = htmlContent;
        document.body.appendChild(loadingWindowDiv);
        initialized = true;
}