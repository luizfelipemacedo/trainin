import api from "../config/api.js";
import baseUrl from "../config/baseUrl.js";
import { getUserData } from "../auth/userData.js";

const deleteButton = document.querySelector("#delete");
const logoutButton = document.querySelector("#logout");

deleteButton.addEventListener("click", handleDeleteUser);
logoutButton.addEventListener("click", handleLogout);

async function handleDeleteUser() {
  const { id } = await getUserData();

  const confirmDelete = confirm("Tem certeza que deseja deletar sua conta?");
  if (!confirmDelete) return;

  try {
    const res = await api.delete(`/user/${id}`);

    if (res.status === 204) {
      alert("Conta deletada com sucesso!");

      handleLogout();
    }
  } catch (error) {
    console.log(error);
  }
};

async function handleLogout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("sb-nutpqerdnsozmmxqzbyj-auth-token");

  const homePage = new URL(`${baseUrl}/pages/login.html`);
  window.location.assign(homePage.toString());
};

(async () => {
  const user = await getUserData();

  const image = document.getElementById("profile-image");
  image.style = `background-image: url(${user.picture})`;

  const inputName = document.querySelector(".username");
  inputName.innerHTML = user.fullName;

  const email = document.querySelector(".email");
  email.innerHTML = user.email;
})();
