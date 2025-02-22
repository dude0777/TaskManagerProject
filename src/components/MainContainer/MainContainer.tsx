import FilterSection from "../FilterSection/FilterSection";
import TableComponent from "../TableComponent/TableComponent";
import styles from "./MainContainer.module.css"; // Import CSS module
import { useFetchTasks } from "../../hooks/useFetchTasks"; // Import the custom hook
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";
const MainContainer = () => {
    const { user } = useAuth();
  // Fetch tasks using the custom hook
  const { data: tasks, isLoading, isError } = useFetchTasks(user?.uid||'');

  // Log the fetched tasks to the console
  useEffect(() => {
    if (tasks) {
      console.log("Fetched tasks:", tasks);
    }
  }, [tasks]);

  // Log loading and error states
  if (isLoading) {
    console.log("Loading tasks...");
  }

  if (isError) {
    console.error("Error fetching tasks");
  }

  return (
    <div className={styles.mainContainer}>
      <FilterSection />
      <TableComponent />
    </div>
  );
};

export default MainContainer;