import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Content = styled.div`
  width: 28.75rem;
  height: auto; /* Adjust height to be auto to allow for padding */
  border-radius: 15px;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
  background-color: #fff;
  padding: 34px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-around; /* This will distribute space around items */
`;

export const Title = styled.h1`
  font-size: 32px;
  color: #555;
  text-align: center;
  margin-bottom: 24px; /* Adjust the bottom margin for spacing */
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #ccc;
  margin: 20px 0; /* Keep this margin or adjust as needed */
`;

export const SignInSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 24px; /* Adjust top margin to distribute space */
  margin-bottom: 24px; /* Adjust bottom margin to distribute space */
`;

export const Button = styled.button`
  width: 80%;
  height: 48px;
  align-items: center;
  justify-content: center;
  background-color: #ea7846;
  border-radius: 5px;
  border: 0;
  margin-top: 32px; /* Adjust as needed */
  margin-bottom: 32px; /* Adjust as needed */
`;

export const ButtonText = styled.span`
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  display: block; /* Ensure text is in block to center it vertically */
  text-align: center; /* Center text horizontally */
`;
