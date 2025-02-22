import { useContext } from "react";
import TaskManagementContext from "../store/TaskManagementProvider";

export const useTaskManagement = () => useContext(TaskManagementContext);