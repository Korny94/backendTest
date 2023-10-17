const registerUsername = document.querySelector("#registerUsername");
const registerEmail = document.querySelector("#registerEmail");
const registerPassword = document.querySelector("#registerPassword");
const registerBtn = document.querySelector("#registerBtn");
const registerApi = "https://backendtest.local/wp-json/wp/v2/users";

registerBtn.addEventListener("click", () => {
  fetchAuthToken();
});

async function fetchAuthToken() {
  try {
    const fetchTokenResponse = {
      method: "POST",
      body: JSON.stringify({
        username: "HaleysPappa",
        password: "Rbkebest94!",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(
      `https://backendtest.local/wp-json/jwt-auth/v1/token`,
      fetchTokenResponse
    );
    const json = await response.json();
    localStorage.setItem("token", json.token);
    const name = registerUsername.value;
    const email = registerEmail.value;
    const password = registerPassword.value;
    console.log(name, email, password);
    const registerUserObject = {
      username: name,
      email: email,
      password: password,
    };
    registerUser(registerApi, registerUserObject);
  } catch (error) {
    console.error(error);
  }
}

async function registerUser(registerApi, registerUserObject) {
  try {
    const token = localStorage.getItem("token");
    const registerResponse = {
      method: "POST",
      body: JSON.stringify(registerUserObject),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(registerApi, registerResponse);
    console.log(response);
    const json = await response.json();
    console.log(json);
    if (response.ok) {
      const registerModal = document.querySelector("#registerModal");
      const loginModal = document.querySelector("#loginModal");
      registerModal.style.display = "none";
      loginModal.style.display = "flex";
      const loginTitle = document.querySelector("#loginTitle");
      loginTitle.innerText = "Registration successful. Please login.";
      loginTitle.classList.add("success");
    } else if (response.status === 500) {
      const createAccountTitle = document.querySelector("#createActTitle");
      createAccountTitle.innerText = json.message;
      createAccountTitle.style.color = "red";
    } else {
      const createAccountTitle = document.querySelector("#createActTitle");
      createAccountTitle.innerText = "Invalid username, email or password.";
      createAccountTitle.style.color = "red";
    }
  } catch (error) {
    console.error(error);
  }
}
