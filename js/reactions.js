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
      `https://karlmagnusnokling.no/haley/wp-json/wp/v2/posts`,
      reactionResponse
    );
    const responseData = await response.json();
    console.log(responseData); // Response from the API
    setTimeout(() => {
      location.reload();
    }, 200);
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
    const scrollPosition = window.scrollY;
    localStorage.setItem("scrollPosition", scrollPosition);
    postReaction(postId, "reaction_like");
    getReactionCounts(postId);
  });

  dislike.addEventListener("click", function () {
    const scrollPosition = window.scrollY;
    localStorage.setItem("scrollPosition", scrollPosition);
    postReaction(postId, "reaction_dislike");
    getReactionCounts(postId);
  });

  haha.addEventListener("click", function () {
    const scrollPosition = window.scrollY;
    localStorage.setItem("scrollPosition", scrollPosition);
    postReaction(postId, "reaction_haha");
    getReactionCounts(postId);
  });

  angry.addEventListener("click", function () {
    const scrollPosition = window.scrollY;
    localStorage.setItem("scrollPosition", scrollPosition);
    postReaction(postId, "reaction_angry");
    getReactionCounts(postId);
  });

  wow.addEventListener("click", function () {
    const scrollPosition = window.scrollY;
    localStorage.setItem("scrollPosition", scrollPosition);
    postReaction(postId, "reaction_wow");
    getReactionCounts(postId);
  });

  sad.addEventListener("click", function () {
    const scrollPosition = window.scrollY;
    localStorage.setItem("scrollPosition", scrollPosition);
    postReaction(postId, "reaction_sad");
    getReactionCounts(postId);
  });

  love.addEventListener("click", function () {
    const scrollPosition = window.scrollY;
    localStorage.setItem("scrollPosition", scrollPosition);
    postReaction(postId, "reaction_love");
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
      `https://karlmagnusnokling.no/haley/wp-json/wp/v2/posts/${postId}`,
      reactionCountResponse
    );

    const reactionCounts = await response.json();
    const likeCount = reactionCounts.reaction_like;
    const dislikeCount = reactionCounts.reaction_dislike;
    const hahaCount = reactionCounts.reaction_haha;
    const angryCount = reactionCounts.reaction_angry;
    const wowCount = reactionCounts.reaction_wow;
    const sadCount = reactionCounts.reaction_sad;
    const loveCount = reactionCounts.reaction_love;

    const totalReactions =
      likeCount +
      dislikeCount +
      hahaCount +
      angryCount +
      wowCount +
      sadCount +
      loveCount;
    console.log(
      likeCount,
      dislikeCount,
      hahaCount,
      angryCount,
      wowCount,
      sadCount,
      loveCount
    );
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
