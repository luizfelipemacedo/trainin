import { getUserData } from "../auth/userData.js";

(async () => {
  const user = await getUserData();

  const image = document.getElementById("profile-image");
  image.style = `background-image: url(${user.picture})`;

  const inputName = document.querySelector(".username");
  inputName.innerHTML = user.fullName;

  const email = document.querySelector(".email");
  email.innerHTML = user.email;
})();