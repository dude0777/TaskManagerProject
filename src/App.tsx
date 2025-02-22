import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./store/AuthProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login/Login";
import { TaskManagementProvider } from "./store/TaskManagementProvider";

const App = () => {
  return (
    <TaskManagementProvider>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
    </TaskManagementProvider>
  );
};

export default App;
