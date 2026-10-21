const appState = {
  username: "",
  gems: 1250,
  wins: 0,
  losses: 0,
  bioCode: "",
  selectedChoice: "heads",
  coinBet: 50,
  blackjackBet: 100,
  adminUnlocked: false,
  bannedUsers: new Set(),
  currentUser: "",
};

const users = [
  { username: "PixelPaws", gems: 640000 },
  { username: "GemTycoon", gems: 520300 },
  { username: "LuckyFox", gems: 488900 },
  { username: "VelvetCorgi", gems: 446200 },
  { username: "SkyForge", gems: 430500 },
  { username: "GoldPaws", gems: 399100 },
  { username: "CryptoCat", gems: 372400 },
  { username: "RoboRanger", gems: 341700 },
  { username: "MoonWolf", gems: 316000 },
  { username: "PetKing", gems: 294000 },
];

const elements = {
  authPanel: document.getElementById("authPanel"),
  profilePanel: document.getElementById("profilePanel"),
  usernameInput: document.getElementById("usernameInput"),
  codeInput: document.getElementById("codeInput"),
  loginBtn: document.getElementById("loginBtn"),
  robloxLoginBtn: document.getElementById("robloxLoginBtn"),
  linkRobloxBtn: document.getElementById("linkRobloxBtn"),
  quickLoginBtn: document.getElementById("quickLoginBtn"),
  profileName: document.getElementById("profileName"),
  avatarUsername: document.getElementById("avatarUsername"),
  bioCodeDisplay: document.getElementById("bioCodeDisplay"),
  gemsValue: document.getElementById("gemsValue"),
  winsValue: document.getElementById("winsValue"),
  lossesValue: document.getElementById("lossesValue"),
  copyBioCodeBtn: document.getElementById("copyBioCodeBtn"),
  chatBox: document.getElementById("chatBox"),
  chatInput: document.getElementById("chatInput"),
  sendChatBtn: document.getElementById("sendChatBtn"),
  flipBtn: document.getElementById("flipBtn"),
  choiceButtons: document.querySelectorAll(".choice"),
  coinBet: document.getElementById("coinBet"),
  tipUser: document.getElementById("tipUser"),
  tipAmount: document.getElementById("tipAmount"),
  tipBtn: document.getElementById("tipBtn"),
  dealBtn: document.getElementById("dealBtn"),
  hitBtn: document.getElementById("hitBtn"),
  standBtn: document.getElementById("standBtn"),
  houseScore: document.getElementById("houseScore"),
  playerScore: document.getElementById("playerScore"),
  adminKeyInput: document.getElementById("adminKeyInput"),
  unlockAdminBtn: document.getElementById("unlockAdminBtn"),
  adminPanel: document.getElementById("adminPanel"),
  banUserInput: document.getElementById("banUserInput"),
  banBtn: document.getElementById("banBtn"),
  unbanBtn: document.getElementById("unbanBtn"),
  grantUserInput: document.getElementById("grantUserInput"),
  grantAmountInput: document.getElementById("grantAmountInput"),
  grantSelfBtn: document.getElementById("grantSelfBtn"),
  grantPlayerBtn: document.getElementById("grantPlayerBtn"),
  toast: document.getElementById("toast"),
  leaderboardList: document.getElementById("leaderboardList"),
};

function randomCode() {
  return `killer${Math.floor(1000 + Math.random() * 900000)}`;
}

function showToast(msg) {
  elements.toast.textContent = msg;
  elements.toast.classList.remove("hidden");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => {
    elements.toast.classList.add("hidden");
  }, 2200);
}

function updateProfile() {
  elements.profileName.textContent = appState.username || "Guest";
  elements.avatarUsername.textContent = (appState.username || "G").slice(0, 1).toUpperCase();
  elements.bioCodeDisplay.textContent = appState.bioCode || "killer000000";
  elements.gemsValue.textContent = appState.gems.toLocaleString();
  elements.winsValue.textContent = appState.wins;
  elements.lossesValue.textContent = appState.losses;
}

function updateLeaderboard() {
  const list = [...users].sort((a, b) => b.gems - a.gems).slice(0, 10);

  elements.leaderboardList.innerHTML = list.map((user, index) => {
    return `<li><span>#${index + 1}</span> <strong>${user.username}</strong> <em>${user.gems.toLocaleString()}</em></li>`;
  }).join("");
}

function setChoice(choice) {
  appState.selectedChoice = choice;
  elements.choiceButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.choice === choice);
  });
}

function generateBioCode() {
  appState.bioCode = randomCode();
  updateProfile();
  showToast(`Your Roblox bio code is ${appState.bioCode}`);
}

function handleLogin() {
  const username = elements.usernameInput.value.trim();
  if (!username) {
    showToast("Enter your Roblox username first.");
    return;
  }

  appState.username = username;
  appState.currentUser = username;
  appState.bioCode = randomCode();
  appState.gems = Math.max(1250, appState.gems);

  const existing = users.find((user) => user.username === username);
  if (!existing) {
    users.push({ username, gems: appState.gems });
  }

  elements.authPanel.classList.add("hidden");
  elements.profilePanel.classList.remove("hidden");
  elements.profileName.textContent = username;
  updateProfile();
  updateLeaderboard();
  showToast(`Welcome, ${username}!`);
}

function handleRobloxLink() {
  window.open("https://www.roblox.com/login", "_blank", "noopener,noreferrer");
  showToast("Roblox login opened. Return here and paste the bio code after signing in.");
}

function addChatMessage(username, text) {
  const message = document.createElement("div");
  message.className = "chat-message";
  message.innerHTML = `<span class="user">${username}</span> <span>${text}</span>`;
  elements.chatBox.appendChild(message);
  elements.chatBox.scrollTop = elements.chatBox.scrollHeight;
}

function sendChat() {
  const text = elements.chatInput.value.trim();
  if (!text) {
    return;
  }

  if (!appState.username) {
    showToast("Login first to chat.");
    return;
  }

  addChatMessage(appState.username, text);
  elements.chatInput.value = "";
}

function coinFlip() {
  if (!appState.username) {
    showToast("Login first to play.");
    return;
  }

  const bet = Number(elements.coinBet.value);
  if (!bet || bet <= 0 || bet > appState.gems) {
    showToast("Not enough gems for that bet.");
    return;
  }

  const result = Math.random() < 0.5 ? "heads" : "tails";
  const won = result === appState.selectedChoice;
  appState.gems += won ? bet : -bet;
  appState.wins += won ? 1 : 0;
  appState.losses += won ? 0 : 1;

  if (won) {
    showToast(`You won ${bet} gems! ${result.toUpperCase()} hit.`);
  } else {
    showToast(`House wins. ${result.toUpperCase()} came up.`);
  }

  updateProfile();
  updateLeaderboard();
}

let blackjackActive = false;
let blackjackPlayer = [];
let blackjackHouse = [];

function cardValue(card) {
  if (card === "A") return 11;
  if (["K", "Q", "J"].includes(card)) return 10;
  return Number(card);
}

function scoreHand(cards) {
  let total = cards.reduce((sum, card) => sum + cardValue(card), 0);
  let aces = cards.filter((card) => card === "A").length;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
}

function drawCard() {
  const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  return ranks[Math.floor(Math.random() * ranks.length)];
}

function resetBlackjack() {
  blackjackPlayer = [drawCard(), drawCard()];
  blackjackHouse = [drawCard(), drawCard()];
  blackjackActive = true;
  elements.houseScore.textContent = scoreHand(blackjackHouse);
  elements.playerScore.textContent = scoreHand(blackjackPlayer);
}

function startBlackjack() {
  if (!appState.username) {
    showToast("Login first to play blackjack.");
    return;
  }

  const bet = Number(document.getElementById("blackjackBet").value);
  if (!bet || bet <= 0 || bet > appState.gems) {
    showToast("Not enough gems for that blackjack bet.");
    return;
  }

  resetBlackjack();
  appState.gems -= bet;
  updateProfile();
}

function hitBlackjack() {
  if (!blackjackActive) {
    showToast("Deal a hand first.");
    return;
  }

  blackjackPlayer.push(drawCard());
  const current = scoreHand(blackjackPlayer);
  elements.playerScore.textContent = current;

  if (current > 21) {
    appState.gems -= Number(document.getElementById("blackjackBet").value);
    appState.losses += 1;
    showToast("Bust! House wins this round.");
    blackjackActive = false;
    updateProfile();
  }
}

function standBlackjack() {
  if (!blackjackActive) {
    showToast("Deal a hand first.");
    return;
  }

  let houseTotal = scoreHand(blackjackHouse);
  while (houseTotal < 17) {
    blackjackHouse.push(drawCard());
    houseTotal = scoreHand(blackjackHouse);
  }

  const bet = Number(document.getElementById("blackjackBet").value);
  const playerTotal = scoreHand(blackjackPlayer);
  elements.houseScore.textContent = houseTotal;

  if (houseTotal > 21 || playerTotal > houseTotal) {
    appState.gems += bet * 2;
    appState.wins += 1;
    showToast("You win the round!");
  } else if (playerTotal === houseTotal) {
    appState.gems += bet;
    showToast("Push. Your bet is returned.");
  } else {
    appState.losses += 1;
    showToast("House wins this round.");
  }

  blackjackActive = false;
  updateProfile();
  updateLeaderboard();
}

function handleTip() {
  if (!appState.username) {
    showToast("Login first before tipping.");
    return;
  }

  const target = document.getElementById("tipUser").value.trim();
  const amount = Number(document.getElementById("tipAmount").value);

  if (!target || !amount || amount <= 0 || amount > appState.gems) {
    showToast("Check the tip username and gems amount.");
    return;
  }

  appState.gems -= amount;
  const targetUser = users.find((user) => user.username.toLowerCase() === target.toLowerCase());
  if (targetUser) {
    targetUser.gems += amount;
    addChatMessage(appState.username, `sent ${amount} gems to ${target}.`);
    showToast(`You tipped ${amount} gems to ${target}.`);
  } else {
    showToast(`${target} was not found, but your tip was queued.`);
  }

  updateProfile();
  updateLeaderboard();
}

function unlockAdmin() {
  const key = elements.adminKeyInput.value.trim();
  if (key === "killer129$") {
    appState.adminUnlocked = true;
    elements.adminPanel.classList.remove("hidden");
    showToast("Admin access unlocked.");
  } else {
    showToast("Incorrect admin key.");
  }
}

function banUser() {
  if (!appState.adminUnlocked) {
    showToast("Unlock admin access first.");
    return;
  }

  const target = elements.banUserInput.value.trim();
  if (!target) {
    showToast("Enter a username to ban.");
    return;
  }

  appState.bannedUsers.add(target);
  showToast(`${target} has been banned.`);
}

function unbanUser() {
  if (!appState.adminUnlocked) {
    showToast("Unlock admin access first.");
    return;
  }

  const target = elements.banUserInput.value.trim();
  if (!target) {
    showToast("Enter a username to unban.");
    return;
  }

  appState.bannedUsers.delete(target);
  showToast(`${target} has been unbanned.`);
}

function grantGemsToPlayer() {
  if (!appState.adminUnlocked) {
    showToast("Unlock admin access first.");
    return;
  }

  const target = elements.grantUserInput.value.trim();
  const amount = Number(elements.grantAmountInput.value);

  if (!target || !amount || amount <= 0) {
    showToast("Enter a username and a valid gem amount.");
    return;
  }

  const targetUser = users.find((user) => user.username.toLowerCase() === target.toLowerCase());
  if (targetUser) {
    targetUser.gems += amount;
    showToast(`${amount} gems granted to ${target}.`);
  } else {
    users.push({ username: target, gems: amount });
    showToast(`${amount} gems granted to ${target}.`);
  }

  updateLeaderboard();
}

function grantSelfGems() {
  if (!appState.adminUnlocked) {
    showToast("Unlock admin access first.");
    return;
  }

  const amount = Number(elements.grantAmountInput.value);
  if (!amount || amount <= 0) {
    showToast("Enter a valid gem amount.");
    return;
  }

  appState.gems += amount;
  updateProfile();
  showToast(`${amount} gems added to your account.`);
}

elements.loginBtn.addEventListener("click", handleLogin);
elements.robloxLoginBtn.addEventListener("click", handleRobloxLink);
elements.linkRobloxBtn.addEventListener("click", handleRobloxLink);
elements.quickLoginBtn.addEventListener("click", handleRobloxLink);
elements.copyBioCodeBtn.addEventListener("click", () => {
  const value = appState.bioCode || randomCode();
  navigator.clipboard.writeText(value)
    .then(() => showToast("Bio code copied."))
    .catch(() => showToast("Copy failed. Please copy manually."));
});

elements.sendChatBtn.addEventListener("click", sendChat);
elements.chatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendChat();
  }
});

elements.choiceButtons.forEach((button) => {
  button.addEventListener("click", () => setChoice(button.dataset.choice));
});

elements.flipBtn.addEventListener("click", coinFlip);
elements.tipBtn.addEventListener("click", handleTip);
elements.dealBtn.addEventListener("click", startBlackjack);
elements.hitBtn.addEventListener("click", hitBlackjack);
elements.standBtn.addEventListener("click", standBlackjack);
elements.unlockAdminBtn.addEventListener("click", unlockAdmin);
elements.banBtn.addEventListener("click", banUser);
elements.unbanBtn.addEventListener("click", unbanUser);
elements.grantPlayerBtn.addEventListener("click", grantGemsToPlayer);
elements.grantSelfBtn.addEventListener("click", grantSelfGems);

updateProfile();
updateLeaderboard();
setChoice("heads");
showToast("Pet Simulator 99.game is ready.");
