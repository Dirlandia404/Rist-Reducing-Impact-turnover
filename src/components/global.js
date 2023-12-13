import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :focus{
    outline:0;
    box-shadow: 0 0 0 1px #EA7846;
  }

  body{
    background-color: #CCC;
    color: #555;
    -webkit-font-smoothing: antialiased;
  }
  
  body, input, textarea, button{
    font: 400 1rem Inter, sans-serif;
  }

  [disabled]{
    opacity: 0.6;
    cursor: not-allowed;
  }

  button{
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover{
      opacity: 0.9;
    }

    &:disabled {
      background-color: #EEE;
    }
  }

  a{
    color: inherit;
    text-decoration: none;
  }
`;
