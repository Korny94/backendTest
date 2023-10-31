export async function getUsers(modalBody) {
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
      "https://karlmagnusnokling.no/haley/wp-json/wp/v2/users",
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
            <h5 class="userModalName">${element.name}</h5>
        </div>
        `);
      userModalBody.appendChild(userModal);

      const otherProfile = userModal.querySelector("#otherProfile");
      otherProfile.onclick = function () {
        const owner = otherProfile.getAttribute("title");

        localStorage.setItem("otherProfile", owner);
        const id = localStorage.getItem("id");

        let url;
        if (id === owner) {
          url = "../html/myProfile.html";
        } else {
          url = "../html/profile.html";
        }

        // Redirect to the appropriate page
        window.location.href = url;
      };
    });
  } catch (error) {
    console.error(error);
  }
}

const getUsersBtn = document.querySelector("#getUsersBtn");
if (getUsersBtn) {
  getUsersBtn.addEventListener("click", () => {
    const modalBody = "userModalBody";
    getUsers(modalBody);
  });
}
