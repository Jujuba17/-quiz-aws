let questions = [];
let selectedQuestions = [];
let currentQuestion = 0;
let score = 0;
const TOTAL_QUESTIONS = 20;

// Evento do botão Iniciar
document.getElementById('start-btn').addEventListener('click', () => {
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('quiz-content').style.display = 'block';
  loadQuestions();
});

async function loadQuestions() {
  const res = await fetch('questions.json');
  const allQuestions = await res.json();
  selectedQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, TOTAL_QUESTIONS);
  document.getElementById('total').textContent = TOTAL_QUESTIONS;
  showQuestion();
}

function showQuestion() {
  const q = selectedQuestions[currentQuestion];

  // Exibe a pergunta
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
      hintBtn.style.display = 'none';
    };
  } else {
    hintBtn.style.display = 'none';
    hintText.style.display = 'none';
    hintText.textContent = '';
  }

  // Gera alternativas SEM EMBARALHAR
  const answersEl = document.getElementById('answers');
  answersEl.innerHTML = '';

  // Cria botões na ordem original do JSON
  q.answers.forEach((ans, index) => {
    const btn = document.createElement('button');
    btn.textContent = ans;
    btn.onclick = () => selectAnswer(btn, index);
    answersEl.appendChild(btn);
  });

  document.getElementById('current').textContent = currentQuestion + 1;
  document.getElementById('next-btn').disabled = true;
}

function selectAnswer(button, index) {
  const correct = selectedQuestions[currentQuestion].correct;
  const buttons = document.querySelectorAll('#answers button');
  
  // Desabilita todos os botões
  buttons.forEach((btn) => {
    btn.disabled = true;
  });

  // Verifica se acertou
  if (index === correct) {
    button.classList.add('correct');
    score++;
    document.getElementById('score').textContent = score;
  } else {
    button.classList.add('wrong');
    // Destaca a resposta correta
    buttons[correct].classList.add('correct');
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