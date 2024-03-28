// src/global/global.js
import React, { useState } from "react";

// Create a context with a default value of false
const BooleanContext = React.createContext(false);

// Define the provider component
const BooleanProvider = ({ children }) => {
  const [boolValue, setBoolValue] = useState(false);

  // Define a function that toggles the boolean state
  const toggleBoolValue = () => setBoolValue(!boolValue);

  // The value prop of the provider will include the boolean state and the toggle function
  const value = { boolValue, toggleBoolValue };

  return (
    <BooleanContext.Provider value={value}>{children}</BooleanContext.Provider>
  );
};

// Export both the provider and the context
export { BooleanProvider, BooleanContext };
