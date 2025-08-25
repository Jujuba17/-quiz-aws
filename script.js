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
  // 🆕 Botão Voltar ao Quiz - Desafio Oficial
  const backToQuizDesafioBtn = document.querySelector('#desafio-content #back-to-quiz-btn');
  if (backToQuizDesafioBtn) {
    backToQuizDesafioBtn.onclick = () => {
      document.getElementById('desafio-content').style.display = 'none';
      document.getElementById('start-screen').style.display = 'block';
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
// Botão Voltar ao Início no Quiz
  const backToQuizStartBtn = document.getElementById('back-to-quiz-start-btn');
  if (backToQuizStartBtn) {
    backToQuizStartBtn.onclick = () => {
      document.getElementById('quiz-content').style.display = 'none';
      document.getElementById('start-screen').style.display = 'block';
    };
  }
}


// 🚦 NOVO CÓDIGO DE FLASHCARDS

const flashcards = [
  { tema: "Análise", pergunta: "Amazon CloudSearch", resposta: "Serviço gerenciado de pesquisa do seu site ou aplicativo" },
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
  { tema: "Internet das coisas", pergunta: "<span style='color: red;'>AWS IoT Core</span>", resposta: "Serviço que permite conectar dispositivos à nuvem de forma fácil e segura." },
  { tema: "Internet das coisas", pergunta: "<span style='color: red;'>AWS IoT Greengrass</span>", resposta: "Serviço que ajuda a criar, implantar e gerenciar softwares de dispositivos." },
  { tema: "Machine Learning", pergunta: "AWS Forecast", resposta: "Usado para fazer previsões de negócios baseadas em IA." },
  { tema: "Machine Learning", pergunta: "Amazon Kendra", resposta: "Serviço de pesquisa com aprendizado de máquina, consegue encontrar informações em diferentes fontes de dados. Melhora o retorno das respostas." },
  { tema: "Machine Learning", pergunta: "<span style='color: red;'>Amazon Lex</span>", resposta: "Permite criação de interfaces de conversação natural, Chatbot de voz e texto." },
  { tema: "Machine Learning", pergunta: "<span style='color: red;'>Amazon Textract</span>", resposta: "Serviço de extração de texto impresso, manuscrito e dados de qualquer documento, serviço de ML." },
  { tema: "Machine Learning", pergunta: "<span style='color: red;'>Amazon Transcribe</span>", resposta: "Serviço que converte áudio em texto." },
  { tema: "Machine Learning", pergunta: "<span style='color: red;'>Amazon Sagemaker</span>", resposta: "Crie, treine e implante modelos de machine learning (ML) para qualquer caso de uso com infraestrutura, ferramentas e fluxos de trabalho totalmente gerenciados." },
  { tema: "Machine Learning", pergunta: "<span style='color: red;'>Amazon Polly</span>", resposta: "Serviço que converte texto em áudio/ fala realista." },
  { tema: "Machine Learning", pergunta: "<span style='color: red;'>Amazon Rekognition</span>", resposta: "Serviço que analisa imagens e vídeos, permitindo a identificação de objetos, detecção de texto e rosto de pessoas." },
  { tema: "Machine Learning", pergunta: "<span style='color: red;'>Amazon Translate</span>", resposta: "Serviço de tradução, ele pode deixar a tradução formal ou informal. Utiliza aprendizado profundo, ML." },
  { tema: "Machine Learning", pergunta: "<span style='color: red;'>Amazon Comprehend</span>", resposta: "Serviço que analisa e compreende texto em linguagem natural extraindo insights de grandes volumes de texto." },
  { tema: "Geren. Governança", pergunta: "<span style='color: red;'>AWS Artifact</span>", resposta: "Acordos e relatórios de conformidade ARTEFATOS, COMPLIANCE e relatório de segurança(ISO, PCI, SOC), acordos de uso de serviços (BAA, HIPAA), auditorias internas e conformidade." },
  { tema: "Geren. Governança", pergunta: "<span style='color: red;'>AWS Cloud Adoption Framework (CAF)</span>", resposta: "Transformação digital de negocios aderir nuvem publica, Negócios, Pessoas, Governança, Plataforma, Segurança, Operações." },
  { tema: "Geren. Governança", pergunta: "<span style='color: red;'>Amazon CloudWatch</span>", resposta: "Serviço de MONITORAMENTO e DESEMPENHO de recursos e aplicativos no seu AMBIENTE. COLETAR > MONITORAR > ATUAR > ANALISAR. PERFORMANCE DE AMBIENTE." },
  { tema: "Geren. Governança", pergunta: "<span style='color: red;'>AWS CloudTrail</span>", resposta: "Serviço que possibilita governança, conformidade, auditoria operacional e de risco. AUDITORIA DE AMBIENTE - DEDO DURO." },
  { tema: "Geren. Governança", pergunta: "AWS Launch Wizard", resposta: "Simplifica a implantação de aplicativos complexos como SAP e Microsoft SQL Server na AWS, guiando os usuários pelo processo de configuração e implantação." },
  { tema: "Geren. Governança", pergunta: "AWS Resource Groups e Tag Editor", resposta: "Ferramentas que ajudam a organizar, gerenciar e filtrar recursos AWS usando tags." },
  { tema: "Geren. Governança", pergunta: "<span style='color: red;'>Console de gerenciamento da AWS</span>", resposta: "Interface gráfica baseada na web para gerenciar e configurar serviços e recursos AWS." },
  { tema: "Geren. Governança", pergunta: "AWS Health Dashboard", resposta: "Painel que fornece insights e notificações em tempo real sobre o status dos serviços da AWS e seu impacto nos recursos do cliente." },
  { tema: "Geren. Governança", pergunta: "<span style='color: red;'>Amazon Organizations</span>", resposta: "Serviço usado para consolidar faturas em um único local." },
  { tema: "Geren. Governança", pergunta: "<span style='color: red;'>AWS CloudFormation</span>", resposta: "Infraestrutura como código." },
  { tema: "Geren. Governança", pergunta: "<span style='color: red;'>AWS Trusted Advisor</span>", resposta: "Ferramenta que fornece recomendações, Otimização de custo, desempenho/performance, segurança, tolerância a falhas, limies de serviços e excelencia operacional." },
  { tema: "Geren. Governança", pergunta: "<span style='color: red;'>AWS Well-Architected</span>", resposta: "Excelência operacional, Segurança, Confiabilidade, Eficiência e performance, Otimização de custos, Sustentabilidade." },
  { tema: "Geren. Governança", pergunta: "<span style='color: red;'>AWS Config</span>", resposta: "Serviço que permite acessar, auditar e avaliar configurações de recursos AWS. Regional, histórico fica armazenado em um bucket S3." },
  { tema: "Geren. Governança", pergunta: "AWS Service Catalog", resposta: "Crie, compartilhe, organize e governe seus modelos de IaC selecionados. Catalogo de serviços." },
  { tema: "Geren. Governança", pergunta: "<span style='color: red;'>AWS Compute Optimizer</span>", resposta: "Serviço de recomendação para otimizar o usos ideal de recursos." },
  { tema: "Geren. Governança", pergunta: "<span style='color: red;'>AWS Control Tower</span>", resposta: "Serviço para configurar e governar um ambiente seguro e multicontas. Orquestra vários serviços AWS." },
  { tema: "Geren. Governança", pergunta: "AWS License Manager", resposta: "Serviço que gerencia suas licenças de software." },
  { tema: "Geren. Governança", pergunta: "<span style='color: red;'>AWS Auto Scaling</span>", resposta: "Serviço que ajusta automaticamente a capacidade de recursos de acordo com a demanda, ajudando a manter a performance e otimizar custos." },
  { tema: "Geren. Governança", pergunta: "<span style='color: red;'>AWS System Manager</span>", resposta: "Gerencie seus recursos na AWS e em ambientes de várias nuvens e híbridos." },
  { tema: "Migração e Transf.", pergunta: "AWS DataSync", resposta: "Simplifica e acelera a transferência de dados, sincronização continua entre diferentes ambientes." },
  { tema: "Migração e Transf.", pergunta: "<span style='color: red;'>AWS Database Migration Service (DMS)</span>", resposta: "Migração de Banco de dados para a nuvem AWS." },
  { tema: "Migração e Transf.", pergunta: "<span style='color: red;'>AWS Migration Hub</span>", resposta: "Centraliza e orienta a migração, acompanha todas as migrações em um único lugar." },
  { tema: "Migração e Transf.", pergunta: "AWS Transfer Family", resposta: "Simplifica a migração de fluxo de trabalho, transferência de dados, protocolos SFTP, FTPS, FTP e AS2." },
  { tema: "Migração e Transf.", pergunta: "<span style='color: red;'>Família AWS Snow</span>", resposta: "Conjunto de dispositivos físicos para transferência de dados em larga escala entre o ambiente local e a AWS, incluindo Snowcone, Snowball e Snowmobile." },
  { tema: "Migração e Transf.", pergunta: "AWS Application Discovery Service", resposta: "Ferramenta que ajuda a descobrir e mapear os ambientes locais para planejamento de migrações." },
  { tema: "Migração e Transf.", pergunta: "AWS Application Migration Service", resposta: "Serviço de migração que converte servidores físicos, virtuais ou em nuvem para a AWS, minimizando o tempo de inatividade." },
  { tema: "Migração e Transf.", pergunta: "AWS Schema Conversion Tool (AWS SCT)", resposta: "Ferramenta que facilita a migração de bancos de dados convertendo esquemas incompatíveis de um banco de dados de origem para um compatível com o banco de dados de destino." },
  { tema: "Redes, Entr. Conteúdo", pergunta: "<span style='color: red;'>Elastic Load Balancer (ELB)</span>", resposta: "Distribuir automaticamente o tráfego de entrada de aplicativos, instâncias EC2, contêineres, endereços IP e funções lambda." },
  { tema: "Redes, Entr. Conteúdo", pergunta: "<span style='color: red;'>AWS Transit Gateway</span>", resposta: "Conecte as Amazon VPCs, as contas da AWS e as redes on-premises a um único gateway por meio de um HUB central." },
  { tema: "Redes, Entr. Conteúdo", pergunta: "AWS App Mesh", resposta: "Redes ao nível de aplicações para todos os seus serviços." },
  { tema: "Redes, Entr. Conteúdo", pergunta: "<span style='color: red;'>Amazon VPC (Virtual Private Cloud)</span>", resposta: "Rede isolada logicamente, permite customizar um rede virtual e executar recursos, ambiente com total controle." },
  { tema: "Redes, Entr. Conteúdo", pergunta: "<span style='color: red;'>Amazon Route 53</span>", resposta: "Serviço que atual como DNS (Domain Name System), Registro de domínio." },
  { tema: "Redes, Entr. Conteúdo", pergunta: "<span style='color: red;'>Amazon CloudFront</span>", resposta: "Serviço de entrega de conteúdo, com segurança, baixa latência e alta velocidade." },
  { tema: "Redes, Entr. Conteúdo", pergunta: "<span style='color: red;'>AWS Direct Connect</span>", resposta: "Conexão dedicada e direta entre ambientes locais e a infra de nuvem AWS." },
  { tema: "Redes, Entr. Conteúdo", pergunta: "<span style='color: red;'>AWS VPN (Virtual Private Network)</span>", resposta: "Estenda suas redes no local para a nuvem e acesse-as com segurança de qualquer lugar, Possui Client VPN conecta usuarios e a Site-to-Site VPN cria túneis criptografados." },
  { tema: "Redes, Entr. Conteúdo", pergunta: "<span style='color: red;'>AWS Global Accelerator</span>", resposta: "Melhore a disponibilidade, a performance e a segurança de aplicações usando a rede global da AWS." },
  { tema: "Redes, Entr. Conteúdo", pergunta: "<span style='color: red;'>Amazon API Gateway</span>", resposta: "Serviço gerenciado que permite que desenvolvedores criem, publiquem, mantenham, monitorem e protejam APIs em qualquer escala com facilidade." },
  { tema: "Segurança", pergunta: "Criptografia em repouso, em trânsito e em uso", resposta: "Proteger informações, EM REPOUSO - arquivo em disco, EM TRÂNSITO - comunicação entre 2 partes, EM USO - durante a computação de dados." },
  { tema: "Segurança", pergunta: "<span style='color: red;'>AWS Identity and Access Management (IAM)</span>", resposta: "Serviço que permite gerenciar o acesso seguro aos recursos da AWS por meio de políticas, usuários, grupos e funções. Essencial para controle de acesso." },
  { tema: "Segurança", pergunta: "AWS IAM Identity Center (AWS Single Sign-On)", resposta: "Serviço que oferece acesso centralizado e simplificado a várias contas e aplicativos na AWS com logon único, promovendo segurança e facilidade de uso." },
  { tema: "Segurança", pergunta: "<span style='color: red;'>AWS Artifact</span>", resposta: "Repositório de documentos de conformidade, onde clientes podem acessar relatórios de auditoria e outros documentos para verificar a conformidade dos serviços AWS com regulamentações." },
  { tema: "Segurança", pergunta: "<span style='color: red;'>AWS Inspector</span>", resposta: "Serviço automatizado de gerenciamento de vulnerabilidade que verifica cargas de trabalho da AWS no EC2." },
  { tema: "Segurança", pergunta: "<span style='color: red;'>AWS Security Hub</span>", resposta: "Serviço de gerenciamento de segurança na nuvem(CSPM), agrega informações em um único local, corrige rapidamente." },
  { tema: "Segurança", pergunta: "<span style='color: red;'>AWS GuardDuty</span>", resposta: "Detecção de ameaças, monitora contas e cargas de trabalho, detecta atividade maliciosa, resultados detalhados, visibilidade e correção." },
  { tema: "Segurança", pergunta: "AWS RAM (Resource Access Manager)", resposta: "Serviço que simplifica e centraliza o compartilhamento, melhorar a colaboração entre contas." },
  { tema: "Segurança", pergunta: "<span style='color: red;'>AWS Detective</span>", resposta: "Visão consolidada fácil de entender, objetivo simplificar detecção e investigação de ameaças." },
  { tema: "Segurança", pergunta: "<span style='color: red;'>AWS Secrets Manager</span>", resposta: "Gerenciamento de segredos, armazenar, recuperar e rotacionar informações sensíveis, senhas, chaves de API." },
  { tema: "Segurança", pergunta: "AWS Directory Service", resposta: "Permite que você use Microsoft Active Directory (AD) com outros serviços AWS." },
  { tema: "Segurança", pergunta: "<span style='color: red;'>AWS Firewal Manager</span>", resposta: "Implementar politica de segurança em um único local, com regra de acesso e detecção de ameaças." },
  { tema: "Segurança", pergunta: "<span style='color: red;'>AWS KMS (Key Management Service)</span>", resposta: "Criação e o controle de chaves criptográficas, proteger seus dados." },
  { tema: "Segurança", pergunta: "<span style='color: red;'>Amazon Macie</span>", resposta: "Serviço de segurança e privacidade de dados que usa machine learning (ML) no S3." },
  { tema: "Segurança", pergunta: "<span style='color: red;'>AWS Cognito</span>", resposta: "Acesso de usuários a APP web móveis, com login de facebook, google." },
  { tema: "Segurança", pergunta: "AWS Audit Manager", resposta: "Audite continuamente o uso da AWS para simplificar a avaliação de risco e conformidade." },
  { tema: "Segurança", pergunta: "<span style='color: red;'>AWS Certificate Manager (ACM)</span>", resposta: "Provisione e gerencie certificados SSL/TLS com serviços da AWS e recursos conectados." },
  { tema: "Segurança", pergunta: "AWS CloudHSM", resposta: "Gerencie Hardware Security Modules (HSMs – Módulos de segurança de hardware), gerenciamento de chaves." },
  { tema: "Segurança", pergunta: "<span style='color: red;'>AWS WAF</span>", resposta: "Firewall de aplicativos web contra BOTS que podem afetar a disponibilidade, permite ou bloqueia o tráfego." },
  { tema: "Segurança", pergunta: "<span style='color: red;'>AWS SHIELD</span>", resposta: "Serviço gerenciado de proteção contra DDoS." },
  { tema: "Segurança", pergunta: "<span style='color: red;'>AWS Network Firewall</span>", resposta: "Serviço de implantação de segurança firewall de rede nas VPCs." },
  { tema: "Sem Servidor", pergunta: "<span style='color: red;'>AWS Fargate</span>", resposta: "Serviço de computação sem servidor para execução de contêineres na nuvem AWS, pagando conforme o uso." },
  { tema: "Sem Servidor", pergunta: "<span style='color: red;'>AWS Lambda</span>", resposta: "Serviço sem servidor, execute códigos sem provisionar pagando pelo número de solicitações e pelo tempo que usar, até 15 minutos." },
  { tema: "Armazenamento", pergunta: "<span style='color: red;'>Família AWS Snow</span>", resposta: "Dispositivos desenvolvidos especificamente para migrar petabytes de dados de forma econômica, offline. Snowcone, Snowball, Snowmobile." },
  { tema: "Armazenamento", pergunta: "Snowcone", resposta: "8TB de armazenamento, computação de borda." },
  { tema: "Armazenamento", pergunta: "<span style='color: red;'>Snowball</span>", resposta: "Storage optimized armazenamento, importa ou exportar, migrar dados até 100TB. Compute Optimized para computação, MIGRAR PETABYTES." },
  { tema: "Armazenamento", pergunta: "Snowmobile", resposta: "Migra dados na escala exabytes." },
  { tema: "Armazenamento", pergunta: "<span style='color: red;'>Amazon S3</span>", resposta: "Serviço gerenciado de armazenamento (ilimitado) e recuperação de objetos. Criar Website estático, Armazenar snapshot, backups, armaz. Híbrido." },
  { tema: "Armazenamento", pergunta: "<span style='color: red;'>S3 Standard</span>", resposta: "Uso geral, recuperação imediata." },
  { tema: "Geren. Governança", pergunta: "AWS Health Dashboard", resposta: "Painel que fornece insights e notificações em tempo real sobre o status dos serviços da AWS e seu impacto nos recursos do cliente." },
  { tema: "Geren. Governança", pergunta: "<span style='color: red;'>Amazon Organizations</span>", resposta: "Serviço usado para consolidar faturas em um único local." },
  { tema: "Geren. Governança", pergunta: "<span style='color: red;'>AWS CloudFormation</span>", resposta: "Infraestrutura como código." },
  { tema: "Geren. Governança", pergunta: "<span style='color: red;'>AWS Trusted Advisor</span>", resposta: "Ferramenta que fornece recomendações, Otimização de custo, desempenho/performance, segurança, tolerância a falhas, limites de serviços e excelência operacional." },
  { tema: "Geren. Governança", pergunta: "<span style='color: red;'>AWS Well-Architected</span>", resposta: "Excelência operacional, Segurança, Confiabilidade, Eficiência e performance, Otimização de custos, Sustentabilidade." },
  { tema: "Geren. Governança", pergunta: "<span style='color: red;'>AWS Config</span>", resposta: "Serviço que permite acessar, auditar e avaliar configurações de recursos AWS. Regional, histórico fica armazenado em um bucket S3." },
  { tema: "Geren. Governança", pergunta: "AWS Service Catalog", resposta: "Crie, compartilhe, organize e governe seus modelos de IaC selecionados. Catálogo de serviços." },
  { tema: "Geren. Governança", pergunta: "<span style='color: red;'>AWS Compute Optimizer</span>", resposta: "Serviço de recomendação para otimizar o uso ideal de recursos." },
  { tema: "Geren. Governança", pergunta: "<span style='color: red;'>AWS Control Tower</span>", resposta: "Serviço para configurar e governar um ambiente seguro e multicontas. Orquestra vários serviços AWS." },
  { tema: "Geren. Governança", pergunta: "AWS License Manager", resposta: "Serviço que gerencia suas licenças de software." },
  { tema: "Geren. Governança", pergunta: "<span style='color: red;'>AWS Auto Scaling</span>", resposta: "Serviço que ajusta automaticamente a capacidade de recursos de acordo com a demanda, ajudando a manter a performance e otimizar custos." },
  { tema: "Geren. Governança", pergunta: "<span style='color: red;'>AWS System Manager</span>", resposta: "Gerencie seus recursos na AWS e em ambientes de várias nuvens e híbridos." },
  { tema: "Migração e Transf.", pergunta: "AWS DataSync", resposta: "Simplifica e acelera a transferência de dados, sincronização contínua entre diferentes ambientes." },
  { tema: "Migração e Transf.", pergunta: "<span style='color: red;'>AWS Database Migration Service (DMS)</span>", resposta: "Migração de Banco de dados para a nuvem AWS." },
  { tema: "Migração e Transf.", pergunta: "<span style='color: red;'>AWS Migration Hub</span>", resposta: "Centraliza e orienta a migração, acompanha todas as migrações em um único lugar." },
  { tema: "Migração e Transf.", pergunta: "AWS Transfer Family", resposta: "Simplifica a migração de fluxo de trabalho, transferência de dados, protocolos SFTP, FTPS, FTP e AS2." },
  { tema: "Migração e Transf.", pergunta: "<span style='color: red;'>Família AWS Snow</span>", resposta: "Conjunto de dispositivos físicos para transferência de dados em larga escala entre o ambiente local e a AWS, incluindo Snowcone, Snowball e Snowmobile." },
  { tema: "Migração e Transf.", pergunta: "AWS Application Discovery Service", resposta: "Ferramenta que ajuda a descobrir e mapear os ambientes locais para planejamento de migrações." },
  { tema: "Migração e Transf.", pergunta: "AWS Application Migration Service", resposta: "Serviço de migração que converte servidores físicos, virtuais ou em nuvem para a AWS, minimizando o tempo de inatividade." },
  { tema: "Migração e Transf.", pergunta: "AWS Schema Conversion Tool (AWS SCT)", resposta: "Ferramenta que facilita a migração de bancos de dados convertendo esquemas incompatíveis de um banco de dados de origem para um compatível com o banco de dados de destino." },
  { tema: "Redes, Entr. Conteúdo", pergunta: "<span style='color: red;'>Elastic Load Balancer (ELB)</span>", resposta: "Distribuir automaticamente o tráfego de entrada de aplicativos, instâncias EC2, contêineres, endereços IP e funções lambda." },
  { tema: "Redes, Entr. Conteúdo", pergunta: "<span style='color: red;'>AWS Transit Gateway</span>", resposta: "Conecte as Amazon VPCs, as contas da AWS e as redes on-premises a um único gateway por meio de um HUB central." },
  { tema: "Redes, Entr. Conteúdo", pergunta: "AWS App Mesh", resposta: "Redes ao nível de aplicações para todos os seus serviços." },
  { tema: "Redes, Entr. Conteúdo", pergunta: "<span style='color: red;'>Amazon VPC (Virtual Private Cloud)</span>", resposta: "Rede isolada logicamente, permite customizar uma rede virtual e executar recursos, ambiente com total controle." },
  { tema: "Redes, Entr. Conteúdo", pergunta: "<span style='color: red;'>Amazon Route 53</span>", resposta: "Serviço que atua como DNS (Domain Name System), Registro de domínio." },
  { tema: "Redes, Entr. Conteúdo", pergunta: "<span style='color: red;'>Amazon CloudFront</span>", resposta: "Serviço de entrega de conteúdo, com segurança, baixa latência e alta velocidade." },
  { tema: "Redes, Entr. Conteúdo", pergunta: "<span style='color: red;'>AWS Direct Connect</span>", resposta: "Conexão dedicada e direta entre ambientes locais e a infra de nuvem AWS." },
  { tema: "Redes, Entr. Conteúdo", pergunta: "<span style='color: red;'>AWS VPN (Virtual Private Network)</span>", resposta: "Estenda suas redes no local para a nuvem e acesse-as com segurança de qualquer lugar, Possui Client VPN conecta usuários e a Site-to-Site VPN cria túneis criptografados." },
  { tema: "Redes, Entr. Conteúdo", pergunta: "<span style='color: red;'>AWS Global Accelerator</span>", resposta: "Melhore a disponibilidade, a performance e a segurança de aplicações usando a rede global da AWS." },
  { tema: "Redes, Entr. Conteúdo", pergunta: "<span style='color: red;'>Amazon API Gateway</span>", resposta: "Serviço gerenciado que permite que desenvolvedores criem, publiquem, mantenham, monitorem e protejam APIs em qualquer escala com facilidade." },  
  { tema: "Segurança", pergunta: "Criptografia em repouso, em trânsito e em uso", resposta: "Proteger informações, EM REPOUSO - arquivo em disco, EM TRÂNSITO - comunicação entre 2 partes, EM USO - durante a computação de dados." },
  { tema: "Segurança", pergunta: "<span style='color: red;'>AWS Identity and Access Management (IAM)</span>", resposta: "Serviço que permite gerenciar o acesso seguro aos recursos da AWS por meio de políticas, usuários, grupos e funções. Essencial para controle de acesso." },
  { tema: "Segurança", pergunta: "AWS IAM Identity Center (AWS Single Sign-On)", resposta: "Serviço que oferece acesso centralizado e simplificado a várias contas e aplicativos na AWS com logon único, promovendo segurança e facilidade de uso." },
  { tema: "Segurança", pergunta: "<span style='color: red;'>AWS Artifact</span>", resposta: "Repositório de documentos de conformidade, onde clientes podem acessar relatórios de auditoria e outros documentos para verificar a conformidade dos serviços AWS com regulamentações." },
  { tema: "Segurança", pergunta: "<span style='color: red;'>AWS Inspector</span>", resposta: "Serviço automatizado de gerenciamento de vulnerabilidade que verifica cargas de trabalho da AWS no EC2" },
  { tema: "Segurança", pergunta: "<span style='color: red;'>AWS Security Hub</span>", resposta: "Serviço de gerenciamento de segurança na nuvem (CSPM), agrega informações em um único local, corrige rapidamente" },
  { tema: "Segurança", pergunta: "<span style='color: red;'>AWS GuardDuty</span>", resposta: "Detecção de ameaças, monitora contas e cargas de trabalho, detecta atividade maliciosa, resultados detalhados, visibilidade e correção." },
  { tema: "Segurança", pergunta: "AWS RAM (Resource Access Manager)", resposta: "Serviço que simplifica e centraliza o compartilhamento, melhorar a colaboração entre contas." },
  { tema: "Segurança", pergunta: "<span style='color: red;'>AWS Detective</span>", resposta: "Visão consolidada fácil de entender, objetivo simplificar detecção e investigação de ameaças." },
  { tema: "Segurança", pergunta: "<span style='color: red;'>AWS Secrets Manager</span>", resposta: "Gerenciamento de segredos, armazenar, recuperar e rotacionar informações sensíveis, senhas, chaves de API." },
  { tema: "Segurança", pergunta: "AWS Directory Service", resposta: "Permite que você use Microsoft Active Directory (AD) com outros serviços AWS." },
  { tema: "Segurança", pergunta: "<span style='color: red;'>AWS Firewal Manager</span>", resposta: "Implementar política de segurança em um único local, com regra de acesso e detecção de ameaças." },
  { tema: "Segurança", pergunta: "<span style='color: red;'>AWS KMS (Key Management Service)</span>", resposta: "Criação e o controle de chaves criptográficas, proteger seus dados." },
  { tema: "Segurança", pergunta: "<span style='color: red;'>Amazon Macie</span>", resposta: "Serviço de segurança e privacidade de dados que usa machine learning (ML) no S3" },
  { tema: "Segurança", pergunta: "<span style='color: red;'>AWS Cognito</span>", resposta: "Acesso de usuários a APP web móveis, com login de facebook, google" },
  { tema: "Segurança", pergunta: "AWS Audit Manager", resposta: "Audite continuamente o uso da AWS para simplificar a avaliação de risco e conformidade" },
  { tema: "Segurança", pergunta: "<span style='color: red;'>AWS Certificate Manager (ACM)</span>", resposta: "Provisione e gerencie certificados SSL/TLS com serviços da AWS e recursos conectados" },
  { tema: "Segurança", pergunta: "AWS CloudHSM", resposta: "Gerencie Hardware Security Modules (HSMs – Módulos de segurança de hardware), gerenciamento de chaves" },
  { tema: "Segurança", pergunta: "<span style='color: red;'>AWS WAF</span>", resposta: "Firewall de aplicativos web contra BOTS que podem afetar a disponibilidade, permite ou bloqueia o tráfego." },
  { tema: "Segurança", pergunta: "<span style='color: red;'>AWS SHIELD</span>", resposta: "Serviço gerenciado de proteção contra DDoS." },
  { tema: "Segurança", pergunta: "<span style='color: red;'>AWS Network Firewall</span>", resposta: "Serviço de implantação de segurança firewall de rede nas VPCs." },
  { tema: "Sem Servidor", pergunta: "<span style='color: red;'>AWS Fargate</span>", resposta: "Serviço de computação sem servidor para execução de contêineres na nuvem AWS, pagando conforme o uso." },
  { tema: "Sem Servidor", pergunta: "<span style='color: red;'>AWS Lambda</span>", resposta: "Serviço sem servidor, execute códigos sem provisionar pagando pelo número de solicitações e pelo tempo que usar, até 15 minutos." },
  { tema: "Armazenamento", pergunta: "<span style='color: red;'>Família AWS Snow</span>", resposta: "Dispositivos desenvolvidos especificamente para migrar petabytes de dados de forma econômica, offline. Snowcone, Snowball, Snowmobile" },
  { tema: "Armazenamento", pergunta: "Snowcone", resposta: "8TB de armazenamento, computação de borda" },
  { tema: "Armazenamento", pergunta: "<span style='color: red;'>Snowball</span>", resposta: "Storage optimized armazenamento, importa ou exporta, migrar dados até 100TB. Compute Optimized para computação, MIGRAR PETABYTES." },
  { tema: "Armazenamento", pergunta: "Snowmobile", resposta: "Migra dados na escala exabytes" },
  { tema: "Armazenamento", pergunta: "<span style='color: red;'>Amazon S3</span>", resposta: "Serviço gerenciado de armazenamento (ilimitado) e recuperação de objetos. Criar Web site estático, Armazenar snapshot, backups, armaz. Híbrido." },
  { tema: "Armazenamento", pergunta: "<span style='color: red;'>S3 Standard</span>", resposta: "Uso geral, recuperação imediata" },
  { tema: "Armazenamento", pergunta: "<span style='color: red;'>S3 Intelligent Tiering</span>", resposta: "Uso geral e movimentação automática" },
  { tema: "Armazenamento", pergunta: "<span style='color: red;'>S3 Standar IA</span>", resposta: "Menor frequência e ideal para backup" },
  { tema: "Armazenamento", pergunta: "<span style='color: red;'>S3 One Zone IA</span>", resposta: "Menor frequência mas só em uma ZD" },
  { tema: "Armazenamento", pergunta: "<span style='color: red;'>S3 Glacier</span>", resposta: "Dados armazenados como arquivos de longo prazo, recuperação minutos ou horas" },
  { tema: "Armazenamento", pergunta: "<span style='color: red;'>S3 Glacier Deep Archive</span>", resposta: "Retenção de longo prazo, acima de 7 anos, recuperação de até 12 horas." },
  { tema: "Armazenamento", pergunta: "<span style='color: red;'>S3 Glacier Instant Retrieval</span>", resposta: "Armazenamento de baixo custo, recuperação de milissegundos para dados raramente acessados" },
  { tema: "Armazenamento", pergunta: "<span style='color: red;'>Amazon EBS (Elastic Block Store)</span>", resposta: "Armazenamento de blocos persistentes, pode ser conectado ao EC2 e usado como um disco." },
  { tema: "Armazenamento", pergunta: "<span style='color: red;'>Amazon EFS (Elastic File System)</span>", resposta: "Sistema de arquivos de rede elástico, acesso a múltiplas ZD, conexão de múltiplos EC2." },
  { tema: "Armazenamento", pergunta: "AWS Elastic Disaster Recovery", resposta: "Serviço de recuperação de desastres que replica servidores de produção para a AWS e permite a recuperação rápida em caso de interrupções, minimizando perda de dados e tempo de inatividade." },
  { tema: "Armazenamento", pergunta: "<span style='color: red;'>AWS Storage Gateway</span>", resposta: "Serviço que conecta o ambiente ON-PREMISES para o serviço de armazenamento na nuvem AWS." },
  { tema: "Armazenamento", pergunta: "<span style='color: red;'>Amazon FSx</span>", resposta: "FILE SERVER armazenar dados, protocolo SMB/ NFS, suporte de ambientes, aprendizado de máquina, arquivos compartilhaods." },
  { tema: "Armazenamento", pergunta: "<span style='color: red;'>AWS Backup</span>", resposta: "Permite gerenciar e automatizar a proteção de dados de maneira centralizada entre produtos." },
  { tema: "Aws CAF", pergunta: "<span style='color: red;'>Negócios</span>", resposta: "Foca na criação de valor de negócios a partir do uso da nuvem. Essa perspectiva orienta a definição de KPIs (indicadores de desempenho) e métricas que alinham a adoção da nuvem com os objetivos estratégicos da organização." },
  { tema: "Aws CAF", pergunta: "<span style='color: red;'>Pessoas</span>", resposta: "Foca nas habilidades e na transformação de talentos. Inclui treinamentos, desenvolvimento de habilidades e gerenciamento de mudanças para preparar os funcionários e equipes para trabalhar na nuvem." },
  { tema: "Aws CAF", pergunta: "<span style='color: red;'>Governança</span>", resposta: "Envolve a gestão de portfólios, projetos e programas de maneira eficiente. Isso inclui a criação de políticas, processos e modelos de governança para monitorar e controlar os investimentos na nuvem." },
  { tema: "Aws CAF", pergunta: "<span style='color: red;'>Plataforma</span>", resposta: "Relaciona-se à construção de uma base tecnológica robusta. Inclui arquitetura de TI, automação, e padrões para a criação de soluções seguras e escaláveis na nuvem." },
  { tema: "Aws CAF", pergunta: "<span style='color: red;'>Segurança</span>", resposta: "Envolve a criação de uma estrutura de segurança que protege dados e aplicações. Engloba autenticação, gerenciamento de identidades, criptografia e conformidade com regulamentações." },
  { tema: "Aws CAF", pergunta: "<span style='color: red;'>Operações</span>", resposta: "Foca em operações diárias de gerenciamento de infraestrutura e aplicativos na nuvem. Visa criar processos de monitoramento, suporte e melhorias contínuas para garantir eficiência e alta disponibilidade." },
  { tema: "Instâncias EC2", pergunta: "<span style='color: red;'>Sob Demanda</span>", resposta: "Indicado para cargas de trabalho com demandas variáveis e imprevisíveis, onde não há necessidade de compromissos a longo prazo." },
  { tema: "Instâncias EC2", pergunta: "<span style='color: red;'>Reservadas</span>", resposta: "Ideal para cargas de trabalho estáveis e previsíveis, onde o uso é garantido por longos períodos (ex. bancos de dados ou servidores de backend em produção)." },
  { tema: "Instâncias EC2", pergunta: "<span style='color: red;'>Spot</span>", resposta: "Indicadas para cargas de trabalho flexíveis e tolerantes a falhas, como processamento em lote, análise de Big Data e testes de desenvolvimento." },
  { tema: "Instâncias EC2", pergunta: "<span style='color: red;'>Dedicadas</span>", resposta: "Necessárias para ambientes que exigem isolamento físico, geralmente por razões de conformidade ou regulatórias (ex. setores de saúde e financeiro)." },
  { tema: "Instâncias EC2", pergunta: "<span style='color: red;'>Hosts Dedicados</span>", resposta: "Ideal para empresas que precisam de controle físico completo do servidor para cumprir licenças de software ou regulamentos específicos." },
  { tema: "Infra global", pergunta: "Regiões da AWS (AWS Regions)", resposta: "Uma Região AWS é um local geográfico onde a AWS concentra seus data centers, oferecendo serviços com baixa latência em áreas específicas do mundo." },
  { tema: "Infra global", pergunta: "Zonas de Disponibilidade (Availability Zones - AZs)", resposta: "Uma Zona de Disponibilidade é uma área distinta dentro de uma Região, com um ou mais data centers fisicamente separados, mas conectados com baixa latência." },
  { tema: "Infra global", pergunta: "Pontos de Presença - Locais de borda", resposta: "Pontos de Presença são usados para otimizar a entrega de conteúdo em várias localidades com baixa latência." },
  { tema: "Segurança da Nuvem", pergunta: "<span style='color: red;'>Segurança da Nuvem</span>", resposta: "A AWS é responsável pela segurança da própria infraestrutura de nuvem, o que inclui proteger a infraestrutura física e os recursos fundamentais que suportam todos os serviços oferecidos. Isso abrange:" },
  { tema: "Segurança da Nuvem", pergunta: "<span style='color: red;'>Responsabilidade da AWS</span>", resposta: "Infraestrutura Física: Controle e segurança dos data centers, incluindo energia, refrigeração e segurança física." },
  { tema: "Segurança da Nuvem", pergunta: "<span style='color: red;'>Responsabilidade da AWS</span>", resposta: "Hardware e Software: Manutenção de servidores, armazenamento e rede." },
  { tema: "Segurança da Nuvem", pergunta: "<span style='color: red;'>Responsabilidade da AWS</span>", resposta: "Serviços Fundamentais: Configuração e gerenciamento de sistemas operacionais de nível host para bancos de dados, computação e rede subjacente." },
  { tema: "Segurança da Nuvem", pergunta: "<span style='color: red;'>Segurança na Nuvem</span>", resposta: "O cliente é responsável pela segurança de tudo que ele constrói e gerencia na nuvem, o que inclui as configurações e o gerenciamento de dados, aplicativos e componentes do sistema" },
  { tema: "Segurança na Nuvem", pergunta: "<span style='color: red;'>Responsabilidade do Cliente</span>", resposta: "Gerenciamento de Dados: Controle e encriptação dos dados que o cliente armazena na nuvem." },
  { tema: "Segurança na Nuvem", pergunta: "<span style='color: red;'>Responsabilidade do Cliente</span>", resposta: "Controle de Acesso e Identidade: Definir e monitorar permissões de acesso usando AWS IAM (Identity and Access Management), implementando autenticação multifator (MFA) e gerenciando chaves de acesso." },
  { tema: "Segurança na Nuvem", pergunta: "<span style='color: red;'>Responsabilidade do Cliente</span>", resposta: "Configuração de Segurança: Definir as políticas de segurança para serviços como o Amazon S3, configurando permissões adequadas para buckets e implementando regras de firewall no Amazon EC2." },
  { tema: "Segurança na Nuvem", pergunta: "<span style='color: red;'>Responsabilidade do Cliente</span>", resposta: "Aplicativos e Patches: Manter o software atualizado e aplicar patches de segurança nos sistemas operacionais das instâncias EC2 e nos aplicativos instalados." },
  { tema: "AWS Support Center", pergunta: "AWS Support Center", resposta: "É uma plataforma que permite que os clientes da AWS gerenciem suas interações de suporte com a Amazon." },
  { tema: "AWS Support Center", pergunta: "Solicitar suporte", resposta: "Os usuários podem abrir casos de suporte para resolver problemas técnicos, obter ajuda com a configuração de serviços ou fazer perguntas sobre a utilização da AWS." },
  { tema: "AWS Support Center", pergunta: "Gerenciar casos de suporte", resposta: "Permite que os usuários visualizem e gerenciem todos os seus casos de suporte em um só lugar." },
  { tema: "AWS Support Center", pergunta: "Acessar documentação", resposta: "Oferece links para recursos úteis, como documentação da AWS, perguntas frequentes e artigos da base de conhecimento." },
  { tema: "Planos de Suporte da AWS", pergunta: "<span style='color: red;'>Planos de Suporte da AWS Basic</span>", resposta: "Acesso 24/7 ao suporte técnico por meio do AWS Support Center.\nAcesso à documentação da AWS, whitepapers e fóruns da comunidade.\nSem custo adicional; disponível para todos os clientes da AWS." },
  { tema: "Planos de Suporte da AWS", pergunta: "<span style='color: red;'>Planos de Suporte da AWS Developer</span>", resposta: "Todos os benefícios do plano Basic.\nRespostas a perguntas sobre melhores práticas de arquitetura.\nAcesso a suporte técnico durante horário comercial (com prazos de resposta em até 12 horas).\nRecomendação de práticas recomendadas e suporte a serviços específicos." },
  { tema: "Planos de Suporte da AWS", pergunta: "<span style='color: red;'>Planos de Suporte da AWS Business</span>", resposta: "Todos os benefícios do plano Developer.\nSuporte técnico 24/7 via telefone, chat e email.\nPrazos de resposta em até 1 hora para casos críticos.\nAcesso a ferramentas de gerenciamento de contas e suporte a serviços abrangentes.\nConsultas sobre melhor uso de serviços da AWS." },
  { tema: "Planos de Suporte da AWS", pergunta: "<span style='color: red;'>Planos de Suporte da AWS Enterprise</span>", resposta: "Todos os benefícios do plano Business.\nGerente de conta técnico (TAM) dedicado.\nSuporte técnico 24/7 com resposta em até 15 minutos para casos críticos.\nAcesso a consultoria sobre arquitetura, segurança e gerenciamento.\nFerramentas de suporte avançadas e acesso a treinamentos." },
  { tema: "Well-Architected Framework", pergunta: "<span style='color: red;'>Excelência Operacional</span>", resposta: "Foca em melhorar e manter sistemas em produção, incluindo práticas para monitoramento, gerenciamento de incidentes e mudanças." },
  { tema: "Well-Architected Framework", pergunta: "<span style='color: red;'>Segurança</span>", resposta: "Trata da proteção de dados e sistemas, envolvendo gerenciamento de identidade e acesso, proteção de dados e monitoramento de atividades suspeitas." },
  { tema: "Well-Architected Framework", pergunta: "<span style='color: red;'>Confiabilidade</span>", resposta: "Refere-se à capacidade de um sistema se recuperar de falhas e atender à demanda, incluindo práticas para resiliência e backups." },
  { tema: "Well-Architected Framework", pergunta: "<span style='color: red;'>Eficiência e Performance</span>", resposta: "Foca em utilizar os recursos de forma eficiente para atender às necessidades do sistema, otimizando desempenho e adaptabilidade." },
  { tema: "Well-Architected Framework", pergunta: "<span style='color: red;'>Otimização de Custos</span>", resposta: "Trata de minimizar custos enquanto atende às necessidades de desempenho, envolvendo análise de uso e escolha de serviços." },
  { tema: "Well-Architected Framework", pergunta: "<span style='color: red;'>Sustentabilidade</span>", resposta: "O pilar mais recente, que se concentra em práticas que ajudam a projetar e operar sistemas de forma sustentável, minimizando o impacto ambiental." },
  { tema: "Infraestrutura como Código", pergunta: "O que é Infraestrutura como Código?", resposta: "É uma prática que permite gerenciar a infraestrutura de TI por meio de código, em vez de fazer isso manualmente." },
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