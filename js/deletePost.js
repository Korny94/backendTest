export async function deletePostFunction(postId) {
  try {
    const token = localStorage.getItem("token");
    const deleteResponse = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(
      `https://backendtest.local/wp-json/wp/v2/posts/${postId}`,
      deleteResponse
    );
    const json = await response.json();
    console.log(json);
    if (response.ok) {
      location.reload();
    } else {
      alert("You do not have permission to delete this post.");
    }
  } catch (error) {
    console.error(error);
  }
}
