import React from "react";
import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./components/AppRouter";
import NotificationSystem from "./components/common/Notificaton";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="App">
        <AppRouter />
        <NotificationSystem />
      </div>
    </AuthProvider>
  );
};

export default App;
