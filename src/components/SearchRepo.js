import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { LogOut, Search } from "lucide-react";
import {
  Container,
  Content,
  ContentHeader,
  UserContainer,
  Avatar,
  Title,
  Subtitle,
  Divider,
  SearchSection,
  InputContainer,
  Label,
  Input,
  Button,
  ButtonText,
} from "./SearchRepoStyles"; // Replace 'YourStyledComponentsFile' with the name of the file where you've defined the styled components

function SearchRepo() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("github_token", token);
      window.history.replaceState({}, document.title, "/search-repo");

      // Fetch user data using the token
      fetch("https://api.github.com/user", {
        headers: {
          Authorization: "token " + token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserData(data);
        });
    }
  }, []);

  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (owner && repo) {
      navigate(`/contributors/${owner}/${repo}`);
    } else {
      alert("Selecione o Dono do repositorio e repositorio");
    }
  };
  localStorage.setItem("owner", owner);
  localStorage.setItem("repo", repo);

  const logout = () => {
    localStorage.removeItem("github_token");
    navigate("/"); // Using navigate instead of history.push
  };

  return (
    <Container>
      <Content>
        {userData && (
          <ContentHeader>
            <UserContainer>
              <Avatar src={userData.avatar_url} alt="User Avatar" />
              <Title>Olá, {userData.login}</Title>
            </UserContainer>
            <button
              onClick={logout}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <LogOut size={24} color="#555" />
            </button>
          </ContentHeader>
        )}

        <Divider />

        <Subtitle>Busque por contribuidores:</Subtitle>

        <SearchSection onSubmit={handleSubmit}>
          <InputContainer>
            <Label>Usuário:</Label>
            <Input
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="Digite o nome do dono do repositório..."
            />
          </InputContainer>
          <InputContainer>
            <Label>Repositório:</Label>
            <Input
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="Digite o nome do repositório..."
            />
          </InputContainer>

          <Button>
            <ButtonText>Buscar</ButtonText>
            <Search size={18} color="#fff" />
          </Button>
        </SearchSection>
      </Content>
    </Container>
  );
}

export default SearchRepo;
