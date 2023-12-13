// Importando módulos e componentes necessários
import UserContext from "../UserContext"; // Importando o contexto do usuário
import React, { useContext } from "react"; // Importando React e o hook useContext

function Dashboard() {
  // Usando o hook useContext para acessar os valores do UserContext
  const { userData, userRepos } = useContext(UserContext);

  // Se userData ainda não foi carregado (por exemplo, ainda está buscando os dados da API),
  // mostrar uma mensagem de "Loading..."
  if (!userData) {
    return <div>Loading...</div>;
  }

  // Renderizando o componente
  return (
    <div>
      {/* Mostrando a imagem de avatar do usuário */}
      <img src={userData.avatar_url} alt={`${userData.name}'s avatar`} />

      {/* Mostrando uma mensagem de boas-vindas com o nome do usuário */}
      <h1>Welcome, {userData.name}</h1>

      {/* Mostrando o nome de usuário do GitHub */}
      <p>Username: {userData.login}</p>

      {/* Listando os repositórios do usuário */}
      <h2>Your Repositories:</h2>
      <ul>
        {userRepos.map((repo) => (
          <li key={repo.id}>
            {/* Cada repositório é um link que abre em uma nova guia */}
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              {repo.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Exportando o componente Dashboard para que ele possa ser usado em outros lugares da aplicação
export default Dashboard;
