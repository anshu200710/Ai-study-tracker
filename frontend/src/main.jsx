import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// Context Providers
import { AuthProvider } from "./context/AuthContext.jsx";
import { ProgressProvider } from "./context/progressContext.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
    <BrowserRouter>
        <ProgressProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </ProgressProvider>
    </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
