export async function postComment(url, commentText) {
  try {
    const token = localStorage.getItem("token");
    const responseComment = {
      method: "POST",
      body: JSON.stringify({
        author_name: localStorage.getItem("username"),
        content: commentText,
      }),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, responseComment);
    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error);
  }
}

/**
 * @function attachCommentEventListener
 * @description Attach the comment event listener to the specified post.
 *
 * @param {string} postId - The ID of the post to attach the listener to.
 */
export function attachCommentEventListener(postId) {
  const commentBtn = document.querySelector(`#sendCommentBtn_${postId}`);
  const commentInput = document.querySelector(`#commentInput_${postId}`);

  commentBtn.addEventListener("click", () => {
    const commentText = commentInput.value;
    if (commentText.trim() !== "") {
      const commentUrl = `https://backendtest.local/wp-json/wp/v2/comments?post=${postId}`;
      postComment(commentUrl, commentText);
    }
  });
}
