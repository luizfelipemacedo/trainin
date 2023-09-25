import { saveTokenToLocalStorage } from "../auth/authentication";
import { getUserData } from "../auth/userData";

(async () => {
  saveTokenToLocalStorage();
  const user = await getUserData();

  const inputName = document.getElementById("name");
  inputName.value = user.fullName;

  const image = document.getElementById("empty-picture");
  image.style = `background-image: url(${user.picture})`;
})();

const nextButton = document.getElementById("next-button");
nextButton.addEventListener("click", goToHome);

function goToHome() {
  window.location.href = "./home.html";
}
