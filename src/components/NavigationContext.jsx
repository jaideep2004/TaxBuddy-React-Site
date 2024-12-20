import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Create a context to hold the navigation function
const NavigationContext = createContext();

// Custom hook to access navigate function
export const useNavigation = () => {
  return useContext(NavigationContext);
};

// Context provider component
export const NavigationProvider = ({ children }) => {
  const navigate = useNavigate();

  return (
    <NavigationContext.Provider value={navigate}>
      {children}
    </NavigationContext.Provider>
  );
};
