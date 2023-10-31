async function getUsers(modalBody, usersArray) {
  const userModalBody = document.querySelector(`#${modalBody}`);
  userModalBody.innerHTML = ""; // Clear existing content
  for (const element of usersArray) {
    const userAvatar = element.url || "../assets/avatarNoImg.png";
    console.log(userModalBody);
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
  }
}

const followersBtn = document.querySelector("#followersBtn");
if (followersBtn) {
  followersBtn.addEventListener("click", async () => {
    const modalBody = "userModalBody4"; // Unique ID for followers modal
    const followers = localStorage.getItem("followers");
    const followersArray = followers;

    try {
      const token = localStorage.getItem("token");
      const usersArray = [];
      for (const followerId of followersArray) {
        const userResponse = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await fetch(
          `https://karlmagnusnokling.no/haley/wp-json/wp/v2/users/${followerId}`,
          userResponse
        );

        if (response.ok) {
          const user = await response.json();
          usersArray.push(user);
        }
      }

      getUsers(modalBody, usersArray);
    } catch (error) {
      console.error(error);
    }
  });
}

const followingBtn = document.querySelector("#followingBtn");
if (followingBtn) {
  followingBtn.addEventListener("click", async () => {
    const modalBody = "userModalBody4";
    const following = localStorage.getItem("following");
    const followingArray = following;
    console.log(followingArray);

    try {
      const token = localStorage.getItem("token");
      const usersArray = [];
      for (const followingId of followingArray) {
        const userResponse = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await fetch(
          `https://karlmagnusnokling.no/haley/wp-json/wp/v2/users/${followingId}`,
          userResponse
        );

        if (response.ok) {
          const user = await response.json();
          usersArray.push(user);
        }
      }

      getUsers(modalBody, usersArray);
    } catch (error) {
      console.error(error);
    }
  });
}

const followersBtn2 = document.querySelector("#followersBtn2");
if (followersBtn2) {
  followersBtn2.addEventListener("click", async () => {
    const modalBody = "userModalBody5"; // Unique ID for followers modal
    const followers = localStorage.getItem("theirFollowers");
    const followersArray = followers;
    console.log(followersArray);

    try {
      const token = localStorage.getItem("token");
      const usersArray = [];
      for (const followerId of followersArray) {
        const userResponse = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await fetch(
          `https://karlmagnusnokling.no/haley/wp-json/wp/v2/users/${followerId}`,
          userResponse
        );
        console.log(response);

        if (response.ok) {
          const user = await response.json();
          usersArray.push(user);
        }
      }

      getUsers(modalBody, usersArray);
    } catch (error) {
      console.error(error);
    }
  });
}

const followingBtn2 = document.querySelector("#followingBtn2");
if (followingBtn2) {
  followingBtn2.addEventListener("click", async () => {
    const modalBody = "userModalBody5";
    const following = localStorage.getItem("theirFollowing");
    const followingArray = following;
    console.log(followingArray);

    try {
      const token = localStorage.getItem("token");
      const usersArray = [];
      for (const followingId of followingArray) {
        const userResponse = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await fetch(
          `https://karlmagnusnokling.no/haley/wp-json/wp/v2/users/${followingId}`,
          userResponse
        );
        console.log(response);

        if (response.ok) {
          const user = await response.json();
          usersArray.push(user);
        }
      }

      getUsers(modalBody, usersArray);
    } catch (error) {
      console.error(error);
    }
  });
}
