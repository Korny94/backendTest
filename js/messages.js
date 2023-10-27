const userModalBody = document.querySelector("#userModalBody");
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
      "https://backendtest.local/wp-json/wp/v2/users",
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

          <div class="d-flex align-items-center gap-3 userModalLink" title="${element.id}" id="user_${element.id}">
              <img class="userModalImg" src="${userAvatar}" alt="User avatar">
              <h2 class="userModalName">${element.name}</h2>
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
    const otherProfile = localStorage.getItem("otherProfile");
    const otherProfileName = localStorage.getItem("otherProfileName");
    const messageResponse = {
      method: "POST",
      body: JSON.stringify({
        title: otherProfileName,
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
      `https://backendtest.local/wp-json/wp/v2/message?_embed=true`,
      messageResponse
    );
    const json = await response.json();
    console.log(json);

    const messageContainer = document.querySelector("#messageContainer");

    const postContainer = document.createElement("div"); // Create a new container for each post
    postContainer.classList.add("messagesContainer"); // Add a class to the container

    const comments =
      json._embedded.replies && json._embedded.replies[0]
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

    const postId = json.id;

    const msgTitle = json.title.rendered;
    const messages = json.excerpt.rendered ? json.excerpt.rendered : "";

    postContainer.innerHTML = DOMPurify.sanitize(`
      <div class="modal d-flex position-relative allMessageModal" tabindex="-1">
          <div class="modal-dialog" id="modalDialog">
              <div class="modal-content postModal">

                  <div class="modal-title m-5 mb-1 mt-4">
                      <h5 class="text-center m-0">${msgTitle}</h5>
                  </div>
                  <div class="modal-body ms-4 me-4">
                      ${messages}
                  </div>
                  <div class="modal-comments">
                      ${commentHTML}
                  </div>
                  <div class="modal-footer mb-1">
                      <textarea class="commentInput" id="commentInput_${postId}" placeholder="Type a message"></textarea>
                      <img class="sendMessage" id="sendCommentBtn_${postId}" src="../assets/send.png" alt="Send" />
                  </div>
              </div>
          </div>
      </div>
  `);

    messageContainer.appendChild(postContainer); // Append each post container to the main container
    attachCommentEventListener(postId);
  } catch (error) {
    console.error(error);
  }
}

async function getMessagesByUsernameInTitle() {
  const username = localStorage.getItem("username");
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

    const matchingPosts = posts.filter((post) => {
      const myId = localStorage.getItem("id");
      return myId === post.author.toString();
    });

    if (matchingPosts.length > 0) {
      matchingPosts.forEach((post) => {
        const messageContainer = document.querySelector("#messageContainer");

        const postContainer = document.createElement("div"); // Create a new container for each post
        postContainer.classList.add("messagesContainer"); // Add a class to the container

        const comments =
          post._embedded && post._embedded.replies && post._embedded.replies[0]
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

        const msgTitle = post.title.rendered;
        const messages = post.excerpt.rendered ? post.excerpt.rendered : "";

        postContainer.innerHTML = DOMPurify.sanitize(`
              <div class="modal d-flex position-relative allMessageModal" tabindex="-1">
                  <div class="modal-dialog" id="modalDialog">
                      <div class="modal-content postModal">
  
                          <div class="modal-title m-5 mb-1 mt-4">
                              <h5 class="text-center m-0">${msgTitle}</h5>
                          </div>
                          <div class="modal-body ms-4 me-4">
                              ${messages}
                          </div>
                          <div class="modal-comments">
                              ${commentHTML}
                          </div>
                          <div class="modal-footer mb-1">
                              <textarea class="commentInput" id="commentInput_${postId}" placeholder="Type a message"></textarea>
                              <img class="sendMessage" id="sendCommentBtn_${postId}" src="../assets/send.png" alt="Send" />
                          </div>
                      </div>
                  </div>
              </div>
          `);

        messageContainer.appendChild(postContainer); // Append each post container to the main container
        attachCommentEventListener(postId);

        // Find the date of the first reply with a date
        const replies = post._embedded.replies[0];
        let postDate = null;
        if (post._embedded && post._embedded.replies) {
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
          console.log("Post Date:", postDate);
        } else {
          // No posts contain both usernames
          console.log("no message");
        }
      });
    }

    // Process the matchingPosts array as needed.
    console.log(matchingPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

getMessagesByUsernameInTitle();

async function getSpecificMessage() {
  const apiUrl = "https://backendtest.local/wp-json/wp/v2/message?_embed=true";
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
      const myId = localStorage.getItem("id");
      const otherProfileName = localStorage.getItem("otherProfileName");

      // Check if the post title contains both usernames
      if (
        myId == post.author.toString() &&
        postTitle.toLowerCase().includes(otherProfileName.toLowerCase())
      ) {
        return true; // Include this post in the matchingPosts array
      }

      return false; // Exclude this post from the matchingPosts array
    });

    // Check if there are matching posts
    if (matchingPosts.length > 0) {
      //   matchingPosts.forEach((post) => {
      //     const messageContainer = document.querySelector("#messageContainer");
      //     const postContainer = document.createElement("div"); // Create a new container for each post
      //     postContainer.classList.add("messagesContainer"); // Add a class to the container
      //     const comments =
      //       post._embedded && post._embedded.replies && post._embedded.replies[0]
      //         ? post._embedded.replies[0]
      //         : [];
      //     let commentHTML = "";
      //     comments.forEach((comment) => {
      //       const commentName = comment.author_name;
      //       commentHTML += `
      //             <div class="modal-comment border m-3 p-2">
      //                 <div title="${commentName}" class="profileLink d-flex align-items-center ms-2 mt-1">
      //                     <h6 class="modal-comment-name m-0 ms-3 mt-2">${comment.author_name}:</h6>
      //                 </div>
      //                 <div class="m-2 mb-0 ms-4">
      //                     ${comment.content.rendered}
      //                 </div>
      //             </div>
      //         `;
      //     });
      //     const postId = post.id;
      //     const msgTitle = json.title.rendered;
      //     const messages = json.excerpt.rendered
      //       ? json.excerpt.rendered
      //       : "";
      //     postContainer.innerHTML = DOMPurify.sanitize(`
      //       <div class="modal d-flex position-relative allMessageModal" tabindex="-1">
      //           <div class="modal-dialog" id="modalDialog">
      //               <div class="modal-content postModal">
      //                   <div class="modal-title m-5 mb-1 mt-4">
      //                       <h5 class="text-center m-0">${msgTitle}</h5>
      //                   </div>
      //                   <div class="modal-body ms-4 me-4">
      //                       ${messages}
      //                   </div>
      //                   <div class="modal-comments">
      //                       ${commentHTML}
      //                   </div>
      //                   <div class="modal-footer mb-1">
      //                       <textarea class="commentInput" id="commentInput_${postId}" placeholder="Type a message"></textarea>
      //                       <img class="sendMessage" id="sendCommentBtn_${postId}" src="../assets/send.png" alt="Send" />
      //                   </div>
      //               </div>
      //           </div>
      //       </div>
      //   `);
      //     messageContainer.appendChild(postContainer); // Append each post container to the main container
      //     attachCommentEventListener(postId);
      //   });
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
