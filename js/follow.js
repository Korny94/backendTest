const id = localStorage.getItem("id");
const url = `https://backendtest.local/wp-json/wp/v2/users/${id}`;
const token = localStorage.getItem("token");
const followBtn = document.querySelector("#follow");
const followers = localStorage.getItem("followers");
const following = localStorage.getItem("following");
const followersArray = JSON.parse(followers);
const followingArray = JSON.parse(following);
const numberId = parseInt(id);
const followersBtn = document.querySelector("#followersBtn");
const followingBtn = document.querySelector("#followingBtn");

async function fetchUser() {
  try {
    const fetchUserResponse = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, fetchUserResponse);
    const json = await response.json();
    console.log(json);
    const followersArray = JSON.stringify(json.acf.followers);
    localStorage.setItem("followers", followersArray);
    const followingArray = JSON.stringify(json.acf.following);
    localStorage.setItem("following", followingArray);
    if (followersArray.includes(numberId)) {
      followBtn.innerHTML = "Unfollow";
    } else {
      followBtn.innerHTML = "Follow";
    }
    followersBtn.innerHTML = `Followers (${json.acf.followers.length})`;
    followingBtn.innerHTML = `Following (${json.acf.following.length})`;
  } catch (error) {
    console.error(error);
  }
}

fetchUser();

followBtn.addEventListener("click", () => {
  if (followBtn.innerHTML === "Follow") {
    follow();
  } else {
    unfollow();
  }
});

async function follow() {
  followersArray.push(numberId);
  followingArray.push(numberId);
  try {
    const followResponse = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        acf: {
          followers: followersArray,
          following: followingArray,
        },
      }),
    };
    console.log(followersArray, numberId);
    const response = await fetch(url, followResponse);
    const json = await response.json();
    if (response.ok) {
      followBtn.innerHTML = "Unfollow";
    }
    console.log(json);
    location.reload();
  } catch (error) {
    console.error(error);
  }
}

async function unfollow() {
  try {
    const unfollowResponse = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        acf: {
          followers: followersArray.filter((follower) => follower !== numberId),
          following: followingArray.filter((follow) => follow !== numberId),
        },
      }),
    };
    followersArray.filter((follower) => follower !== numberId);
    followingArray.filter((follow) => follow !== numberId);
    const response = await fetch(url, unfollowResponse);
    const json = await response.json();
    if (response.ok) {
      followBtn.innerHTML = "Follow";
    }
    console.log(json);
    fetchUser();
    setTimeout(() => {
      location.reload();
    }, 1000);
  } catch (error) {
    console.error(error);
  }
}
