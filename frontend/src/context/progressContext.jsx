import { createContext, useState } from "react";

export const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const [progressData, setProgressData] = useState([]);

  const updateProgressState = (data) => setProgressData(data);

  return (
    <ProgressContext.Provider value={{ progressData, updateProgressState }}>
      {children}
    </ProgressContext.Provider>
  );
};
