import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Modal,
  Textarea,
  Label,
  InputGroup,
  CloseButton,
  Backdrop,
} from "./RepoContributorsWithTasksStyles";
import {
  Button,
  ButtonGroup,
  StyledButton,
  StyledTitle,
  StyledSelect,
  SkillsList,
  ModalContainer,
} from "./AddTaskModalStyle";
import { addDoc, collection } from "firebase/firestore/lite";
import { db } from "../config/firebaseConfig"; // Importe a referência da configuração do Firebase
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
// Componente de Modal para Adicionar Tarefas
function AddTaskModal({ contributors, onAdd }) {
  // Estado para controlar a exibição do modal
  const [showModal, setShowModal] = useState(false);
  // Obtém os parâmetros da URL via React Router
  const { owner, repo } = useParams();
  // Estado inicial do formulário
  const [formData, setFormData] = useState({
    description: "",
    difficulty: "",
    desenvolvedor: "",
    status: "to_do",
    activityType: "",
    skills: [],
  });
  // Função para lidar com a adição de habilidades
  const handleSkillChange = (skill, isChecked) => {
    setFormData((prevFormData) => {
      const updatedSkills = isChecked
        ? [...prevFormData.skills, skill]
        : prevFormData.skills.filter((s) => s !== skill);
      return { ...prevFormData, skills: updatedSkills };
    });
  };

  // Função assíncrona para lidar com a adição de uma tarefa
  const handleAdd = async () => {
    if (formData.desenvolvedor) {
      const contributor = contributors.find(
        (c) => c.login === formData.desenvolvedor
      );

      const contributorLevel = parseInt(contributor.level.substring(6), 10);
      const taskDifficulty = parseInt(formData.difficulty, 10);

      if (contributorLevel < taskDifficulty) {
        alert("Este desenvolvedor não possui nível adequado para esta tarefa!");
        return;
      }

      setFormData((prev) => ({ ...prev, status: "in_progress" }));
    }

    try {
      const repoTasksCollection = collection(
        db,
        "repositories",
        `${owner}_${repo}`,
        "tasks"
      );
      const newdocData = await addDoc(repoTasksCollection, formData);
      console.log("Documento criado com o ID: ", newdocData.id);

      onAdd({
        description: formData.description,
        difficulty: formData.difficulty,
        desenvolvedor: formData.desenvolvedor,
        status: formData.status,
        skills: formData.skills,
      });
      setShowModal(false);
    } catch (e) {
      console.error("Erro ao adicionar o documento: ", e);
    }
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Adicionar Tarefa</Button>
      {/* Renderiza o modal se 'showModal' for true */}
      {showModal && (
        <Modal>
          <Backdrop onClick={handleCloseModal} />
          <ModalContainer>
            {/* Botão para fechar o modal */}
            <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            <StyledTitle>Adicionar Tarefa</StyledTitle>
            {/* Formulário para inserção da descrição da tarefa */}
            <InputGroup>
              <Label>Descrição:</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              ></Textarea>
              <InputGroup>
                <div>
                  <Label>Habilidades necessárias:</Label>
                  <SkillsList>
                    {availableSkills.map((skill, index) => (
                      <label key={index}>
                        <input
                          type="checkbox"
                          checked={formData.skills.includes(skill)}
                          onChange={(e) =>
                            handleSkillChange(skill, e.target.checked)
                          }
                        />
                        {skill}
                      </label>
                    ))}
                  </SkillsList>
                </div>
              </InputGroup>
            </InputGroup>

            {/* Seletor para escolha da dificuldade da tarefa */}
            <InputGroup>
              <Label>Dificuldade (Nível):</Label>
              <StyledSelect
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    difficulty: e.target.value,
                  }))
                }
              >
                <option value="1">Nível 1</option>
                <option value="2">Nível 2</option>
                <option value="3">Nível 3</option>
                <option value="4">Nível 4</option>
                <option value="5">Nível 5</option>
              </StyledSelect>
            </InputGroup>
            {/* Seletor para escolha do desenvolvedor da tarefa */}
            <InputGroup>
              <Label>Desenvolvedor:</Label>
              <StyledSelect
                value={formData.desenvolvedor}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    desenvolvedor: e.target.value,
                  }))
                }
              >
                <option value="">Nenhum</option>{" "}
                {/* Opção padrão (sem desenvolvedor) */}
                {/* Lista de desenvolvedores */}
                {contributors
                  .filter((contributor) => contributor.isActive)
                  .map((contributor) => (
                    <option key={contributor.id} value={contributor.login}>
                      {contributor.login} ({contributor.tasksCount || 0}{" "}
                      tarefas)
                    </option>
                  ))}
              </StyledSelect>
            </InputGroup>
            {/* Seletor para escolha do status da tarefa */}
            <InputGroup>
              <Label>Status:</Label>
              <StyledSelect
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, status: "in_progress" }))
                }
              >
                <option value="to_do">Para fazer</option>
                <option value="in_progress">Em progresso</option>
                <option value="in_review">Em revisão</option>
                <option value="done">Concluída</option>
              </StyledSelect>
            </InputGroup>

            {/* Botão para adicionar a tarefa */}
            <ButtonGroup>
              <StyledButton onClick={handleAdd}>Adicionar</StyledButton>
              <StyledButton onClick={() => setShowModal(false)}>
                Cancelar
              </StyledButton>
            </ButtonGroup>
          </ModalContainer>
        </Modal>
      )}
      {/* Botão para logout */}
    </>
  );
}

export default AddTaskModal;
