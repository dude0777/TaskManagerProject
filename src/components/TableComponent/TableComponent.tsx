import React from "react";
import { useFetchTasks } from "../../hooks/useFetchTasks";
import { useAuth } from "../../hooks/useAuth";
import TableSection from "../TableSection/TableSection";
import { useTaskManagement } from "../../hooks/useTaskManagement ";
import dayjs from "dayjs";
import Loader from "../Loader/Loader";

const TableComponent: React.FC = () => {
  const { user } = useAuth();
  const { data: tasks, isLoading, error } = useFetchTasks(user?.uid || "");
  const { searchValue, category, dueDate } = useTaskManagement();

  if (isLoading) return <Loader />;
  if (error) return <p>Error loading tasks: {error.message}</p>;


  const filteredTasks = (tasks || []).filter((task) => {
    const matchesSearch = searchValue
      ? ((task.title && task.title.toLowerCase().includes(searchValue.toLowerCase())) ||
         (task.description && task.description.toLowerCase().includes(searchValue.toLowerCase())))
      : true;

    const matchesDueDate = dueDate
      ? task.dueDate && dayjs(task.dueDate).isSame(dayjs(dueDate), "day")
      : true;

    const matchesCategory = category ? task.status === category : true;

    return matchesSearch && matchesDueDate && matchesCategory;
  });


  const completedTasks = filteredTasks.filter((task) => task.status === "Completed");
  const pendingTasks = filteredTasks.filter((task) => task.status === "New");
  const inProgressTasks = filteredTasks.filter((task) => task.status === "In Progress");

  return (
    <div style={{ width: "100%", marginTop: "2rem" }}>
      <TableSection
        title="Todo"
        sectionStatus="New"
        tasks={pendingTasks}
        accordionColor="#FBAFE5"
        addButtonNeeded={true}
      />
      <TableSection
        title="In-progress Tasks"
        sectionStatus="In Progress"
        tasks={inProgressTasks}
        accordionColor="#8BCEE4"
        addButtonNeeded={false}
      />
      <TableSection
        title="Completed Tasks"
        sectionStatus="Completed"
        tasks={completedTasks}
        accordionColor="#CEFFCC"
        addButtonNeeded={false}
      />
    </div>
  );
};

export default TableComponent;
