const versus = document.querySelector("#versus");
const score = document.querySelector("#score");
const rock = document.querySelector("#rock");
const paper = document.querySelector("#paper");
const scissors = document.querySelector("#scissors");
const myChoice = document.querySelector("#myChoice");
const ready = document.querySelector("#ready");
const token = localStorage.getItem("token");
const matchId = localStorage.getItem("matchId");
const loader = document.querySelector("#loader");
const waitingOn = document.querySelector("#waitingOn");
const choicesContainer = document.querySelector("#choicesContainer");
const player1choice = localStorage.getItem("player1choice");
const player2choice = localStorage.getItem("player2choice");

function choices(choice) {
  const choiceName = choice.getAttribute("alt");
  myChoice.innerHTML = DOMPurify.sanitize(`
        <img style="width: 80px" src="../assets/${choiceName}.png" alt="${choiceName}" id="chosen">
    `);
}

rock.addEventListener("click", () => {
  choices(rock);
});

paper.addEventListener("click", () => {
  choices(paper);
});

scissors.addEventListener("click", () => {
  choices(scissors);
});

ready.addEventListener("click", () => {
  const chosen = document.querySelector("#chosen").alt;
  localStorage.setItem("chosen", chosen);
  const username = localStorage.getItem("username");
  const otherProfileName = localStorage.getItem("otherProfileName");
  const player1 = localStorage.getItem("player1");
  const player2 = localStorage.getItem("player2");
  const id = localStorage.getItem("id");

  const url = `https://backendtest.local/wp-json/wp/v2/game1/${matchId}`;

  if (player1 === id) {
    const gameResponse = {
      method: "PUT",
      body: JSON.stringify({
        acf: {
          player1choice: chosen,
          player1ready: true,
        },
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    fetch(url, gameResponse);
    localStorage.setItem("player1ready", true);
    setTimeout(() => {
      location.reload();
    }, 1000);
  }
  if (player2 === id) {
    const gameResponse = {
      method: "PUT",
      body: JSON.stringify({
        acf: {
          player2choice: chosen,
          player2ready: true,
        },
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    fetch(url, gameResponse);
    localStorage.setItem("player2ready", true);
    setTimeout(() => {
      location.reload();
    }, 1000);
  }
});

async function createMatch() {
  try {
    const url = "https://backendtest.local/wp-json/wp/v2/game1";
    const username = localStorage.getItem("username");
    const otherProfileName = localStorage.getItem("otherProfileName");
    const otherProfile = localStorage.getItem("otherProfile");

    const gameResponse = {
      method: "POST",
      body: JSON.stringify({
        title: username + " VS. " + otherProfileName,
        status: "publish",
        acf: {
          additional_users: otherProfile,
        },
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, gameResponse);
    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error);
  }
}

async function getMatches() {
  try {
    const url = "https://backendtest.local/wp-json/wp/v2/game1?_embed=true";
    const username = localStorage.getItem("username");
    const otherProfileName = localStorage.getItem("otherProfileName");
    const player1 = localStorage.getItem("player1");
    const player2 = localStorage.getItem("player2");
    const id = localStorage.getItem("id");

    const gameResponse = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, gameResponse);
    const posts = await response.json();
    loader.classList.remove("loader");

    console.log(posts);
    localStorage.setItem("matchId", posts[0].id);
    localStorage.setItem("player1", posts[0].author);
    localStorage.setItem("player2", posts[0].acf.additional_users);

    // Filter the matching posts
    const matchingPosts = posts.filter((post) => {
      if (
        post.title.rendered.toLowerCase().includes(username.toLowerCase()) &&
        post.title.rendered
          .toLowerCase()
          .includes(otherProfileName.toLowerCase())
      ) {
        return true;
      } else {
        return false;
      }
    });
    // Check if there are matching posts
    if (matchingPosts.length > 0) {
      console.log(matchingPosts);
      localStorage.setItem("player1choice", matchingPosts[0].acf.player1choice);
      localStorage.setItem("player2choice", matchingPosts[0].acf.player2choice);
    } else {
      // No posts contain both usernames
      console.log("match not found");
      createMatch();
    }
    versus.innerHTML = DOMPurify.sanitize(`
${username} - ${otherProfileName}
`);
    score.innerHTML = DOMPurify.sanitize(`
    <div class="d-flex scoreboard">
    <h2>${matchingPosts[0].acf.score1}</h2>
    <h2>${matchingPosts[0].acf.score2}</h2>
    </div>
    `);

    if (
      matchingPosts[0].acf.player1ready === true &&
      matchingPosts[0].acf.player2ready === true
    ) {
      if (
        (player1choice === "rock" && player2choice === "scissors") ||
        (player1choice === "paper" && player2choice === "rock") ||
        (player1choice === "scissors" && player2choice === "paper")
      ) {
        console.log("Player 1 Wins!");
        waitingOn.innerHTML = DOMPurify.sanitize(`
        ${username} Wins!     
        `);
      } else if (
        (player1choice === "rock" && player2choice === "paper") ||
        (player1choice === "paper" && player2choice === "scissors") ||
        (player1choice === "scissors" && player2choice === "rock")
      ) {
        console.log("Player 2 Wins!");
        waitingOn.innerHTML = DOMPurify.sanitize(`
        ${otherProfileName} Wins!
        `);
      } else if (player1choice === player2choice) {
        console.log("Draw!");
        waitingOn.innerHTML = DOMPurify.sanitize(`
        Draw! Wait for new game 
        `);
        setTimeout(() => {
          newGame();
        }, 3000);
      }

      localStorage.setItem("player1ready", false);
    } else if (player1 === id && matchingPosts[0].acf.player1ready === true) {
      console.log("Waiting for player 2");
      waitingOn.innerHTML = DOMPurify.sanitize(
        `Waiting on ${otherProfileName}`
      );
      loader.classList.add("loader");

      choicesContainer.style.opacity = "0";
      ready.style.display = "none";

      setTimeout(() => {
        location.reload();
      }, 5000);
    } else if (player2 === id && matchingPosts[0].acf.player2ready === true) {
      waitingOn.innerHTML = DOMPurify.sanitize(
        `Waiting on ${otherProfileName}`
      );
      loader.classList.add("loader");

      choicesContainer.style.opacity = "0";
      ready.style.display = "none";
    } else {
      console.log("Waiting on you");
    }
  } catch (error) {
    console.error(error);
  }
}

getMatches();

async function newGame() {
  localStorage.removeItem("player1choice");
  localStorage.removeItem("player2choice");
  const newGameResponse = {
    method: "PUT",
    body: JSON.stringify({
      acf: {
        player1ready: false,
        player2ready: false,
      },
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(
    `https://backendtest.local/wp-json/wp/v2/game1/${matchId}`,
    newGameResponse
  );
  const json = await response.json();
  console.log(json);
  setTimeout(() => {
    location.reload();
  }, 4000);
}
