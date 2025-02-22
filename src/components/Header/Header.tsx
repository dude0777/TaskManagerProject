
import { useAuth } from "../../hooks/useAuth";
import userImgg from "../../assets/userImgg.jpg";
import styles from "./Header.module.css"; // Import the CSS module

function Header() {
  const { user } = useAuth();
  console.log(user, "user");
  console.log(user?.photoURL, "user");

  return (
    <div className={styles.header}>
      <h1>TaskBuddy</h1>
      <div className={styles.profileImageContainer}>
        <img src={user?.photoURL ?? userImgg} alt="User" />
        <p>{user?.displayName}</p>
      </div>
    </div>
  );
}

export default Header;
