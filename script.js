
let questions = [];
let selectedQuestions = [];
let currentQuestion = 0;
let score = 0;
const TOTAL_QUESTIONS = 10;

async function loadQuestions() {
  const res = await fetch('questions.json');
  const allQuestions = await res.json();
  selectedQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, TOTAL_QUESTIONS);
  document.getElementById('total').textContent = TOTAL_QUESTIONS;
  showQuestion();
}

function showQuestion() {
  const q = selectedQuestions[currentQuestion];
  document.getElementById('question').textContent = q.question;
  const answersEl = document.getElementById('answers');
  answersEl.innerHTML = '';
  q.answers.forEach((answer, idx) => {
    const btn = document.createElement('button');
    btn.textContent = answer;
    btn.onclick = () => selectAnswer(btn, idx);
    answersEl.appendChild(btn);
  });
  document.getElementById('current').textContent = currentQuestion + 1;
  document.getElementById('next-btn').disabled = true;
}

function selectAnswer(button, index) {
  const correct = selectedQuestions[currentQuestion].correct;
  const buttons = document.querySelectorAll('#answers button');
  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === correct) btn.classList.add('correct');
    else if (idx === index) btn.classList.add('wrong');
  });
  if (index === correct) {
    score++;
    document.getElementById('score').textContent = score;
  }
  document.getElementById('next-btn').disabled = false;
}

document.getElementById('next-btn').addEventListener('click', () => {
  currentQuestion++;
  if (currentQuestion < TOTAL_QUESTIONS) {
    showQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  document.querySelector('.quiz-container').innerHTML = `
    <h2>Quiz finalizado!</h2>
    <p>Você acertou <strong>${score}</strong> de <strong>${TOTAL_QUESTIONS}</strong> perguntas.</p>
    <button onclick="location.reload()">Tentar novamente</button>
  `;
}

loadQuestions();
