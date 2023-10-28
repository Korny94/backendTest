const rockPaperScissors = document.querySelector("#rockPaperScissors");

const userModalBody3 = "userModalBody3";
rockPaperScissors.addEventListener("click", () => {
  localStorage.setItem("game", "rockPaperScissors");
  getUsers(userModalBody3);
});

async function getUsers(modalBody) {
  try {
    const token = localStorage.getItem("token");
    const userResponse = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(
      "https://backendtest.local/wp-json/wp/v2/users",
      userResponse
    );
    const json = await response.json();
    console.log(json);

    const userModalBody = document.querySelector(`#${modalBody}`);
    userModalBody.innerHTML = "";

    json.forEach((element) => {
      const userAvatar = element.url
        ? element.url
        : "../assets/avatarNoImg.png";

      console.log(element);
      const userModal = document.createElement("div");
      userModal.classList.add("userModal");
      userModal.innerHTML = DOMPurify.sanitize(`
          <div class="d-flex align-items-center gap-3 userModalLink" title="${element.id}" id="otherProfile">
              <img class="userModalImg" src="${userAvatar}" alt="User avatar">
              <h2 class="userModalName">${element.name}</h2>
          </div>
          `);
      userModalBody.appendChild(userModal);

      const otherProfile = userModal.querySelector("#otherProfile");
      otherProfile.onclick = function () {
        localStorage.setItem("otherProfileName", element.name);
        localStorage.setItem("otherProfile", element.id);

        const game = localStorage.getItem("game");

        const url = `../html/${game}.html`;

        // Redirect to the appropriate page
        window.location.href = url;
      };
    });
  } catch (error) {
    console.error(error);
  }
}
