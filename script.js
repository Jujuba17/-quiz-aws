// =============================================================
// ARQUIVO: script.js (Quiz Principal e Flashcards)
// VERSÃO ATUALIZADA - Botão Voltar Recarrega a Página
// =============================================================

// --- VARIÁVEIS GLOBAIS DO QUIZ PRINCIPAL ---
let questions = [];
let selectedQuestions = [];
let currentQuestion = 0;
let score = 0;
let userAnswers = [];
const TOTAL_QUESTIONS = 20;
let answeredQuestions = JSON.parse(localStorage.getItem('quizProgress')) || [];

// --- VARIÁVEIS GLOBAIS DOS FLASHCARDS ---
const flashcards = [
  { tema: "Análise", pergunta: "Amazon CloudSearch", resposta: "Serviço gerenciado de pesquisa do seu site ou aplicativo" },
  { tema: "Infraestrutura como Código", pergunta: "Benefícios da Infraestrutura como Código", resposta: "Automação: Provisione e configure a infraestrutura automaticamente, reduzindo erros.\nConsistência: Garanta que as configurações sejam idênticas em diferentes ambientes.\nRepetibilidade: Recrie a mesma infraestrutura facilmente sempre que necessário.\nVersionamento: Rastreie e reverta alterações como em um código-fonte comum.\nColaboração: Equipes podem trabalhar juntas de forma mais eficaz, usando o mesmo código." },
  // Adicione mais flashcards aqui
];
let currentFlashcardIndex = 0;
let filteredFlashcards = [];


// --- FUNÇÃO DE CONEXÃO DE EVENTOS ---
function connectEventListeners() {
  // Botão Iniciar Quiz Principal
  const startBtn = document.getElementById('start-btn');
  if (startBtn) {
    startBtn.onclick = () => {
      document.getElementById('start-screen').style.display = 'none';
      document.getElementById('quiz-content').style.display = 'block';
      loadQuestions();
    };
  }

  // Botão Iniciar Flash Cards
  const flashcardBtn = document.getElementById('flashcard-btn');
  if (flashcardBtn) {
    flashcardBtn.onclick = () => {
      document.getElementById('start-screen').style.display = 'none';
      document.getElementById('flashcard-content').style.display = 'block';
      showFlashcard();
    };
  }
  
  // ✅ CORREÇÃO APLICADA AQUI
  // Pega TODOS os botões "Voltar" (do quiz e do flashcard) com o ID padronizado.
  const backToStartButtons = document.querySelectorAll('#back-to-start-btn');
  backToStartButtons.forEach(button => {
    button.onclick = () => {
      // Simplesmente recarrega a página. É o reset mais eficaz e garantido.
      location.reload(); 
    };
  });

  // Botão Próxima do Quiz Principal
  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) {
    nextBtn.onclick = () => {
      currentQuestion++;
      if (currentQuestion < TOTAL_QUESTIONS) {
        showQuestion();
      } else {
        showResult();
      }
    };
  }
}

// --- FUNÇÕES DOS FLASHCARDS ---
// (Nenhuma alteração nesta seção)
function showFlashcard() {
  const selectedTema = document.getElementById("tema-select").value;
  filteredFlashcards = flashcards.filter(flashcard =>
    selectedTema === "todos" || flashcard.tema.toLowerCase() === selectedTema.toLowerCase()
  );

  if (filteredFlashcards.length === 0) {
    alert("Não há flashcards disponíveis para essa categoria.");
    document.getElementById("flashcard-pergunta").innerText = "Nenhum card encontrado.";
    document.getElementById("flashcard-resposta").style.display = "none";
    document.getElementById("show-answer-btn").style.display = "none";
    return;
  }

  currentFlashcardIndex = Math.floor(Math.random() * filteredFlashcards.length);
  displayFlashcard();
}

function displayFlashcard() {
  const flashcard = filteredFlashcards[currentFlashcardIndex];
  document.getElementById("flashcard-pergunta").innerHTML = flashcard.pergunta;
  document.getElementById("flashcard-resposta").innerText = flashcard.resposta;
  document.getElementById("flashcard-resposta").style.display = "none";
  document.getElementById("show-answer-btn").style.display = "inline-block";
}


// --- FUNÇÕES DO QUIZ PRINCIPAL ---
// (Nenhuma alteração nesta seção)
async function loadQuestions() {
  try {
    const res = await fetch('questions.json');
    questions = await res.json();
    selectedQuestions = selectQuestionsWithRepeat();
    userAnswers = new Array(TOTAL_QUESTIONS).fill(-1);
    document.getElementById('total').textContent = TOTAL_QUESTIONS;
    showQuestion();
  } catch(error) {
    console.error("Erro ao carregar questions.json:", error);
    document.getElementById('question').innerHTML = "Falha ao carregar perguntas. Verifique o console (F12).";
  }
}

function selectQuestionsWithRepeat() {
  let finalQuestions = [];
  if (answeredQuestions.length < 3) {
    const availableQuestions = questions.filter((_, index) => !answeredQuestions.includes(index));
    const shuffled = availableQuestions.sort(() => 0.5 - Math.random());
    finalQuestions = shuffled.slice(0, TOTAL_QUESTIONS);
    finalQuestions.forEach(q => {
      const originalIndex = questions.indexOf(q);
      if (!answeredQuestions.includes(originalIndex)) answeredQuestions.push(originalIndex);
    });
    localStorage.setItem('quizProgress', JSON.stringify(answeredQuestions));
  } else {
    const numRepeat = Math.min(2, answeredQuestions.length);
    const numNew = TOTAL_QUESTIONS - numRepeat;
    const questionsToRepeat = [];
    const shuffledAnswered = [...answeredQuestions].sort(() => 0.5 - Math.random());
    for (let i = 0; i < numRepeat && i < shuffledAnswered.length; i++) {
      questionsToRepeat.push(questions[shuffledAnswered[i]]);
    }
    const unansweredQuestions = questions.filter((_, index) => !answeredQuestions.includes(index));
    const shuffledNew = unansweredQuestions.sort(() => 0.5 - Math.random());
    const newQuestions = shuffledNew.slice(0, numNew);
    newQuestions.forEach(q => {
      const originalIndex = questions.indexOf(q);
      answeredQuestions.push(originalIndex);
    });
    localStorage.setItem('quizProgress', JSON.stringify(answeredQuestions));
    finalQuestions = [...questionsToRepeat, ...newQuestions].sort(() => 0.5 - Math.random());
    if (unansweredQuestions.length === 0) {
      console.log("🔄 Todas as perguntas foram respondidas! Resetando...");
      answeredQuestions = [];
      localStorage.setItem('quizProgress', JSON.stringify(answeredQuestions));
      const shuffled = questions.sort(() => 0.5 - Math.random());
      finalQuestions = shuffled.slice(0, TOTAL_QUESTIONS);
      finalQuestions.forEach(q => {
        const originalIndex = questions.indexOf(q);
        answeredQuestions.push(originalIndex);
      });
      localStorage.setItem('quizProgress', JSON.stringify(answeredQuestions));
    }
  }
  return finalQuestions;
}

function showQuestion() {
  if (currentQuestion >= selectedQuestions.length) {
    showResult();
    return;
  }
  const q = selectedQuestions[currentQuestion];
  document.getElementById('question').innerHTML = q.question;
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
  }
  const answersEl = document.getElementById('answers');
  answersEl.innerHTML = '';
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
  userAnswers[currentQuestion] = index;
  buttons.forEach((btn) => { btn.disabled = true; });
  if (index === correct) {
    button.classList.add('correct');
    score++;
    document.getElementById('score').textContent = score;
  } else {
    button.classList.add('wrong');
    buttons[correct].classList.add('correct');
  }
  document.getElementById('next-btn').disabled = false;
}

function showResult() {
    const areaStats = {};
    selectedQuestions.forEach((q, index) => {
        const area = q.titulo || 'Geral';
        if (!areaStats[area]) areaStats[area] = { total: 0, acertos: 0 };
        areaStats[area].total++;
        if (userAnswers[index] === q.correct) areaStats[area].acertos++;
    });
    let statsHTML = '';
    for (const area in areaStats) {
        const { total, acertos } = areaStats[area];
        const percent = Math.round((acertos / total) * 100);
        statsHTML += `<p><strong>${area}:</strong> ${acertos}/${total} (${percent}%)</p>`;
    }
    const totalAnswered = answeredQuestions.length;
    const totalQuestionsInBank = questions.length;
    const progress = Math.min(100, Math.round((totalAnswered / totalQuestionsInBank) * 100));
    let progressHTML = `<div style="margin-top: 20px; padding: 15px; background: #f0f8ff; border-radius: 8px;"><h4>📈 Progresso Geral:</h4><p><strong>Perguntas únicas respondidas:</strong> ${totalAnswered}/${totalQuestionsInBank} (${progress}%)</p>${totalAnswered >= totalQuestionsInBank ? '<p style="color: green;">🎉 <strong>Parabéns! Você respondeu todas as perguntas!</strong></p>' : '<p style="color: #666;">💡 <em>Algumas perguntas podem se repetir para fixar o aprendizado</em></p>'}</div>`;
    document.querySelector('.quiz-container').innerHTML = `<h2>Quiz finalizado!</h2><p>Você acertou <strong>${score}</strong> de <strong>${TOTAL_QUESTIONS}</strong> perguntas.</p><div style="margin: 20px 0;"><button id="toggle-stats" style="background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">📊 Ver Desempenho por Área</button><div id="area-stats" style="display: none; margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #007bff;"><h3>📊 Desempenho por Área:</h3>${statsHTML}</div></div>${progressHTML}<button onclick="resetQuiz()" style="margin-right: 10px;">Novo Quiz</button><button onclick="resetCompleteQuiz()" style="background-color: #dc3545; color: white;">🔄 Zerar Progresso Completo</button>`;
    document.getElementById('toggle-stats').onclick = function() {
        const statsDiv = document.getElementById('area-stats');
        const button = document.getElementById('toggle-stats');
        if (statsDiv.style.display === 'none') {
            statsDiv.style.display = 'block';
            button.textContent = '📊 Ocultar Desempenho por Área';
            button.style.background = '#6c757d';
        } else {
            statsDiv.style.display = 'none';
            button.textContent = '📊 Ver Desempenho por Área';
            button.style.background = '#007bff';
        }
    };
}

function resetQuiz() {
  // O recarregamento da página é a forma mais simples de reiniciar
  location.reload();
}

function resetCompleteQuiz() {
  localStorage.removeItem('quizProgress');
  location.reload(); // Recarrega a página para um reset completo
}


// --- INICIALIZAÇÃO ---
function addDesafioContentListeners() {
    const openDesafioButton = document.createElement('button');
    openDesafioButton.textContent = 'Desafio Oficial';
    openDesafioButton.id = 'desafio-btn';
    openDesafioButton.style.cssText = `margin-top: 10px; background-color: #ff9900; color: white; border: none; border-radius: 5px; padding: 15px 30px; font-size: 18px; font-weight: bold; cursor: pointer; transition: all 0.3s ease; width: 100%;`;
    
    if (!document.getElementById('desafio-btn')) {
        const startScreenEl = document.getElementById('start-screen');
        if (startScreenEl) startScreenEl.appendChild(openDesafioButton);
    }
    
    openDesafioButton.onclick = () => {
        const startScreen = document.getElementById('start-screen');
        const desafioContent = document.getElementById('desafio-content');
        if (startScreen) startScreen.style.display = 'none';
        if (desafioContent) desafioContent.style.display = 'block';
    };
}


document.addEventListener('DOMContentLoaded', () => {
  connectEventListeners();

  document.getElementById("show-answer-btn").onclick = () => {
    document.getElementById("flashcard-resposta").style.display = "block";
    document.getElementById("show-answer-btn").style.display = "none";
  };
  document.getElementById("next-flashcard-btn").onclick = showFlashcard;
  document.getElementById("tema-select").addEventListener("change", showFlashcard);

  addDesafioContentListeners();
});
//////////////////////////SEGUNDO CODIGO /////////////////////////

// =============================================================
// ARQUIVO: desafio.js (Desafio Oficial)
// VERSÃO ATUALIZADA - Botão Voltar Recarrega a Página
// =============================================================

document.addEventListener('DOMContentLoaded', () => {
    // --- Seleção de Elementos do DOM ---
    const desafioContent = document.getElementById('desafio-content');
    const startScreen = document.getElementById('start-screen');
    const provaSelect = document.getElementById('prova-select');
    const startButton = document.getElementById('start-desafio-button');
    const desafioStart = document.getElementById('desafio-start');
    const desafioContainer = document.getElementById('desafio');
    const questionElement = document.getElementById('desafio-question');
    const answersElement = document.getElementById('desafio-answers');
    const submitButton = document.getElementById('desafio-submit-button');
    const nextButton = document.getElementById('desafio-next-button');
    const currentElement = document.getElementById('desafio-current');
    const totalElement = document.getElementById('desafio-total');
    const scoreElement = document.getElementById('desafio-correct-answers');
    const desafioEnd = document.getElementById('desafio-end');
    const finalScoreElement = document.getElementById('desafio-final-score');
    const restartButton = document.getElementById('desafio-restart-button');
    const backToStartButton = document.getElementById('desafio-back-to-start');

    // --- Carregamento dinâmico de Scripts e Variáveis de Estado ---
    // (Nenhuma alteração nesta seção)
    if (!window.Chart) {
        const chartScript = document.createElement('script');
        chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        document.head.appendChild(chartScript);
    }
    let currentQuestionIndex = 0;
    let correctAnswers = 0;
    let questions = [];
    let selectedAnswers = [];
    let currentProva = 'Prova1.json';


    // --- Funções do Desafio ---
    // (Nenhuma alteração nesta seção)
    function restartDesafio() {
        currentQuestionIndex = 0;
        correctAnswers = 0;
        questions = [];
        selectedAnswers = [];
        if (provaSelect) {
            currentProva = provaSelect.value;
        }
        if (scoreElement) scoreElement.textContent = '0';
        if (currentElement) currentElement.textContent = '0';
        if (totalElement) totalElement.textContent = '0';
        const resultChartCanvas = document.getElementById('result-chart');
        if (resultChartCanvas) {
            const chartInstance = Chart.getChart(resultChartCanvas);
            if (chartInstance) {
                chartInstance.destroy();
            }
        }
    }

    async function loadQuestions(provaFile) {
        try {
            const response = await fetch(provaFile);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            questions = await response.json();
            totalElement.textContent = questions.length;
        } catch (error) {
            console.error('Erro ao carregar as perguntas do desafio:', error);
            questionElement.textContent = 'Erro ao carregar as perguntas da prova.';
        }
    }

    async function startDesafio() {
        await loadQuestions(currentProva);
        if (questions.length === 0) return;
        desafioStart.style.display = 'none';
        desafioContainer.style.display = 'block';
        provaSelect.style.display = 'none';
        document.querySelector('label[for="prova-select"]').style.display = 'none';
        currentQuestionIndex = 0;
        correctAnswers = 0;
        selectedAnswers = [];
        scoreElement.textContent = correctAnswers;
        loadQuestion();
    }

    function loadQuestion() {
        if (currentQuestionIndex < questions.length) {
            const questionData = questions[currentQuestionIndex];
            questionElement.textContent = questionData.question;
            answersElement.innerHTML = '';
            selectedAnswers = [];
            questionData.answers.forEach((answer, index) => {
                const button = document.createElement('button');
                button.textContent = answer;
                button.classList.add('answer');
                button.dataset.index = index;
                button.addEventListener('click', selectAnswer);
                answersElement.appendChild(button);
            });
            currentElement.textContent = currentQuestionIndex + 1;
            submitButton.style.display = 'inline-block';
            submitButton.disabled = true;
            nextButton.style.display = 'none';
        } else {
            endDesafio();
        }
    }
    

    function selectAnswer(event) {
        const selectedButton = event.target;
        const answerIndex = parseInt(selectedButton.dataset.index, 10);
        const questionData = questions[currentQuestionIndex];
        const isMultipleChoice = Array.isArray(questionData.correct);

        // ✅ LÓGICA CORRIGIDA PARA MÚLTIPLA ESCOLHA
        if (isMultipleChoice) {
            const requiredAnswersCount = questionData.correct.length;
            const isAlreadySelected = selectedAnswers.includes(answerIndex);

            if (isAlreadySelected) {
                // Se já está selecionado, permite desmarcar.
                selectedAnswers = selectedAnswers.filter(index => index !== answerIndex);
                selectedButton.classList.remove('selected');
            } else {
                // Se NÃO está selecionado, verifica se o limite já foi atingido.
                if (selectedAnswers.length < requiredAnswersCount) {
                    // Limite ainda não atingido, permite selecionar.
                    selectedAnswers.push(answerIndex);
                    selectedButton.classList.add('selected');
                } else {
                    // Limite atingido. Ignora o clique em uma nova opção.
                    // Opcional: pode-se adicionar um feedback visual, mas por enquanto, só ignoramos.
                    console.log(`Limite de ${requiredAnswersCount} respostas atingido.`);
                    return; // Impede a execução do resto da função
                }
            }
        } else {
            // Lógica para perguntas de resposta única (permanece a mesma)
            // Remove a seleção anterior
            document.querySelectorAll('.answer.selected').forEach(btn => btn.classList.remove('selected'));
            // Adiciona a nova seleção
            selectedAnswers = [answerIndex];
            selectedButton.classList.add('selected');
        }

        // Habilita ou desabilita o botão de enviar com base na seleção
        submitButton.disabled = selectedAnswers.length === 0;
    }

    function submitAnswer() {
        const questionData = questions[currentQuestionIndex];
        let isCorrect = false;
        document.querySelectorAll('.answer').forEach(button => { button.disabled = true; });
        if (Array.isArray(questionData.correct)) {
            isCorrect = questionData.correct.every(correctIndex => selectedAnswers.includes(correctIndex)) && selectedAnswers.length === questionData.correct.length;
        } else {
            isCorrect = selectedAnswers.includes(questionData.correct);
        }
        document.querySelectorAll('.answer').forEach((button, index) => {
            const isCorrectAnswer = Array.isArray(questionData.correct) ? questionData.correct.includes(index) : index === questionData.correct;
            const isSelected = selectedAnswers.includes(index);
            if (isCorrectAnswer) button.classList.add('correct');
            else if (isSelected) button.classList.add('incorrect');
        });
        if (isCorrect) correctAnswers++;
        scoreElement.textContent = correctAnswers;
        submitButton.style.display = 'none';
        nextButton.style.display = 'inline-block';
    }

    function nextQuestion() {
        currentQuestionIndex++;
        loadQuestion();
    }
    
    function endDesafio() {
        desafioContainer.style.display = 'none';
        desafioEnd.style.display = 'block';
        finalScoreElement.textContent = `${correctAnswers} de ${questions.length}`;
        const createChart = () => { /* ... sua lógica de gráfico ... */ };
        createChart();
    }

    // --- Event Listeners com Lógica de Telas Corrigida ---
    if(provaSelect) provaSelect.addEventListener('change', (event) => { currentProva = event.target.value; });
    if(startButton) startButton.addEventListener('click', startDesafio);
    if(submitButton) submitButton.addEventListener('click', submitAnswer);
    if(nextButton) nextButton.addEventListener('click', nextQuestion);
    
    if (restartButton) {
        restartButton.addEventListener('click', () => {
            if (desafioEnd) desafioEnd.style.display = 'none';
            if (desafioContainer) desafioContainer.style.display = 'none';
            if (desafioStart) desafioStart.style.display = 'block';
            if (provaSelect) provaSelect.style.display = 'block';
            const provaLabel = document.querySelector('label[for="prova-select"]');
            if (provaLabel) provaLabel.style.display = 'block';
            restartDesafio();
        });
    }

    // ✅ CORREÇÃO APLICADA AQUI
    // Listener do botão "Voltar ao Início" durante o desafio.
    if (backToStartButton) {
        backToStartButton.addEventListener('click', () => {
            // Ação unificada: recarregar a página para voltar ao início.
            location.reload();
        });
    }
});