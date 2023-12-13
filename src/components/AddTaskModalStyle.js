// RepoContributorsWithTasksStyles.js
import styled from "styled-components";

export const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 1001;
  width: auto; // Auto-width based on content, up to the max-width
  max-width: 600px; // Set a max-width to limit how wide the modal can stretch
  margin: 0 auto; // Center the modal in the viewport
  overflow-y: auto; // Add scroll for overflowing content
  height: auto; // Height based on content
  max-height: 80vh; // Max height to ensure it doesn't touch the very top/bottom of the screen
  position: relative; // Add relative for proper z-indexing
`;

export const SkillsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px; // Espaço entre as habilidades
  margin-bottom: 15px;

  & > label {
    background-color: #e9ecef;
    padding: 5px 10px;
    border-radius: 15px;
    cursor: pointer;

    &:hover {
      background-color: #dde2e6;
    }

    input {
      margin-right: 5px;
    }
  }
`;
export const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  margin-left: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const StyledTitle = styled.h2`
  color: #333; // Defina a cor do texto
  text-align: center; // Alinhamento do texto ao centro
  font-size: 1.5rem; // Tamanho da fonte
  margin-top: 0; // Margem superior
  margin-bottom: 1rem; // Margem inferior
  // Adicione aqui mais estilos conforme necessário
`;
export const StyledSelect = styled.select`
  width: 100%; // Faz o select ocupar toda a largura do container
  padding: 8px 12px; // Adiciona padding interno para maior legibilidade
  border: 1px solid #ccc; // Define uma borda sólida
  border-radius: 4px; // Bordas arredondadas
  margin-bottom: 15px; // Espaço entre os selects e outros elementos

  // Assegura que a seta do select esteja alinhada com outros ícones ou elementos
  background: url('data:image/svg+xml;utf8,<svg fill="black" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')
    no-repeat right 8px center;
  appearance: none; // Remove a aparência padrão do select
  -webkit-appearance: none; // Para navegadores com base no WebKit
  -moz-appearance: none; // Para navegadores com base no Mozilla

  &:focus {
    border-color: #007bff; // Altera a cor da borda quando focado
    outline: none; // Remove o outline padrão
  }
`;
export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center; // Centraliza os botões horizontalmente
  gap: 15px; // Adiciona espaço entre os botões
  margin-top: 25px; // Adiciona espaço acima do grupo de botões
`;
export const Button = styled.button`
  height: 20%;
  margin: 10px;
  padding: 5px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &.deactivate {
    background-color: red;
    color: white;
  }

  &.activate {
    background-color: green;
    color: white;
  }

  &:hover {
    background-color: darkgray;
  }
`;
// Modifique o componente Button para ter feedback visual no hover
export const StyledButton = styled(Button)`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease; // Transição suave para o background-color

  &:hover {
    opacity: 0.8; // Diminui a opacidade no hover para feedback visual
  }

  &:first-of-type {
    background-color: #007bff; // Cor para o botão principal
    color: white;
  }

  &:last-of-type {
    background-color: red; // Cor para o botão secundário
    color: white;
  }
`;
