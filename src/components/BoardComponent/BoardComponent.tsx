import React from "react";
import { Box, Container } from "@mui/material";
import { useFetchTasks } from "../../hooks/useFetchTasks";
import { useAuth } from "../../hooks/useAuth";
import BoardSection from "../BoardSection/BoardSection";
import Loader from "../Loader/Loader";
const BoardComponent: React.FC = () => {
  const { user } = useAuth();
  const { data: tasks, isLoading, error } = useFetchTasks(user?.uid || "");

  if (isLoading) return <Loader />;
  if (error) return <p>Error loading tasks: {error.message}</p>;

  const completedTasks =
    tasks?.filter((task) => task.status === "Completed") || [];
  const pendingTasks = tasks?.filter((task) => task.status === "New") || [];
  const inProgressTasks =
    tasks?.filter((task) => task.status === "In Progress") || [];

  return (
    <Container maxWidth={false} disableGutters>
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 2,
          
          minHeight: 600,
        }}
      >
        <BoardSection
          title="Todo"
          tasks={pendingTasks}
          backgroundColor="#FBAFE5"
         
        />
        <BoardSection
          title="In-progress"
          tasks={inProgressTasks}
          backgroundColor="#8BCEE4"
         
        />
        <BoardSection
          title="Completed"
          tasks={completedTasks}
          backgroundColor="#CEFFCC"
         
        />
      </Box>
    </Container>
  );
};

export default BoardComponent;
