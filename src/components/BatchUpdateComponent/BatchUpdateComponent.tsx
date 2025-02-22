import React, { useState } from "react";
import TasksIcon from "../../assets/TasksIcon";
import { useTaskManagement } from "../../hooks/useTaskManagement ";
import { useUpdateTasks, useDeleteTasks } from "../../hooks/useBatchOperations";
import CloseIcon from "@mui/icons-material/Close";
import { Popover, MenuItem } from "@mui/material";
import styles from "./BatchUpdate.module.css";

const statusOptions = [
  { value: "New", label: "New" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
];

const BatchUpdateContainer: React.FC = () => {
  const { selectedTasks, clearSelections } = useTaskManagement();
  const updateTasksMutation = useUpdateTasks();
  const deleteTasksMutation = useDeleteTasks();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleBatchUpdate = (status: string) => {
    const updates = selectedTasks.map((id) => ({ id, data: { status } }));
    updateTasksMutation.mutate(updates);
    clearSelections();
    setAnchorEl(null);
  };

  const handleBatchDelete = () => {
    deleteTasksMutation.mutate(selectedTasks);
    clearSelections();
  };

  if (selectedTasks.length === 0) return null;

  return (
    <div className={styles.container}>
      {/* Task Count and Close button */}
      <div className={styles.taskInfo}>
        <div className={styles.taskCountBox}>
          <div>{selectedTasks.length} Tasks Selected</div>
          <CloseIcon onClick={clearSelections}  />
        </div>
        <TasksIcon />
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        {/* Status button with Popover */}
        <button
          onClick={(event) => setAnchorEl(event.currentTarget)}
          className={styles.statusButton}
        >
          Status
        </button>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          {statusOptions.map((option) => (
            <MenuItem key={option.value} onClick={() => handleBatchUpdate(option.value)}>
              {option.label}
            </MenuItem>
          ))}
        </Popover>

        {/* Delete button */}
        <button onClick={handleBatchDelete} className={styles.deleteButton}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default BatchUpdateContainer;
