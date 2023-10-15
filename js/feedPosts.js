const postsContainer = document.querySelector("#postsContainer");

async function fetchPosts() {
  try {
    const token = localStorage.getItem("token");
    const postsResponse = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(
      `https://backendtest.local/wp-json/wp/v2/posts?_embed=true`,
      postsResponse
    );
    const json = await response.json();
    console.log(json);

    json.forEach((post) => {
      const postContainer = document.createElement("div"); // Create a new container for each post
      postContainer.classList.add("postContainer"); // Add a class to the container
      const repliesCount =
        post._embedded.replies && post._embedded.replies[0]
          ? post._embedded.replies[0].length
          : 0;

      const imageProfile = post._embedded.author[0].avatar_urls[24]
        ? post._embedded.author[0].avatar_urls[24]
        : "../assets/logo.png";

      const comments =
        post._embedded.replies && post._embedded.replies[0]
          ? post._embedded.replies[0]
          : [];
      let commentHTML = "";
      comments.forEach((comment) => {
        commentHTML += `
            <div class="modal-comment border m-3 p-2">
                <div class="d-flex align-items-center ms-2 mt-1">
                    <img class="modal-profile-image me-2" src="${imageProfile}" alt="Profile Image" />
                    <h6 class="modal-comment-name m-0">${comment.author_name}:</h6>
                </div>

                <div class="m-2 mb-0">
                    ${comment.content.rendered}
                </div>
            </div>
            `;
      });

      postContainer.innerHTML = DOMPurify.sanitize(`
      <div class="modal d-flex position-relative" tabindex="-1">
        <div class="modal-dialog ">
            <div class="modal-content postModal">
                <div class="modal-header ms-2 me-3 mt-1">
                    <img class="modal-profile-image me-2" src="${imageProfile}" alt="" />
                    <h5 class="modal-name m-0">${post._embedded.author[0].name}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-image">
                    <img id="modalImage" src="${post._embedded["wp:featuredmedia"][0].source_url}" alt="" />
                </div>
                <div class="modal-title m-3">
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
                <div class="modal-footer m-3 mb-1">
                    <textarea class="commentInput" placeholder="Add a comment..."></textarea>
                    <img class="sendComment" src="../assets/send.png" alt="Send" />
                </div>
            </div>
        </div>
      </div>
        `);
      postsContainer.appendChild(postContainer); // Append each post container to the main container
    });
  } catch (error) {
    console.error(error);
  }
}

fetchPosts();
