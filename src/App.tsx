import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./store/AuthProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login/Login";

const App = () => {
  return (
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
  );
};

export default App;
