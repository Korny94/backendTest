const chat = document.querySelector("#chat");
const messageContainer = document.querySelector("#messageContainer2");
messageContainer.style.display = "none";

let chatOpen = false;

chat.addEventListener("click", () => {
  if (chatOpen) {
    chatOpen = false;
    messageContainer.style.display = "none";
  } else {
    chatOpen = true;
    messageContainer.style.display = "flex";
    getMessagesByUsernameInTitle();
  }
});

import { attachCommentEventListener } from "../postComment.js";

async function getMessagesByUsernameInTitle() {
  const apiUrl =
    "https://backendtest.local/wp-json/wp/v2/message?_embed=true&per_page=100";
  const token = localStorage.getItem("token");

  try {
    const usernamePosts = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(apiUrl, usernamePosts);
    const posts = await response.json();

    // Filter the matching posts
    const username = localStorage.getItem("username");
    const otherProfileName = localStorage.getItem("otherProfileName");
    const matchingPosts = posts.filter(
      (post) =>
        post.title.rendered.toLowerCase().includes(username.toLowerCase()) &&
        post.title.rendered
          .toLowerCase()
          .includes(otherProfileName.toLowerCase())
    );

    displaySortedPosts(matchingPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

function displaySortedPosts(matchingPosts) {
  messageContainer.innerHTML = ""; // Clear existing content

  matchingPosts.forEach((post) => {
    const postContainer = document.createElement("div"); // Create a new container for each post
    postContainer.classList.add("messagesContainer"); // Add a class to the container

    const comments =
      post._embedded && post._embedded.replies && post._embedded.replies[0]
        ? post._embedded.replies[0]
        : [];

    let commentHTML = "";
    comments.sort((commentA, commentB) => {
      const commentDateA = commentA.date; // Assuming date is available in the comments
      const commentDateB = commentB.date;

      // Compare comments based on the commentDate
      return new Date(commentDateA) - new Date(commentDateB);
    });

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

    const msgTitle = post.title.rendered;

    postContainer.innerHTML = DOMPurify.sanitize(`
              <div class="modal d-flex position-relative allMessageModal" tabindex="-1">
                  <div class="modal-dialog" id="modalDialog">
                      <div class="modal-content postModal pt-3">
                          <div class="modal-comments pb-3"  style="background-color: rgba(255, 255, 255, 0.931)" id="messageComments">
                              ${commentHTML}
                          </div>
                          <div class="modal-footer mb-1" style="background-color: rgba(255, 255, 255, 0.931)"  id="messageFooter">
                              <textarea class="commentInput" id="commentInput_${postId}" placeholder="${msgTitle}"></textarea>
                              <img class="sendMessage" id="sendCommentBtn_${postId}" src="../assets/send.png" alt="Send" />
                          </div>
                      </div>
                  </div>
              </div>
          `);
    const modalComments = postContainer.querySelector("#messageComments");

    if (modalComments) {
      setTimeout(() => {
        modalComments.scrollTop = modalComments.scrollHeight;
      }, 500);
    }
    messageContainer.appendChild(postContainer); // Append each post container to the main container
    attachCommentEventListener(postId);
  });
}
