import React, { createContext, useContext } from "react";

const TokenContext = createContext(null);

export function useToken() {
  return useContext(TokenContext);
}

export function TokenProvider({ children, token }) {
  return (
    <TokenContext.Provider value={token}>{children}</TokenContext.Provider>
  );
}
