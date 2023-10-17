// // export async function postReaction(postId, reaction) {
// //   const reactionData = {
// //     post_id: postId, // Send the post ID
// //     reaction: reaction, // 'like' or 'dislike' or 'love' or 'haha' or 'wow' or 'sad' or 'angry'
// //   };
// //   const token = localStorage.getItem("token");

// //   const reactionResponse = {
// //     method: "POST",
// //     headers: {
// //       "Content-Type": "application/json",
// //       authorization: `Bearer ${token}`,
// //     },
// //     body: JSON.stringify(reactionData),
// //   };

// //   try {
// //     const response = await fetch(
// //       `https://backendtest.local/wp-json/wp/v2/posts/${postId}/`,
// //       reactionResponse
// //     );
// //     const responseData = await response.json();
// //     console.log(responseData); // Response from the API
// //   } catch (error) {
// //     console.error(error);
// //   }
// // }

// export async function postReaction(postId, reaction) {
//   const token = localStorage.getItem("token");

//   // Create the data object with the reaction to update
//   const reactionData = {
//     fields: {
//       [reaction]: true, // Set the reaction field to true
//     },
//   };

//   const reactionResponse = {
//     method: "PUT", // Use PUT to update the ACF data
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(reactionData),
//   };

//   try {
//     const response = await fetch(
//       `https://backendtest.local/wp-json/wp/v2/posts/${postId}/acf`, // Specify the ACF endpoint
//       reactionResponse
//     );
//     const responseData = await response.json();
//     console.log(responseData); // Response from the API
//   } catch (error) {
//     console.error(error);
//   }
// }

// export function addReactionListeners(postId) {
//   const like = document.querySelector(`#like_${postId}`);
//   const dislike = document.querySelector(`#dislike_${postId}`);
//   const haha = document.querySelector(`#haha_${postId}`);
//   const angry = document.querySelector(`#angry_${postId}`);
//   const wow = document.querySelector(`#wow_${postId}`);
//   const sad = document.querySelector(`#sad_${postId}`);
//   const love = document.querySelector(`#love_${postId}`);

//   like.addEventListener("click", function () {
//     postReaction(postId, "like");
//     getReactionCounts(postId);
//   });

//   dislike.addEventListener("click", function () {
//     postReaction(postId, "dislike");
//     getReactionCounts(postId);
//   });

//   haha.addEventListener("click", function () {
//     postReaction(postId, "haha");
//     getReactionCounts(postId);
//   });

//   angry.addEventListener("click", function () {
//     postReaction(postId, "angry");
//     getReactionCounts(postId);
//   });

//   wow.addEventListener("click", function () {
//     postReaction(postId, "wow");
//     getReactionCounts(postId);
//   });

//   sad.addEventListener("click", function () {
//     postReaction(postId, "sad");
//     getReactionCounts(postId);
//   });

//   love.addEventListener("click", function () {
//     postReaction(postId, "love");
//     getReactionCounts(postId);
//   });
// }

// export async function getReactionCounts(postId) {
//   try {
//     const response = await fetch(
//       `https://backendtest.local/wp-json/wp/v2/posts/${postId}`
//     );

//     if (response.ok) {
//       const reactionCounts = await response.json();
//       console.log(reactionCounts.acf); // Reaction counts for the post
//       // Update your UI with the reaction counts
//     } else {
//       console.error("Failed to retrieve reaction counts");
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }

// // Example of calling the getReactionCounts function

export async function postReaction(postId, reaction) {
  const token = localStorage.getItem("token");

  const reactionData = {
    post_id: postId, // Send the post ID
    reaction: reaction, // 'like' or 'dislike' or 'love' or 'haha' or 'wow' or 'sad' or 'angry'
  };

  const reactionResponse = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reactionData),
  };

  try {
    const response = await fetch(
      `https://backendtest.local/wp-json/custom/v1/post-reactions`,
      reactionResponse
    );
    const responseData = await response.json();
    console.log(responseData); // Response from the API
  } catch (error) {
    console.error(error);
  }
}

export function addReactionListeners(postId) {
  const like = document.querySelector(`#like_${postId}`);
  const dislike = document.querySelector(`#dislike_${postId}`);
  const haha = document.querySelector(`#haha_${postId}`);
  const angry = document.querySelector(`#angry_${postId}`);
  const wow = document.querySelector(`#wow_${postId}`);
  const sad = document.querySelector(`#sad_${postId}`);
  const love = document.querySelector(`#love_${postId}`);

  like.addEventListener("click", function () {
    postReaction(postId, "like");
    getReactionCounts(postId);
  });

  dislike.addEventListener("click", function () {
    postReaction(postId, "dislike");
    getReactionCounts(postId);
  });

  haha.addEventListener("click", function () {
    postReaction(postId, "haha");
    getReactionCounts(postId);
  });

  angry.addEventListener("click", function () {
    postReaction(postId, "angry");
    getReactionCounts(postId);
  });

  wow.addEventListener("click", function () {
    postReaction(postId, "wow");
    getReactionCounts(postId);
  });

  sad.addEventListener("click", function () {
    postReaction(postId, "sad");
    getReactionCounts(postId);
  });

  love.addEventListener("click", function () {
    postReaction(postId, "love");
    getReactionCounts(postId);
  });
}

export async function getReactionCounts(postId, modalReactionCount) {
  try {
    const token = localStorage.getItem("token");
    const reactionCountResponse = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(
      `https://backendtest.local/wp-json/custom/v1/post-reactions/${postId}`,
      reactionCountResponse
    );

    const reactionCounts = await response.json();
    const likeCount = reactionCounts.like;
    const dislikeCount = reactionCounts.dislike;
    const hahaCount = reactionCounts.haha;
    const angryCount = reactionCounts.angry;
    const wowCount = reactionCounts.wow;
    const sadCount = reactionCounts.sad;
    const loveCount = reactionCounts.love;

    const totalReactions =
      likeCount +
      dislikeCount +
      hahaCount +
      angryCount +
      wowCount +
      sadCount +
      loveCount;
    console.log(totalReactions);
    if (totalReactions > 0) {
      modalReactionCount.title = `${totalReactions} Reactions`;
      if (likeCount > 0) {
        modalReactionCount.innerHTML += `<img class="reaction-icon likeCount" src="../assets/thumbsUp.png" alt="Like Icon" />`;
      }
      if (dislikeCount > 0) {
        modalReactionCount.innerHTML += `<img class="reaction-icon dislikeCount" src="../assets/thumbsDown.png" alt="Dislike Icon" />`;
      }
      if (angryCount > 0) {
        modalReactionCount.innerHTML += `<img class="reaction-icon angryCount" src="../assets/angry.png" alt="Angry Icon" />`;
      }
      if (hahaCount > 0) {
        modalReactionCount.innerHTML += `<img class="reaction-icon hahaCount" src="../assets/laugh.png" alt="Haha Icon" />`;
      }
      if (wowCount > 0) {
        modalReactionCount.innerHTML += `<img class="reaction-icon wowCount" src="../assets/surprised.png" alt="Wow Icon" />`;
      }
      if (sadCount > 0) {
        modalReactionCount.innerHTML += `<img class="reaction-icon sadCount" src="../assets/cry.png" alt="Sad Icon" />`;
      }
      if (loveCount > 0) {
        modalReactionCount.innerHTML += `<img class="reaction-icon loveCount" src="../assets/heart.png" alt="Love Icon" />`;
      }
    }
  } catch (error) {
    console.error(error);
  }
}
