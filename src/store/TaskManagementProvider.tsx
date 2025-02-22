import { createContext, useState, ReactNode } from "react";
import { Task } from "../hooks/types";

export type TaskManagementContextType = {
  selectedTasks: string[];
  editingTask: Task | null;
  setSelectedTasks: (tasks: string[]) => void;
  setEditingTask: (task: Task | null) => void;
  toggleTaskSelection: (taskId: string) => void;
  clearSelections: () => void;
  enableEditing: boolean;
  setEnableEditing: (enable: boolean) => void;
  tab: string;
  setTab: (tab: string) => void;
 
  category: string;
  setCategory: (category: string) => void;
  dueDate: string | null;
  setDueDate: (dueDate: string | null) => void;
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
};

type TaskProviderProps = {
  children: ReactNode;
};

const TaskManagementContext = createContext<TaskManagementContextType>({
  selectedTasks: [],
  editingTask: null,
  setSelectedTasks: () => {},
  setEditingTask: () => {},
  toggleTaskSelection: () => {},
  clearSelections: () => {},
  enableEditing: false,
  setEnableEditing: () => {},
  tab: "list",
  setTab: () => {},
  category: "",
  setCategory: () => {},
  dueDate: null,
  setDueDate: () => {},
  searchValue: "",
  setSearchValue: () => {},
});

export const TaskManagementProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [enableEditing, setEnableEditing] = useState<boolean>(false);
  const [tab, setTab] = useState<string>("list");

  const [category, setCategory] = useState<string>("");
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const clearSelections = () => {
    setSelectedTasks([]);
  };

  return (
    <TaskManagementContext.Provider
      value={{
        selectedTasks,
        editingTask,
        setSelectedTasks,
        setEditingTask,
        toggleTaskSelection,
        clearSelections,
        enableEditing,
        setEnableEditing,
        tab,
        setTab,
        category,
        setCategory,
        dueDate,
        setDueDate,
        searchValue,
        setSearchValue,
      }}
    >
      {children}
    </TaskManagementContext.Provider>
  );
};

export default TaskManagementContext;
