import * as React from "react";
import { useState } from "react";
import { Global } from "@emotion/react";
import { SelectChangeEvent } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { Close } from "@mui/icons-material";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Dialog from "@mui/material/Dialog";
import { Chip, Stack, TextField } from "@mui/material";
import CustomTextField from "../CustomTextField/CustomTextField";
import CustomDatePicker from "../CustomDatePicker";
import CustomSelect from "../CustomSelect/CustomSelect";
import { Dayjs } from "dayjs";
import { uploadFileToCloudinary } from "../../utils/uploadFileToCloudinary";
import { useAddTask } from "../../hooks/useAddTask";
import { useAuth } from "../../hooks/useAuth";
import { useWindowSize } from "../../hooks/useWindowSize";
import styles from "./AddTask.module.css";
import RichTextEditor from "../RichTextEditor/RichTextEditor";
import Loader from "../Loader/Loader";

const drawerBleeding = 56;

interface Props {
  open: boolean;
  toggleDrawer: (newOpen: boolean) => void;
}

const CreateTask: React.FC<Props> = ({ open, toggleDrawer }) => {
  const [taskType, setTaskType] = useState<"work" | "personal">("work");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  const [taskStatus, setTaskStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({
    title: false,
    status: false,
    dueDate: false,
  });

  const isMobile = useWindowSize().isMobile;
  const { user } = useAuth();
  const addTaskMutation = useAddTask(user?.uid || "");

  const handleDateChange = (date: Dayjs | null) => {
    setDueDate(date);
    setErrors({ ...errors, dueDate: date === null });
  };

  const handleCreateTask = async () => {
    if (!validateForm()) return;

    const newTask = {
      title: taskTitle,
      description: taskDescription,
      type: taskType,
      status: taskStatus,
      dueDate: dueDate ? dueDate.toISOString() : null,
      fileURL,
      tags,
      activities: [
        {
          name: "You created this task",
          time: new Date().toISOString(),
        },
      ],
    };

    try {
      await addTaskMutation.mutateAsync(newTask);
      resetForm();
      toggleDrawer(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const resetForm = () => {
    setTaskTitle("");
    setTaskDescription("");
    setTaskType("work");
    setTaskStatus("");
    setDueDate(null);
    setFileURL(null);
    setTags([]);
    setTagInput("");
    setErrors({
      title: false,
      status: false,
      dueDate: false,
    });
  };

  const handleStatusChange = (event: SelectChangeEvent<string | number>) => {
    setTaskStatus(event.target.value.toString());
    setErrors({ ...errors, status: event.target.value.toString() === "" });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setIsUploading(true);
      try {
        const fileUrl = await uploadFileToCloudinary(selectedFile);
        setFileURL(fileUrl);
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setIsUploading(false);
      }
      e.target.value = "";
    }
  };

  const handleDivClick = () => {
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleRemoveFile = () => {
    setFileURL(null);
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== "" && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(e.target.value);
    setErrors({ ...errors, title: e.target.value.trim() === "" });
  };

  const validateForm = () => {
    const newErrors = {
      title: taskTitle.trim() === "",
      status: taskStatus === "",
      dueDate: dueDate === null,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const isCreateDisabled = () => {
    return taskTitle.trim() === "" || taskStatus === "" || dueDate === null;
  };

  const menuItems = [
    { value: "New", label: "New" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
  ];

  const formContent = (
    <div className={styles.contentContainer}>
      <div className={styles.header}>
        <p className={styles.headerTitle}>Create Task</p>
        <Close onClick={() => toggleDrawer(false)} />
      </div>

      <div className={styles.formSection}>
        <CustomTextField
          borderRadius="10px"
          label="Task Title"
          value={taskTitle}
          onChange={handleTitleChange}
          width="100%"
        />

        <RichTextEditor
          label="Description"
          value={taskDescription}
          onChange={(newDescription) => setTaskDescription(newDescription)}
        />

        <div className={isMobile ? styles.inputGroup : styles.desktopInputRow}>
          <div className={styles.chipContainer}>
            <p className={styles.label}>Task Category*</p>
            <Stack direction="row" spacing={2}>
              <Chip
                sx={{
                  backgroundColor:
                    taskType === "work" ? "#7B1984" : "transparent",
                  color: taskType === "work" ? "white" : "black",
                  borderColor: "#7B1984",
                  padding: "1rem 1.5rem",
                  "&:hover": {
                    backgroundColor:
                      taskType === "work" ? "#6A1570" : "rgba(0,0,0,0.08)",
                  },
                }}
                label="Work"
                clickable
                variant={taskType === "work" ? "filled" : "outlined"}
                onClick={() => setTaskType("work")}
              />
              <Chip
                variant={taskType === "personal" ? "filled" : "outlined"}
                sx={{
                  backgroundColor:
                    taskType === "personal" ? "#7B1984" : "transparent",
                  color: taskType === "personal" ? "white" : "black",
                  borderColor: "#7B1984",
                  padding: "1rem 1.3rem",
                  "&:hover": {
                    backgroundColor:
                      taskType === "personal" ? "#6A1570" : "rgba(0,0,0,0.08)",
                  },
                }}
                label="Personal"
                clickable
                onClick={() => setTaskType("personal")}
              />
            </Stack>
          </div>

          <div className={styles.inputGroup}>
            <p className={styles.label}>Due on*</p>
            <CustomDatePicker
              value={dueDate}
              onChange={handleDateChange}
              borderRadius="10px"
            />
          </div>

          <div className={styles.inputGroup}>
            <p className={styles.label}>Task Status*</p>
            <CustomSelect
              value={taskStatus}
              onChange={handleStatusChange}
              borderRadius="10px"
              menuItems={menuItems}
              placeholder="Choose"
            />
          </div>
        </div>

        <div className={styles.tagSection}>
          <p className={styles.label}>Tags</p>
          <TextField
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleAddTag();
              }
            }}
            placeholder="Add a tag and press Enter"
            fullWidth
            variant="outlined"
            size="small"
          />
          <div className={styles.tagChips}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => handleDeleteTag(tag)}
              />
            ))}
          </div>
        </div>

        <div className={styles.attachmentSection} onClick={handleDivClick}>
          <p className={styles.label}>Attachment</p>
          <div className={styles.dropZone}>
            <p className={styles.dropZoneText}>
            Drop your files here or <span className={styles.uploadLink}>Upload</span>
            </p>
          </div>
          <input
            id="file-input"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        {fileURL && (
          <div className={styles.filePreview}>
            <img
              src={fileURL}
              alt="File Preview"
              className={styles.previewImage}
            />
            <Close
              className={styles.removeFileButton}
              onClick={handleRemoveFile}
            />
          </div>
        )}
      </div>

      <div className={styles.actionButtons}>
        <button
          onClick={() => {
            resetForm();
            toggleDrawer(false);
          }}
          className={styles.cancelButton}
        >
          Cancel
        </button>
        <button
          disabled={isCreateDisabled()}
          onClick={handleCreateTask}
          className={`${styles.createButton} ${
            isCreateDisabled() ? styles.createButtonDisabled : ""
          }`}
        >
          Create
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.root}>
      <CssBaseline />
      {isUploading  &&  <Loader />}
      {isMobile ? (
        <>
          <Global
            styles={{
              ".MuiDrawer-root.MuiDrawer-modal .MuiDrawer-paper": {
                height: `calc(100% - ${drawerBleeding}px)`,
                borderRadius: "20px 20px 0 0",
              },
            }}
          />
          <SwipeableDrawer
            anchor="bottom"
            open={open}
            onClose={() => toggleDrawer(false)}
            onOpen={() => toggleDrawer(true)}
            swipeAreaWidth={drawerBleeding}
            disableSwipeToOpen={false}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              "& .MuiDrawer-paper": {
                height: `calc(80% - ${drawerBleeding}px)`,
                borderRadius: "20px 20px 0 0",
              },
            }}
          >
            {formContent}
          </SwipeableDrawer>
        </>
      ) : (
        <Dialog
          open={open}
          onClose={() => toggleDrawer(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            style: {
              borderRadius: "20px",
            },
          }}
        >
          {formContent}
        </Dialog>
      )}
    </div>
  );
};

export default CreateTask;
