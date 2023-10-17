const loginPassword = document.querySelector("#loginPassword");
const loginUsername = document.querySelector("#loginUsername");
const loginBtn = document.querySelector("#loginBtn");
const loginTitle = document.querySelector("#loginTitle");

loginBtn.addEventListener("click", () => {
  loginTitle.style.color = "black";
  loginTitle.innerText = "Logging in...";
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

    if (response.ok) {
      loginTitle.innerHTML = "Login successful! Redirecting...";
      loginTitle.style.color = "green";
      loginUser();
    } else {
      loginTitle.innerHTML = json.message;
      loginTitle.style.color = "red";
    }
  } catch (error) {
    loginTitle.innerHTML = error;
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
