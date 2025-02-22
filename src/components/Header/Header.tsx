import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import userImgg from "../../assets/userImgg.jpg";
import styles from "./Header.module.css";
import TaskIcon from "../../assets/TaskIcon";
import { useWindowSize } from "../../hooks/useWindowSize";
import Logout from "../../assets/Logout";
import BoardIcon from "../../assets/BoardIcon";
import ListIcon from "../../assets/ListIcon";
import { Popover } from "@mui/material"; // Import Popover and Button from MUI
import { useTaskManagement } from "../../hooks/useTaskManagement ";

function Header() {
  const isMobile = useWindowSize().isMobile;
  const { user, logout } = useAuth();
  const { tab, setTab } = useTaskManagement();

  // Popover state
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // Open popover
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Close popover
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  // Check if popover is open
  const open = Boolean(anchorEl);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          {!isMobile && (
            <div>
              <TaskIcon />
            </div>
          )}
          <h1>TaskBuddy</h1>
        </div>
        <div className={styles.profileImageContainer}>
          {/* Profile image with click handler for mobile */}
          <img
            src={user?.photoURL ?? userImgg}
            alt="User"
            onClick={isMobile ? handlePopoverOpen : undefined} // Open popover on mobile
            style={{ cursor: isMobile ? "pointer" : "default" }} // Add pointer cursor for mobile
          />
          {!isMobile && <p>{user?.displayName}</p>}
        </div>
      </div>

      {/* Popover for mobile */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          style: {
            borderRadius: "12px", // Rounded corners for the popover
            padding: "16px", // Add padding inside the popover
          },
        }}
      >
        <div className={styles.mobilePopover}>
          <div className={styles.popoverProfile}>
            <img
              src={user?.photoURL ?? userImgg}
              alt="User"
              className={styles.popoverImage}
            />
            <p>{user?.displayName}</p>
          </div>
          <button onClick={logout} className={styles.logoutButton}>
            <Logout /> Logout
          </button>
        </div>
      </Popover>

      
      {!isMobile && (
        <div className={styles.logoutContainer}>
          <div className={styles.tabs}>
            <div
              className={`${styles.tabButton} ${
                tab === "list" ? styles.active : ""
              }`}
              onClick={() => setTab("list")}
            >
              <ListIcon />
              <span>List</span>
              <div className={styles.underline} />
            </div>
            <div
              className={`${styles.tabButton} ${
                tab === "board" ? styles.active : ""
              }`}
              onClick={() => setTab("board")}
            >
              <BoardIcon />
              <span>Board</span>
              <div className={styles.underline} />
            </div>
          </div>
          <button onClick={logout} className={styles.logoutButton}>
            <Logout /> Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Header;