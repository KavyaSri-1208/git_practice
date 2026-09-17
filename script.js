const alphabet = [
  { letter: "A", word: "Apple", emoji: "🍎", hint: "A juicy red fruit that grows on trees." },
  { letter: "B", word: "Ball", emoji: "⚽", hint: "A round toy you can kick, throw, or bounce." },
  { letter: "C", word: "Cat", emoji: "🐱", hint: "A soft, furry animal that says meow." },
  { letter: "D", word: "Dog", emoji: "🐶", hint: "A friendly animal that loves to play." },
  { letter: "E", word: "Elephant", emoji: "🐘", hint: "A huge animal with big ears and a long trunk." },
  { letter: "F", word: "Fish", emoji: "🐟", hint: "An animal that swims and lives in water." },
  { letter: "G", word: "Grapes", emoji: "🍇", hint: "Small, juicy fruits that grow in bunches." },
  { letter: "H", word: "Hat", emoji: "🎩", hint: "You can wear this on your head." },
  { letter: "I", word: "Ice Cream", emoji: "🍦", hint: "A cool, sweet treat for a sunny day." },
  { letter: "J", word: "Juice", emoji: "🧃", hint: "A yummy drink made from fruit." },
  { letter: "K", word: "Kite", emoji: "🪁", hint: "A colorful toy that flies in the wind." },
  { letter: "L", word: "Lion", emoji: "🦁", hint: "A big wild cat known as the king of the jungle." },
  { letter: "M", word: "Moon", emoji: "🌙", hint: "You can see this glowing in the night sky." },
  { letter: "N", word: "Nest", emoji: "🪺", hint: "A cozy home where birds lay their eggs." },
  { letter: "O", word: "Orange", emoji: "🍊", hint: "A round, juicy fruit with a bright orange color." },
  { letter: "P", word: "Penguin", emoji: "🐧", hint: "A black-and-white bird that loves to swim." },
  { letter: "Q", word: "Queen", emoji: "👑", hint: "A royal lady who wears a crown." },
  { letter: "R", word: "Rabbit", emoji: "🐰", hint: "A cute animal with long ears." },
  { letter: "S", word: "Sun", emoji: "☀️", hint: "A bright star that lights and warms our day." },
  { letter: "T", word: "Tiger", emoji: "🐯", hint: "A striped wild cat with orange fur." },
  { letter: "U", word: "Umbrella", emoji: "☂️", hint: "You can use this to stay dry in the rain." },
  { letter: "V", word: "Violin", emoji: "🎻", hint: "A musical instrument played with a bow." },
  { letter: "W", word: "Whale", emoji: "🐋", hint: "A giant animal that lives in the ocean." },
  { letter: "X", word: "Xylophone", emoji: "🎵", hint: "A musical instrument with colorful bars." },
  { letter: "Y", word: "Yo-yo", emoji: "🪀", hint: "A toy that spins up and down on a string." },
  { letter: "Z", word: "Zebra", emoji: "🦓", hint: "A horse-like animal with black-and-white stripes." }
];

let currentIndex = 0;
let score = 0;
let learned = new Set();
let soundOn = true;
let challengeSolved = false;

const letterGrid = document.getElementById("letterGrid");
const selectedLetter = document.getElementById("selectedLetter");
const wordName = document.getElementById("wordName");
const wordEmoji = document.getElementById("wordEmoji");
const wordHint = document.getElementById("wordHint");
const scoreEl = document.getElementById("score");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");
const answerGrid = document.getElementById("answerGrid");
const questionText = document.getElementById("questionText");
const feedback = document.getElementById("feedback");
const celebration = document.getElementById("celebration");

function buildLetters() {
  letterGrid.innerHTML = "";
  alphabet.forEach((item, index) => {
    const button = document.createElement("button");
    button.className = "letter-btn";
    button.textContent = item.letter;
    button.setAttribute("aria-label", `Learn letter ${item.letter}`);
    button.addEventListener("click", () => selectLetter(index));
    letterGrid.appendChild(button);
  });
  refreshLetterButtons();
}

function refreshLetterButtons() {
  [...letterGrid.children].forEach((button, index) => {
    button.classList.toggle("active", index === currentIndex);
    button.classList.toggle("learned", learned.has(index));
  });
}

function selectLetter(index, speak = true) {
  currentIndex = index;
  const item = alphabet[index];

  selectedLetter.textContent = item.letter;
  wordName.textContent = item.word;
  wordEmoji.textContent = item.emoji;
  wordHint.textContent = item.hint;

  wordEmoji.style.animation = "none";
  requestAnimationFrame(() => {
    wordEmoji.style.animation = "pop .45s ease both";
  });

  refreshLetterButtons();
  updateProgress();
  createChallenge();

  if (speak && soundOn) {
    speakText(`${item.letter}. ${item.letter} is for ${item.word}.`);
  }
}

function markLearned(index) {
  learned.add(index);
  updateProgress();
  refreshLetterButtons();
}

function updateProgress() {
  const count = learned.size;
  progressText.textContent = `${count} / 26`;
  progressBar.style.width = `${(count / alphabet.length) * 100}%`;
}

function nextLetter() {
  markLearned(currentIndex);

  if (learned.size === alphabet.length) {
    showCelebration();
    return;
  }

  let next = (currentIndex + 1) % alphabet.length;
  while (learned.has(next)) {
    next = (next + 1) % alphabet.length;
  }

  selectLetter(next);
  document.getElementById("gamePanel").scrollIntoView({ behavior: "smooth", block: "center" });
}

function randomOptions(correctIndex) {
  const options = new Set([correctIndex]);
  while (options.size < 3) {
    options.add(Math.floor(Math.random() * alphabet.length));
  }
  return [...options].sort(() => Math.random() - 0.5);
}

function createChallenge() {
  challengeSolved = false;
  const correctIndex = currentIndex;
  const item = alphabet[correctIndex];
  questionText.textContent = `${item.emoji} ${item.word} starts with...`;
  feedback.textContent = "";
  feedback.className = "feedback";

  answerGrid.innerHTML = "";
  randomOptions(correctIndex).forEach(index => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.innerHTML = `<strong>${alphabet[index].letter}</strong>`;
    button.addEventListener("click", () => checkAnswer(index, correctIndex, button));
    answerGrid.appendChild(button);
  });
}

function checkAnswer(selectedIndex, correctIndex, button) {
  if (challengeSolved) return;

  if (selectedIndex === correctIndex) {
    challengeSolved = true;
    button.classList.add("correct");
    feedback.textContent = "🎉 Great job! You got it!";
    feedback.className = "feedback good";

    score += 10;
    scoreEl.textContent = score;
    markLearned(correctIndex);

    if (soundOn) speakText(`Great job! ${alphabet[correctIndex].letter} is correct.`);
    makeStars();
  } else {
    button.classList.add("wrong");
    feedback.textContent = "💡 Almost! Try another letter.";
    feedback.className = "feedback bad";
    if (soundOn) speakText("Try again!");
  }
}

function makeStars() {
  const stars = document.createElement("div");
  stars.className = "star-burst";
  stars.textContent = "⭐ ✨ ⭐ ✨ ⭐";
  Object.assign(stars.style, {
    position: "fixed",
    left: "50%",
    top: "48%",
    transform: "translate(-50%, -50%)",
    zIndex: "30",
    fontSize: "28px",
    pointerEvents: "none",
    animation: "pop .5s ease both"
  });
  document.body.appendChild(stars);
  setTimeout(() => stars.remove(), 650);
}

function speakText(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.82;
  utterance.pitch = 1.18;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

function showCelebration() {
  const earnedStars = Math.min(5, Math.max(1, Math.ceil(score / 60)));
  document.getElementById("finalStars").textContent = "⭐ ".repeat(earnedStars).trim();
  celebration.classList.add("show");
  celebration.setAttribute("aria-hidden", "false");
  if (soundOn) speakText("Amazing! You completed the alphabet adventure!");
}

function restartGame() {
  currentIndex = 0;
  score = 0;
  learned.clear();
  scoreEl.textContent = "0";
  celebration.classList.remove("show");
  celebration.setAttribute("aria-hidden", "true");
  selectLetter(0, false);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("gamePanel").scrollIntoView({ behavior: "smooth", block: "start" });
  setTimeout(() => selectLetter(0), 400);
});

document.getElementById("nextBtn").addEventListener("click", nextLetter);

document.getElementById("listenBtn").addEventListener("click", () => {
  const item = alphabet[currentIndex];
  speakText(`${item.letter}. ${item.letter} is for ${item.word}.`);
});

document.getElementById("soundToggle").addEventListener("click", (event) => {
  soundOn = !soundOn;
  event.currentTarget.textContent = soundOn ? "🔊 Sound On" : "🔇 Sound Off";
  if (!soundOn && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
});

document.getElementById("playAgainBtn").addEventListener("click", restartGame);

buildLetters();
selectLetter(0, false);
const alphabet = [
  { letter: "A", word: "Apple", emoji: "🍎", hint: "A juicy red fruit that grows on trees." },
  { letter: "B", word: "Ball", emoji: "⚽", hint: "A round toy you can kick, throw, or bounce." },
  { letter: "C", word: "Cat", emoji: "🐱", hint: "A soft, furry animal that says meow." },
  { letter: "D", word: "Dog", emoji: "🐶", hint: "A friendly animal that loves to play." },
  { letter: "E", word: "Elephant", emoji: "🐘", hint: "A huge animal with big ears and a long trunk." },
  { letter: "F", word: "Fish", emoji: "🐟", hint: "An animal that swims and lives in water." },
  { letter: "G", word: "Grapes", emoji: "🍇", hint: "Small, juicy fruits that grow in bunches." },
  { letter: "H", word: "Hat", emoji: "🎩", hint: "You can wear this on your head." },
  { letter: "I", word: "Ice Cream", emoji: "🍦", hint: "A cool, sweet treat for a sunny day." },
  { letter: "J", word: "Juice", emoji: "🧃", hint: "A yummy drink made from fruit." },
  { letter: "K", word: "Kite", emoji: "🪁", hint: "A colorful toy that flies in the wind." },
  { letter: "L", word: "Lion", emoji: "🦁", hint: "A big wild cat known as the king of the jungle." },
  { letter: "M", word: "Moon", emoji: "🌙", hint: "You can see this glowing in the night sky." },
  { letter: "N", word: "Nest", emoji: "🪺", hint: "A cozy home where birds lay their eggs." },
  { letter: "O", word: "Orange", emoji: "🍊", hint: "A round, juicy fruit with a bright orange color." },
  { letter: "P", word: "Penguin", emoji: "🐧", hint: "A black-and-white bird that loves to swim." },
  { letter: "Q", word: "Queen", emoji: "👑", hint: "A royal lady who wears a crown." },
  { letter: "R", word: "Rabbit", emoji: "🐰", hint: "A cute animal with long ears." },
  { letter: "S", word: "Sun", emoji: "☀️", hint: "A bright star that lights and warms our day." },
  { letter: "T", word: "Tiger", emoji: "🐯", hint: "A striped wild cat with orange fur." },
  { letter: "U", word: "Umbrella", emoji: "☂️", hint: "You can use this to stay dry in the rain." },
  { letter: "V", word: "Violin", emoji: "🎻", hint: "A musical instrument played with a bow." },
  { letter: "W", word: "Whale", emoji: "🐋", hint: "A giant animal that lives in the ocean." },
  { letter: "X", word: "Xylophone", emoji: "🎵", hint: "A musical instrument with colorful bars." },
  { letter: "Y", word: "Yo-yo", emoji: "🪀", hint: "A toy that spins up and down on a string." },
  { letter: "Z", word: "Zebra", emoji: "🦓", hint: "A horse-like animal with black-and-white stripes." }
];

let currentIndex = 0;
let score = 0;
let learned = new Set();
let soundOn = true;
let challengeSolved = false;

const letterGrid = document.getElementById("letterGrid");
const selectedLetter = document.getElementById("selectedLetter");
const wordName = document.getElementById("wordName");
const wordEmoji = document.getElementById("wordEmoji");
const wordHint = document.getElementById("wordHint");
const scoreEl = document.getElementById("score");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");
const answerGrid = document.getElementById("answerGrid");
const questionText = document.getElementById("questionText");
const feedback = document.getElementById("feedback");
const celebration = document.getElementById("celebration");

function buildLetters() {
  letterGrid.innerHTML = "";
  alphabet.forEach((item, index) => {
    const button = document.createElement("button");
    button.className = "letter-btn";
    button.textContent = item.letter;
    button.setAttribute("aria-label", `Learn letter ${item.letter}`);
    button.addEventListener("click", () => selectLetter(index));
    letterGrid.appendChild(button);
  });
  refreshLetterButtons();
}

function refreshLetterButtons() {
  [...letterGrid.children].forEach((button, index) => {
    button.classList.toggle("active", index === currentIndex);
    button.classList.toggle("learned", learned.has(index));
  });
}

function selectLetter(index, speak = true) {
  currentIndex = index;
  const item = alphabet[index];

  selectedLetter.textContent = item.letter;
  wordName.textContent = item.word;
  wordEmoji.textContent = item.emoji;
  wordHint.textContent = item.hint;

  wordEmoji.style.animation = "none";
  requestAnimationFrame(() => {
    wordEmoji.style.animation = "pop .45s ease both";
  });

  refreshLetterButtons();
  updateProgress();
  createChallenge();

  if (speak && soundOn) {
    speakText(`${item.letter}. ${item.letter} is for ${item.word}.`);
  }
}

function markLearned(index) {
  learned.add(index);
  updateProgress();
  refreshLetterButtons();
}

function updateProgress() {
  const count = learned.size;
  progressText.textContent = `${count} / 26`;
  progressBar.style.width = `${(count / alphabet.length) * 100}%`;
}

function nextLetter() {
  markLearned(currentIndex);

  if (learned.size === alphabet.length) {
    showCelebration();
    return;
  }

  let next = (currentIndex + 1) % alphabet.length;
  while (learned.has(next)) {
    next = (next + 1) % alphabet.length;
  }

  selectLetter(next);
  document.getElementById("gamePanel").scrollIntoView({ behavior: "smooth", block: "center" });
}

function randomOptions(correctIndex) {
  const options = new Set([correctIndex]);
  while (options.size < 3) {
    options.add(Math.floor(Math.random() * alphabet.length));
  }
  return [...options].sort(() => Math.random() - 0.5);
}

function createChallenge() {
  challengeSolved = false;
  const correctIndex = currentIndex;
  const item = alphabet[correctIndex];
  questionText.textContent = `${item.emoji} ${item.word} starts with...`;
  feedback.textContent = "";
  feedback.className = "feedback";

  answerGrid.innerHTML = "";
  randomOptions(correctIndex).forEach(index => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.innerHTML = `<strong>${alphabet[index].letter}</strong>`;
    button.addEventListener("click", () => checkAnswer(index, correctIndex, button));
    answerGrid.appendChild(button);
  });
}

function checkAnswer(selectedIndex, correctIndex, button) {
  if (challengeSolved) return;

  if (selectedIndex === correctIndex) {
    challengeSolved = true;
    button.classList.add("correct");
    feedback.textContent = "🎉 Great job! You got it!";
    feedback.className = "feedback good";

    score += 10;
    scoreEl.textContent = score;
    markLearned(correctIndex);

    if (soundOn) speakText(`Great job! ${alphabet[correctIndex].letter} is correct.`);
    makeStars();
  } else {
    button.classList.add("wrong");
    feedback.textContent = "💡 Almost! Try another letter.";
    feedback.className = "feedback bad";
    if (soundOn) speakText("Try again!");
  }
}

function makeStars() {
  const stars = document.createElement("div");
  stars.className = "star-burst";
  stars.textContent = "⭐ ✨ ⭐ ✨ ⭐";
  Object.assign(stars.style, {
    position: "fixed",
    left: "50%",
    top: "48%",
    transform: "translate(-50%, -50%)",
    zIndex: "30",
    fontSize: "28px",
    pointerEvents: "none",
    animation: "pop .5s ease both"
  });
  document.body.appendChild(stars);
  setTimeout(() => stars.remove(), 650);
}

function speakText(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.82;
  utterance.pitch = 1.18;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

function showCelebration() {
  const earnedStars = Math.min(5, Math.max(1, Math.ceil(score / 60)));
  document.getElementById("finalStars").textContent = "⭐ ".repeat(earnedStars).trim();
  celebration.classList.add("show");
  celebration.setAttribute("aria-hidden", "false");
  if (soundOn) speakText("Amazing! You completed the alphabet adventure!");
}

function restartGame() {
  currentIndex = 0;
  score = 0;
  learned.clear();
  scoreEl.textContent = "0";
  celebration.classList.remove("show");
  celebration.setAttribute("aria-hidden", "true");
  selectLetter(0, false);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("gamePanel").scrollIntoView({ behavior: "smooth", block: "start" });
  setTimeout(() => selectLetter(0), 400);
});

document.getElementById("nextBtn").addEventListener("click", nextLetter);

document.getElementById("listenBtn").addEventListener("click", () => {
  const item = alphabet[currentIndex];
  speakText(`${item.letter}. ${item.letter} is for ${item.word}.`);
});

document.getElementById("soundToggle").addEventListener("click", (event) => {
  soundOn = !soundOn;
  event.currentTarget.textContent = soundOn ? "🔊 Sound On" : "🔇 Sound Off";
  if (!soundOn && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
});

document.getElementById("playAgainBtn").addEventListener("click", restartGame);

buildLetters();
selectLetter(0, false);

