// RepoContributorsWithTasksStyles.js

import styled, { keyframes } from "styled-components";

// Cores do tema
const theme = {
  background: "#f7f7f7", // Fundo cinza mais suave
  headerBackground: "#ffffff",
  border: "#e1e4e8",
  text: "#24292e",
  textSecondary: "#586069",
  button: "#2ea44f", // Verde para ações positivas
  buttonHover: "#22863a", // Verde escuro para hover
  buttonDanger: "#d73a49", // Vermelho para ações de alerta
  buttonDangerHover: "#cb2431", // Vermelho escuro para hover
  modalBoxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)", // Sombra mais suave para o modal
};
// Animação para o spinner
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Componente para a sobreposição de carregamento
export const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); /* Fundo semi-transparente */
  color: white;
  font-size: 1.5em;
  z-index: 1000; /* Garante que fique no topo */
`;

// Componente para o spinner
export const Spinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #fff;
  width: 40px;
  height: 40px;
  animation: ${spin} 2s linear infinite;
`;

export const SkillsGrid = styled.div`
  display: flex;
  flex-direction: column; // Organiza os itens em uma única coluna vertical
  gap: 5px; // Espaço entre os checkboxes
  margin-bottom: 10px; // Espaço abaixo do grid para separá-lo de outros elementos
`;

// Estilos para o container que engloba a informação do "Fator Caminhão"
export const TruckFactorContainer = styled.div`
  background-color: #f9f9f9; // Um fundo sutilmente diferente para destaque
  border-left: 4px solid #ffa500; // Uma borda à esquerda para chamar atenção
  padding: 15px;
  margin-bottom: 20px; // Espaço abaixo do container
`;

// Estilos para o título
export const TruckFactorTitle = styled.h2`
  color: #333;
  margin: 0 0 10px 0; // Espaçamento abaixo do título
  font-size: 1rem; // Tamanho da fonte
`;

// Estilos para os detalhes dos desenvolvedores críticos
export const CriticalDevelopersText = styled.p`
  color: #666;
  margin: 0; // Remove a margem padrão
  font-size: 1rem; // Tamanho da fonte
`;

export const Input = styled.input`
  width: 33%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const List = styled.ul`
  list-style: none;
  padding: 0;
`;

export const Container = styled.div`
  background-color: ${theme.background}; // Aplica o fundo cinza claro
  min-height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px; // Aumenta o padding para maior espaçamento interno
  background-color: ${theme.headerBackground}; // Define a cor de fundo para branco
  border-bottom: 1px solid ${theme.border};

  h1 {
    font-size: 24px;
    color: ${theme.text}; // Usa a cor de texto definida no tema
  }

  button {
    padding: 10px 20px; // Aumenta o padding para botões maiores
    background-color: ${theme.button}; // Cor laranja
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin: 0 10px; // Garante margem dos lados para espaçamento

    &:hover {
      background-color: ${theme.buttonHover}; // Uma tonalidade laranja mais escura para hover
    }
  }
`;
export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px; // Adjust this as needed
  border-bottom: 1px solid ${theme.border}; // Adds a visual separation
`;

export const ModalTitle = styled.h2`
  font-size: 1.5rem; // Increase the font size if needed
  color: ${theme.text};
  flex: 1; // Takes up the available space, pushing the close button to the edge
`;

export const ModalContainer = styled.div`
  background-color: white;
  padding: 20px; // You can adjust this as needed to reduce the size
  border-radius: 6px; // Keep the border-radius for aesthetic
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: auto; // The modal will only be as wide as its content plus padding
  max-width: 45%; // Reduced from the original, adjust as needed for your design
  z-index: 1001; // Keep it on top of other elements
  margin: 10vh auto; // Center it vertically with a smaller margin
  box-sizing: border-box; // Include padding in the width calculation
  position: relative; // For positioning of close button or any other absolute elements inside
  overflow-y: auto; // Add a scrollbar if the content is too long
  display: flex;
  flex-direction: column;
  align-items: center; // This will keep contents aligned in the center if they have less width

  box-sizing: border-box; // Include padding and borders in the element's width
  overflow-x: hidden; // Prevent horizontal scrolling
  padding: 20px;
`;

export const Backdrop = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;
export const SkillRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px; // Adjust as needed
  width: 100%; // Ensure full width
  box-sizing: border-box; // Include padding and border in the element's total width
`;
export const SkillLabel = styled.label`
  flex-basis: 50%; // Allocate 50% of the row width to the label
  text-align: left; // Align text to the left
`;

export const SkillSelect = styled.select`
  width: 100%; // Full width of the SkillRow container
  max-width: 200px; // Or a fixed width if you prefer
  height: 35px; // A fixed height for all select elements
  padding: 0 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box; // Include padding and borders in the element's width
  width: calc(100% - 20px);
  -moz-appearance: none; // Firefox
  -webkit-appearance: none; // Safari and Chrome
  appearance: none; // Standard syntax

  // Define background with a custom arrow
  background: url("path-to-your-down-arrow-icon.svg") no-repeat right 10px
    center / 12px;
  background-color: #fff; // Background color of the select
`;
export const Button = styled.button`
  padding: 10px 20px; // Tamanho padrão para botões
  border: none;
  border-radius: 5px; // Bordas arredondadas consistentes
  cursor: pointer;
  font-weight: 600; // Torna o texto do botão mais legível
  transition: background-color 0.2s ease-in-out; // Transição suave

  &.deactivate {
    background-color: ${theme.buttonDanger};
    color: white;

    &:hover {
      background-color: ${theme.buttonDangerHover};
    }
  }

  &.activate {
    background-color: ${theme.button};
    color: white;

    &:hover {
      background-color: ${theme.buttonHover};
    }
  }
`;

export const ListItem = styled.li`
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SaveButton = styled.button`
  padding: 1rem; // Generous padding for a larger click area
  width: 100%; // Full width for prominence
  margin-top: 2rem; // Space above the button
  background-color: #4caf50; // Example green color
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #45a049; // A slightly darker green on hover
  }
`;
export const ModalButton = styled(Button)`
  &:hover {
    background-color: darkblue;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
`;

export const Select = styled.select`
  width: 33%;
  padding: 10px;
  margin-bottom: 10px;
  margin-left: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const Label = styled.label`
  font-weight: bold;
`;
export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const InputGroup = styled.div`
  margin-bottom: 20px;
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
`;
export const taskContainer = styled.textarea`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
`;
export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  border: none;
  background: none;
  color: ${theme.textSecondary};

  &:hover {
    color: ${theme.text};
  }
`;

export const TaskCard = styled.div`
  display: flex;
  flex-direction: column; // Organiza o conteúdo do card em uma coluna
  justify-content: space-between; // Distribui o espaço uniformemente
  align-items: flex-start; // Alinha itens à esquerda
  flex: 1;
  min-width: 300px; // Tamanho mínimo do card
  background-color: #fff;
  margin: 10px;
  border-radius: 4px;
  min-width: 200px; // Ou qualquer valor mínimo que você tenha definido
  padding: 10px 20px; // 10px para o topo e fundo, 20px para esquerda e direita
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  h2 {
    font-size: 1.25rem; // Tamanho do título
    color: #333; // Cor do texto do título
    margin-bottom: 0.5rem; // Espaçamento abaixo do título
  }

  p {
    font-size: 1rem; // Tamanho do texto
    color: #666; // Cor do texto
    margin-bottom: 0.5rem; // Espaçamento abaixo do parágrafo
  }

  &:hover {
    transform: translateY(-5px); // Efeito de elevação ao passar o mouse
  }
`;
export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center; // Centraliza os botões horizontalmente
  gap: 10px; // Espaçamento entre os botões, caso você não use a propriedade margin-right no TaskButton
  margin: 10px; // Margem de 10px para todos os lados
`;

// Estilo para botões dentro do TaskCard, se aplicável
export const TaskButton = styled.button`
  padding: 12px 30px; // Aumenta o padding horizontal para tornar os botões mais largos
  margin: 10px; // Assegura que a margem de 10px em todos os lados seja mantida

  border-radius: 4px; // Mantém as bordas arredondadas
  background-color: #0366d6; // Cor de fundo do botão
  color: white; // Cor do texto do botão
  border: none;
  cursor: pointer;
  width: auto; // Garante que o botão tenha o comprimento baseado no seu conteúdo
  flex: 1; // Faz com que o botão expanda para ocupar o espaço disponível se dentro de um flex container

  &:hover {
    background-color: #0056b3; // Cor de fundo ao passar o mouse
  }

  // Se você tem dois botões lado a lado e deseja que ambos tenham o mesmo comprimento:
  &:not(:last-child) {
    margin-left: 50px; // Adiciona margem à direita para separá-los
  }
`;

export const TaskGrid = styled.div`
  display: grid;
  background-color: #f0f0f0;
  grid-template-columns: repeat(
    4,
    1fr
  ); // Cria quatro colunas com tamanhos iguais
  gap: 20px; // Espaçamento entre as colunas
  padding: 20px;
  margin: 0 auto; // Centraliza o grid na página
  max-width: 100%; // Certifica-se de que o grid não ultrapasse a largura da tela
  box-sizing: border-box; // Garante que o padding não adicione largura ao elemento
  height: calc(
    100vh - 60px
  ); // Ajusta a altura para preencher a tela, subtraindo a altura do cabeçalho
  overflow-y: auto; // Adiciona rolagem vertical se o conteúdo for muito longo
`;
