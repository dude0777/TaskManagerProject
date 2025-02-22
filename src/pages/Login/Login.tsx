// pages/Login/LoginPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import TaskIcon from "../../assets/TaskIcon";
import styles from './Login.module.css'
import GoogleIcon from "../../assets/GoogleIcon";
import BackgroundCircles from "../../components/BackgroundCircles/BackgroundCircles";
import { useWindowSize } from "../../hooks/useWindowSize";
import TaskList  from '../../assets/Task list view 3.png'
const LoginPage = () => {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useWindowSize();

  useEffect(() => {
    console.log("LoginPage effect - User:", user, "Loading:", loading);
    if (user && !loading) {
      console.log("Navigating to home...");
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleLogin = async () => {
    console.log("Login button clicked");
    try {
      await login();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return ( <>
    <div className={styles.container}>
     <div className={styles.contentContainer}>
      <div className={styles.header}>
        <div className={styles.taskIcon}>
          <TaskIcon />
        </div>
        <h1 className={styles.title}>TaskBuddy</h1>
      </div>
      <div className={styles.description}>
        Streamline your workflow and track progress effortlessly <br></br>
        with our all-in-one task management app.
      </div>
      <div className={styles.description}>
       
      </div>
      <button onClick={handleLogin} className={styles.loginButton}>
        <GoogleIcon/>
        Continue with Google
    
      </button>
      </div>
      { !isMobile&&<div>
        <img className={styles.imgStyles} src={TaskList} alt="Task List" />
      </div>}
    </div>
    <BackgroundCircles />
   </>
  );
};

export default LoginPage;