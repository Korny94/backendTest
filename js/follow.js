const id = localStorage.getItem("id");
const url = `https://backendtest.local/wp-json/wp/v2/users/${id}`;
const token = localStorage.getItem("token");
const followBtn = document.querySelector("#follow");
const numberId = parseInt(id);
const followersBtn = document.querySelector("#followersBtn");
const followingBtn = document.querySelector("#followingBtn");
const messageBtn = document.querySelector("#messageBtn");

messageBtn.addEventListener("click", () => {
  window.location.href = "../html/messages.html";
});

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

    let jsonFollowers = json.acf.followers;
    let jsonFollowing = json.acf.following;
    if (jsonFollowers === null) {
      jsonFollowers = [];
    }
    if (jsonFollowing === null) {
      jsonFollowing = [];
    }
    followersBtn.innerHTML = `Followers (${jsonFollowers.length})`;
    followingBtn.innerHTML = `Following (${jsonFollowing.length})`;
    localStorage.setItem("followers", jsonFollowers);
    localStorage.setItem("following", jsonFollowing);
    const followers = localStorage.getItem("followers");
    console.log(followers);

    let followersArray;
    if (typeof followers !== "number") {
      followersArray = followers.split(",").map(Number);
    } else {
      followersArray = JSON.parse(followers);
    }
    console.log(followersArray);

    if (followersArray == numberId) {
      followBtn.innerHTML = "Unfollow";
    } else if (followersArray === null) {
      followBtn.innerHTML = "Follow";
    } else if (followersArray.includes(numberId)) {
      followBtn.innerHTML = "Unfollow";
    }
  } catch (error) {
    console.error(error);
  }
}

fetchUser();

followBtn.addEventListener("click", () => {
  if (followBtn.innerText === "Follow") {
    follow();
  } else {
    unfollow();
  }
});

async function follow() {
  const followers = localStorage.getItem("followers");
  const following = localStorage.getItem("following");

  let followersArray;
  if (typeof followers !== "number") {
    followersArray = followers.split(",").map(Number);
  } else {
    followersArray = JSON.parse(followers);
  }
  let followingArray;
  if (typeof following !== "number") {
    followingArray = following.split(",").map(Number);
  } else {
    followingArray = JSON.parse(following);
  }
  console.log(followersArray, followingArray);

  let newFollowersArray;

  if (
    followersArray === null ||
    followersArray.length == 0 ||
    followersArray == numberId ||
    followersArray == 0 ||
    followersArray == []
  ) {
    newFollowersArray = [numberId];
  } else {
    newFollowersArray = followersArray.concat([numberId]);
  }

  let newFollowingArray;
  if (
    followingArray === null ||
    followingArray.length == 0 ||
    followingArray == numberId ||
    followingArray == 0 ||
    followingArray == []
  ) {
    newFollowingArray = [numberId];
  } else {
    newFollowingArray = followingArray.concat([numberId]);
  }
  console.log(newFollowersArray, newFollowingArray);

  try {
    const followResponse = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        acf: {
          followers: newFollowersArray,
          following: newFollowingArray,
        },
      }),
    };
    const response = await fetch(url, followResponse);
    const json = await response.json();

    console.log(json);
    setTimeout(() => {
      location.reload();
    }, 500);
  } catch (error) {
    console.error(error);
  }
}
async function unfollow() {
  const followers = localStorage.getItem("followers");
  const following = localStorage.getItem("following");
  let followersArray;
  if (typeof followers !== "number") {
    followersArray = followers.split(",").map(Number);
  } else {
    followersArray = JSON.parse(followers);
  }
  let followingArray;
  if (typeof following !== "number") {
    followingArray = following.split(",").map(Number);
  } else {
    followingArray = JSON.parse(following);
  }
  console.log(followersArray, followingArray);
  let newFollowerArray = null;
  if (
    followersArray == numberId ||
    followersArray.length == 0 ||
    followersArray === null ||
    followersArray == 0 ||
    followersArray == []
  ) {
    newFollowerArray = [];
  } else {
    newFollowerArray = followersArray.filter(
      (follower) => follower !== numberId
    );
  }

  let newFollowingArray = [];
  if (
    followingArray == numberId ||
    followingArray.length == 0 ||
    followingArray === null ||
    followingArray == 0 ||
    followingArray == []
  ) {
    newFollowingArray = [];
  } else {
    newFollowingArray = followingArray.filter((follow) => follow !== numberId);
  }
  try {
    const unfollowResponse = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        acf: {
          followers: newFollowerArray,
          following: newFollowingArray,
        },
      }),
    };
    const response = await fetch(url, unfollowResponse);
    const json = await response.json();
    console.log(json);
    fetchUser();
    setTimeout(() => {
      location.reload();
    }, 500);
  } catch (error) {
    console.error(error);
  }
}
