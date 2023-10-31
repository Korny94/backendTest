const userModalBody = document.querySelector("#userModalBody2");
import { attachCommentEventListener } from "./postComment.js";

async function getUsers() {
  try {
    const token = localStorage.getItem("token");
    const userResponse = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(
      "https://karlmagnusnokling.no/haley/wp-json/wp/v2/users",
      userResponse
    );
    const json = await response.json();
    console.log(json);

    json.forEach((element) => {
      const userAvatar = element.url
        ? element.url
        : "../assets/avatarNoImg.png";

      console.log(element);
      const userModal = document.createElement("div");
      userModal.classList.add("userModal");
      userModal.innerHTML += DOMPurify.sanitize(`

          <div class="d-flex align-items-center gap-3 userModalLink2" title="${element.id}" id="user_${element.id}">
              <img class="userModalImg" src="${userAvatar}" alt="User avatar">
              <h5 class="userModalName">${element.name}</h5>
          </div>
          `);
      userModalBody.appendChild(userModal);
      const messageProfile = userModalBody.querySelector(`#user_${element.id}`);

      messageProfile.onclick = function () {
        localStorage.setItem("otherProfile", element.id);
        localStorage.setItem("otherProfileName", element.name);
        getSpecificMessage();
      };
    });
  } catch (error) {
    console.error(error);
  }
}

getUsers();

async function createMessage() {
  try {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const otherProfile = localStorage.getItem("otherProfile");
    const otherProfileName = localStorage.getItem("otherProfileName");
    const messageResponse = {
      method: "POST",
      body: JSON.stringify({
        title: otherProfileName + " & " + username,
        status: "publish",
        content: "",
        acf: {
          additional_users: otherProfile,
        },
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(
      `https://karlmagnusnokling.no/haley/wp-json/wp/v2/message?_embed=true`,
      messageResponse
    );
    const json = await response.json();

    location.reload();
    console.log(json);
  } catch (error) {
    console.error(error);
  }
}

async function getMessagesByUsernameInTitle() {
  const apiUrl =
    "https://karlmagnusnokling.no/haley/wp-json/wp/v2/message?_embed=true&per_page=100";
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
    const matchingPosts = posts.filter((post) =>
      post.title.rendered.toLowerCase().includes(username.toLowerCase())
    );

    // Sort the matchingPosts by postDate
    const sortedPosts = matchingPosts.sort((postA, postB) => {
      const postDateA = findPostDate(postA); // Get postDate for postA
      const postDateB = findPostDate(postB); // Get postDate for postB

      return new Date(postDateB) - new Date(postDateA); // Sort in descending order
    });

    // Display the sorted posts
    displaySortedPosts(sortedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

function findPostDate(post) {
  let postDate = null;
  if (post._embedded && post._embedded.replies) {
    const replies = post._embedded.replies[0];

    for (let i = 0; i < replies.length; i++) {
      const reply = replies[i];
      if (reply.date) {
        postDate = reply.date;
        break; // Stop searching after finding the first reply with a date
      }
    }
  }

  return postDate;
}

function displaySortedPosts(sortedPosts) {
  const messageContainer = document.querySelector("#messageContainer");
  messageContainer.innerHTML = ""; // Clear existing content

  sortedPosts.forEach((post) => {
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
    const modalCommentsList = document.querySelectorAll(".modal-comments");
    modalCommentsList.forEach((modalComments) => {
      if (modalComments) {
        modalComments.scrollTop = modalComments.scrollHeight;
      }
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
                          <div class="modal-comments pb-2" id="messageComments">
                              ${commentHTML}
                          </div>
                          <div class="modal-footer mb-1" id="messageFooter">
                              <textarea class="commentInput" id="commentInput_${postId}" placeholder="${msgTitle}"></textarea>
                              <img class="sendMessage" id="sendCommentBtn_${postId}" src="../assets/send.png" alt="Send" />
                          </div>
                      </div>
                  </div>
              </div>
          `);

    messageContainer.appendChild(postContainer); // Append each post container to the main container
    attachCommentEventListener(postId);

    // Find the date of the first reply with a date
    let postDate = null;
    if (post._embedded && post._embedded.replies) {
      const replies = post._embedded.replies[0];

      for (let i = 0; i < replies.length; i++) {
        const reply = replies[i];
        if (reply.date) {
          postDate = reply.date;
          break; // Stop searching after finding the first reply with a date
        }
      }
    }

    // Use postDate as needed
    if (postDate) {
      // You can format the date or use it as necessary
      console.log(postDate);
    } else {
      // No posts contain both usernames
      console.log("no message");
    }
  });
}

getMessagesByUsernameInTitle();

async function getSpecificMessage() {
  const apiUrl =
    "https://karlmagnusnokling.no/haley/wp-json/wp/v2/message?_embed=true";
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

    const matchingPosts = posts.filter((post) => {
      const postTitle = post.title.rendered;
      const username = localStorage.getItem("username");
      const otherProfileName = localStorage.getItem("otherProfileName");

      // Check if the post title contains both usernames
      if (
        postTitle.toLowerCase().includes(username.toLowerCase()) &&
        postTitle.toLowerCase().includes(otherProfileName.toLowerCase())
      ) {
        return true; // Include this post in the matchingPosts array
      }

      return false; // Exclude this post from the matchingPosts array
    });

    // Check if there are matching posts
    if (matchingPosts.length > 0) {
      console.log(matchingPosts);
    } else {
      // No posts contain both usernames
      console.log("no message");
      createMessage();
    }

    // Process the matchingPosts array as needed.
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}
