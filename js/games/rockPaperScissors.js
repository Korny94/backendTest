const versus = document.querySelector("#versus");
const score = document.querySelector("#score");
const rock = document.querySelector("#rock");
const paper = document.querySelector("#paper");
const scissors = document.querySelector("#scissors");
const myChoice = document.querySelector("#myChoice");
const ready = document.querySelector("#ready");
const token = localStorage.getItem("token");
const loader = document.querySelector("#loader");
const waitingOn = document.querySelector("#waitingOn");
const choicesContainer = document.querySelector("#choicesContainer");
const question = document.querySelector("#question");
const choicesDiv = document.querySelector("#choices");
const otherProfileName = localStorage.getItem("otherProfileName");
const otherProfile = localStorage.getItem("otherProfile");
const username = localStorage.getItem("username");

async function getMatches() {
  waitingOn.style.color = "green";

  try {
    const url =
      "https://karlmagnusnokling.no/haley/wp-json/wp/v2/game1?_embed=true";

    const gameResponse = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, gameResponse);
    const posts = await response.json();
    posts.forEach((post) => {
      const postId = post.id;
      const author = post.author;
      const additionalUsers = post.acf.additional_users;
      localStorage.setItem("matchId", postId.toString());
      localStorage.setItem("player1", author.toString());
      localStorage.setItem("player2", additionalUsers.toString());
    });
    loader.classList.remove("loader");

    console.log(posts);

    // Filter the matching posts
    const matchingPosts = posts.filter((post) => {
      if (
        (post.title.rendered.toLowerCase().includes(username.toLowerCase()) &&
          post._embedded.author[0].name
            .toLowerCase()
            .includes(otherProfileName.toLowerCase())) ||
        (post.title.rendered
          .toLowerCase()
          .includes(otherProfileName.toLowerCase()) &&
          post._embedded.author[0].name
            .toLowerCase()
            .includes(username.toLowerCase()))
      ) {
        return true;
      } else {
        return false;
      }
    });
    // Check if there are matching posts
    if (matchingPosts.length > 0) {
      console.log(matchingPosts);
      localStorage.setItem("matchId", matchingPosts[0].id.toString());
      localStorage.setItem("player1", matchingPosts[0].author.toString());
      localStorage.setItem(
        "player2",
        matchingPosts[0].acf.additional_users.toString()
      );
    } else {
      // No posts contain both usernames
      console.log("match not found");
      createMatch();
    }
    versus.innerHTML = DOMPurify.sanitize(`
  ${matchingPosts[0]._embedded.author[0].name} - ${matchingPosts[0].title.rendered}
  `);
    score.innerHTML = DOMPurify.sanitize(`
      <div class="d-flex scoreboard">
      <h2>${matchingPosts[0].acf.score1}</h2>
      <h2>${matchingPosts[0].acf.score2}</h2>
      </div>
      `);

    const id = localStorage.getItem("id");
    const player1 = localStorage.getItem("player1");
    const player2 = localStorage.getItem("player2");
    if (
      matchingPosts[0].acf.player1ready === true &&
      matchingPosts[0].acf.player2ready === true
    ) {
      choicesDiv.style.display = "none";
      ready.style.display = "none";

      const pointPlayer1 = matchingPosts[0].acf.score1;
      const pointPlayer2 = matchingPosts[0].acf.score2;
      const point1 = pointPlayer1 + 1;
      const point2 = pointPlayer2 + 1;
      const player1choice = matchingPosts[0].acf.player1choice;
      const player2choice = matchingPosts[0].acf.player2choice;
      if (player1 === id) {
        question.src = `../assets/${player2choice}.png`;
        question.style.transform = "scaleX(-1)";
        myChoice.innerHTML = DOMPurify.sanitize(`
          <img style="height: 80px" src="../assets/${player1choice}.png" alt="${player1choice}" id="chosen">
          `);
      } else {
        question.src = `../assets/${player1choice}.png`;
        question.style.transform = "scaleX(-1)";
        myChoice.innerHTML = DOMPurify.sanitize(`
          <img style="height: 80px" src="../assets/${player2choice}.png" alt="${player2choice}" id="chosen">
          `);
      }
      if (
        (player1choice === "rock" && player2choice === "scissors") ||
        (player1choice === "paper" && player2choice === "rock") ||
        (player1choice === "scissors" && player2choice === "paper")
      ) {
        if (player1 === id) {
          console.log("Player 1 Wins!");
          waitingOn.classList.add("mb-5");
          choicesContainer.style.opacity = "1";

          waitingOn.innerHTML = DOMPurify.sanitize(`
          ${username} Wins!     
          `);
          setTimeout(() => {
            newGame(point1, pointPlayer2);
          }, 3000);
        } else {
          console.log("Player 2 Wins!");
          waitingOn.classList.add("mb-5");
          choicesContainer.style.opacity = "1";

          waitingOn.innerHTML = DOMPurify.sanitize(`
              ${otherProfileName} Wins!
              `);
          setTimeout(() => {
            newGame(point1, pointPlayer2);
          }, 3000);
        }
      } else if (
        (player1choice === "rock" && player2choice === "paper") ||
        (player1choice === "paper" && player2choice === "scissors") ||
        (player1choice === "scissors" && player2choice === "rock")
      ) {
        if (player1 === id) {
          console.log("Player 2 Wins!");
          choicesContainer.style.opacity = "1";

          waitingOn.classList.add("mb-5");
          waitingOn.innerHTML = DOMPurify.sanitize(`
                  ${otherProfileName} Wins! Wait for a new game
                  `);
          setTimeout(() => {
            newGame(pointPlayer1, point2);
          }, 3000);
        } else {
          console.log("Player 1 Wins!");
          choicesContainer.style.opacity = "1";

          waitingOn.classList.add("mb-5");
          waitingOn.innerHTML = DOMPurify.sanitize(`
              ${username} Wins! Wait for a new game
              `);
          setTimeout(() => {
            newGame(pointPlayer1, point2);
          }, 3000);
        }
      } else if (player1choice === player2choice) {
        console.log("Draw!");
        waitingOn.classList.add("mb-5");
        choicesContainer.style.opacity = "1";

        waitingOn.innerHTML = DOMPurify.sanitize(`
          Draw! Wait for a new game 
          `);
        setTimeout(() => {
          newGame(pointPlayer1, pointPlayer2);
        }, 3000);
      }

      localStorage.setItem("player1ready", false);
    } else if (player1 === id && matchingPosts[0].acf.player1ready === true) {
      choicesDiv.style.display = "none";
      ready.style.display = "none";

      console.log("Waiting for player 2");
      waitingOn.innerHTML = DOMPurify.sanitize(
        `Waiting on ${otherProfileName}`
      );
      loader.classList.add("loader");
      // setTimeout(() => {
      //   location.reload();
      // }, 3000);
      setInterval(() => {
        getMatches();
      }, 1000);

      choicesContainer.style.opacity = "0";
      ready.style.display = "none";
    } else if (player2 === id && matchingPosts[0].acf.player2ready === true) {
      choicesDiv.style.display = "none";
      ready.style.display = "none";

      waitingOn.innerHTML = DOMPurify.sanitize(
        `Waiting on ${otherProfileName}`
      );
      loader.classList.add("loader");
      choicesContainer.style.opacity = "0";
      ready.style.display = "none";
      // setTimeout(() => {
      //   location.reload();
      // }, 3000);
      setInterval(() => {
        getMatches();
      }, 1000);
    } else {
      console.log("Waiting on you");
    }
  } catch (error) {
    console.error(error);
  }
}

getMatches();

function choices(choice) {
  ready.classList.remove("disabled");
  const choiceName = choice.getAttribute("alt");
  myChoice.innerHTML = DOMPurify.sanitize(`
        <img style="height: 100px" src="../assets/${choiceName}.png" alt="${choiceName}" id="chosen">
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
  const id = localStorage.getItem("id");
  const player2 = localStorage.getItem("player2");
  const player1 = localStorage.getItem("player1");
  ready.style.display = "none";
  choicesDiv.style.display = "none";
  const chosen = document.querySelector("#chosen").alt;
  localStorage.setItem("chosen", chosen);
  const matchId = localStorage.getItem("matchId");

  const matchIdString = matchId.toString();
  console.log(typeof matchIdString);

  const url = `https://karlmagnusnokling.no/haley/wp-json/wp/v2/game1/${matchIdString}`;

  console.log(typeof player1.toString(), typeof id.toString());

  if (player1.toString() == id.toString()) {
    localStorage.setItem("player1ready", true);

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

    setTimeout(() => {
      location.reload();
    }, 100);
  }

  console.log(typeof player2.toString(), typeof id.toString());

  if (player2.toString() == id.toString()) {
    localStorage.setItem("player2ready", true);

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
    getMatches();

    setTimeout(() => {
      location.reload();
    }, 500);
  }
});

async function createMatch() {
  try {
    const url =
      "https://karlmagnusnokling.no/haley/wp-json/wp/v2/game1?_embed=true";

    const gameResponse = {
      method: "POST",
      body: JSON.stringify({
        title: otherProfileName,
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
    const jsonId = json.id;
    const author = json.author;
    const additionalUsers = json.acf.additional_users;
    localStorage.setItem("matchId", jsonId.toString());
    localStorage.setItem("player1", author.toString());
    localStorage.setItem("player2", additionalUsers.toString());
    setTimeout(() => {
      location.reload();
    }, 500);
  } catch (error) {
    console.error(error);
  }
}

async function newGame(point1, point2) {
  const newGameResponse = {
    method: "PUT",
    body: JSON.stringify({
      acf: {
        player1ready: false,
        player2ready: false,
        score1: point1,
        score2: point2,
      },
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const matchId = localStorage.getItem("matchId");
  const matchIdString = matchId.toString();

  const response = await fetch(
    `https://karlmagnusnokling.no/haley/wp-json/wp/v2/game1/${matchIdString}`,
    newGameResponse
  );
  const json = await response.json();
  console.log(json);
  setTimeout(() => {
    location.reload();
  }, 2500);
}
