let questions = [];
let selectedQuestions = [];
let currentQuestion = 0;
let score = 0;
let userAnswers = [];
const TOTAL_QUESTIONS = 20;

let answeredQuestions = JSON.parse(localStorage.getItem('quizProgress')) || [];
let repeatQuestions = [];

// ✅ FUNÇÃO PARA CONECTAR TODOS OS EVENT LISTENERS
function connectEventListeners() {
  // Botão Iniciar
  const startBtn = document.getElementById('start-btn');
  if (startBtn) {
    startBtn.onclick = () => {
      document.getElementById('start-screen').style.display = 'none';
      document.getElementById('quiz-content').style.display = 'block';
      loadQuestions();
    };
  }

  // Botão Próxima
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

  // Adiciona o listener para o botão Flash Card
  const flashcardBtn = document.getElementById('flashcard-btn');
  if (flashcardBtn) {
    flashcardBtn.onclick = () => {
      document.getElementById('start-screen').style.display = 'none';
      document.getElementById('flashcard-content').style.display = 'block';
      showFlashcard();
    };
  }

  // Adiciona o listener para o botão Voltar ao Quiz
  const backToQuizBtn = document.getElementById('back-to-quiz-btn');
  if (backToQuizBtn) {
    backToQuizBtn.onclick = () => {
      document.getElementById('flashcard-content').style.display = 'none';
      document.getElementById('start-screen').style.display = 'block'; // Exibe a tela inicial novamente
    };
  }
}

// 🚦 NOVO CÓDIGO DE FLASHCARDS

const flashcards = [
  { tema: "Análise", pergunta: "Amazon CloudSearch", resposta: "Serviço gerenciado de pesquisa do seu site ou aplicativo" },
  { tema: "Infraestrutura como Código", pergunta: "Benefícios da Infraestrutura como Código", resposta: "Automação: Provisione e configure a infraestrutura automaticamente, reduzindo erros.\nConsistência: Garanta que as configurações sejam idênticas em diferentes ambientes.\nRepetibilidade: Recrie a mesma infraestrutura facilmente sempre que necessário.\nVersionamento: Rastreie e reverta alterações como em um código-fonte comum.\nColaboração: Equipes podem trabalhar juntas de forma mais eficaz, usando o mesmo código." },
];

let currentFlashcardIndex = 0;
let filteredFlashcards = [];

// Função para mostrar um flashcard
function showFlashcard() {
  const selectedTema = document.getElementById("tema-select").value;
  filteredFlashcards = flashcards.filter(flashcard => 
    selectedTema === "todos" || flashcard.tema.toLowerCase() === selectedTema.toLowerCase()
  );

  // Verifica se há flashcards disponíveis
  if (filteredFlashcards.length === 0) {
    alert("Não há flashcards disponíveis para essa categoria.");
    currentFlashcardIndex = 0; // Reseta índice se não houver flashcards disponíveis
    return; 
  }

  currentFlashcardIndex = Math.floor(Math.random() * filteredFlashcards.length);
  displayFlashcard();
}

// Função para exibir um flashcard
function displayFlashcard() {
  const flashcard = filteredFlashcards[currentFlashcardIndex];
  document.getElementById("flashcard-pergunta").innerHTML = flashcard.pergunta; // Use innerHTML aqui
  document.getElementById("flashcard-resposta").innerText = flashcard.resposta;
  document.getElementById("flashcard-resposta").style.display = "none";

  // Mostra o botão de mostrar resposta
  document.getElementById("show-answer-btn").style.display = "inline-block"; 
}

// Evento para mostrar a resposta
document.getElementById("show-answer-btn").onclick = () => {
  document.getElementById("flashcard-resposta").style.display = "block";
  document.getElementById("show-answer-btn").style.display = "none"; // Esconde o botão após ser clicado
};

// Evento para mostrar o próximo flashcard
document.getElementById("next-flashcard-btn").onclick = () => {
  if (filteredFlashcards.length > 0) {
    currentFlashcardIndex = Math.floor(Math.random() * filteredFlashcards.length);
    displayFlashcard();
  }
};

// Evento de mudança para selecionar tema
document.getElementById("tema-select").addEventListener("change", showFlashcard);

// ✅ CHAMA QUANDO A PÁGINA CARREGA
document.addEventListener('DOMContentLoaded', connectEventListeners);

async function loadQuestions() {
  const res = await fetch('questions.json');
  questions = await res.json();
  
  selectedQuestions = selectQuestionsWithRepeat();
  userAnswers = new Array(TOTAL_QUESTIONS).fill(-1);
  
  document.getElementById('total').textContent = TOTAL_QUESTIONS;
  showQuestion();
}

function selectQuestionsWithRepeat() {
  let finalQuestions = [];
  
  if (answeredQuestions.length < 3) {
    const availableQuestions = questions.filter((_, index) => 
      !answeredQuestions.includes(index)
    );
    
    const shuffled = availableQuestions.sort(() => 0.5 - Math.random());
    finalQuestions = shuffled.slice(0, TOTAL_QUESTIONS);
    
    finalQuestions.forEach(q => {
      const originalIndex = questions.indexOf(q);
      if (!answeredQuestions.includes(originalIndex)) {
        answeredQuestions.push(originalIndex);
      }
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
    
    const unansweredQuestions = questions.filter((_, index) => 
      !answeredQuestions.includes(index)
    );
    
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
    hintText.textContent = '';
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
  
  buttons.forEach((btn) => {
    btn.disabled = true;
  });

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
    if (!areaStats[area]) {
      areaStats[area] = { total: 0, acertos: 0 };
    }
    areaStats[area].total++;
    
    if (userAnswers[index] === q.correct) {
      areaStats[area].acertos++;
    }
  });

  // ✅ CRIA O HTML DO DESEMPENHO POR ÁREA (OCULTO INICIALMENTE)
  let statsHTML = '';
  for (const area in areaStats) {
    const { total, acertos } = areaStats[area];
    const percent = Math.round((acertos / total) * 100);
    statsHTML += `<p><strong>${area}:</strong> ${acertos}/${total} (${percent}%)</p>`;
  }

  const totalAnswered = answeredQuestions.length;
  const totalQuestions = questions.length;
  const progress = Math.min(100, Math.round((totalAnswered / totalQuestions) * 100));
  
  let progressHTML = `
    <div style="margin-top: 20px; padding: 15px; background: #f0f8ff; border-radius: 8px;">
      <h4>📈 Progresso Geral:</h4>
      <p><strong>Perguntas únicas respondidas:</strong> ${totalAnswered}/${totalQuestions} (${progress}%)</p>
      ${totalAnswered >= totalQuestions ? 
        '<p style="color: green;">🎉 <strong>Parabéns! Você respondeu todas as perguntas!</strong></p>' : 
        '<p style="color: #666;">💡 <em>Algumas perguntas podem se repetir para fixar o aprendizado</em></p>'
      }
    </div>
  `;

  document.querySelector('.quiz-container').innerHTML = `
    <h2>Quiz finalizado!</h2>
    <p>Você acertou <strong>${score}</strong> de <strong>${TOTAL_QUESTIONS}</strong> perguntas.</p>
    
    <!-- ✅ BOTÃO PARA MOSTRAR/OCULTAR DESEMPENHO POR ÁREA -->
    <div style="margin: 20px 0;">
      <button id="toggle-stats" style="background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
        📊 Ver Desempenho por Área
      </button>
      <div id="area-stats" style="display: none; margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #007bff;">
        <h3>📊 Desempenho por Área:</h3>
        ${statsHTML}
      </div>
    </div>

    ${progressHTML}
    <button onclick="resetQuiz()" style="margin-right: 10px;">Novo Quiz</button>
    <button onclick="resetCompleteQuiz()" style="background-color: #dc3545; color: white;">🔄 Zerar Progresso Completo</button>
  `;

  // ✅ ADICIONA FUNCIONALIDADE PARA MOSTRAR/OCULTAR AS ESTATÍSTICAS
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

// ✅ FUNÇÃO PARA RESETAR APENAS O QUIZ ATUAL
function resetQuiz() {
  currentQuestion = 0;
  score = 0;
  userAnswers = [];
  selectedQuestions = [];
  
  document.querySelector('.quiz-container').innerHTML = `
    <div id="start-screen" class="start-screen">
      <h1>Quiz AWS Cloud</h1>
      <p>Teste seus conhecimentos sobre <br>Amazon Web Services.</p>
      <p>Boa sorte! 🚀</p>
      <button id="start-btn">Iniciar Quiz</button>
      <button id="flashcard-btn">Flash Card</button> <!-- Botão para Flash Card -->
    </div>

    <div id="quiz-content" class="quiz-content" style="display: none;">
      <h1>Quiz AWS Cloud</h1>

      <div id="question-container">
        <p id="question">Carregando pergunta...</p>
        <div id="answers"></div>
      </div>

      <div class="quiz-footer">
        <p>Pergunta <span id="current">1</span>/<span id="total">10</span></p>
        <p>Acertos: <span id="score">0</span></p>
      </div>

      <div class="quiz-buttons">
        <button id="hint-btn" title="Ver dica">💡</button>
        <button id="next-btn" disabled>Próxima</button>
      </div>

      <p id="hint-text" style="display: none; font-style: italic; color: #555;"></p>
    </div>
  `;
  
  // ✅ RECONECTA OS EVENT LISTENERS APÓS RECRIAR O HTML
  connectEventListeners();
}

// ✅ FUNÇÃO PARA ZERAR TUDO
function resetCompleteQuiz() {
  localStorage.removeItem('quizProgress');
  answeredQuestions = [];
  location.reload();
}

//////////////////////////SEGUNDO CODIGO /////////////////////////

document.addEventListener('DOMContentLoaded', () => {
    const chartScript = document.createElement('script');
    chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    document.head.appendChild(chartScript);

    const provaSelect = document.getElementById('prova-select');
    const startButton = document.getElementById('start-desafio-button');
    const desafioStart = document.getElementById('desafio-start');
    const desafioContainer = document.getElementById('desafio');
    const questionElement = document.getElementById('desafio-question');
    const answersElement = document.getElementById('desafio-answers');
    const nextButton = document.getElementById('desafio-next-button');
    const progressElement = document.getElementById('desafio-progress');
    const currentElement = document.getElementById('desafio-current');
    const totalElement = document.getElementById('desafio-total');
    const scoreElement = document.getElementById('desafio-correct-answers');
    const desafioEnd = document.getElementById('desafio-end');
    const finalScoreElement = document.getElementById('desafio-final-score');
    const restartButton = document.getElementById('desafio-restart-button');

    // Adicione um canvas para o gráfico no HTML da seção de fim de desafio

  const openDesafioButton = document.createElement('button');
  openDesafioButton.textContent = 'Desafio Oficial';
  openDesafioButton.id = 'desafio-btn'; // Adiciona um ID
  openDesafioButton.style.cssText = `
      margin-top: 10px;
      background-color: #ff9900;
      color: white;
      border: none;
      border-radius: 5px;
      padding: 15px 30px;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      width: 100%;
      position: relative;
      overflow: hidden;
  `;
  

  // Adiciona efeitos de hover via JavaScript
  openDesafioButton.addEventListener('mouseenter', (e) => {
      e.target.style.transform = 'scale(1.05)';
      e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
  });

  openDesafioButton.addEventListener('mouseleave', (e) => {
      e.target.style.transform = 'scale(1)';
      e.target.style.boxShadow = 'none';
  });

  openDesafioButton.onclick = () => {
      document.getElementById('start-screen').style.display = 'none';
      document.getElementById('desafio-content').style.display = 'block';
  };

  document.getElementById('start-screen').appendChild(openDesafioButton);

    let currentQuestionIndex = 0;
    let correctAnswers = 0;
    let questions = [];
    let selectedAnswers = [];
    let currentProva = 'Prova1.json'; // Valor padrão inicial

    // Função para carregar as perguntas do arquivo JSON
    async function loadQuestions(provaFile = currentProva) {
        try {
            const response = await fetch(provaFile);
            questions = await response.json();
            totalElement.textContent = questions.length;
        } catch (error) {
            console.error('Erro ao carregar as perguntas:', error);
            questionElement.textContent = 'Erro ao carregar as perguntas. Por favor, tente novamente mais tarde.';
            nextButton.disabled = true;
        }
    }

    // Evento de seleção da prova
    provaSelect.addEventListener('change', (event) => {
        currentProva = event.target.value; // Atualiza a prova selecionada
        loadQuestions(currentProva); // Carrega as questões da prova selecionada
    });

    function startDesafio() {
        desafioStart.style.display = 'none';
        desafioContainer.style.display = 'block';
        provaSelect.style.display = 'none'; // Oculta o menu suspenso
        
        // Nova linha para ocultar o texto de seleção de prova
        
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
            answersElement.innerHTML = ''; // Limpa as opções anteriores
            selectedAnswers = []; // Limpa as respostas selecionadas para a nova pergunta

            questionData.answers.forEach((answer, index) => {
                const button = document.createElement('button');
                button.textContent = answer;
                button.classList.add('answer');
                button.dataset.index = index;
                button.addEventListener('click', selectAnswer);
                answersElement.appendChild(button);

                // Mantém o botão selecionado se a resposta já foi escolhida
                if (selectedAnswers.includes(index)) {
                    button.classList.add('selected');
                }
            });

            currentElement.textContent = currentQuestionIndex + 1;

            // Habilita o botão "Próxima" se todas as respostas corretas forem selecionadas
            if (Array.isArray(questionData.correct)) {
                nextButton.disabled = selectedAnswers.length !== questionData.correct.length;
            } else {
                nextButton.disabled = selectedAnswers.length === 0; // Desabilita se nenhuma resposta foi selecionada
            }
        } else {
            endDesafio();
        }
    }

    
    function selectAnswer(event) {
        const selectedButton = event.target;
        const answerIndex = parseInt(selectedButton.dataset.index);
        const questionData = questions[currentQuestionIndex];

        // Se a pergunta tem apenas uma resposta correta
        if (!Array.isArray(questionData.correct)) {
            // Remove qualquer outra resposta já selecionada
            if (selectedAnswers.length > 0) {
                const previouslySelectedIndex = selectedAnswers[0];
                const previouslySelectedButton = document.querySelector(`.answer[data-index="${previouslySelectedIndex}"]`);
                if (previouslySelectedButton) {
                    previouslySelectedButton.classList.remove('selected');
                }
                selectedAnswers = []; // Limpa o array de respostas selecionadas
            }
        }

        // Adiciona ou remove a resposta selecionada
        if (selectedAnswers.includes(answerIndex)) {
            // Remove a resposta se já estiver selecionada
            selectedAnswers = selectedAnswers.filter(index => index !== answerIndex);
            selectedButton.classList.remove('selected');
        } else {
            // Adiciona a resposta se ainda não estiver selecionada
            selectedAnswers.push(answerIndex);
            selectedButton.classList.add('selected');
        }

        // Habilita ou desabilita o botão "Próxima"
        if (Array.isArray(questionData.correct)) {
            nextButton.disabled = selectedAnswers.length !== questionData.correct.length;
        } else {
            nextButton.disabled = selectedAnswers.length === 0;
        }
    }


    function nextQuestion() {
        const questionData = questions[currentQuestionIndex];
        let isCorrect = false;

        // Desabilita todos os botões de resposta
        document.querySelectorAll('.answer').forEach(button => {
            button.disabled = true;
        });

        // Remove as classes 'correct' e 'incorrect' de todos os botões
        const answerButtons = document.querySelectorAll('.answer');
        answerButtons.forEach(button => {
            button.classList.remove('correct');
            button.classList.remove('incorrect');
            button.classList.remove('selected'); // Remove a seleção anterior
        });

        // Verifica se a resposta é única ou múltipla
        if (Array.isArray(questionData.correct)) {
            // Se a resposta for múltipla, verifica se TODAS as corretas foram selecionadas
            isCorrect = questionData.correct.every(correctIndex => selectedAnswers.includes(correctIndex)) &&
                        selectedAnswers.length === questionData.correct.length;
        } else {
            // Se a resposta for única, verifica se a SELECIONADA é a correta
            isCorrect = selectedAnswers.includes(questionData.correct);
        }

        // Aplica estilos com base na correção da resposta
        answerButtons.forEach((button, index) => {
            if (Array.isArray(questionData.correct)) {
                // Para respostas múltiplas
                if (questionData.correct.includes(index) && selectedAnswers.includes(index)) {
                    // Resposta correta selecionada fica verde
                    button.classList.add('correct');
                } 
                
                if (selectedAnswers.includes(index) && !questionData.correct.includes(index)) {
                    // Resposta incorreta selecionada fica vermelha
                    button.classList.add('incorrect');
                }

                // Mostra a resposta correta em verde se não foi selecionada
                if (questionData.correct.includes(index) && !selectedAnswers.includes(index)) {
                    button.classList.add('correct');
                }
            } else {
                // Para resposta única
                if (index === questionData.correct) {
                    button.classList.add('correct');
                } 
                
                if (selectedAnswers.includes(index) && index !== questionData.correct) {
                    button.classList.add('incorrect');
                }
            }
        });

        if (isCorrect) {
            correctAnswers++;
        }

        scoreElement.textContent = correctAnswers;
        currentQuestionIndex++;
        selectedAnswers = [];

        setTimeout(() => {
            loadQuestion();
        }, 1500);
    }

    function endDesafio() {
        desafioContainer.style.display = 'none';
        desafioEnd.style.display = 'block';
        finalScoreElement.textContent = `${correctAnswers} de ${questions.length}`;

        // Criar gráfico de pizza
        const wrongAnswers = questions.length - correctAnswers;
        
        // Verifica se o Chart está disponível (aguarda o script carregar)
        const createChart = () => {
            if (window.Chart) {
                const ctx = document.getElementById('result-chart').getContext('2d');
                new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: ['Acertos', 'Erros'],
                        datasets: [{
                            data: [correctAnswers, wrongAnswers],
                            backgroundColor: [
                                'green',   // cor para acertos
                                'red'      // cor para erros
                            ]
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Resultado do Desafio'
                            }
                        }
                    }
                });
            } else {
                // Tenta novamente após um curto intervalo se o Chart não estiver disponível
                setTimeout(createChart, 100);
            }
        };

        createChart();
    }

    function restartDesafio() {
        desafioEnd.style.display = 'none';
        desafioStart.style.display = 'block';
        provaSelect.style.display = 'block'; // Restaura a visibilidade do menu
        provaSelect.style.display = 'block'; // Restaura a visibilidade do menu
        
        // Limpa o gráfico anterior
        const existingChart = document.getElementById('result-chart');
        if (existingChart) {
            existingChart.remove();
        }
        
        // Recria o canvas para o próximo gráfico
        const newResultChartCanvas = document.createElement('canvas');
        newResultChartCanvas.id = 'result-chart';
        desafioEnd.appendChild(newResultChartCanvas);
    }

    // Event listeners
    startButton.addEventListener('click', startDesafio);
    nextButton.addEventListener('click', nextQuestion);
    restartButton.addEventListener('click', restartDesafio);

    // Carrega as perguntas quando a página é carregada
    loadQuestions();
});