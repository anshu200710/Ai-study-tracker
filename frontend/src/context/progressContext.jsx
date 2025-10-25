// context/ProgressContext.jsx
import { createContext, useState } from "react";

export const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const [progressInfo, setProgressInfo] = useState({});

  const updateProgressState = (data) => setProgressInfo(data || {});

  return (
    <ProgressContext.Provider value={{ progressInfo, updateProgressState }}>
      {children}
    </ProgressContext.Provider>
  );
};
