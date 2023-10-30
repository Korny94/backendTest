const theirId = localStorage.getItem("otherProfile");
const theirNumberId = parseInt(theirId);
const myId = localStorage.getItem("id");
const url = `https://backendtest.local/wp-json/wp/v2/users/${theirId}`;
const token = localStorage.getItem("token");
const followBtn = document.querySelector("#followBtn2");

const numberId = parseInt(myId);
const followersBtn = document.querySelector("#followersBtn2");
const followingBtn = document.querySelector("#followingBtn2");

fetchMe();
fetchUser();

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
    localStorage.setItem("otherProfileName", json.name);
    let jsonFollowing = json.acf.following;
    let jsonFollowers = json.acf.followers;
    if (jsonFollowers === null) {
      jsonFollowers = [];
    }
    if (jsonFollowing === null) {
      jsonFollowing = [];
    }
    followersBtn.innerHTML = `Followers (${jsonFollowers.length})`;
    followingBtn.innerHTML = `Following (${jsonFollowing.length})`;
    localStorage.setItem("theirFollowers", jsonFollowers);
    localStorage.setItem("theirFollowing", jsonFollowing);
    const followers = localStorage.getItem("theirFollowers");
    console.log(followers);

    let followersArray;
    if (typeof followers !== "number") {
      followersArray = followers.split(",").map(Number);
    } else {
      followersArray = JSON.parse(followers);
    }

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

followBtn.addEventListener("click", (event) => {
  event.preventDefault();
  if (followBtn.innerText === "Follow") {
    follow();
  } else {
    unfollow();
  }
});

async function follow() {
  const followers = localStorage.getItem("theirFollowers");

  let followersArray;
  if (typeof followers === null) {
    followersArray = [];
  } else if (typeof followers !== "number") {
    followersArray = followers.split(",").map(Number);
  } else {
    followersArray = JSON.parse(followers);
  }
  let newFollowersArray;

  if (
    followersArray === null ||
    followersArray == numberId ||
    followersArray.length == 0 ||
    followersArray == 0 ||
    followersArray == []
  ) {
    newFollowersArray = [numberId];
  } else {
    newFollowersArray = followersArray.concat([numberId]);
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
        },
      }),
    };
    const response = await fetch(url, followResponse);
    const json = await response.json();
    if (response.ok) {
      followBtn.innerHTML = "Unfollow";
    }
    console.log(json);
    fetchMe();
    fetchUser();
    newFollowing();
    // setTimeout(() => {
    //   location.reload();
    // }, 1000);
  } catch (error) {
    console.error(error);
  }
}

async function unfollow() {
  const followers = localStorage.getItem("theirFollowers");
  let followersArray;
  if (typeof followers === null) {
    followersArray = [];
  } else if (typeof followers !== "number") {
    followersArray = followers.split(",").map(Number);
  } else {
    followersArray = JSON.parse(followers);
  }

  let newFollowerArray = null;

  if (
    followersArray == numberId ||
    followersArray.length == 0 ||
    followersArray === null ||
    followersArray == 0 ||
    followersArray == []
  ) {
    newFollowerArray = null;
  } else {
    newFollowerArray = followersArray.filter(
      (follower) => follower !== numberId
    );
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
        },
      }),
    };
    const response = await fetch(url, unfollowResponse);
    const json = await response.json();
    if (response.ok) {
      followBtn.innerHTML = "Follow";
    }
    console.log(json);
    fetchUser();
    fetchMe();
    removeFollowing();
    setTimeout(() => {
      location.reload();
    }, 500);
  } catch (error) {
    console.error(error);
  }
}

async function fetchMe() {
  try {
    const token = localStorage.getItem("token");
    const url = `https://backendtest.local/wp-json/wp/v2/users/me`;
    const fetchMeResponse = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, fetchMeResponse);
    const json = await response.json();
    console.log(json);
    const myFollowingArray = json.acf.following;
    localStorage.setItem("myFollowing", myFollowingArray);
    console.log(myFollowingArray);
  } catch (error) {
    console.error(error);
  }
}

async function newFollowing() {
  const myFollowings = localStorage.getItem("myFollowing");
  let myFollowingArray;
  if (typeof myFollowings === null) {
    myFollowingArray = [];
  } else if (typeof myFollowings !== "number") {
    myFollowingArray = myFollowings.split(",").map(Number);
  } else {
    myFollowingArray = JSON.parse(myFollowings);
  }
  console.log(myFollowingArray);
  let newMyFollowingArray;
  if (
    myFollowingArray == null ||
    myFollowingArray.length == 0 ||
    myFollowings == [] ||
    myFollowingArray == 0 ||
    myFollowingArray == theirNumberId
  ) {
    newMyFollowingArray = [theirNumberId];
  } else {
    newMyFollowingArray = myFollowingArray.concat([theirNumberId]);
  }
  console.log(newMyFollowingArray);
  try {
    const token = localStorage.getItem("token");
    const url = `https://backendtest.local/wp-json/wp/v2/users/me`;
    const newFollowingResponse = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        acf: {
          following: newMyFollowingArray,
        },
      }),
    };
    const response = await fetch(url, newFollowingResponse);
    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error);
  }
}

async function removeFollowing() {
  const myFollowings = localStorage.getItem("myFollowing");
  let myFollowingArray;
  if (typeof myFollowings === null) {
    myFollowingArray = [];
  } else if (typeof myFollowings !== "number") {
    myFollowingArray = myFollowings.split(",").map(Number);
  } else {
    myFollowingArray = JSON.parse(myFollowings);
  }

  let myNewFollowingArray;

  if (
    myFollowingArray == theirNumberId ||
    myFollowingArray.length == 0 ||
    myFollowings == [] ||
    myFollowingArray === null ||
    myFollowingArray == 0
  ) {
    myNewFollowingArray = null;
  } else {
    myNewFollowingArray = myFollowingArray.filter(
      (number) => number !== theirNumberId
    );
  }
  console.log(
    "myNewFollowingArray" + typeof myNewFollowingArray,
    myNewFollowingArray
  );
  try {
    const url = `https://backendtest.local/wp-json/wp/v2/users/me`;
    const removeFollowingResponse = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        acf: {
          following: myNewFollowingArray,
        },
      }),
    };
    const response = await fetch(url, removeFollowingResponse);
    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error);
  }
}
