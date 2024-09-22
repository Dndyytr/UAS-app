// Simulasi data login (username dan password yang benar)
const correctUsername = "mahasiswa";
const correctPassword = "mahasiswa";

// elemen
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login");
const logoutButton = document.getElementById("logout");
const eye = document.querySelector(".fa-eye-slash");
const wadah1 = document.querySelector(".wadah.satu");
const wadah2 = document.querySelector(".wadah.dua");

// password
eye.addEventListener("click", () => {
  eye.classList.toggle("fa-eye");
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
});

// loading
function loading() {
  const loadingBar = document.querySelector(".loading");
  loadingBar.style.width = "100%";
  loadingBar.style.transition = "width 1s";
  setTimeout(() => {
    loadingBar.style.width = "0%";
    loadingBar.style.removeProperty("transition");
  }, 1000);
}

// proses login
loginButton.addEventListener("click", (e) => {
  e.preventDefault();
  const enteredUsername = usernameInput.value;
  const enteredPassword = passwordInput.value;

  if (enteredUsername === "") {
    usernameInput.setCustomValidity("Username harus diisi!");
    usernameInput.reportValidity();
  } else if (enteredUsername !== "" && enteredPassword === "") {
    usernameInput.setCustomValidity("");
    passwordInput.setCustomValidity("Password harus diisi!");
    passwordInput.reportValidity();
  } else if (
    enteredUsername === correctUsername &&
    enteredPassword === correctPassword
  ) {
    wadah1.style.display = "none";
    wadah2.style.display = "flex";

    localStorage.setItem("username", enteredUsername);
    localStorage.setItem("password", enteredPassword);
  } else {
    document.querySelector(".peringatan").classList.add("active");
    setTimeout(() => {
      document.querySelector(".peringatan").classList.remove("active");
    }, 2300);
    usernameInput.value = "";
    passwordInput.value = "";
  }
});

// logout
function logout() {
  localStorage.removeItem("password");
  localStorage.removeItem("username");
  localStorage.removeItem("transactions");

  wadah1.style.display = "flex";
  wadah2.style.display = "none";

  usernameInput.value = "";
  passwordInput.value = "";
}

logoutButton.addEventListener("click", (e) => {
  e.preventDefault();
  logout();
});

// refresh
window.addEventListener("load", () => {
  loading();
  const storedUsername = localStorage.getItem("username");
  const storedPassword = localStorage.getItem("password");

  if (storedUsername && storedPassword) {
    wadah1.style.display = "none";
    wadah2.style.display = "flex";
  } else {
    wadah1.style.display = "flex";
    wadah2.style.display = "none";
  }
});

//
