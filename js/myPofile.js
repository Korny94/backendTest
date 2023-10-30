const avatarImg = document.querySelector("#avatarImg");
const bannerImg = document.querySelector("#bannerImg");
const profileTitle = document.querySelector("#profileTitle");
import { deletePostFunction } from "../js/deletePost.js";

const myPostsContainer = document.querySelector("#myPostsContainer");
import { attachCommentEventListener } from "../js/postComment.js";
import { postReaction } from "../js/reactions.js";
import { addReactionListeners } from "../js/reactions.js";
import { getReactionCounts } from "../js/reactions.js";

async function fetchProfile() {
  try {
    const token = localStorage.getItem("token");
    const profileResponse = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(
      `https://backendtest.local/wp-json/wp/v2/users/me`,
      profileResponse
    );
    const json = await response.json();
    console.log(json);
    localStorage.setItem("id", json.id);

    const bannerUrl = json.description;

    bannerImg.src = bannerUrl ? bannerUrl : "../assets/bannerNoImg.png";

    // Define an array of supported image file extensions
    const supportedExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".svg",
      ".bmp",
      ".tiff",
      ".tif",
      ".ico",
    ];

    // Function to check if the URL ends with a supported extension
    function endsWithSupportedExtension(url) {
      return supportedExtensions.some((ext) => url.toLowerCase().endsWith(ext));
    }

    if (bannerUrl && endsWithSupportedExtension(bannerUrl)) {
      // Set the image URL to the valid image URL
      bannerImg.src = bannerUrl;
    } else {
      // Set a fallback image URL
      bannerImg.src = "../assets/bannerNoImg.jpg";
    }

    const avatarUrl = json.url;
    avatarImg.src = avatarUrl ? avatarUrl : "../assets/avatarNoImg.png";

    if (avatarUrl && endsWithSupportedExtension(avatarUrl)) {
      // Set the image URL to the valid image URL
      avatarImg.src = avatarUrl;
    } else {
      // Set a fallback image URL
      avatarImg.src = "../assets/avatarNoImg.png";
    }

    profileTitle.innerHTML = json.name + "'s Profile";
  } catch (error) {
    console.error(error);
  }
}

fetchProfile();

async function fetchPosts() {
  try {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const postsResponse = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(
      `https://backendtest.local/wp-json/wp/v2/posts?_embed=true&id=${id}`,
      postsResponse
    );
    const json = await response.json();
    console.log(json);

    const loader = document.querySelector("#loader");
    loader.classList.remove("loader");

    json.forEach((post) => {
      const postContainer = document.createElement("div"); // Create a new container for each post
      postContainer.classList.add("postContainer"); // Add a class to the container
      const repliesCount =
        post._embedded.replies && post._embedded.replies[0]
          ? post._embedded.replies[0].length
          : 0;

      const imageProfile = post._embedded.author[0].url
        ? post._embedded.author[0].url
        : "../assets/avatarNoImg.png";

      const comments =
        post._embedded.replies && post._embedded.replies[0]
          ? post._embedded.replies[0]
          : [];
      let commentHTML = "";
      comments.forEach((comment) => {
        const commentName = comment.author_name;
        commentHTML += `
        <div class="modal-comment border m-3 p-2">
        <div title="${commentName}" class="profileLink d-flex align-items-center ms-2 mt-1">
            <h6 class="modal-comment-name m-0 ms-3 mt-2">${comment.author_name}:</h6>
        </div>

        <div class="m-2 mb-0 ms-4">
            ${comment.content.rendered}
        </div>
    </div>
    `;
      });

      const postId = post.id;
      const imageUrl = post.meta.footnotes
        ? post.meta.footnotes
        : "../assets/noPostImg.jpg";

      console.log(imageUrl);

      const postAuthor = post._embedded.author[0].name;

      postContainer.innerHTML = DOMPurify.sanitize(`
        <div class="modal d-flex position-relative" tabindex="-1">
          <div class="modal-dialog ">
              <div class="modal-content postModal">
                  <div class="modal-header ms-2 me-3 mt-1">
                  <div class="profileLink" id="otherProfile" title="${post.author}">
                      <img class="modal-profile-image me-2" src="${imageProfile}" alt="" />
                      <h5 class="modal-name m-0">${post._embedded.author[0].name}</h5>
                  </div>
                      <button type="button" class="btn-close" alt="${postAuthor}" title="${post.id}" id="deletePost" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-image">
                    <img id="modalImage" src="${imageUrl}" alt="" />
                  </div>
                  <div>
                      <div class="modal-reactionCount" id="modalReactionCount_${postId}">
                      </div>
                  </div>
                  <div class="modal-title m-3 mt-0">
                      <h5 class="text-center m-0">${post.title.rendered}</h5>
                  </div>
                  <div class="modal-body ms-4 me-4">
                      ${post.excerpt.rendered}
                  </div>
                  <div class="modal-commentCount">
                      <h6 class="text-center">Comments (${repliesCount})</h6>
                  </div>
                  <div class="modal-comments">
                     ${commentHTML}
                  </div>
                  <div class="modal-footer mb-1">
                      <div class="modal-reactions mb-3 d-flex justify-content-around">
                          <img class="modal-reaction" title="Like" alt="like" id="like_${postId}" src="../assets/thumbsUp.png" alt="Thumbs Up" />
                          <img class="modal-reaction" title="Dislike" alt="dislike" id="dislike_${postId}" src="../assets/thumbsDown.png" alt="Thumbs Down" />
                          <img class="modal-reaction" title="Love" alt="love" id="love_${postId}" src="../assets/heart.png" alt="Heart" />
                          <img class="modal-reaction" title="Haha" alt="haha" id="haha_${postId}" src="../assets/laugh.png" alt="Laugh" />
                          <img class="modal-reaction" title="Wow" alt="wow" id="wow_${postId}" src="../assets/surprised.png" alt="Surprised" />
                          <img class="modal-reaction" title="Sad" alt="sad" id="sad_${postId}" src="../assets/cry.png" alt="Cry" />
                          <img class="modal-reaction" title="Angry" alt="angry" id="angry_${postId}" src="../assets/angry.png" alt="Angry" />
                      </div>
                      <textarea class="commentInput" id="commentInput_${postId}" placeholder="Add a comment..."></textarea>
                      <img class="sendComment" id="sendCommentBtn_${postId}" src="../assets/send.png" alt="Send" />
                  </div>
              </div>
          </div>
        </div>
          `);

      const deletePost = postContainer.querySelector("#deletePost");
      deletePost.onclick = function () {
        const postId = deletePost.getAttribute("title");
        const postAuthor = deletePost.getAttribute("alt");
        if (postAuthor === localStorage.getItem("username")) {
          deletePostFunction(postId);
        } else {
          alert("You can only delete your own posts.");
        }
      };

      const otherProfile = postContainer.querySelector("#otherProfile");
      otherProfile.onclick = function () {
        const owner = otherProfile.getAttribute("title");

        localStorage.setItem("otherProfile", owner);
        const username = localStorage.getItem("username");

        let url;
        if (username === owner) {
          url = "../html/myProfile.html";
        } else {
          url = "../html/profile.html";
        }

        // Redirect to the appropriate page
        setTimeout(() => {
          window.location.href = url;
        }, 1000);
      };

      myPostsContainer.appendChild(postContainer); // Append each post container to the main container
      attachCommentEventListener(postId);
      addReactionListeners(postId, postReaction);
      const modalReactionCount = document.querySelector(
        `#modalReactionCount_${postId}`
      );

      getReactionCounts(postId, modalReactionCount);
    });
    setTimeout(() => {
      const scrollPosition = localStorage.getItem("scrollPosition");
      window.scrollTo(0, scrollPosition);
    }, 1000);
    setTimeout(() => {
      localStorage.removeItem("scrollPosition");
    }, 3000);
  } catch (error) {
    console.error(error);
  }
}

fetchPosts();

async function editBanner(bannerUrl) {
  try {
    const token = localStorage.getItem("token");
    const editResponse = {
      method: "PUT",
      body: JSON.stringify({
        description: bannerUrl,
      }),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(
      `https://backendtest.local/wp-json/wp/v2/users/me/`,
      editResponse
    );
    const json = await response.json();
    console.log(json);

    if (response.ok) {
      location.reload();
    }
  } catch (error) {
    console.error(error);
  }
}

bannerImg.addEventListener("click", () => {
  const bannerUrl = prompt("Enter new banner-image URL");
  if (!bannerUrl) {
    return;
  }
  editBanner(bannerUrl);
});

async function editAvatar(avatarUrl) {
  try {
    const token = localStorage.getItem("token");
    const editResponse = {
      method: "PUT",
      body: JSON.stringify({
        url: avatarUrl,
      }),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(
      `https://backendtest.local/wp-json/wp/v2/users/me/`,
      editResponse
    );
    const json = await response.json();
    console.log(json);
    if (response.ok) {
      location.reload();
    }
  } catch (error) {
    console.error(error);
  }
}

avatarImg.addEventListener("click", () => {
  const avatarUrl = prompt("Enter new profile-image URL");
  if (!avatarUrl) {
    return;
  }
  editAvatar(avatarUrl);
});
