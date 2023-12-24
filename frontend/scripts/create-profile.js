import { saveTokenToLocalStorage } from "../auth/authentication";
import { getUserData } from "../auth/userData";
import baseUrl from "../config/baseUrl";

saveTokenToLocalStorage();
const url = new URL(`${baseUrl}/pages/home.html`);
window.location.assign(url.toString());
/*
(async () => {
  saveTokenToLocalStorage();
  const user = await getUserData();

  const inputName = document.getElementById("name");
  inputName.value = user.fullName;

  const image = document.getElementById("profile-image");
  image.style = `background-image: url(${user.picture})`;
})();

const nextButton = document.getElementById("next-button");
nextButton.addEventListener("click", goToHome);

function goToHome() {
  window.location.href = "./home.html";
}
*/