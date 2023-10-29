const id = localStorage.getItem("id");
const url = `https://backendtest.local/wp-json/wp/v2/users/${id}`;
const token = localStorage.getItem("token");
const followBtn = document.querySelector("#follow");
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

    const amIFollowing = JSON.stringify(json.acf.followers);
    if (amIFollowing.includes(id)) {
      followBtn.innerHTML = "Unfollow";
    } else {
      followBtn.innerHTML = "Follow";
    }

    // Store the followers array as an array in localStorage
    const followersWhat = json.acf.followers;
    if (typeof followersWhat == "number") {
      const followersArray = [followersWhat];
      localStorage.setItem("followers", JSON.stringify(followersArray));
      followersBtn.innerHTML = `Followers (1)`;
    } else if (followersWhat === null) {
      localStorage.setItem("followers", JSON.stringify([]));
      followersBtn.innerHTML = `Followers (0)`;
    } else {
      localStorage.setItem("followers", JSON.stringify(followersWhat));
      let followersCount = followersWhat.length;
      followersBtn.innerHTML = `Followers (${
        followersCount === 1 ? "1" : followersCount
      })`;
    }
    const followingWhat = json.acf.following;
    if (typeof followingWhat == "number") {
      const followingArray = [followingWhat];
      localStorage.setItem("following", JSON.stringify(followingArray));
      followingBtn.innerHTML = `Following (1)`;
    } else if (followingWhat === null) {
      localStorage.setItem("following", JSON.stringify([]));
      followingBtn.innerHTML = `Following (0)`;
    } else {
      localStorage.setItem("following", JSON.stringify(followingWhat));
      let followingCount = followingWhat.length;
      followingBtn.innerHTML = `Following (${
        followingCount === 1 ? "1" : followingCount
      })`;
    }
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
  const myFollowers = localStorage.getItem("followers");
  const myFollowing = localStorage.getItem("following");
  let followersArray = JSON.parse(myFollowers);
  let followingArray = JSON.parse(myFollowing);
  const parseId = parseInt(id);
  console.log(
    followersArray.length,
    typeof followersArray,
    followersArray,
    followingArray.length,
    typeof followingArray,
    followingArray
  );
  let newFollowersArray = [];
  if (followersArray.length == 0) {
    newFollowersArray = parseId;
  } else {
    newFollowersArray = [followersArray, parseId];
  }
  let newFollowingArray = [];
  if (followingArray.length == 0) {
    newFollowingArray = parseId;
  } else {
    newFollowingArray = [followingArray, parseId];
  }
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
    console.log(followersArray, numberId);
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

const theirFollowers = localStorage.getItem("theirFollowers");
const followersArray = JSON.parse(theirFollowers);
console.log(typeof followersArray, followersArray, typeof numberId, numberId);

let newFollowerArray = [];
if (followersArray == numberId) {
  newFollowerArray = null;
} else if (followersArray !== null) {
  newFollowerArray = followersArray.filter((follower) => follower !== numberId);
} else {
  newFollowerArray = null;
}

async function unfollow() {
  const followers = localStorage.getItem("followers");
  const following = localStorage.getItem("following");
  const followingArray = JSON.parse(following);
  const followersArray = JSON.parse(followers);

  let newFollowerArray = [];
  if (followersArray == numberId) {
    newFollowerArray = null;
  } else if (followersArray !== null) {
    newFollowerArray = followersArray.filter(
      (follower) => follower !== numberId
    );
  } else {
    newFollowerArray = null;
  }

  let newFollowingArray = [];
  if (followingArray == numberId) {
    newFollowingArray = null;
  } else if (followingArray !== null) {
    newFollowingArray = followingArray.filter((follow) => follow !== numberId);
  } else {
    newFollowingArray = null;
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
