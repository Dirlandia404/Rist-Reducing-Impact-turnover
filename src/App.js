// Importando módulos e componentes necessários
import React, { useState } from "react"; // Importando React e o hook useState
import "./AppStyle"; // Importando estilos do componente
import GitHubLogin from "./GitHubLogin"; // Importando o componente de login do GitHub
import Dashboard from "./components/Dashboard"; // Importando o componente Dashboard
import UserContext from "./UserContext"; // Importando o contexto do usuário
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RepositoryInfo from "./components/RepositoryInfo"; // Não se esqueça de importar o novo componente
import RepoContributorsWithTasks from "./components/RepoContributorsWithTasks"; // Não se esqueça de importar o novo componente
import SearchRepo from "./components/SearchRepo"; // Não se esqueça de importar o novo componente
import { Header } from "./components/HeaderStyle"; // Não se esqueça de importar o novo componente
import { GlobalStyle } from "./components/global";

function App() {
  // Definindo o estado local para armazenar os dados do usuário e seus repositórios
  const [userData, setUserData] = useState(null); // Estado para armazenar os dados do usuário
  const [userRepos, setUserRepos] = useState([]); // Estado para armazenar os repositórios do usuário

  // Renderizando o componente
  return (
    // Fornecendo o contexto do usuário para componentes filhos
    // Isso permite que componentes descendentes acessem e modifiquem os dados do usuário e seus repositórios
    <UserContext.Provider
      value={{ userData, setUserData, userRepos, setUserRepos }}
    >
      <Router>
        <GlobalStyle />
        <Header />
        <Routes>
          <Route path="/" element={<GitHubLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/repo-info" element={<RepositoryInfo />} />
          <Route path="/search-repo" element={<SearchRepo />} />
          <Route
            path="/contributors/:owner/:repo"
            element={<RepoContributorsWithTasks />}
          />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

// Exportando o componente App para que ele possa ser usado em outros lugares da aplicação
export default App;
