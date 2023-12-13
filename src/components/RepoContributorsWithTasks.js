// Importando componentes e funcionalidades do React e bibliotecas relacionadas
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { LogOut } from "lucide-react";
import {
  Container,
  ModalContainer,
  Header,
  Button,
  Modal,
  TextArea,
  Select,
  Label,
  CloseButton,
  TaskCard,
  ButtonContainer,
  TaskButton,
  TaskGrid,
  Backdrop,
  ListItem,
  Input,
  List,
  TruckFactorContainer,
  TruckFactorTitle,
  CriticalDevelopersText,
  SkillsGrid,
  ModalTitle,
  ModalHeader,
  SkillLabel,
  SkillSelect,
  SaveButton,
  SkillRow,
  LoadingOverlay,
  Spinner,
} from "./RepoContributorsWithTasksStyles"; // Importação de estilos do componente
import AddTaskModal from "./AddTaskModal"; // Importação do modal para adicionar tarefas
import TrelloLogin from "./TrelloLogin"; // Ajuste o caminho se necessário
import axios from "axios";
// Importando funções para interagir com o Firestore (base de dados Firebase)
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  addDoc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore/lite";
import { db } from "../config/firebaseConfig"; // Importa a referência do banco de dados do Firebase

// Função para determinar o nível de contribuição com base no grau de autori
const devLevelMapping = {
  júnior: 1,
  pleno: 2,
  sênior: 3,
};

// Componente principal
function RepoContributorsWithTasks() {
  // Definindo o estado inicial dos colaboradores e tarefas
  const [contributors, setContributors] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Obtendo o 'owner' e 'repo' da URL via React Router
  const { owner, repo } = useParams();
  async function getExistingTasks() {
    const repoTasksCollection = collection(
      db,
      "repositories",
      `${owner}_${repo}`,
      "tasks"
    );
    const taskSnapshot = await getDocs(repoTasksCollection);
    return taskSnapshot.docs.map((doc) => doc.data());
  }

  // Obtendo o token de autenticação do GitHub do armazenamento local
  const token = localStorage.getItem("github_token");
  const [activeModal, setActiveModal] = useState(null); // Controle do modal ativo
  const [showDevelopersModal, setShowDevelopersModal] = useState(false); // Controla a exibição do modal de desenvolvedores
  const [newContributorUsername, setNewContributorUsername] = useState(""); //adiciona contribuidores
  const [newContributorEspecialidade, setNewContributorEspecialidade] =
    useState(""); // Estado para o tipo do colaborador
  const [newContributorDevLevel, setNewContributorDevLevel] = useState(""); // Estado para o nível do colaborador (se for desenvolvimento)

  useEffect(() => {
    // Função para buscar as tarefas do repositório no Firestore
    async function fetchTasks() {
      const repoTasksCollection = collection(
        db,
        "repositories",
        `${owner}_${repo}`,
        "tasks"
      );
      const taskSnapshot = await getDocs(repoTasksCollection);
      const tasksList = taskSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTasks(tasksList);
    }

    fetchTasks();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dependência vazia significa que o efeito será executado uma vez ao montar o componente

  async function fetchContributorsFromFirestore() {
    let contributorsMatrix = [];
    try {
      const repoDocRef = doc(db, "repositories", `${owner}_${repo}`);
      const contributorsCollection = collection(repoDocRef, "contributors");
      const contributorSnapshot = await getDocs(contributorsCollection);

      contributorSnapshot.docs.forEach((doc) => {
        let contributorData = doc.data();

        // Verifica se o campo 'skills' existe e, se não, inicializa com 0
        if (!contributorData.skills) {
          contributorData.skills = {};
          availableSkills.forEach((skill) => {
            contributorData.skills[skill] = 0;
          });
        }

        // Transforma o objeto de habilidades em um array de valores
        let skillsArray = availableSkills.map(
          (skill) => contributorData.skills[skill] || 0
        );

        contributorsMatrix.push(skillsArray);
      });

      console.log("Matriz de contribuidores carregada:", contributorsMatrix);
    } catch (error) {
      console.error("Erro ao buscar contribuidores do Firestore:", error);
    }
    return contributorsMatrix;
  }
  async function initializeSkillsForAllContributors() {
    const contributorsCollection = collection(
      db,
      "repositories",
      `${owner}_${repo}`,
      "contributors"
    );
    const querySnapshot = await getDocs(contributorsCollection);

    querySnapshot.forEach(async (docSnapshot) => {
      let contributorData = docSnapshot.data();

      // Verifica se o campo 'skills' existe e está completo
      let needsUpdate = false;
      const updatedSkills = availableSkills.reduce((acc, skill) => {
        if (
          !contributorData.skills ||
          contributorData.skills[skill] === undefined
        ) {
          needsUpdate = true;
          acc[skill] = 0; // valor padrão
        } else {
          acc[skill] = contributorData.skills[skill];
        }
        return acc;
      }, {});

      if (needsUpdate) {
        await updateDoc(docSnapshot.ref, { skills: updatedSkills });
        console.log(`Habilidades atualizadas para ${docSnapshot.id}`);
      }
    });
  }

  // Chame esta função em um useEffect ou em um evento apropriado

  useEffect(() => {
    async function fetchAndSetContributors() {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contributors`,
          {
            headers: {
              Authorization: `token ${token}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );
        const githubContributors = await response.json();

        if (!Array.isArray(githubContributors)) {
          throw new Error("Expected data to be an array");
        }

        const totalCommits = githubContributors.reduce(
          (acc, contributor) => acc + contributor.contributions,
          0
        );

        const updatedContributors = await Promise.all(
          githubContributors.map(async (contributor) => {
            return {
              ...contributor,
              contribuit: contributor.contributions,
              experience: contributor.contributions / totalCommits,
            };
          })
        );

        setContributors(updatedContributors);

        // Calculando o grau de autoria e o nível de cada colaborador
        const contributorsWithCommits = await Promise.all(
          githubContributors.map(async (contributor) => {
            const commitsResponse = await fetch(
              `https://api.github.com/repos/${owner}/${repo}/commits`,
              {
                headers: {
                  Authorization: `token ${token}`,
                  Accept: "application/vnd.github.v3+json",
                },
              }
            );
            const commitsData = await commitsResponse.json();
            const contributorCommits = commitsData.filter(
              (commit) =>
                commit.author && commit.author.login === contributor.login
            );

            return {
              ...contributor,
              commits: contributorCommits.length,

              isActive:
                contributor.isActive !== undefined
                  ? contributor.isActive
                  : true, // se isActive não estiver definido, defina como true
              role: contributor.role || "desenvolvimento", // se role não estiver definido, defina como "desenvolvimento"
            };
          })
        );

        // Buscar contribuidores do Firestore
        const firestoreContributors = await fetchContributorsFromFirestore();

        // Combinar contribuidores do GitHub e Firestore, removendo duplicatas
        const combinedContributors = [
          ...contributorsWithCommits,
          ...firestoreContributors.filter(
            (contributor) =>
              !contributorsWithCommits.find(
                (c) => c.login === contributor.login
              )
          ),
        ];

        // Atualizar o estado com a lista combinada de contribuidores
        setContributors(combinedContributors);
        console.log("Updated contributors with skills", updatedContributors);

        /// Aqui, você salva os contribuidores no Firestore
        const repoDocRef = doc(db, "repositories", `${owner}_${repo}`); // Referência ao documento do repositório
        const contributorsCollection = collection(repoDocRef, "contributors"); // Subcoleção "contributors"

        // Primeiro, vamos verificar se o documento do repositório já existe
        const repoDocSnapshot = await getDoc(repoDocRef);
        if (!repoDocSnapshot.exists()) {
          // Se o documento do repositório não existir, criamos um
          await setDoc(repoDocRef, { owner, repo }); // ou qualquer outro dado relevante
        }

        // Agora, salvamos cada contribuidor na subcoleção
        contributorsWithCommits.forEach(async (contributor) => {
          // Você pode querer criar um ID único para cada contribuidor ou usar um identificador existente, como o login do GitHub
          const contributorId = contributor.login; // ou outro identificador único
          const contributorDocRef = doc(contributorsCollection, contributorId);

          // Verificamos se o contribuidor já existe para evitar duplicatas
          const contributorDocSnapshot = await getDoc(contributorDocRef);
          if (!contributorDocSnapshot.exists()) {
            // Se o contribuidor não existir, adicionamos ao Firestore
            await setDoc(contributorDocRef, contributor);
          } else {
            // Se o contribuidor já existir, você pode optar por atualizar os dados existentes ou pular
            // Para atualizar, você pode usar a função updateDoc()
            // await updateDoc(contributorDocRef, contributor);
          }
        });
      } catch (error) {
        console.error("Error fetching and setting contributors:", error);
      }
    }

    fetchAndSetContributors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner, repo, token]);

  // Função para alternar a ativação/desativação de um colaborador
  const toggleContributor = async (id) => {
    setContributors((prevContributors) =>
      prevContributors.map((contributor) => {
        if (contributor.id === id) {
          const updatedContributor = {
            ...contributor,
            isActive: !contributor.isActive,
          };

          // Atualizar no Firestore
          const contributorDocRef = doc(
            db,
            "repositories",
            `${owner}_${repo}`,
            "contributors",
            updatedContributor.login
          );

          updateDoc(contributorDocRef, {
            isActive: updatedContributor.isActive,
          })
            .then(() => {
              console.log("Contributor updated successfully");
            })
            .catch((error) => {
              console.error("Error updating contributor:", error);
            });

          return updatedContributor;
        }
        return contributor;
      })
    );
  };

  // Função para adicionar uma tarefa
  const handleAddTask = useCallback(
    (task) => {
      setTasks((prevTasks) => [...prevTasks, task]); // Adiciona a nova tarefa ao final do array
      const contributor = contributors.find(
        (c) => c.login === task.desenvolvedor
      );
      if (contributor) {
        contributor.tasksCount = (contributor.tasksCount || 0) + 1;
      }
    },
    [contributors, setTasks]
  );

  // Função para deletar uma tarefa
  const handleDeleteTask = async (taskId) => {
    // Referência para o documento da tarefa no Firestore
    const taskDocRef = doc(
      db,
      "repositories",
      `${owner}_${repo}`,
      "tasks",
      taskId
    );

    try {
      // Exclui o documento da coleção no Firestore
      await deleteDoc(taskDocRef);

      // Atualiza o estado para remover a tarefa da lista
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

      console.log("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Função para editar uma tarefa
  const handleEditTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      setActiveModal(taskToEdit);
    }
  };

  // Função para atualizar a tarefa no modal ativo
  const handleUpdateActiveModal = (field, value) => {
    setActiveModal((prevTask) => ({ ...prevTask, [field]: value }));
  };

  const assignTasksToDevelopers = async () => {
    console.log("Optimization Result:", optimizationResult);
    console.log("Number of tasks:", tasks.length);

    const bestSolution = optimizationResult && optimizationResult[0];

    if (!bestSolution || bestSolution.length !== tasks.length) {
      console.warn(
        "Dados de otimização indisponíveis ou em formato incorreto."
      );
      return;
    }

    // Crie um array para armazenar todas as promessas de atualização
    const updatePromises = [];

    const updatedTasks = tasks.map((task, index) => {
      const developerIndex = bestSolution[index];
      const assignedDeveloper = contributors[developerIndex];

      if (!assignedDeveloper) {
        console.warn(
          `Desenvolvedor não encontrado para a tarefa no índice ${index}`
        );
        return task;
      }

      const updatedTask = {
        ...task,
        desenvolvedor: assignedDeveloper.login,
        status: "in_progress",
      };

      const taskDocRef = doc(
        db,
        "repositories",
        `${owner}_${repo}`,
        "tasks",
        task.id
      );

      updatePromises.push(updateDoc(taskDocRef, updatedTask));

      return updatedTask;
    });

    // Aguarde todas as promessas de atualização serem concluídas
    try {
      await Promise.all(updatePromises);
      console.log(
        "Todas as tarefas foram atualizadas com sucesso no Firestore"
      );
    } catch (error) {
      console.error("Erro ao atualizar tarefas no Firestore:", error);
    }

    // Atualize o estado das tarefas
    setTasks(updatedTasks);
  };

  // Para adicionar um novo colaborador:
  const addNewContributor = async () => {
    if (!newContributorUsername) return;

    try {
      const response = await fetch(
        `https://api.github.com/users/${newContributorUsername}`,
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      const data = await response.json();

      if (!data.login) {
        throw new Error("Nome de usuário inválido");
      }

      // Criando o objeto newContributor a partir de data
      const newContributor = {
        ...data,
        commits: 0,
        isActive: true, // assumindo que o novo colaborador está ativo
        role: newContributorEspecialidade || "desenvolvimento", // assumindo que todos são desenvolvedores, ajuste conforme necessário
        tasksCount: 0,
        devLevel: devLevelMapping[newContributorDevLevel] || 1, // valor padrão se não estiver definido
        skills: [],
      };

      // Adicionando ao estado local
      setContributors((prevContributors) => [
        ...prevContributors,
        newContributor,
      ]);

      // Limpa os campos de entrada
      setNewContributorUsername("");
      setNewContributorEspecialidade("");
      setNewContributorDevLevel("");

      // Adicionando ao Firestore
      const repoDocRef = doc(db, "repositories", `${owner}_${repo}`); // Referência ao documento do repositório
      const contributorsCollection = collection(repoDocRef, "contributors"); // Subcoleção "contributors"

      // Criar um ID único para o novo colaborador ou usar um identificador existente, como o login do GitHub
      const contributorId = newContributor.login; // ou outro identificador único
      const contributorDocRef = doc(contributorsCollection, contributorId);

      // Verificar se o contribuidor já existe para evitar duplicatas
      const contributorDocSnapshot = await getDoc(contributorDocRef);
      if (!contributorDocSnapshot.exists()) {
        // Se o contribuidor não existir, adicionamos ao Firestore
        await setDoc(contributorDocRef, newContributor);
      } else {
        await updateDoc(contributorDocRef, newContributor);
      }
    } catch (error) {
      console.error("Erro ao adicionar novo colaborador:", error);
    }
  };
  const [selectedContributor, setSelectedContributor] = useState(null);

  const handleTrelloCardsFetched = async (trelloCards) => {
    try {
      const existingTasks = await getExistingTasks(); // Obter tarefas existentes

      const newTrelloTasks = trelloCards.map((card) => ({
        id: card.id,
        description: card.name, // ou outro campo relevante do card do Trello
        difficulty: "1", // valor padrão ou mapeado de um campo do Trello
        desenvolvedor: "", // inicialmente sem desenvolvedor atribuído
        status: "to_do", // as tarefas do Trello começam como "to_do"
        skills: [],
      }));

      // Filtrar tarefas que já existem
      const uniqueTrelloTasks = newTrelloTasks.filter(
        (newTask) =>
          !existingTasks.some((existingTask) => existingTask.id === newTask.id)
      );

      // Adicionar tarefas únicas ao estado
      if (uniqueTrelloTasks.length > 0) {
        setTasks((prevTasks) => [...prevTasks, ...uniqueTrelloTasks]);

        // Adicionar tarefas únicas ao Firestore
        const tasksCollection = collection(
          db,
          "repositories",
          `${owner}_${repo}`,
          "tasks"
        );

        for (const task of uniqueTrelloTasks) {
          await addDoc(tasksCollection, task);
        }
      }
    } catch (e) {
      console.error("Error processing Trello cards: ", e);
      // Aqui, você pode adicionar lógica adicional para lidar com erros, como mostrar uma mensagem para o usuário.
    }
  };

  const [boardId, setBoardId] = useState("");
  // Função para realizar logout do usuário
  function handleLogout() {
    localStorage.removeItem("github_token");

    // Remove o token e os dados do usuário do localStorage
    localStorage.removeItem("github_token");
    localStorage.removeItem("github_user_data");

    // Redireciona para a página inicial
    window.location.href = "/";
  }

  const [agentSkills] = useState([]);

  // Exemplo de uso do estado agentSkills
  useEffect(() => {
    console.log("Habilidades Atualizadas dos Agentes:", agentSkills);
  }, [agentSkills]);

  const [response, setResponse] = useState(null);
  const [setRepositoryContent] = useState([]);

  useEffect(() => {
    const fetchRepositoryContent = async () => {
      try {
        const response = await axios.get(
          `https://api.github.com/repos/${owner}/${repo}/contents`
        );
        setRepositoryContent(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados do repositório:", error);
      }
    };

    fetchRepositoryContent();
  }, [owner, repo]);

  useEffect(() => {
    const fetchRepositoryContent = async () => {
      try {
        const response = await axios.get(
          `https://api.github.com/repos/${owner}/${repo}/contents`
        );
        setRepositoryContent(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados do repositório:", error);
      }
    };

    fetchRepositoryContent();
  }, [owner, repo]);

  // Função que combina os contribuidores do GitHub com os do Firestore sem duplicatas
  async function combineContributors(
    githubContributors,
    firestoreContributors
  ) {
    // Cria um novo mapa onde a chave é o login do contribuidor
    const combinedContributorsMap = new Map();

    // Primeiro, adiciona todos os contribuidores do Firestore ao mapa
    firestoreContributors.forEach((firestoreContributor) => {
      combinedContributorsMap.set(
        firestoreContributor.login,
        firestoreContributor
      );
    });

    // Depois, passa pelos contribuidores do GitHub e adiciona ou atualiza as entradas no mapa
    githubContributors.forEach((githubContributor) => {
      // Se o contribuidor do GitHub já estiver no mapa, você pode decidir como mesclar os dados
      if (combinedContributorsMap.has(githubContributor.login)) {
        // Aqui, você pode mesclar as informações do GitHub com as do Firestore
        const existingContributor = combinedContributorsMap.get(
          githubContributor.login
        );
        combinedContributorsMap.set(githubContributor.login, {
          ...existingContributor,
          ...githubContributor,
          // Aqui você pode decidir como lidar com sobreposições, por exemplo:
          contributions: githubContributor.contributions, // prefira os dados do GitHub para contribuições
        });
      } else {
        // Se o contribuidor do GitHub não estiver no mapa, apenas adicione-o
        combinedContributorsMap.set(githubContributor.login, githubContributor);
      }
    });

    // Converte o mapa de volta para uma lista/array
    return Array.from(combinedContributorsMap.values());
  }

  // ...

  async function fetchCommitsForAllFiles(owner, repo) {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents`
    );
    const files = response.data.filter((item) => item.type === "file");

    const fileCommitsData = {};

    for (const file of files) {
      const commitsResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/commits`,
        { params: { path: file.path } }
      );
      fileCommitsData[file.name] = commitsResponse.data;
    }

    return fileCommitsData;
  }

  function createContributionMatrix(fileCommitsData, contributors) {
    const contributorUsernames = contributors.map((c) => c.login); // Lista de logins de contribuidores
    const fileNames = Object.keys(fileCommitsData); // Lista de nomes de arquivos

    // Criando uma matriz onde as linhas representam arquivos e colunas representam contribuidores
    const matrix = fileNames.map((fileName) => {
      const fileCommits = fileCommitsData[fileName]; // Commits associados com o arquivo atual
      const fileContributions = new Array(contributorUsernames.length).fill(0); // Inicializa uma linha da matriz com zeros

      // Preenche a linha da matriz com a contagem de commits de cada contribuidor para o arquivo
      fileCommits.forEach((commit) => {
        const contributorIndex = contributorUsernames.indexOf(
          commit.author.login
        ); // Encontra o índice do contribuidor
        if (contributorIndex !== -1) {
          fileContributions[contributorIndex] += 1; // Incrementa a contagem de commits
        }
      });

      return fileContributions; // Retorna a linha da matriz representando as contribuições para o arquivo
    });

    return matrix; // Retorna a matriz completa
  }

  async function fetchContributionData() {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents`
    );
    const files = response.data.filter((item) => item.type === "file");

    // Inicializa um mapa para rastrear contribuições de cada usuário para cada arquivo
    const contributionsMap = new Map();

    for (const file of files) {
      const commitsResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/commits`,
        { params: { path: file.path } }
      );

      // Processa cada commit para o arquivo
      commitsResponse.data.forEach((commit) => {
        const authorLogin = commit.author?.login;
        if (authorLogin) {
          // Se o autor já estiver no mapa, atualize a contagem de commits
          if (!contributionsMap.has(authorLogin)) {
            contributionsMap.set(authorLogin, {});
          }
          const userContributions = contributionsMap.get(authorLogin);
          if (!userContributions[file.name]) {
            userContributions[file.name] = 0;
          }
          userContributions[file.name]++;
          contributionsMap.set(authorLogin, userContributions);
        }
      });
    }

    // Convertendo o mapa para uma matriz onde cada linha representa um contribuidor e cada coluna representa um arquivo
    const contributorsList = Array.from(contributionsMap.keys());
    const filesList = files.map((file) => file.name);
    const contributionMatrix = contributorsList.map((login) => {
      return filesList.map((fileName) => {
        const userContributions = contributionsMap.get(login) || {};
        return userContributions[fileName] || 0;
      });
    });

    console.log("Matriz de Contribuição:", contributionMatrix);
    return contributionMatrix;
  }

  // Você chama essa função dentro de um useEffect para garantir que ela seja executada quando o componente for montado
  useEffect(() => {
    fetchContributionData();
    // Outras dependências podem ser adicionadas aqui se necessário
  }, [owner, repo]); // Garanta que 'owner' e 'repo' sejam incluídos nas dependências do useEffect se eles forem estados.

  // Usando a função e exibindo no console
  fetchContributionData().then((matrix) => {
    console.log("Matriz de Contribuição:", matrix);
  });
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

  async function sendOptimizationRequest() {
    setIsAnalysisLoading(true);
    try {
      // Filtrar tarefas que estão na coluna "A Fazer"
      const tasksToDo = tasks.filter((task) => task.status === "to_do");

      // Agora, crie as matrizes de dados necessárias apenas com as tarefas filtradas
      const taskTable = await fetchTasksData(tasksToDo); // Certifique-se de que fetchTasksData aceita e processa uma lista de tarefas

      const repositoryData = await fetchContributionData();

      const agentsTable = await fetchContributorsFromFirestore(); // Obtém a matriz de habilidades
      console.log("agentsTable", agentsTable);
      console.log("taskTable", taskTable);
      console.log("repositoryData", repositoryData);
      const data = {
        //Cada linha pode representar um arquivo ou módulo do projeto, e cada coluna um membro da equipe.
        //Os valores indicariam a quantidade de contribuição ou conhecimento que cada membro tem em cada arquivo.
        // Dados Reais: extrair esses dados a partir de um sistema de controle de versão, Git.
        //  Por exemplo, o número de commits, linhas de código alteradas ou outras métricas de contribuição por membro em cada arquivo.
        repository: repositoryData,
        //Cada linha é um agente (membro da equipe) e cada coluna uma habilidade ou área de conhecimento.
        //Dados Reais: Essa tabela pode ser criada com base em avaliações de habilidades, histórico de projetos anteriores, ou autoavaliações dos membros da equipe.
        // Por exemplo, pode- se avaliar em uma escala de 1 a 10 a proficiência em diferentes tecnologias ou aspectos do projeto.
        agents_table: agentsTable,

        //Cada linha é uma tarefa e as colunas representam os requisitos da tarefa em termos de habilidades ou recursos necessários.
        //Dados Reais: Esses dados podem ser obtidos de um sistema de rastreamento de tarefas ou projeto, como Jira ou Trello.
        //Cada tarefa terá requisitos específicos que podem ser quantificados(por exemplo, nível de habilidade necessário em diferentes áreas).
        task_table: taskTable,
        type: "data/random.txt",
        //file_table pode mapear tarefas para arquivos específicos, e change_table as mudanças necessárias por tarefa.
        //Dados Reais: Essa informação pode ser mais desafiadora de automatizar e pode exigir entrada manual ou
        // estimativas baseadas em projetos anteriores ou na complexidade percebida da tarefa.
        file_table: taskTable,
        change_table: taskTable,
      };

      // Envio da solicitação
      const response = await fetch("http://localhost:5000/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log("Success:", responseData);
      setResponse(responseData); // Atualize o estado com a resposta
      setOptimizationResult(responseData);
      setOptimizationResult(responseData.best_solution); // Se você quiser manter o estado separado para a melhor solução
      setEvaluationResult(responseData.evaluation_result);

      console.log("Response Data:", responseData);
      console.log("Best Solution:", responseData.best_solution);
      console.log("Best Solution:", responseData.evaluation_result);
      setIsAnalysisLoading(false);
      // Exibe um alerta de sucesso
      alert(
        "Análise gerada com sucesso, pode atribuir as tarefas aos desenvolvedores!"
      );
    } catch (error) {
      console.error("Error:", error);
      alert("Erro ao gerar a análise.");
      setIsAnalysisLoading(false);
    }
  }

  const [showEditSkillsModal, setShowEditSkillsModal] = useState(false);
  const [editingSkills, setEditingSkills] = useState({});
  const openSkillsModal = (contributor) => {
    setSelectedContributor(contributor);
    setEditingSkills(contributor.skills || {});
    setShowEditSkillsModal(true);
  };
  const updateSkills = async () => {
    if (!selectedContributor) return;

    // Initialize skills with a default value of 1 if not set
    const skillsWithDefaults = availableSkills.reduce((acc, skill) => {
      acc[skill] = editingSkills[skill] || 0;
      return acc;
    }, {});

    const updatedContributor = {
      ...selectedContributor,
      skills: skillsWithDefaults,
    };

    try {
      const contributorDocRef = doc(
        db,
        "repositories",
        `${owner}_${repo}`,
        "contributors",
        updatedContributor.login
      );

      await setDoc(
        contributorDocRef,
        { skills: updatedContributor.skills },
        { merge: true }
      );

      setContributors((prevContributors) =>
        prevContributors.map((contributor) =>
          contributor.login === updatedContributor.login
            ? updatedContributor
            : contributor
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar habilidades do colaborador:", error);
    }

    setShowEditSkillsModal(false);
  };

  // async function fetchDevelopersData() {
  //   const contributorsCollection = collection(
  //     db,
  //     "repositories",
  //     `${owner}_${repo}`,
  //     "contributors"
  //   );
  //   const contributorSnapshot = await getDocs(contributorsCollection);

  //   const developersMatrix = contributorSnapshot.docs
  //     .map((doc) => {
  //       const data = doc.data();

  //       // Verifica se o contribuidor está ativo antes de incluí-lo
  //       if (!data.isActive) {
  //         return null;
  //       }

  //       // Convertendo habilidades em um array
  //       const skillsArray = Object.keys(data.skills || {}).map(
  //         (key) => data.skills[key]
  //       );
  //       return skillsArray; // Retorna apenas as habilidades como um array
  //     })
  //     .filter((item) => item != null); // Remove contribuidores inativos (null)

  //   return developersMatrix; // Retorna a matriz de habilidades
  // }

  // // Uso da função
  // fetchDevelopersData().then((matrix) => {
  //   console.log(matrix); // Exibe a matriz no console
  // });

  const availableSkills = [
    "Arquitetura de Sistemas",
    "Bancos de Dados",
    "Comunicação e Colaboração",
    "Controle de Versão",
    "Desenvolvimento Back-End",
    "Desenvolvimento Front-End",
    "Desenvolvimento Ágil e Scrum",
    "Integração e Entrega Contínuas (CI/CD)",
    "Segurança de Aplicações",
    "Teste de Software",
  ];
  async function fetchTasksData() {
    const tasksCollection = collection(
      db,
      "repositories",
      `${owner}_${repo}`,
      "tasks"
    );
    const tasksSnapshot = await getDocs(tasksCollection);

    const tasksMatrix = tasksSnapshot.docs.map((doc) => {
      const taskData = doc.data();

      // Garante que taskData.skills é um array antes de chamar includes
      const skillsArray = availableSkills.map((skill) =>
        Array.isArray(taskData.skills) && taskData.skills.includes(skill)
          ? 1
          : 0
      );

      return skillsArray;
    });

    return tasksMatrix;
  }

  // Usando a função e exibindo no console
  fetchTasksData().then((matrix) => {
    console.log("Matriz de Tarefas:", matrix);
  });

  // fetchDevelopersData().then((matrix) => {
  //   console.log(matrix); // Exibe a matriz no console
  // });
  const handleSkillChange = async (taskId, skill, isChecked) => {
    // Atualiza o estado local primeiro
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        let updatedSkills = Array.isArray(task.skills) ? [...task.skills] : [];

        if (isChecked) {
          // Adiciona a habilidade se ela não estiver na lista
          if (!updatedSkills.includes(skill)) {
            updatedSkills.push(skill);
          }
        } else {
          // Remove a habilidade da lista
          updatedSkills = updatedSkills.filter((s) => s !== skill);
        }

        return { ...task, skills: updatedSkills };
      }
      return task;
    });

    setTasks(updatedTasks);

    // Atualizar no Firestore
    const taskToUpdate = updatedTasks.find((task) => task.id === taskId);
    if (taskToUpdate) {
      const taskDocRef = doc(
        db,
        "repositories",
        `${owner}_${repo}`,
        "tasks",
        taskId
      );

      try {
        // Aqui você atualiza apenas o campo de habilidades da tarefa específica
        await updateDoc(taskDocRef, {
          skills: taskToUpdate.skills,
        });
        console.log("Task updated successfully with new skills");
      } catch (error) {
        console.error("Error updating task skills:", error);
      }
    }
  };

  const handleModalSkillChange = (skill, isChecked) => {
    setActiveModal((prevModal) => {
      const updatedSkills = isChecked
        ? [...prevModal.skills, skill]
        : prevModal.skills.filter((s) => s !== skill);

      return { ...prevModal, skills: updatedSkills };
    });
  };

  const handleSaveTaskChanges = async (updatedTask) => {
    const taskDocRef = doc(
      db,
      "repositories",
      `${owner}_${repo}`,
      "tasks",
      updatedTask.id
    );

    try {
      await updateDoc(taskDocRef, updatedTask);
      console.log("Task updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Recupere as habilidades salvas no localStorage ao carregar a página
  useEffect(() => {
    const storedSkills = localStorage.getItem("editingSkills");
    if (storedSkills) {
      setEditingSkills(JSON.parse(storedSkills));
    }
  }, []);
  async function fetchAndCombineContributors() {
    try {
      // Pegando contribuidores do GitHub
      const githubResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contributors`,
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      const githubContributors = await githubResponse.json();

      // Pegando contribuidores do Firestore
      const repoDocRef = doc(db, "repositories", `${owner}_${repo}`);
      const contributorsCollection = collection(repoDocRef, "contributors");
      const firestoreSnapshot = await getDocs(contributorsCollection);
      const firestoreContributors = firestoreSnapshot.docs.map((doc) =>
        doc.data()
      );

      // Combinando ambos os conjuntos de contribuidores
      const combinedContributors = new Map();

      githubContributors.forEach((contributor) => {
        combinedContributors.set(contributor.login, {
          ...contributor,
          source: "github",
        });
      });

      firestoreContributors.forEach((contributor) => {
        if (combinedContributors.has(contributor.login)) {
          // Se já temos esse contribuidor do GitHub, combinamos os dados
          combinedContributors.set(contributor.login, {
            ...combinedContributors.get(contributor.login),
            ...contributor,
            source: "both", // Indica que a informação veio de ambas as fontes
          });
        } else {
          // Se não, apenas adicionamos o contribuidor do Firestore
          combinedContributors.set(contributor.login, {
            ...contributor,
            source: "firestore",
          });
        }
      });

      // Convertendo o Map para Array
      const combinedContributorsArray = Array.from(
        combinedContributors.values()
      );
      setContributors(combinedContributorsArray);
    } catch (error) {
      console.error("Error fetching and combining contributors:", error);
    }
  }

  // Chame esta função em um useEffect ou em um evento apropriado
  useEffect(() => {
    fetchAndCombineContributors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner, repo, token]);

  return (
    <Container>
      {isAnalysisLoading && (
        <LoadingOverlay>
          <Spinner />
          <div>Gerando análise, por favor aguarde...</div>
        </LoadingOverlay>
      )}
      <Header>
        <TruckFactorContainer>
          {evaluationResult && (
            <div>
              <TruckFactorTitle>Valor Truck Factor</TruckFactorTitle>
              <CriticalDevelopersText>
                {evaluationResult[0]}
              </CriticalDevelopersText>
            </div>
          )}
        </TruckFactorContainer>
        <TrelloLogin
          boardId={boardId}
          setBoardId={setBoardId}
          onCardsFetched={handleTrelloCardsFetched}
        />

        <div>
          {activeModal && (
            <Modal>
              <Backdrop onClick={() => setActiveModal(null)} />
              <ModalContainer>
                <h2>Editar Tarefa</h2>
                <Label>Descrição:</Label>
                <TextArea
                  value={activeModal.description}
                  onChange={(e) =>
                    handleUpdateActiveModal("description", e.target.value)
                  }
                />
                <Label>Dificuldade (Nível):</Label>
                <Select
                  value={activeModal.difficulty}
                  onChange={(e) =>
                    handleUpdateActiveModal("difficulty", e.target.value)
                  }
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num.toString()}>
                      Nível {num}
                    </option>
                  ))}
                </Select>
                <div>
                  <SkillsGrid>
                    <strong>Habilidades:</strong>
                    {availableSkills.map((skill, index) => (
                      <label key={index}>
                        <input
                          type="checkbox"
                          checked={activeModal.skills.includes(skill)}
                          onChange={(e) =>
                            handleModalSkillChange(skill, e.target.checked)
                          }
                        />
                        {skill}
                      </label>
                    ))}
                  </SkillsGrid>
                </div>
                <Label>Desenvolvedor:</Label>
                <Select
                  value={activeModal.desenvolvedor}
                  onChange={(e) =>
                    handleUpdateActiveModal("desenvolvedor", e.target.value)
                  }
                >
                  {contributors.map((contributor) => (
                    <option key={contributor.id} value={contributor.login}>
                      {contributor.login}
                    </option>
                  ))}
                </Select>
                <Button
                  onClick={() => {
                    const newTasks = [...tasks];
                    let taskToUpdate;
                    if (activeModal.idx != null) {
                      taskToUpdate = {
                        ...activeModal,
                        status: activeModal.desenvolvedor
                          ? "in_progress"
                          : "to_do",
                      };
                      newTasks[activeModal.idx] = taskToUpdate;
                    } else {
                      taskToUpdate = {
                        ...activeModal,
                        status: activeModal.desenvolvedor
                          ? "in_progress"
                          : "to_do",
                      };
                      newTasks.push(taskToUpdate);
                    }
                    const updatedTasks = tasks.map((t) =>
                      t.id === activeModal.id ? { ...activeModal } : t
                    );
                    setTasks(updatedTasks);
                    setActiveModal(null);
                    handleSaveTaskChanges(activeModal); // Salvar as alterações no banco de dados
                  }}
                >
                  Salvar
                </Button>

                <button onClick={() => setActiveModal(null)}>Cancelar</button>
              </ModalContainer>
            </Modal>
          )}
          <Button onClick={() => setShowDevelopersModal(true)}>
            Atualizar Desenvolvedores
          </Button>
          {showDevelopersModal && (
            <Modal>
              <Backdrop onClick={() => setShowDevelopersModal(false)} />

              <ModalContainer>
                <CloseButton onClick={() => setShowDevelopersModal(false)}>
                  &times;
                </CloseButton>
                <ModalHeader>
                  <ModalTitle>Time</ModalTitle>
                </ModalHeader>

                {/* Adicionar novo colaborador */}
                <List>
                  {contributors
                    .filter((contributor) => contributor.login) // Filtra apenas os contribuidores com login
                    .map((contributor) => (
                      <ListItem key={contributor.login}>
                        {contributor.login} - Commits: {contributor.commits},
                        Especialidade: {contributor.role}
                        {contributor.role === "desenvolvimento"}
                        <Button
                          onClick={() => toggleContributor(contributor.id)}
                          className={
                            contributor.isActive ? "deactivate" : "activate"
                          }
                        >
                          {contributor.isActive ? "Desativar" : "Ativar"}
                        </Button>
                        <Button onClick={() => openSkillsModal(contributor)}>
                          Editar Habilidades
                        </Button>
                      </ListItem>
                    ))}
                </List>

                {/* <div>
                  <Input
                    type="text"
                    placeholder="Nome de usuário do GitHub"
                    value={newContributorUsername}
                    onChange={(e) => setNewContributorUsername(e.target.value)}
                  />
                  <Select
                    value={newContributorEspecialidade}
                    onChange={(e) =>
                      setNewContributorEspecialidade(e.target.value)
                    }
                  >
                    <option value="desenvolvimento">Desenvolvimento</option>
                    <option value="design">Design</option>
                  </Select>
                  {newContributorEspecialidade === "desenvolvimento" && (
                    <Select
                      value={newContributorDevLevel}
                      onChange={(e) =>
                        setNewContributorDevLevel(e.target.value)
                      }
                    >
                      <option value="júnior">Júnior</option>
                      <option value="pleno">Pleno</option>
                      <option value="sênior">Sênior</option>
                    </Select>
                  )}
                  <button onClick={addNewContributor}>Adicionar</button>
                </div> */}
                {showEditSkillsModal && (
                  <Modal>
                    <ModalContainer>
                      <CloseButton
                        onClick={() => setShowEditSkillsModal(false)}
                      >
                        &times;
                      </CloseButton>
                      <ModalHeader>
                        <ModalTitle>Editar Habilidades</ModalTitle>
                      </ModalHeader>
                      {availableSkills.map((skill) => (
                        <SkillRow key={skill}>
                          <SkillLabel>{skill}:</SkillLabel>
                          <SkillSelect
                            value={editingSkills[skill] || 0}
                            onChange={(e) =>
                              setEditingSkills({
                                ...editingSkills,
                                [skill]: e.target.value,
                              })
                            }
                          >
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </SkillSelect>
                        </SkillRow>
                      ))}
                      <SaveButton onClick={updateSkills}>
                        Salvar Habilidades
                      </SaveButton>
                    </ModalContainer>
                  </Modal>
                )}
              </ModalContainer>
            </Modal>
          )}

          <AddTaskModal contributors={contributors} onAdd={handleAddTask} />
          <Button onClick={assignTasksToDevelopers}>Atribuir Tarefas</Button>
          <Button onClick={sendOptimizationRequest}>Gerar Análise</Button>
        </div>
        <button
          onClick={handleLogout}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <LogOut size={24} color="#555" />
        </button>
      </Header>
      <div className="taskContainer">
        <TaskGrid>
          {["to_do", "in_progress", "in_review", "done"].map((status) => (
            <div key={status}>
              <h3>
                {status === "to_do"
                  ? "Para fazer"
                  : status === "in_progress"
                  ? "Em progresso"
                  : status === "in_review"
                  ? "Em revisão"
                  : "Concluída"}
              </h3>
              {tasks
                .filter((task) => task.status === status) // Filtrar as tarefas com base no status atual
                .map((task, idx) => (
                  <TaskCard key={task.id || idx}>
                    <strong>Descrição:</strong> {task.description}
                    <strong>Dificuldade:</strong> Nível {task.difficulty}
                    <strong>Desenvolvedor:</strong> {task.desenvolvedor}
                    <div>
                      <SkillsGrid>
                        <strong>Habilidades:</strong>
                        {availableSkills.map((skill, skillIdx) => (
                          <label key={skillIdx}>
                            <input
                              type="checkbox"
                              // Garante que task.skills é um array antes de chamar .includes
                              checked={
                                Array.isArray(task.skills) &&
                                task.skills.includes(skill)
                              }
                              onChange={(e) =>
                                handleSkillChange(
                                  task.id,
                                  skill,
                                  e.target.checked
                                )
                              }
                            />
                            {skill}
                          </label>
                        ))}
                      </SkillsGrid>
                    </div>
                    <ButtonContainer>
                      <TaskButton onClick={() => handleEditTask(task.id)}>
                        Editar
                      </TaskButton>
                      <TaskButton onClick={() => handleDeleteTask(task.id)}>
                        Excluir
                      </TaskButton>
                    </ButtonContainer>
                  </TaskCard>
                ))}
            </div>
          ))}
        </TaskGrid>
      </div>
    </Container>
  );
}

export default RepoContributorsWithTasks;
