import React, { useState } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";
import { SelectChangeEvent } from "@mui/material/Select";
import CustomSelect from "../CustomSelect/CustomSelect";
import CustomDatePicker from "../CustomDatePicker";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import SearchIcons from "@mui/icons-material/Search";
import CustomTextField from "../CustomTextField/CustomTextField";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Button } from "@mui/material";
import styles from "./FilterSection.module.css";
import AddTask from "../AddTask/AddTask";
import { useTaskManagement } from "../../hooks/useTaskManagement ";
const FilterSection = () => {
  const { isMobile } = useWindowSize();
  const [open, setOpen] = useState<boolean>(false);
  const {
    category,
    setCategory,
    dueDate,
    setDueDate,
    searchValue,
    setSearchValue,
  } = useTaskManagement();

  const toggleDrawer = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchValue(event.target.value);
  };

  const handleDateChange = (date: Dayjs | null) => {
    // Store the date as an ISO string or null
    setDueDate(date ? date.toISOString() : null);
  };

  const handleChange = (event: SelectChangeEvent<string | number>) => {
    setCategory(event.target.value as string);
  };

  // Function to reset all filters
  const resetFilters = () => {
    setCategory("");
    setDueDate(null);
    setSearchValue("");
  };

  // Check if any filter is applied
  const isFilterApplied = category || dueDate || searchValue;

  const menuItems = [
    { value: "", label: "" },
    { value: "New", label: "New" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
  ];

  return (
    <div className={styles.filterSection}>
      <div className={styles.topRow}>
        {!isMobile && (
          <CustomTextField
            value={searchValue}
            onChange={handleSearchChange}
            label="Search"
            borderRadius="25px"
            type="text"
            width="12.75rem"
            startAdornmentIcon={<SearchIcons />}
          />
        )}
        <Button
          onClick={() => toggleDrawer(true)}
          sx={{
            backgroundColor: "#7B1984",
            color: "white",
            borderRadius: "25px",
            minWidth: "9rem",
            padding: "0.8rem 2.1rem",
          }}
        >
          ADD TASK
        </Button>
      </div>
      <div className={styles.filterContainer}>
        <div className={styles.filterLabel}>Filter by:</div>
        <div className={styles.filtersRow}>
          <CustomSelect
            value={category}
            onChange={handleChange}
            width="130px"
            borderRadius="25px"
            menuItems={menuItems}
            placeholder="categories"
          />
          <CustomDatePicker
            value={dueDate ? dayjs(dueDate) : null}
            label="Due Date"
            width="153px"
            borderRadius="25px"
            onChange={handleDateChange}
            endAdornmentIcon={<KeyboardArrowDownIcon />}
          />
          {/* Conditionally render the "Remove Filters" button */}
          {isFilterApplied && (
            <button
              onClick={resetFilters}
              style={{
                backgroundColor: "#FF6B6B",
                color: "white",
                borderRadius: "25px",
          
                padding: "0.6rem 0.8rem",
                marginLeft: "1rem",
              }}
            >
          X
            </button>
          )}
        </div>
      </div>
      <div className={styles.mobileSearchRow}>
        {isMobile && (
          <CustomTextField
            value={searchValue}
            onChange={handleSearchChange}
            label="Search"
            borderRadius="25px"
            type="text"
            width="98%"
            startAdornmentIcon={<SearchIcons />}
          />
        )}
      </div>
   {  open && <AddTask open={open} toggleDrawer={toggleDrawer} />}
    </div>
  );
};

export default FilterSection;