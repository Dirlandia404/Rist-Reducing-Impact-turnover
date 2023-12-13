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
  height: auto; // Let the content define the height
  border-radius: 15px;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
  background-color: #fff;
  padding: 24px; // Adjusted for even padding
`;

export const ContentHeader = styled.header`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  margin-bottom: 24px; // Added to give space below the header
`;

export const UserContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

export const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 9999px;
`;

export const Title = styled.h1`
  font-size: 16px;
  color: #555;
`;

export const Subtitle = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: #8a8a8a;
  text-align: center;
  margin-top: 24px; // Adjusted for proper spacing from the divider
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #ccc;
  margin: 20px 0;
`;

export const SearchSection = styled.form`
  padding: 0 24px; // Ensure padding is consistent with header
`;
export const InputContainer = styled.div`
  margin-bottom: 24px; // Increased to give more space between inputs
`;

export const Label = styled.span`
  color: #8a8a8a;
  font-weight: 600;
  font-size: 12px;
`;

export const Input = styled.input`
  width: 100%;
  height: 42px;
  border-radius: 5px;
  border: 0.5px solid #a3a3a3;
  background-color: #fff;
  padding: 0 20px;
  margin-top: 5px;
  font-size: 12px;
`;

export const Button = styled.button`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ea7846;
  border: 0;
  border-radius: 5px;
  margin-top: 24px; // Adjusted for space above the button
  gap: 10px; // Adjusted for space between text and icon
`;

export const ButtonText = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
`;
