//Componentes, Objetos
const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.querySelector("#score-points"),
  },
  cardSprites: {
    avatar: document.querySelector("#card-img"),
    name: document.querySelector("#card-name"),
    type: document.querySelector("#card-type"),
  },
  fieldCards: {
    player: document.querySelector("#player-card"),
    computer: document.querySelector("#computer-card"),
  },
  actions: {
    button: document.querySelector("#next-duel"),
  },
};

const pathImages = "assets/icons/";

const cardData = [
  {
    id: 0,
    name: "Dragão Branco de Olhos Azuis",
    type: "Papel",
    img: `${pathImages}dragon.png`,
    Winof: [1],
    Loseof: [2],
  },
  {
    id: 1,
    name: "Mago Negro",
    type: "Pedra",
    img: `${pathImages}magician.png`,
    Winof: [2],
    Loseof: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Tesoura",
    img: `${pathImages}exodia.png`,
    Winof: [0],
    Loseof: [1],
  },
];

const playerSide = {
  player1: "player-cards",
  computer: "computer-cards",
};

//Funções
async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "assets/icons/card-back.png");
  cardImage.setAttribute("data-id", IdCard);
  cardImage.classList.add("card");

  if (fieldSide === playerSide.player1) {
    cardImage.addEventListener("mouseover", () => {
      drawSelectCard(IdCard);
    });

    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"));
    });
  }

  return cardImage;
}

async function setCardsField(cardId) {
  await removeAllCardsImages();

  let computerCardId = await getRandomCardId();
  state.fieldCards.player.style.display = "block";
  state.fieldCards.computer.style.display = "block";

  state.cardSprites.avatar.src = "";
  state.cardSprites.name.innerText = "";
  state.cardSprites.type.innerText = "";

  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;

  let duelResults = await checkDuelResults(cardId, computerCardId);

  await updateScore();
  await drawButton(duelResults);
}

async function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = "Draw";
  let playerCard = cardData[playerCardId];

  if (playerCard.Winof.includes(computerCardId)) {
    duelResults = "Win";
    await playAudio(duelResults);
    state.score.playerScore++;
  }

  if (playerCard.Loseof.includes(computerCardId)) {
    duelResults = "Lose";
    await playAudio(duelResults);
    state.score.computerScore++;
  }

  return duelResults;
}

async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function drawButton(text) {
  state.actions.button.innerText = text.toUpperCase();
  state.actions.button.style.display = "block";
}

async function removeAllCardsImages() {
  let cards = document.querySelector("#computer-cards");
  let imgElements = cards.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());

  cards = document.querySelector("#player-cards");
  imgElements = cards.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index) {
  state.cardSprites.avatar.src = cardData[index].img;
  state.cardSprites.name.innerText = cardData[index].name;
  state.cardSprites.type.innerText = "Attribute : " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

async function resetDuel() {
  state.cardSprites.avatar.src = "";
  state.actions.button.style.display = "none";
  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";

  init();
}

async function playAudio(status) {
  const audio = new Audio(`./assets/audios/${status}.wav`);
  audio.play();
}

//função principal
function init() {
  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";
  drawCards(5, playerSide.player1);
  drawCards(5, playerSide.computer);

  const bgm = document.querySelector("#bgm")
  bgm.play()
}
init();
