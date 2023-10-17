const loginPassword = document.querySelector("#loginPassword");
const loginUsername = document.querySelector("#loginUsername");
const loginBtn = document.querySelector("#loginBtn");
const loginTitle = document.querySelector("#loginTitle");

loginBtn.addEventListener("click", () => {
  fetchToken();
});

async function fetchToken() {
  try {
    const password = loginPassword.value;
    const username = loginUsername.value;
    const loginResponse = {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(
      `https://backendtest.local/wp-json/jwt-auth/v1/token`,
      loginResponse
    );
    const json = await response.json();
    console.log(json);
    localStorage.setItem("token", json.token);
    localStorage.setItem("username", json.user_display_name);
    localStorage.setItem("email", json.user_email);
    loginTitle.innerHTML = json.message;
    if (response.ok) {
      loginUser();
    } else {
      //   loginFailed.classList.add("text-danger");
      //   loginFailed.innerText = "Login failed, please try again.";
    }
  } catch (error) {
    console.error(error);
  }
}

async function loginUser() {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    const loginResponse = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(
      `https://backendtest.local/wp-json/jwt-auth/v1/token/validate`,
      loginResponse
    );
    const json = await response.json();
    console.log(json);
    if (response.ok) {
      window.location.href = "../html/feed.html";
    } else {
      loginFailed.classList.add("text-danger");
      loginFailed.innerText = "Login failed, please try again.";
    }
  } catch (error) {
    console.error(error);
  }
}
