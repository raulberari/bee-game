class Bee {
  constructor(hp, type, damage) {
    this.hp = hp;
    this.type = type;
    this.damage = damage;
  }

  receiveDamage() {
    this.hp -= this.damage;
    if (this.hp <= 0) {
      this.hp = 0;
    }
  }
}

class Queen extends Bee {
  constructor() {
    super(100, "Queen", 8);
  }
}

class Worker extends Bee {
  constructor() {
    super(75, "Worker", 10);
  }
}

class Drone extends Bee {
  constructor() {
    super(50, "Drone", 12);
  }
}

class Game {
  constructor() {
    window.addEventListener("DOMContentLoaded", (event) => {
      this.hitButton = document.getElementById("hit-button");
      this.hitButton.addEventListener("click", this.hitBee.bind(this));

      this.editNameButton = document.getElementById("edit-name-button");
      this.playerNameDisplay = document.getElementById("player-name-display");
      this.playerNameInput = document.getElementById("player-name-input");

      this.editNameButton.addEventListener(
        "click",
        this.toggleNameInput.bind(this)
      );
      this.playerNameInput.addEventListener(
        "blur",
        this.updatePlayerName.bind(this)
      );

      const savedPlayerName = localStorage.getItem("playerName");
      if (savedPlayerName) {
        this.playerNameDisplay.innerHTML = savedPlayerName;
      }

      this.restartButton = document.getElementById("restart-button");
      this.restartButton.addEventListener(
        "click",
        this.restartToDefault.bind(this)
      );

      this.init();
    });
  }

  init() {
    const savedBeesState = localStorage.getItem("beesState");
    if (savedBeesState) {
      this.bees = [];
      JSON.parse(savedBeesState).forEach((bee) => {
        this.bees.push(new Bee(bee.hp, bee.type, bee.damage));
      });
    } else {
      this.initDefaultBees();
    }
    document.getElementById("ongoing-game").style.display = "flex";
    document.getElementById("end-game").style.display = "none";
    document.getElementById("hit-info").style.display = "none";

    this.updateBeesUI();
  }

  initDefaultBees() {
    this.bees = [];
    this.bees.push(new Queen());

    for (let i = 0; i < 5; i++) {
      this.bees.push(new Worker());
    }

    for (let i = 0; i < 8; i++) {
      this.bees.push(new Drone());
    }
  }

  restartToDefault() {
    this.initDefaultBees();

    document.getElementById("ongoing-game").style.display = "flex";
    document.getElementById("end-game").style.display = "none";
    document.getElementById("hit-info").style.display = "none";

    this.updateBeesUI();
  }

  toggleNameInput() {
    this.playerNameDisplay.classList.add("hidden");
    this.playerNameInput.classList.remove("hidden");
    this.playerNameInput.value = this.playerNameDisplay.textContent;
    this.playerNameInput.focus();
  }

  updatePlayerName() {
    this.playerNameDisplay.textContent = this.playerNameInput.value;
    this.playerNameDisplay.classList.remove("hidden");
    this.playerNameInput.classList.add("hidden");

    localStorage.setItem("playerName", this.playerNameInput.value);
  }

  hitBee() {
    this.hitButton.disabled = true;
    this.showLoader();

    setTimeout(() => {
      this.hitButton.disabled = false;
      this.hideLoader();

      const aliveBees = this.bees.filter((bee) => bee.hp > 0);
      const randomBee = aliveBees[Math.floor(Math.random() * aliveBees.length)];
      randomBee.receiveDamage();

      this.updateHitInfo(randomBee);
      this.updateBeesUI();
    }, 400);
  }

  showLoader() {
    const loader = document.createElement("div");
    loader.classList.add("loader");
    this.hitButton.innerHTML = "";
    this.hitButton.appendChild(loader);
  }

  hideLoader() {
    const loader = this.hitButton.querySelector(".loader");
    if (loader) {
      loader.remove();
    }
    this.hitButton.innerHTML = "Hit the Swarm";
  }

  createBeeImgAndAddToContainer(bee) {
    const beeType = bee.type;

    const beeContainer = document.createElement("div");
    beeContainer.className = "bee-container";

    const beeImg = document.createElement("img");
    beeImg.className = "bee-image";
    beeImg.src = `images/${beeType}.png`;

    const beeHealth = document.createElement("div");
    beeHealth.className = "bee-health";
    beeHealth.style.width = `${bee.hp}%`;
    beeHealth.style.backgroundColor = `hsl(${bee.hp},100%,50%)`;

    beeContainer.appendChild(beeImg);
    beeContainer.appendChild(beeHealth);

    const bees = document.getElementById(`${beeType.toLowerCase()}s`);
    bees.appendChild(beeContainer);
  }

  updateHitInfo(bee) {
    const hitInfo = document.getElementById("hit-info");
    hitInfo.style.display = "block";
    hitInfo.innerHTML = `Hit a ${bee.type} with ${bee.damage} damage. Current HP: ${bee.hp}.`;
  }

  updateBeesUI() {
    document.getElementById("queens").innerHTML = "";
    document.getElementById("workers").innerHTML = "";
    document.getElementById("drones").innerHTML = "";

    const aliveBees = this.bees.filter((bee) => bee.hp > 0);
    const isQueenAlive =
      aliveBees.filter((bee) => bee.type === "Queen").length > 0;

    if (!isQueenAlive) {
      // end game state
      document.getElementById("ongoing-game").style.display = "none";
      document.getElementById("end-game").style.display = "flex";
    }

    let totalSwarmHP = 0;

    aliveBees.forEach((bee) => {
      this.createBeeImgAndAddToContainer(bee);

      totalSwarmHP += bee.hp;
    });

    document.getElementById("total-hp").innerHTML = `${totalSwarmHP}`;
    localStorage.setItem("beesState", JSON.stringify(this.bees));
  }
}

const game = new Game();
module.exports = { Game, Bee, Queen, Worker, Drone };
