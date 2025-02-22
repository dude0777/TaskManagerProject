import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import {
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Typography,
  Button,
  TableHead,
  Popover,
  MenuItem,
  IconButton,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "../../assets/EditIcon";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { Task } from "../../hooks/types";
import CustomDatePicker from "../CustomDatePicker";
import { useAddTask } from "../../hooks/useAddTask";
import { useUpdateTask } from "../../hooks/useUpdateTask";
import { useAuth } from "../../hooks/useAuth";
import { useTaskManagement } from "../../hooks/useTaskManagement ";
import { useDeleteTask } from "../../hooks/useDeleteTask";
import { Dayjs } from "dayjs";
import { useWindowSize } from "../../hooks/useWindowSize";
import { CheckCircleOutline } from "@mui/icons-material";
import { useDrag, useDrop } from "react-dnd";

const ITEM_TYPE = "TASK";

type DraggableTaskRowProps = {
  task: Task;
  index: number;
  moveTask: (dragIndex: number, hoverIndex: number) => void;
  isMobile: boolean;
  selectedTasks: string[];
  toggleTaskSelection: (id: string) => void;
  handlePopoverOpen: (
    event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
    type: "status" | "category" | "actions" | "updateStatus",
    taskId?: string
  ) => void;
  formatDate: (dateString: string | null) => string;
handleTaskEdit: (task: Task) => void;
};

const DraggableTaskRow: React.FC<DraggableTaskRowProps> = ({
  task,
  index,
  moveTask,
  isMobile,
  selectedTasks,
  toggleTaskSelection,
  handlePopoverOpen,
  formatDate,
  handleTaskEdit
 
}) => {
  const ref = useRef<HTMLTableRowElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index, task },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (dragItem: { index: number; task: Task }) => {
      if (!ref.current) return;
      const dragIndex = dragItem.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveTask(dragIndex, hoverIndex);
      dragItem.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <TableRow
      ref={ref}
      key={task.id}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: "move" }}
    >
      <TableCell padding="checkbox">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Checkbox
            checked={selectedTasks.includes(task.id || "")}
            onChange={() => toggleTaskSelection(task.id || "")}
          />
          <CheckCircleOutline
            sx={{
              color: 'white',
              backgroundColor: task.status === "Completed" ? "green" : "grey",
              borderRadius: "50%",  
              border:'none',
              padding:'0',
            }}
          />
        </div>
      </TableCell>
      <TableCell onClick={() => {
        if (isMobile) {
          handleTaskEdit(task);
        }
      }}>
        {task.title}
      </TableCell>
      {!isMobile && (
        <>
          <TableCell>{formatDate(task.dueDate)}</TableCell>
          <TableCell>
            <Button
              sx={{ backgroundColor: "#DDDADD", color: "black" }}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                handlePopoverOpen(e, "updateStatus", task.id)
              }
            >
              {task.status === "New" ? "TO-DO" : task.status.toUpperCase()}
            </Button>
          </TableCell>
          <TableCell>{task.type}</TableCell>
          <TableCell>
            <IconButton
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                handlePopoverOpen(e, "actions", task.id)
              }
            >
              <MoreHorizIcon />
            </IconButton>
          </TableCell>
        </>
      )}
    </TableRow>
  );
};

type TableSectionProps = {
  title: string;
  tasks: Task[];
  sectionStatus: string;
  accordionColor?: string;
  addButtonNeeded: boolean;
};

const TableSection: React.FC<TableSectionProps> = ({
  title,
  tasks,
  sectionStatus,
  accordionColor = "#E0E0E0",
  addButtonNeeded,
}: TableSectionProps) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  const [taskStatus, setTaskStatus] = useState<string>("");
  const [taskCategory, setTaskCategory] = useState<"work" | "personal">("work");
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({
    title: false,
    status: false,
    dueDate: false,
  });

  const updateTaskMutation = useUpdateTask();
  const { user } = useAuth();
  const addTaskMutation = useAddTask(user?.uid || "");
  const deleteTaskMutation = useDeleteTask();
  const statusOptions = [
    { value: "New", label: "New" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
  ];
  const isMobile = useWindowSize().isMobile;
  const categoryOptions = [
    { value: "work", label: "Work" },
    { value: "personal", label: "Personal" },
  ];

  const {
    selectedTasks,
    toggleTaskSelection,
    setEditingTask,
    setEnableEditing,
  } = useTaskManagement();

  const [popover, setPopover] = useState<{
    anchorEl: HTMLButtonElement | HTMLDivElement | null;
    type: "status" | "category" | "actions" | "updateStatus" | null;
    taskId?: string;
  }>({
    anchorEl: null,
    type: null,
  });

  const [orderedTasks, setOrderedTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    setOrderedTasks(tasks);
  }, [tasks]);

  const moveTask = (fromIndex: number, toIndex: number) => {
    const updatedTasks = [...orderedTasks];
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedTask);
    setOrderedTasks(updatedTasks);
  };

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (dragItem: { index: number; task: Task }) => {
      if (dragItem.task.status !== sectionStatus) {
        updateTaskMutation.mutate({
          id: dragItem.task.id,
          updatedTask: { status: sectionStatus },
        });
      }
    },
  });

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
    type: "status" | "category" | "actions" | "updateStatus",
    taskId?: string
  ) => {
    setPopover({
      anchorEl: event.currentTarget,
      type,
      taskId,
    });
  };

  const handlePopoverClose = () => {
    setPopover({ anchorEl: null, type: null });
  };

  const handleTaskDelete = (taskId: string) => {
    deleteTaskMutation.mutate(taskId);
    handlePopoverClose();
  };

  const handleTaskEdit = (task: Task) => {
    setEditingTask(task);
    handlePopoverClose();
    setEnableEditing(true);
  };

  const handleTaskEditing = (
    taskId: string | undefined,
    updatedStatus: string
  ) => {
    if (!taskId) return;
    updateTaskMutation.mutate({
      id: taskId,
      updatedTask: { status: updatedStatus },
    });
    handlePopoverClose();
  };

  const handleAddClick = () => {
    setIsAddingTask(true);
  };

  const handleCancel = () => {
    setIsAddingTask(false);
    setTaskName("");
    setDueDate(null);
    setTaskStatus("");
    setTaskCategory("work");
    setErrors({ title: false, status: false, dueDate: false });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const newTask = {
      title: taskName,
      description: "",
      type: taskCategory,
      status: taskStatus,
      dueDate: dueDate ? dueDate.toISOString() : null,
      fileURL: null,
      tags: [],
      activities: [
        {
          name: "You created this task",
          time: new Date().toISOString(),
        },
      ],
    };

    try {
      await addTaskMutation.mutateAsync(newTask);
      handleCancel();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = dayjs(dateString);
    const today = dayjs();
    if (date.format("YYYY-MM-DD") === today.format("YYYY-MM-DD")) {
      return "Today";
    }
    return date.format("D MMM, YYYY");
  };

  const validateForm = () => {
    const newErrors = {
      title: taskName.trim() === "",
      status: taskStatus === "",
      dueDate: dueDate === null,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  return (
    <div ref={drop}>
      <Accordion
        sx={{
          width: "100%",
          backgroundColor: accordionColor,
          marginBottom: "1.5rem",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-content"
          id="panel-header"
        >
          <Typography>
            {title} ({orderedTasks.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: "0px !important" }}>
          <TableContainer component={Paper} sx={{ backgroundColor: "#F1F1F1" }}>
            <Table aria-label="task table">
              {!isMobile && addButtonNeeded && (
                <TableHead>
                  {!isAddingTask ? (
                    <TableRow
                      sx={{ borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
                    >
                      <TableCell
                        sx={{
                          borderBottom: "1px solid rgba(224, 224, 224, 1)",
                        }}
                        colSpan={2}
                      >
                        <div
                          style={{ fontSize: "1.1rem", cursor: "pointer" }}
                          onClick={handleAddClick}
                        >
                          <span
                            style={{ fontSize: "1.4rem", color: "#7B1984" }}
                          >
                            {" "}
                            +{" "}
                          </span>{" "}
                          Add Task
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <TableCell
                        sx={{
                          borderBottom: "1px solid rgba(224, 224, 224, 1)",
                        }}
                        colSpan={2}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.8rem",
                            marginBlockStart: "1.9rem",
                          }}
                        >
                          <input
                            type="text"
                            placeholder="Task Name"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            style={{
                              border: errors.title ? "1px solid red" : "none",
                              borderRadius: "25px",
                              padding: "0.5rem 1rem",
                              backgroundColor: "#F1F1F1",
                              width: "100%",
                              outline: "none",
                              boxShadow: "none",
                            }}
                          />
                          <div>
                            <Button
                              onClick={handleSubmit}
                              sx={{
                                backgroundColor: "#7B1984",
                                color: "white",
                                borderRadius: "25px",
                                minWidth: "7rem",
                                padding: "0.5rem 0.1rem 0.5rem 0.1rem",
                                "&:hover": { backgroundColor: "#691574" },
                              }}
                            >
                              <div style={{ marginRight: "1rem" }}>ADD</div>
                              <KeyboardReturnIcon />
                            </Button>
                            <Button
                              onClick={handleCancel}
                              sx={{
                                backgroundColor: "transparent",
                                color: "#7B1984",
                                borderRadius: "25px",
                                minWidth: "7rem",
                                padding: "0.5rem 0.1rem 0.5rem 0.1rem",
                                marginLeft: "1rem",
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <CustomDatePicker
                          label="Add Date"
                          width="110px"
                          borderRadius="25px"
                          onChange={(date) => setDueDate(date)}
                          endAdornmentIcon={<KeyboardReturnIcon />}
                        />
                      </TableCell>
                      <TableCell>
                        <div
                          style={{
                            border: errors.status
                              ? "1px solid red"
                              : "1px solid #E0E0E0",
                            borderRadius: "50%",
                            padding: "0.6rem 1rem",
                            display: "inline-block",
                            fontSize: "1.3rem",
                            cursor: "pointer",
                          }}
                          onClick={(e) => handlePopoverOpen(e, "status")}
                        >
                          +
                        </div>
                      </TableCell>
                      <TableCell colSpan={2}>
                        <div
                          style={{
                            border: "1px solid #E0E0E0",
                            borderRadius: "50%",
                            padding: "0.6rem 1rem",
                            display: "inline-block",
                            fontSize: "1.3rem",
                            cursor: "pointer",
                          }}
                          onClick={(e) => handlePopoverOpen(e, "category")}
                        >
                          +
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableHead>
              )}
              <TableBody>
                {orderedTasks.length > 0 ? (
                  orderedTasks.map((task, index) => (
                    <DraggableTaskRow
                      key={task.id}
                      task={task}
                      index={index}
                      moveTask={moveTask}
                      isMobile={isMobile}
                      selectedTasks={selectedTasks}
                      toggleTaskSelection={toggleTaskSelection}
                      handlePopoverOpen={handlePopoverOpen}
                      formatDate={formatDate}
                      handleTaskEdit={handleTaskEdit}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                      No tasks in {title.replace("Tasks",'')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
        <Popover
          disablePortal
          sx={{ minWidth: "10rem" }}
          open={Boolean(popover.anchorEl)}
          anchorEl={popover.anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          {popover.type === "updateStatus" &&
            statusOptions.map((option) => (
              <MenuItem
                key={option.value}
                onClick={() => {
                  handleTaskEditing(popover.taskId, option.value);
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          {popover.type === "status" &&
            statusOptions.map((option) => (
              <MenuItem
                key={option.value}
                onClick={() => {
                  setTaskStatus(option.value);
                  handlePopoverClose();
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          {popover.type === "category" &&
            categoryOptions.map((option) => (
              <MenuItem
                key={option.value}
                onClick={() => {
                  setTaskCategory(option.value as "work" | "personal");
                  handlePopoverClose();
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          {popover.type === "actions" && (
            <>
              <MenuItem
                onClick={() => {
                  const taskToEdit = tasks.find(
                    (t: Task) => t.id === popover.taskId
                  );
                  if (taskToEdit) handleTaskEdit(taskToEdit);
                }}
              >
                <EditIcon /> Edit
              </MenuItem>
              <MenuItem
                onClick={() =>
                  popover.taskId && handleTaskDelete(popover.taskId)
                }
                sx={{ color: "red" }}
              >
                Delete
              </MenuItem>
            </>
          )}
        </Popover>
      </Accordion>
    </div>
  );
};

export default TableSection;
