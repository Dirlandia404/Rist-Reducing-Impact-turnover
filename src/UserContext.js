// Importando o módulo React
import React from "react";

// Criando um novo contexto chamado UserContext
const UserContext = React.createContext({
  // userData armazena informações sobre o usuário. Inicialmente, é definido como null, o que indica que nenhum usuário está logado ou que seus dados não foram carregados ainda.
  userData: null,

  // setUserData é uma função que será usada para atualizar userData. A função vazia () => {} é apenas um valor padrão.
  setUserData: () => {},

  // userRepos armazena a lista de repositórios do usuário. Inicialmente, é uma lista vazia.
  userRepos: [],

  // setUserRepos é uma função que será usada para atualizar userRepos. A função vazia () => {} é apenas um valor padrão.
  setUserRepos: () => {},
});

// Exportando o UserContext para ser usado em outros componentes
export default UserContext;
