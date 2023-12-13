import React, { useState, useEffect } from "react";
import axios from "axios";
import { Select } from "./AddTaskModalStyle";
const API_KEY = API_KEY;
const TrelloLogin = ({ onCardsFetched, onSaveCards, owner, repo }) => {
  const [todoListId, setTodoListId] = useState("");
  const [cards, setCards] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("trelloToken"));
  const [userBoardId, setUserBoardId] = useState("");
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const tokenFromHash = hash.split("=")[1];
      setToken(tokenFromHash);
      localStorage.setItem("trelloToken", tokenFromHash);
      window.history.replaceState(null, null, " ");
    }
    if (token) {
      fetchUserBoards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  const fetchUserBoards = async () => {
    try {
      const response = await axios.get(
        `https://api.trello.com/1/members/me/boards?key=${API_KEY}&token=${token}`
      );
      setBoards(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchListsAndCards = async (boardId) => {
    if (!boardId) {
      console.error("Nenhum quadro selecionado.");
      return;
    }

    try {
      // Buscar listas
      const listsResponse = await axios.get(
        `https://api.trello.com/1/boards/${boardId}/lists?key=${API_KEY}&token=${token}`
      );
      const todoList = listsResponse.data.find(
        (list) => list.name === "A Fazer"
      );

      if (!todoList) {
        console.error("Lista 'A Fazer' não encontrada");
        return;
      }

      setTodoListId(todoList.id);

      // Buscar cards
      const cardsResponse = await axios.get(
        `https://api.trello.com/1/lists/${todoList.id}/cards?key=${API_KEY}&token=${token}&members=true&member_fields=username&labels=true`
      );

      setCards(cardsResponse.data);
      if (onCardsFetched) {
        console.log("onCardsFetched is called with data:", cardsResponse.data);

        onCardsFetched(cardsResponse.data);
      }
      if (onSaveCards) {
        console.log("onSaveCards is called with data:", cardsResponse.data);
        onSaveCards(cardsResponse.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = () => {
    const storedOwner = localStorage.getItem("owner");
    const storedRepo = localStorage.getItem("repo");
    const dynamicReturnUrl = `http://localhost:3000/contributors/${storedOwner}/${storedRepo}`;
    window.location.href = `https://trello.com/1/authorize?expiration=1day&name=My%20Trello%20App&scope=read&response_type=token&key=${API_KEY}&return_url=${dynamicReturnUrl}&callback_method=fragment`;
  };

  const handleBoardSelect = (e) => {
    const boardId = e.target.value;
    setUserBoardId(boardId); // Atualiza o userBoardId com o ID do quadro selecionado
    if (boardId) {
      fetchListsAndCards(boardId); // Busca as listas e cards com o novo ID do quadro
    }
  };
  console.log("Owner:", owner, "Repo:", repo);

  return (
    <div>
      {token ? (
        <div>
          {boards.length ? (
            <div>
              <Select
                value={selectedBoard}
                onChange={handleBoardSelect} // use o novo manipulador aqui
              >
                <option value="">Selecione um Quadro</option>
                {boards.map((board) => (
                  <option key={board.id} value={board.id}>
                    {board.name}
                  </option>
                ))}
              </Select>
            </div>
          ) : (
            <p>Carregando quadros...</p>
          )}
        </div>
      ) : (
        <button onClick={handleLogin}>Login Trello</button>
      )}
    </div>
  );
};

export default TrelloLogin;
