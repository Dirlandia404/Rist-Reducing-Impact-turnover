// Importando módulos e componentes necessários
import React, { useContext, useEffect } from "react"; // Importando React, useContext e useEffect
import { Github } from "lucide-react";

import UserContext from "./UserContext"; // Importando o contexto do usuário
import {
  Button,
  ButtonText,
  Container,
  Content,
  Divider,
  SignInSection,
  Title,
} from "./GitHubLoginStyles"; // Atualize o caminho do arquivo conforme necessário

import { useNavigate } from "react-router-dom";
const GITHUB_CLIENT_ID = "763ea15d20c5b67f73f8";
function GitHubLogin() {
  const navigate = useNavigate(); // Hook para navegar entre rotas
  const { userData, setUserData } = useContext(UserContext); // Usando o contexto para obter e modificar userData

  useEffect(() => {
    // Parsing dos parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code"); // Obtendo o código do GitHub da URL

    console.log("Code from URL:", code); // Log para debug

    // Se houver um código, troque-o por um token de acesso
    if (code) {
      fetch("/exchangeCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Data from /exchangeCode:", data); // Log para debug

          // Se houver um token de acesso na resposta, armazene-o no localStorage
          if (data.access_token) {
            localStorage.setItem("github_token", data.access_token);

            // Use o token de acesso para buscar informações do usuário
            fetch("https://api.github.com/user", {
              headers: {
                Authorization: "token " + data.access_token,
              },
            })
              .then((response) => response.json())
              .then((userData) => {
                // Atualize o estado do userData e navegue para o dashboard
                setUserData(userData);
                navigate("/dashboard");
              });
          }
        });
    }
  }, [navigate, setUserData]); // Dependências do useEffect

  return (
    <Container>
      <Content>
        <Title>Bem-vindo ao Rist!</Title>
        <Divider />

        <SignInSection>
          <Github size={128} />
          {userData ? (
            <div>Hello, {userData.login}!</div>
          ) : (
            <Button
              onClick={() =>
                (window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=repo`)
              }
            >
              <ButtonText>Login com GitHub</ButtonText>
            </Button>
          )}
        </SignInSection>
      </Content>
    </Container>
  );
}

// Exportando o componente GitHubLogin
export default GitHubLogin;
