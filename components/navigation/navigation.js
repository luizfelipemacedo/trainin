//carrega o arquivo html como string e inicializa o menu depois de carregado
export async function loadMenuComponent(){
    fetch('/components/navigation/navigation.html').then(function (response) {      
        return response.text();
    }).then(function (html) {
        initializeMenu(html);
    }).catch(function (err) {
        console.warn('Something went wrong.', err);
    });
}

function initializeMenu(htmlContent) {
        const divElement = document.getElementById('menu');

        divElement.innerHTML = htmlContent;
        document.body.appendChild(divElement);

        const homeButton = document.querySelector('#bottom-tab > .home > button');
        const statsButton = document.querySelector('#bottom-tab > .stats > button');
        const profileButton = document.querySelector('#bottom-tab > .profile > button');

        homeButton.addEventListener('click', loadHomePage);
        statsButton.addEventListener('click', loadStatsPage);
        profileButton.addEventListener('click', loadProfilePage);

        function loadHomePage() {
            window.location.href = ("/pages/home.html");
        }

        function loadStatsPage() {
            window.location.href = ("/pages/stats.html");
        }

        function loadProfilePage() {
            window.location.href = ("/pages/profile.html");
        }

        updateMenuActiveButton();
}


function updateMenuActiveButton(){
    const homeButton = document.querySelector('#bottom-tab > .home > button');
    const statsButton = document.querySelector('#bottom-tab > .stats > button');
    const profileButton = document.querySelector('#bottom-tab > .profile > button');

    //var fileName = location.href.split("/").slice(-1);
    var lastPage = localStorage.getItem("lastPage") ? localStorage.getItem("lastPage") : location.href;
    var path = lastPage.substring(lastPage.lastIndexOf("/")+ 1);
    var fileName = (path.match(/[^.]+(\.[^?#]+)?/) || [])[0];

    console.log(fileName);

    if(fileName == "profile.html"){
        homeButton.className = "disabled";
        statsButton.className = "disabled";
        profileButton.className = "";
    }
    else if(fileName == "home.html"){
        homeButton.className = "";
        statsButton.className = "disabled";
        profileButton.className = "disabled";
    }
    else if(fileName == "stats.html"){
        homeButton.className = "disabled";
        statsButton.className = "";
        profileButton.className = "disabled";
    }
    else{        
        homeButton.className = "disabled";
        statsButton.className = "disabled";
        profileButton.className = "disabled";
    }
}