
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

  // Exibe a pergunta (já com innerHTML)
  document.getElementById('question').innerHTML = q.question;

  // Gerencia a dica
  const hintBtn = document.getElementById('hint-btn');
  const hintText = document.getElementById('hint-text');

  if (q.dica) {
    hintBtn.style.display = 'inline-block';
    hintText.style.display = 'none';
    hintText.textContent = q.dica;

    hintBtn.onclick = () => {
      hintText.style.display = 'block';
      hintBtn.style.display = 'none'; // esconde o botão após clicar
    };
  } else {
    hintBtn.style.display = 'none';
    hintText.style.display = 'none';
    hintText.textContent = '';
  }

  // Gera alternativas
  const answersEl = document.getElementById('answers');
  answersEl.innerHTML = '';
// Cria lista com índice para embaralhar
const indexedAnswers = q.answers.map((ans, i) => ({ ans, index: i }));
const shuffled = indexedAnswers.sort(() => 0.5 - Math.random());

shuffled.forEach(({ ans, index }) => {
  const btn = document.createElement('button');
  btn.textContent = ans;
  btn.onclick = () => selectAnswer(btn, index);  // índice original
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
