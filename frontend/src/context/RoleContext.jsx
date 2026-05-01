/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";

const RoleContext = createContext({
  role: null,
  roleLevel: 0,
  hasRole: () => false,
});

export function RoleProvider({ value, children }) {
  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  return useContext(RoleContext);
}
