const avatarImg = document.querySelector("#avatarImg");
const bannerImg = document.querySelector("#bannerImg");
const profileTitle = document.querySelector("#profileTitle");

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
    // const loader = document.querySelector("#loader");
    // loader.classList.remove("loader");

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
