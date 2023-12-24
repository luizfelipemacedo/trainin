import { authenticateWithGoogle } from "../auth/authentication";
const loginButton = document.getElementById('login-button');

loginButton.addEventListener('click', authenticateWithGoogle);