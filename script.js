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
  { tema: "Análise", pergunta: "Amazon DataZone", resposta: "Descubra dados dentre os limites organizacionais" },
  { tema: "Análise", pergunta: "Amazon FinSpace", resposta: "Armazene, catalogue, prepare e analise dados do setor financeiro" },
  { tema: "Análise", pergunta: "Amazon Data Pipeline", resposta: "Serviço de orquestração para fluxos de trabalhos periódicos orientado a dados" },
  { tema: "Análise", pergunta: "AWS Lake Formation", resposta: "Governe, proteja e compartilhe dados de forma centralizada para análise e aprendizado de máquina" },
  { tema: "Análise", pergunta: "<span style='color: red;'>Amazon Athena</span>", resposta: "Consulte dados no S3 usando SQL" },
  { tema: "Análise", pergunta: "Amazon EMR (Elastic MapReduce)", resposta: "Framework do Hadoop hospedado" },
  { tema: "Análise", pergunta: "<span style='color: red;'>Amazon Kinesis</span>", resposta: "Analise fluxos de vídeo e dados em tempo real" },
  { tema: "Análise", pergunta: "Amazon MSK (Managed Streaming para Apache Kafka)", resposta: "Serviço do Apache Kafka totalmente gerenciado facilita a ingestão e o processamento de dados de streaming em tempo real" },
  { tema: "Análise", pergunta: "Amazon OpenSearch", resposta: "Pesquise, visualize e analise até PETABYTES de texto e dados" },
  { tema: "Análise", pergunta: "<span style='color: red;'>Amazon QuickSight</span>", resposta: "Serviço rápido de análise empresarial - usa ML" },
  { tema: "Análise", pergunta: "<span style='color: red;'>Amazon Glue</span>", resposta: "Serviço ETL que permite extrair, transformar e carregar dados" },
  { tema: "Análise", pergunta: "Amazon Data Exchange", resposta: "Encontre, assine e use dados de terceiros na nuvem" },
  { tema: "Análise", pergunta: "<span style='color: red;'>Amazon Redshift</span>", resposta: "Usa SQL para analisar dados estruturados e semiestruturados em Data warehousing" },
  { tema: "Integração de aplicações", pergunta: "Amazon MQ", resposta: "Serviço gerenciado de agente de mensagem Apache ActiveMQ e RabbitMQ" },
  { tema: "Integração de aplicações", pergunta: "Amazon SES (Simple Email Service)", resposta: "Serviço de entrega de campanha de e-mail de alto volume" },
  { tema: "Integração de aplicações", pergunta: "Amazon AppFlow", resposta: "Automatizar fluxos de dados entre software como serviço (SaaS) e serviços AWS" },
  { tema: "Integração de aplicações", pergunta: "Amazon EventBridge", resposta: "Crie aplicações orientadas por eventos em escala na AWS, sistemas existentes ou aplicações SaaS" },
  { tema: "Integração de aplicações", pergunta: "<span style='color: red;'>Amazon SNS (Simple Notification Service)</span>", resposta: "Serviço de envio de mensagens de publicação/assinatura" },
  { tema: "Integração de aplicações", pergunta: "<span style='color: red;'>Amazon SQS (Simple Queue Service)</span>", resposta: "Serviço de fila de mensagens" },
  { tema: "Integração de aplicações", pergunta: "<span style='color: red;'>Amazon Step Functions</span>", resposta: "Serviço de fluxo de trabalho para aplicações distribuídas" },
  { tema: "Aplicações empresariais", pergunta: "Amazon SES (Simple Email Service)", resposta: "Serviço de entrega de campanha de e-mail de alto volume" },
  { tema: "Aplicações empresariais", pergunta: "Amazon Connect", resposta: "Central de atendimento na nuvem, omnichannel." },
  { tema: "Gerenciamento financeiro", pergunta: "<span style='color: red;'>Amazon Pricing Calculator</span>", resposta: "Serviço para criar uma estimativa de preço" },
  { tema: "Gerenciamento financeiro", pergunta: "<span style='color: red;'>Amazon Control Tower</span>", resposta: "Serviço para gerenciar contas, implementar políticas de segurança e garantir conformidade do ambiente" },
  { tema: "Gerenciamento financeiro", pergunta: "<span style='color: red;'>Amazon Budgets</span>", resposta: "Defina orçamentos personalizados de custo e uso" },
  { tema: "Gerenciamento financeiro", pergunta: "<span style='color: red;'>Amazon Cost Explorer</span>", resposta: "Explorador de custos. Analise seus custos na AWS" },
  { tema: "Gerenciamento financeiro", pergunta: "Amazon Marketplace", resposta: "Plataforma da AWS que permite que clientes comprem e vendam software desenvolvido por terceiros." },
  { tema: "Gerenciamento financeiro", pergunta: "<span style='color: red;'>AWS Relatório de uso e custo</span>", resposta: "Examina os custos e os dados de uso da AWS" },
  { tema: "Computação", pergunta: "<span style='color: red;'>Amazon Compute Optimizer</span>", resposta: "Avalia o desempenho dos recursos computacionais dos últimos 14 dias e fornece recomendações para otimização" },
  { tema: "Computação", pergunta: "<span style='color: red;'>Amazon Lambda</span>", resposta: "Serviço sem servidor, execute códigos sem provisionar pagando pelo número de solicitações e pelo tempo que usar, até 15 minutos." },
  { tema: "Computação", pergunta: "<span style='color: red;'>Amazon EC2 Auto Scaling</span>", resposta: "Escale a capacidade computacional para atender à demanda." },
  { tema: "Computação", pergunta: "<span style='color: red;'>Amazon Auto Scaling</span>", resposta: "Monitora aplicativos e ajusta automaticamente a capacidade, mantendo o desempenho constante e menor custo possível" },
  { tema: "Computação", pergunta: "<span style='color: red;'>Amazon EC2</span>", resposta: "Servidores virtuais na nuvem." },
  { tema: "Computação", pergunta: "<span style='color: red;'>Zonas Locais da AWS</span>", resposta: "Zonas Locais são extensões da infraestrutura da AWS que aproximam os serviços da AWS dos usuários finais, reduzindo a latência." },
  { tema: "Computação", pergunta: "<span style='color: red;'>Amazon Lightsail</span>", resposta: "Crie aplicações e sites rapidamente com recursos de nuvem pré-configurados e de baixo custo." },
  { tema: "Computação", pergunta: "<span style='color: red;'>Amazon Batch</span>", resposta: "Serviço para executar processamento em lote na nuvem." },
  { tema: "Computação", pergunta: "<span style='color: red;'>Amazon Elastic Beanstalk</span>", resposta: "Serviço gerenciado, para desenvolvedores realizarem uma fácil utilização de implantação e escalabilidade de app e serviços web." },
  { tema: "Computação", pergunta: "<span style='color: red;'>Amazon Outposts</span>", resposta: "Execute a infraestrutura da AWS on-premises." },
  { tema: "Computação", pergunta: "Amazon Wavelength", resposta: "Disponibiliza aplicações de latência ultrabaixa para dispositivos 5G." },
  { tema: "Contêineres", pergunta: "<span style='color: red;'>Amazon Fargate</span>", resposta: "Serviço de computação sem servidor para execução de contêineres na nuvem AWS, pagando conforme o uso." },
  { tema: "Contêineres", pergunta: "Amazon Elastic Kubernetes Service (EKS)", resposta: "Serviço gerenciado do KUBERNETES para executar KUBERNETES na nuvem AWS e em ambientes on-premises." },
  { tema: "Contêineres", pergunta: "<span style='color: red;'>Amazon Elastic Container Service (ECS)</span>", resposta: "Serviço de orquestração de contêineres totalmente gerenciado, simplifica a implantação, gerenciamento e escalabilidade." },
  { tema: "Contêineres", pergunta: "<span style='color: red;'>Amazon Elastic Container Registry (ECR)</span>", resposta: "Serviço de registro de contêineres que oferece local seguro e privado para armazenar, gerenciar e distribuir imagens DOCKER." },
  { tema: "Interação com os clientes", pergunta: "AWS Activate para startups", resposta: "O programa AWS Activate oferece créditos, treinamentos e suporte gratuitos para startups." },
  { tema: "Interação com os clientes", pergunta: "AWS IQ", resposta: "Permite encontrar e contratar especialistas certificados AWS." },
  { tema: "Interação com os clientes", pergunta: "AWS Managed Services (AMS)", resposta: "Serviço gerenciado que administra, monitora e opera ambientes na AWS em nome dos clientes, seguindo as melhores práticas de segurança e conformidade." },
  { tema: "Interação com os clientes", pergunta: "AWS Support", resposta: "Serviço de suporte da AWS que oferece diferentes níveis de suporte técnico, com opções como suporte 24/7, orientação de especialistas, análise de arquitetura e consultoria técnica para otimização de soluções." },
  { tema: "Banco de dados", pergunta: "Amazon ElastiCache", resposta: "Serviço de gerenciamento de banco de dados na memória, para aplicativos que precisam de tempo de resposta inferiores a milissegundos." },
  { tema: "Banco de dados", pergunta: "Amazon DocumentDB", resposta: "Banco de dados de documentos, gerenciamento de conteúdo, catálogos, perfis de usuários." },
  { tema: "Banco de dados", pergunta: "Amazon Timestream", resposta: "Banco de dados de séries temporais para armazenar e analisar dados de eventos de forma eficiente, ideal para IoT e dados operacionais em tempo real." },
  { tema: "Banco de dados", pergunta: "<span style='color: red;'>Amazon Redshift</span>", resposta: "Usa SQL para analisar dados estruturados e semiestruturados em Data warehousing." },
  { tema: "Banco de dados", pergunta: "<span style='color: red;'>Amazon RDS (Relational Database Service)</span>", resposta: "É um banco de dados relacional, escalável, automatização na aplicação de patch, provisionamento e backup. Compativel com Aurora, MySql, Maria DB, PostgreSQL, Oracle, SQL Server." },
  { tema: "Banco de dados", pergunta: "<span style='color: red;'>Amazon DynamoDB</span>", resposta: "Banco de dados não relacional (NoSQL) de chave-valor e documento que oferece desempenho de milissegundos, AWS gerencia os recursos, virtualmente ilimitado." },
  { tema: "Banco de dados", pergunta: "<span style='color: red;'>Amazon Aurora</span>", resposta: "Banco de dados relacional gerenciado de alta performance, alta disponibilidade, escalabilidade automática, robusto para armazenar, eficiente para recuperação de dados." },
  { tema: "Banco de dados", pergunta: "Amazon Neptune", resposta: "Serviço de banco de dados de grafo, totalmente gerenciado, projetado para armazenar e processar dados de GRAFOS. Pode encontrar na pergunta palavra GRAFICO." },
  { tema: "Banco de dados", pergunta: "Amazon MemoryDB para Redis", resposta: "Banco de dados gerenciado, compatível com Redis e otimizado para cargas de trabalho em tempo real." },
  { tema: "Desenvolvedor", pergunta: "Orquestração CI/CD: AWS CodePipeline", resposta: "Código-fonte/compilação/testes/Produção = CodeCommit > CodeBuild > CodeDeploy" },
  { tema: "Desenvolvedor", pergunta: "CI/CD", resposta: "Integração Contínua, Entrega Contínua e Implantação Contínua." },
  { tema: "Desenvolvedor", pergunta: "CI/CD", resposta: "É representado como um PIPELINE, onde o novo código é enviado em uma extremidade, testado por meio de uma série de estágios (fonte, construção, teste, preparação e produção)." },
  { tema: "Desenvolvedor", pergunta: "<span style='color: red;'>AWS CLI</span>", resposta: "Interface de Linha de Comando da AWS permite que os usuários gerenciem e interajam com serviços da AWS diretamente do terminal." },
  { tema: "Desenvolvedor", pergunta: "AWS Cloudshell", resposta: "É um SHELL baseado em navegador que oferece acesso por linha de comando aos recursos AWS na região selecionada da AWS." },
  { tema: "Desenvolvedor", pergunta: "AWS Cloud9", resposta: "É uma IDE da AWS para que os desenvolvedores consigam escrever, executar e depurar códigos de maneira eficiente e colaborativa." },
  { tema: "Desenvolvedor", pergunta: "AWS AppConfig", resposta: "Sinalizadores de recursos para facilitar a implantação, configuração e o monitoramento de aplicativos. Habilitar ou desabilitar um recurso na aplicação. FEATURE FLAGS." },
  { tema: "Desenvolvedor", pergunta: "AWS CodeArtifact", resposta: "Serviço de repositório de pacotes gerenciado centralizado, para armazenar, organizar e distribuir pacotes de software para desenvolvimento." },
  { tema: "Desenvolvedor", pergunta: "<span style='color: red;'>AWS CodeCommit</span>", resposta: "Serviço de hospedagem de repositórios privados git, para controle de origem, armazenamento e gerenciamento do código-fonte." },
  { tema: "Desenvolvedor", pergunta: "<span style='color: red;'>AWS CodeBuild</span>", resposta: "Serviço gerenciado para compilar, testar e empacotar o código-fonte, ajudar no processo de build de software." },
  { tema: "Desenvolvedor", pergunta: "<span style='color: red;'>AWS CodeDeploy</span>", resposta: "Serviço para automatizar o processo de implantação." },
  { tema: "Desenvolvedor", pergunta: "<span style='color: red;'>AWS CodePipeline</span>", resposta: "Serviço de entrega continua que automatiza o processo, fluxo de trabalho." },
  { tema: "Desenvolvedor", pergunta: "AWS CodeStar", resposta: "Serviço que simplifica o desenvolvimento e a implantação de aplicativos através de templates." },
  { tema: "Desenvolvedor", pergunta: "AWS X-Ray", resposta: "Serviço de rastreamento, análise de aplicativos, visão detalhada, o que está funcionando e onde pode ser feita as melhorias." },
  { tema: "Comput. Usu. Final", pergunta: "Amazon AppStream 2.0", resposta: "Serviço de streaming de aplicativos para usuários seguro, confiável e escalável." },
  { tema: "Comput. Usu. Final", pergunta: "<span style='color: red;'>Amazon Workspaces</span>", resposta: "Serviço de desktop virtual na nuvem, acesse o ambiente de trabalho de qualquer lugar a qualquer momento." },
  { tema: "Comput. Usu. Final", pergunta: "Amazon WorkSpaces Web", resposta: "Serviço que permite acessar aplicativos baseados em navegador de maneira segura a partir de qualquer dispositivo." },
  { tema: "Web e Front-end", pergunta: "Amazon Pinpoint", resposta: "Ferramenta de marketing digital que ajuda empresas a interagir com os clientes por e-mail, SMS, push e outros canais." },
  { tema: "Web e Front-end", pergunta: "Amazon Simple Email Service (SES)", resposta: "Serviço de entrega de campanha de e-mail de alto volume." },
  { tema: "Web e Front-end", pergunta: "<span style='color: red;'>Amazon API Gateway</span>", resposta: "Serviço que atua como gateway serverless, para criar, publicar, manter, monitorar e proteger as APIs da aplicação na internet." },
  { tema: "Web e Front-end", pergunta: "AWS Device Farm", resposta: "Serviço para você testar sua aplicação front-end em dispositivos móveis reais." },
  { tema: "Web e Front-end", pergunta: "AWS Amplify", resposta: "Conjunto de ferramentas e serviços que aceleram o desenvolvimento de aplicações móveis e WEB na AWS." },
  { tema: "Web e Front-end", pergunta: "AWS AppSync", resposta: "Conecte aplicativos a dados e eventos com APIs seguras, sem servidor e de alto desempenho do GraphQL e do Pub/Sub." },
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