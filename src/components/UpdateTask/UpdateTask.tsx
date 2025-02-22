import * as React from "react";
import { useState, useEffect } from "react";
import { Global } from "@emotion/react";
import { SelectChangeEvent, Tab, Tabs } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { Close } from "@mui/icons-material";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Dialog from "@mui/material/Dialog";
import { Chip, Stack, TextField } from "@mui/material";
import CustomTextField from "../CustomTextField/CustomTextField";
import CustomDatePicker from "../CustomDatePicker";
import CustomSelect from "../CustomSelect/CustomSelect";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { uploadFileToCloudinary } from "../../utils/uploadFileToCloudinary";
import { useUpdateTask } from "../../hooks/useUpdateTask";
import { useWindowSize } from "../../hooks/useWindowSize";
import styles from "./UpdateTask.module.css";
import { Task } from "../../hooks/types";
import { useTaskManagement } from "../../hooks/useTaskManagement ";
import RichTextEditor from "../RichTextEditor/RichTextEditor";
import Loader from "../Loader/Loader";
const drawerBleeding = 56;

interface Activity {
  name: string;
  time: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div className={styles.tabContent}>{children}</div>}
    </div>
  );
}

const UpdateTask: React.FC = () => {
  const { editingTask, setEditingTask, enableEditing, setEnableEditing } = useTaskManagement();
  const [activeTab, setActiveTab] = useState(0);
  const [taskType, setTaskType] = useState<"work" | "personal">("work");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  const [taskStatus, setTaskStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({
    title: false,
    status: false,
    dueDate: false,
  });

  const isMobile = useWindowSize().isMobile;
  const updateTaskMutation = useUpdateTask();

  useEffect(() => {
    if (editingTask) {
      setTaskType(editingTask.type as "work" | "personal");
      setTaskTitle(editingTask.title);
      setTaskDescription(editingTask.description || "");
      setDueDate(editingTask.dueDate ? dayjs(editingTask.dueDate) : null);
      setTaskStatus(editingTask.status);
      setFileURL(editingTask.fileURL);
      setTags(editingTask.tags || []);
      setActivities(editingTask.activities || []);
    }
  }, [editingTask]);

  const handleClose = () => {
    setEditingTask(null);
    resetForm();
    setEnableEditing(false);
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
    setActiveTab(0);
    setActivities([]);
    setErrors({
      title: false,
      status: false,
      dueDate: false,
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const addActivity = (activityDescription: string) => {
    const newActivity: Activity = {
      name: activityDescription,
      time: new Date().toISOString(),
    };
    setActivities((prev) => [newActivity, ...prev]);
    return newActivity;
  };

  const handleDateChange = (date: Dayjs | null) => {
    if (editingTask && date?.toISOString() !== dueDate?.toISOString()) {
      const activity = addActivity(
        `You changed due date from ${dueDate?.format("YYYY-MM-DD") || "none"} to ${
          date?.format("YYYY-MM-DD") || "none"
        }`
      );
      setDueDate(date);
      handlePartialUpdate({
        dueDate: date?.toISOString() || null,
        activities: [...activities, activity],
      });
    }
  };

  const handleStatusChange = (event: SelectChangeEvent<string | number>) => {
    const newStatus = event.target.value.toString();
    if (editingTask && newStatus !== taskStatus) {
      const activity = addActivity(`You changed status from ${taskStatus} to ${newStatus}`);
      setTaskStatus(newStatus);
      handlePartialUpdate({
        status: newStatus,
        activities: [...activities, activity],
      });
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTaskTitle(newTitle);
    setErrors({ ...errors, title: newTitle.trim() === "" });

    if (editingTask && newTitle !== editingTask.title) {
      const activity = addActivity(`You updated the task title`);
      handlePartialUpdate({
        title: newTitle,
        activities: [...activities, activity],
      });
    }
  };

  const handleDescriptionChange = (newDescription: string) => {
    setTaskDescription(newDescription); // Update the state with the new HTML content
  
    if (editingTask && newDescription !== editingTask.description) {
      const activity = addActivity(`You updated the task description`);
      handlePartialUpdate({
        description: newDescription,
        activities: [...activities, activity],
      });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && editingTask) {
      setIsUploading(true);
      try {
        const fileUrl = await uploadFileToCloudinary(selectedFile);
        const activity = addActivity("You uploaded a new file");
        setFileURL(fileUrl);
        handlePartialUpdate({
          fileURL: fileUrl,
          activities: [...activities, activity],
        });
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setIsUploading(false);
      }
      e.target.value = "";
    }
  };

  const handleDivClick = () => {
    const fileInput = document.getElementById("update-file-input");
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleRemoveFile = () => {
    if (editingTask && fileURL) {
      const activity = addActivity("You removed the attached file");
      setFileURL(null);
      handlePartialUpdate({
        fileURL: null,
        activities: [...activities, activity],
      });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== "" && !tags.includes(tagInput.trim()) && editingTask) {
      const newTag = tagInput.trim();
      const activity = addActivity(`You added tag: ${newTag}`);
      const newTags = [...tags, newTag];
      setTags(newTags);
      setTagInput("");
      handlePartialUpdate({
        tags: newTags,
        activities: [...activities, activity],
      });
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    if (editingTask) {
      const activity = addActivity(`You removed tag: ${tagToDelete}`);
      const newTags = tags.filter((tag) => tag !== tagToDelete);
      setTags(newTags);
      handlePartialUpdate({
        tags: newTags,
        activities: [...activities, activity],
      });
    }
  };

  const handleTypeChange = (newType: "work" | "personal") => {
    if (editingTask && newType !== taskType) {
      const activity = addActivity(`You changed task type from ${taskType} to ${newType}`);
      setTaskType(newType);
      handlePartialUpdate({
        type: newType,
        activities: [...activities, activity],
      });
    }
  };

  const handlePartialUpdate = async (updatedFields: Partial<Task>) => {
    if (editingTask) {
      try {
        await updateTaskMutation.mutateAsync({
          id: editingTask.id,
          updatedTask: updatedFields,
        });
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  const isUpdateDisabled = () => {
    return taskTitle.trim() === "" || taskStatus === "" || dueDate === null;
  };

  const menuItems = [
    { value: "New", label: "New" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
  ];

  const renderDetailsTab = () => (
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
  onChange={handleDescriptionChange}
/>

      <div className={isMobile ? styles.inputGroup : styles.desktopInputRow}>
        <div className={styles.chipContainer}>
          <p className={styles.label}>Task Category*</p>
          <Stack direction="row" spacing={2}>
            <Chip
              sx={{
                backgroundColor: taskType === "work" ? "#7B1984" : "transparent",
                color: taskType === "work" ? "white" : "black",
                borderColor: "#7B1984",
                padding: "1rem 1.5rem",
                "&:hover": {
                  backgroundColor: taskType === "work" ? "#6A1570" : "rgba(0,0,0,0.08)",
                },
              }}
              label="Work"
              clickable
              variant={taskType === "work" ? "filled" : "outlined"}
              onClick={() => handleTypeChange("work")}
            />
            <Chip
              sx={{
                backgroundColor: taskType === "personal" ? "#7B1984" : "transparent",
                color: taskType === "personal" ? "white" : "black",
                borderColor: "#7B1984",
                padding: "1rem 1.7rem",
                "&:hover": {
                  backgroundColor: taskType === "personal" ? "#6A1570" : "rgba(0,0,0,0.08)",
                },
              }}
              label="Personal"
              clickable
              variant={taskType === "personal" ? "filled" : "outlined"}
              onClick={() => handleTypeChange("personal")}
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
            <Chip key={index} label={tag} onDelete={() => handleDeleteTag(tag)} />
          ))}
        </div>
      </div>

      <div className={styles.attachmentSection}>
        <p className={styles.label}>Attachment</p>
        <div className={styles.dropZone} onClick={handleDivClick}>
          <p className={styles.dropZoneText}>
            Drop your files here or <span className={styles.uploadLink}>Upload</span>
          </p>
        </div>
        <input
          id="update-file-input"
          type="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {fileURL && (
          <div className={styles.filePreview}>
            <img src={fileURL} alt="File Preview" className={styles.previewImage} />
            <Close className={styles.removeFileButton} onClick={handleRemoveFile} />
          </div>
        )}
      </div>
    </div>
  );

  const renderActivitiesTab = () => (
    <div className={styles.activitiesSection}>
     
      {activities.map((activity, index) => (
        <div key={index} className={styles.activityItem}>
          <p className={styles.activityName}>{activity.name}</p>
          <p className={styles.activityTime}>
            {dayjs(activity.time).format("MMM D, YYYY h:mm A")}
          </p>
        </div>
      ))}
      {activities.length === 0 && <p className={styles.noActivities}>No activities yet</p>}
    </div>
  );

  
  const renderDesktopLayout = () => (
    <div className={styles.desktopContainer}>
      <div className={styles.header}>
        <p className={styles.headerTitle}>Update Task</p>
        <Close onClick={handleClose} className={styles.closeIcon} />
      </div>
      
      <div className={styles.twoColumnLayout}>
        <div className={styles.leftColumn}>
          {renderDetailsTab()}
        </div>
        <div className={styles.rightColumn}>
          {renderActivitiesTab()}
        </div>
      </div>

      <div className={styles.actionButtons}>
        <button onClick={handleClose} className={styles.cancelButton}>
          Cancel
        </button>
        <button
          disabled={isUpdateDisabled()}
          onClick={() => handleClose()}
          className={`${styles.updateButton} ${
            isUpdateDisabled() ? styles.updateButtonDisabled : ""
          }`}
        >
          Update
        </button>
      </div>
    </div>
  );

  // Mobile layout - with tabs
  const renderMobileLayout = () => (
    <div className={styles.contentContainer}>
      <div className={styles.header}>
        <p className={styles.headerTitle}>Update Task</p>
        <Close onClick={handleClose} className={styles.closeIcon} />
      </div>

      <Tabs 
  value={activeTab} 
  onChange={handleTabChange} 
  className={styles.tabs}
  sx={{

    justifyContent:'space-between',
    minHeight: '52px',
    padding: '0.5rem',
    '& .MuiTabs-indicator': {
      display: 'none',
    },
    '& .MuiTabs-flexContainer': {
      gap: '0.5rem',
    }
  }}
>
  <Tab 
    label="DETAILS" 
    className={styles.tab}
    sx={{
      borderRadius: '30px',
      minHeight: '40px',
      padding: '0.6rem 4.5rem',
      textTransform: 'uppercase',
      fontWeight: 500,
      border: '1px solid #787878',
      fontSize: '0.9rem',
      backgroundColor: activeTab === 0 ? '#231F20' : 'transparent',
      color: activeTab === 0 ? 'white' : '#787878',
      '&.Mui-selected': {
        color: 'white',
      },
      '&:hover': {
        backgroundColor: activeTab === 0 ? '#231F20' : 'rgba(0, 0, 0, 0.04)',
      }
    }}
  />
  <Tab 
    label="ACTIVITY" 
    className={styles.tab}
    sx={{
      borderRadius: '30px',
      minHeight: '40px',
      padding: '0.6rem 3rem',
      textTransform: 'uppercase',
      fontWeight: 500,
      fontSize: '0.9rem',
      border: '1px solid #787878',
      backgroundColor: activeTab === 1 ? '#231F20' : 'transparent',
      color: activeTab === 1 ? 'white' : '#787878',
      '&.Mui-selected': {
        color: 'white',
      },
      '&:hover': {
        backgroundColor: activeTab === 1 ? '#231F20' : 'rgba(0, 0, 0, 0.04)',
      }
    }}
  />
</Tabs>

      <TabPanel value={activeTab} index={0}>
        {renderDetailsTab()}
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        {renderActivitiesTab()}
      </TabPanel>

      <div className={styles.actionButtons}>
        <button onClick={handleClose} className={styles.cancelButton}>
          Cancel
        </button>
        <button
          disabled={isUpdateDisabled()}
          onClick={() => handleClose()}
          className={`${styles.updateButton} ${
            isUpdateDisabled() ? styles.updateButtonDisabled : ""
          }`}
        >
          Update
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.root}>
      <CssBaseline />
      {isUploading && <Loader />}
      {isMobile ? (
        <>
          <Global
            styles={{
              ".MuiDrawer-root > .MuiPaper-root": {
                height: `calc(100%)`,
                borderRadius: "20px 20px 0 0",
              },
            }}
          />
          <SwipeableDrawer
            anchor="bottom"
            open={enableEditing}
            onClose={handleClose}
            onOpen={() => setEnableEditing(true)}
            swipeAreaWidth={drawerBleeding}
            disableSwipeToOpen={false}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {renderMobileLayout()}
          </SwipeableDrawer>
        </>
      ) : (
        <Dialog
          open={enableEditing}
          onClose={handleClose}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            style: {
              borderRadius: '20px'
            }
          }}
        >
          {renderDesktopLayout()}
        </Dialog>
      )}
    </div>
  );
};

export default UpdateTask;