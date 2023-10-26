import { loadMenuComponent } from "../components/navigation/navigation.js";
import { getUserData } from "../auth/userData.js";

(async () => {
  const user = await getUserData();

  const image = document.getElementById("empty-picture");
  image.style = `background-image: url(${user.picture})`;

  const inputName = document.querySelector(".username");
  inputName.innerHTML = user.fullName;

  const email = document.querySelector(".email");
  email.innerHTML = user.email;
})();

loadMenuComponent();
