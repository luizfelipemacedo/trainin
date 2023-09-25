import user from "../auth/userData";
import { saveTokenToLocalStorage } from "../auth/authentication";

saveTokenToLocalStorage();

const nextButton = document.getElementById("next-button");
nextButton.addEventListener("click", goToHome);

const inputName = document.getElementById("name");
inputName.value = user.fullName;

function goToHome() {
  window.location.href = "./home.html";
}
