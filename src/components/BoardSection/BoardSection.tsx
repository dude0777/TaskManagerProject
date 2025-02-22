import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Paper,
  Popover,
  MenuItem,
} from "@mui/material";
import EditIcon from "../../assets/EditIcon";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Task } from "../../hooks/types";
import dayjs from "dayjs";
import { useDrag, useDrop, DragSourceMonitor } from "react-dnd";

import { useUpdateTask } from "../../hooks/useUpdateTask";
import { useDeleteTask } from "../../hooks/useDeleteTask";
import { useTaskManagement } from "../../hooks/useTaskManagement ";

const ItemTypes = {
  TASK: "task",
};

interface DropResult {
  status: string;
}

interface DragItem {
  id: string;
  task: Task;
}

interface DragEndHandler {
  (itemId: string, status: string): void;
}

type DraggableTaskCardProps = {
  task: Task;
  onDragEnd: DragEndHandler;
  onMoreClick: (event: React.MouseEvent<HTMLButtonElement>, taskId: string) => void;
};

const DraggableTaskCard: React.FC<DraggableTaskCardProps> = ({
  task,
  onDragEnd,
  onMoreClick,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { id: task.id, task },
    end: (item: DragItem | null, monitor: DragSourceMonitor) => {
      const dropResult = monitor.getDropResult() as DropResult | null;
      if (item && dropResult) {
        onDragEnd(item.id, dropResult.status);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = dayjs(dateString);
    const today = dayjs();
    if (date.format("YYYY-MM-DD") === today.format("YYYY-MM-DD")) {
      return "Today";
    }
    return date.format("D MMM, YYYY");
  };

  return (
    <Card
      ref={drag}
      sx={{
        mb: 2,
        opacity: isDragging ? 0.4 : 1,
        cursor: "move",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h6" component="div" sx={{ fontSize: "1rem", fontWeight: "bold" }}>
            {task.title}
          </Typography>
          <IconButton size="small" onClick={(e) => onMoreClick(e, task.id)}>
            <MoreHorizIcon />
          </IconButton>
        </Box>
        <Box display="flex" mt={1} justifyContent="space-between" alignItems="center">
          <Chip
            label={task.type}
            size="small"
            sx={{
              bgcolor: task.type === "work" ? "#f0f4ff" : "#fff0f0",
              color: task.type === "work" ? "#5b7cff" : "#ff7c5b",
              fontSize: "0.75rem",
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {formatDate(task.dueDate)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const DroppableSection = ({
  status,
  children,
}: {
  status: string;
  children: React.ReactNode;
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: () => ({ status }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      style={{
        position: "relative",
        minHeight: "300px",
        backgroundColor: isOver ? "rgba(123, 25, 132, 0.1)" : "transparent",
        transition: "background-color 0.2s ease",
        height: "100%",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
};

type BoardSectionProps = {
  title: string;
  tasks: Task[];
  backgroundColor: string;
};

const BoardSection: React.FC<BoardSectionProps> = ({
  title,
  tasks,
  backgroundColor,
}) => {
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const { setEditingTask, setEnableEditing } = useTaskManagement();

  // Popover state for edit and delete actions
  const [popover, setPopover] = useState<{
    anchorEl: HTMLButtonElement | null;
    taskId?: string;
    type: "actions" | null;
  }>({
    anchorEl: null,
    type: null,
  });

  const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>, taskId: string) => {
    setPopover({
      anchorEl: event.currentTarget,
      taskId,
      type: "actions",
    });
  };

  const handlePopoverClose = () => {
    setPopover({ anchorEl: null, type: null });
  };

  const handleTaskEdit = (taskId: string) => {
    const taskToEdit = tasks.find((t) => t.id === taskId);
    if (taskToEdit) {
      setEditingTask(taskToEdit);
      setEnableEditing(true);
      handlePopoverClose();
    }
  };

  const handleTaskDelete = (taskId: string) => {
    deleteTaskMutation.mutate(taskId);
    handlePopoverClose();
  };

  const handleTaskDragEnd = (taskId: string, newStatus: string) => {
    // Map section titles to actual status values
    const validStatus =
      newStatus === "Todo"
        ? "New"
        : newStatus === "In-progress"
        ? "In Progress"
        : newStatus === "Completed"
        ? "Completed"
        : newStatus;
    updateTaskMutation.mutate({
      id: taskId,
      updatedTask: {
        status: validStatus,
        activities: [
          {
            name: `You moved this task to ${validStatus}`,
            time: new Date().toISOString(),
          },
        ],
      },
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "#F1F1F1",
        borderRadius: 2,
        p: 2,
        flex: 1,
        minWidth: 300,
        maxWidth: 350,
        height: "fit-content",
        m: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: backgroundColor,
            borderRadius: 2,
            p: 1,
          }}
        >
          <Typography>{title.toUpperCase()}</Typography>
        </Box>
      </Box>
      <DroppableSection status={title}>
        <Box
          sx={{
            minHeight: 300,
            maxHeight: 600,
            overflowY: "auto",
            pr: 1,
          }}
        >
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <DraggableTaskCard
                key={task.id}
                task={task}
                onDragEnd={handleTaskDragEnd}
                onMoreClick={handlePopoverOpen}
              />
            ))
          ) : (
            <Typography align="center" color="text.secondary" sx={{ mt: 10 }}>
              No tasks available
            </Typography>
          )}
        </Box>
      </DroppableSection>
      <Popover
        disablePortal
        sx={{ minWidth: "10rem" }}
        open={Boolean(popover.anchorEl)}
        anchorEl={popover.anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {popover.type === "actions" && (
          <>
            <MenuItem onClick={() => popover.taskId && handleTaskEdit(popover.taskId)}>
              <EditIcon /> Edit
            </MenuItem>
            <MenuItem
              onClick={() => popover.taskId && handleTaskDelete(popover.taskId)}
              sx={{ color: "red" }}
            >
              Delete
            </MenuItem>
          </>
        )}
      </Popover>
    </Paper>
  );
};

export default BoardSection;
