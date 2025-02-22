import * as React from "react";
import { useState } from "react";
import { Global } from "@emotion/react";
import { SelectChangeEvent } from "@mui/material";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import { Close } from "@mui/icons-material";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Chip, Stack, TextField } from "@mui/material"; // Import TextField and IconButton
import CustomTextField from "../CustomTextField/CustomTextField";
import CustomDatePicker from "../CustomDatePicker";
import CustomSelect from "../CustomSelect/CustomSelect";
import { Dayjs } from "dayjs";
import { uploadFileToCloudinary } from "../../utils/uploadFileToCloudinary";
import { useAddTask } from "../../hooks/useAddTask";
import { useAuth } from "../../hooks/useAuth";
const drawerBleeding = 56;

interface Props {
  open: boolean;
  toggleDrawer: (newOpen: boolean) => void;
}

const Root = styled("div")(({ theme }) => ({
  height: "100%",
  backgroundColor: grey[100],
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.background.default,
  }),
}));

const CreateTask: React.FC<Props> = ({ open, toggleDrawer }) => {
  const [taskType, setTaskType] = useState<"work" | "personal">("work");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  const [taskStatus, setTaskStatus] = useState<string|number>("");
  const [isUploading, setIsUploading] = useState(false);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]); 
  const [tagInput, setTagInput] = useState(""); 
  const [errors, setErrors] = useState<{[key: string]: boolean}>({
    title: false,
    status: false,
    dueDate: false
  });
  const { user } = useAuth();

  const addTaskMutation = useAddTask(user?.uid||'');
  const handleDateChange = (date: Dayjs | null) => {
    setDueDate(date);
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
      
      // Reset form and close drawer
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
    setErrors({
      title: false,
      status: false,
      dueDate: false
    });
  };
  const handleStatusChange = (event: SelectChangeEvent<string | number>) => {
    setTaskStatus(event.target.value as string);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setIsUploading(true);

      try {
        const fileUrl = await uploadFileToCloudinary(selectedFile); // Call the utility function
        setFileURL(fileUrl); // Set the file URL for preview
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setIsUploading(false);
      }

      // Reset the file input value
      e.target.value = "";
    }
  };

  const handleDivClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.click(); // Trigger the file input when the div is clicked
    }
  };

  const handleRemoveFile = () => {
    setFileURL(null); // Reset the file URL state
  };

  // Function to handle adding a tag
  const handleAddTag = () => {
    if (tagInput.trim() !== "") {
      setTags([...tags, tagInput.trim()]); // Add the new tag to the list
      setTagInput(""); // Clear the input field
    }
  };

  // Function to handle deleting a tag
  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter((tag) => tag !== tagToDelete)); // Remove the tag from the list
  };

  const menuItems = [
    { value: "New", label: "New" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
  ];
  const validateForm = () => {
    const newErrors = {
        taskType: taskType.trim() === '',
      status: taskStatus === '',
      dueDate: dueDate === null
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };
  const isCreateDisabled = () => {
    return Object.values(errors).some(error => error) || 
           taskType.trim() === '' || 
           taskStatus === '' || 
           dueDate === null;
  };
  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(90% - ${drawerBleeding}px)`,
            overflow: "visible",
            borderRadius: "20px",
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
      >
        <div
          style={{
            height: "100%",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "1.1rem",
              }}
            >
              <p style={{ fontSize: "1.5rem" }}>Create Task</p>
              <Close onClick={() => toggleDrawer(false)} />
            </div>
            <div>
              <hr />{" "}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "0.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <CustomTextField
                borderRadius="10px"
                label="Task Title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                width="100%"
              />
              <CustomTextField
                borderRadius="10px"
                multiline={true}
                label="Description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                width="100%"
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.7rem",
                  flexDirection: "column",
                }}
              >
                <p style={{ fontWeight: "500", color: "#56595c" }}>
                  Task Category*
                </p>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Chip
                    sx={{
                      backgroundColor:
                        taskType === "work" ? "#7B1984" : "transparent",
                      color: taskType === "work" ? "white" : "black",
                      borderColor: "#7B1984",
                      padding: "1rem 1.5rem 1rem 1.5rem",
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
                      padding: "1rem 1.3rem 1rem  1.3rem",
                      "&:hover": {
                        backgroundColor:
                          taskType === "personal"
                            ? "#6A1570"
                            : "rgba(0,0,0,0.08)",
                      },
                    }}
                    label="Personal"
                    clickable
                    onClick={() => setTaskType("personal")}
                  />
                </Stack>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.4rem",
                  flexDirection: "column",
                }}
              >
                <p style={{ fontWeight: "500", color: "#56595c" }}>Due on*</p>
                <CustomDatePicker
                  value={dueDate}
                  onChange={handleDateChange}
                  width="75%"
                  borderRadius="10px"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.4rem",
                  flexDirection: "column",
                }}
              >
                <p style={{ fontWeight: "500", color: "#56595c" }}>
                  Task Status*
                </p>
                <CustomSelect
                  value={taskStatus}
                  onChange={handleStatusChange}
                  width="75%"
                  borderRadius="10px"
                  menuItems={menuItems}
                  placeholder="Choose"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.4rem",
                  flexDirection: "column",
                }}
              >
                <p style={{ fontWeight: "500", color: "#56595c" }}>Tags</p>
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
                <Stack direction="row" spacing={1} style={{ flexWrap: "wrap" }}>
                  {tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleDeleteTag(tag)}
                      style={{ margin: "4px" }}
                    />
                  ))}
                </Stack>
              </div>
              <div
                onClick={handleDivClick}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  flexDirection: "column",
                }}
              >
                <p style={{ fontWeight: "500", color: "#56595c" }}>
                  Attachment
                </p>
                <div
                  style={{
                    backgroundColor: "#F1F1F1",
                    padding: "0.5rem 1rem",
                    borderRadius: "10px",
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p style={{ color: "#9E9E9E" }}>
                    Drop your files here or <a href="">Upload</a>{" "}
                  </p>
                </div>
                <input
                  id="file-input"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>

              {/* File Preview Section */}
              {fileURL && (
                <div
                  style={{
                    position: "relative",
                    marginTop: "1rem",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "1rem",
                  }}
                >
                  <img
                    src={fileURL}
                    alt="File Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      borderRadius: "10px",
                    }}
                  />
                  <Close
                    style={{
                      position: "absolute",
                      top: "0.5rem",
                      right: "0.5rem",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      color: "white",
                      borderRadius: "50%",
                      padding: "0.25rem",
                      cursor: "pointer",
                    }}
                    onClick={handleRemoveFile}
                  />
                </div>
              )}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                backgroundColor: "#F1F1F1",
                bottom: "0",
                padding: "2.5rem 1rem 1rem 1rem",
                marginTop: "2rem",
                gap: "0.5rem",
              }}
            >
                <button
                    onClick={() => {
                        resetForm();
                        toggleDrawer(false);
                      }}
                style={{
                  backgroundColor: "transparent",
                  color: "#7B1984",
                  padding: "1rem 2.7rem 1rem  2.7rem",
                  border: "1px solid #7B1984",
                  borderRadius: "25px",
                  cursor: "pointer",
                  marginLeft: "1rem",
                }}
              >
                Cancel
              </button>
              <button
              disabled={isCreateDisabled()}
               onClick={handleCreateTask} 
               style={{
                backgroundColor: isCreateDisabled() ? "#C0C0C0" : "#7B1984",
                color: "white",
                padding: "1rem 2.7rem 1rem 2.7rem",
                border: "none",
                borderRadius: "25px",
                cursor: isCreateDisabled() ? "not-allowed" : "pointer",
                opacity: isCreateDisabled() ? 0.5 : 1,
              }}
              >
                Create
              </button>
              
            </div>
          </div>
        </div>
      </SwipeableDrawer>
    </Root>
  );
};

export default CreateTask;