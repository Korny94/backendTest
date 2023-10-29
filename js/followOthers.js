const theirId = localStorage.getItem("otherProfile");
const myId = localStorage.getItem("id");
const url = `https://backendtest.local/wp-json/wp/v2/users/${theirId}`;
const token = localStorage.getItem("token");
const followBtn = document.querySelector("#followBtn2");

const numberId = parseInt(myId);
const followersBtn = document.querySelector("#followersBtn2");
const followingBtn = document.querySelector("#followingBtn2");

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
    localStorage.setItem("theirFollowers", followersArray);
    const followingArray = JSON.stringify(json.acf.following);
    localStorage.setItem("theirFollowing", followingArray);
    if (followersArray.includes(numberId)) {
      followBtn.innerHTML = "Unfollow";
    } else {
      followBtn.innerHTML = "Follow";
    }
    let followersCount = 0;
    if (json.acf.followers !== null) {
      followersCount = json.acf.followers.length;
    }
    let followingCount = 0;
    if (json.acf.following !== null) {
      followingCount = json.acf.following.length;
    }

    followersBtn.innerHTML = `Followers (${
      followersCount ? followersCount : 0
    })`;
    followingBtn.innerHTML = `Following (${
      followingCount ? followingCount : 0
    })`;
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
  const theirFollowers = localStorage.getItem("theirFollowers");
  let followersArray = JSON.parse(theirFollowers);
  if (followersArray !== null) {
    followersArray.push(numberId);
  } else {
    followersArray = [numberId];
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
          followers: followersArray,
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
    fetchMe();
    fetchUser();
    newFollowing();
    setTimeout(() => {
      location.reload();
    }, 1000);
  } catch (error) {
    console.error(error);
  }
}

async function unfollow() {
  const theirFollowers = localStorage.getItem("theirFollowers");
  const followersArray = JSON.parse(theirFollowers);
  console.log(typeof followersArray, followersArray, typeof numberId, numberId);

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
    followersArray.filter((follower) => follower !== numberId);
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
  const myFollowing = localStorage.getItem("myFollowing");
  let myFollowingArray = JSON.parse(myFollowing);
  const otherProfile = localStorage.getItem("otherProfile");
  const otherId = parseInt(otherProfile);
  if (myFollowingArray !== null) {
    myFollowingArray.push(otherId);
  } else {
    myFollowingArray = otherId;
  }
  console.log(myFollowingArray);
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
          following: myFollowingArray,
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
  const myFollowing = localStorage.getItem("myFollowing");
  let myFollowingArray = JSON.parse(myFollowing);
  const otherProfile = localStorage.getItem("otherProfile");
  const otherId = parseInt(otherProfile);
  console.log(
    typeof myFollowingArray,
    myFollowingArray,
    typeof otherId,
    otherId
  );

  let myNewFollowingArray = [];
  if (myFollowingArray === otherId) {
    myNewFollowingArray = null;
  } else if (myFollowingArray !== null) {
    myNewFollowingArray = myFollowingArray.filter(
      (number) => number !== otherId
    );
  } else {
    myNewFollowingArray = null;
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
