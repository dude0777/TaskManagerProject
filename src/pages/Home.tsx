import Header from "../components/Header/Header";
import { useAuth } from "../hooks/useAuth";
import MainContainer from "../components/MainContainer/MainContainer";
const HomePage = () => {
  const { user, logout } = useAuth();

  return (
    <div>
    <Header/>
      
        <MainContainer/>
        Logged in as: <strong>{user?.displayName || user?.email}</strong>
      
      <button onClick={logout}>Log Out</button>
    </div>
  );
};

export default HomePage;
