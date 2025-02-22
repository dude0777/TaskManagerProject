import { useState } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";
import { SelectChangeEvent } from "@mui/material/Select";
import CustomSelect from "../CustomSelect/CustomSelect";
import CustomDatePicker from "../CustomDatePicker";
import { Dayjs } from "dayjs";
import SearchIcons from "@mui/icons-material/Search";
import CustomTextField from "../CustomTextField/CustomTextField";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Button } from "@mui/material";
import styles from "./FilterSection.module.css"; // Import the CSS module
import AddTask from "../AddTask/AddTask";
const FilterSection = () => {
  const [age, setAge] = useState<string | number>("");
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const { isMobile } = useWindowSize();
  const [open, setOpen] = useState<boolean>(false);
  const toggleDrawer = (newOpen: boolean) => {
    setOpen(newOpen);
  }

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchValue(event.target.value);
  };

  const handleDateChange = (date: Dayjs | null) => {
    setDueDate(date);
  };

  const handleChange = (event: SelectChangeEvent<string | number>) => {
    setAge(event.target.value);
  };

  const menuItems = [
    { value: 10, label: "Ten" },
    { value: 20, label: "Twenty" },
    { value: 30, label: "Thirty" },
    { value: 40, label: "Forty" },
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
            minWidth:'9rem',
            padding: "0.8rem 2.1rem 0.8rem 2.1rem",
          }}
        >
          ADD TASK
        </Button>
      </div>
      <div className={styles.filterContainer}>
        <p className={styles.filterLabel}>Filter by:</p>
        <div className={styles.filtersRow}>
          <CustomSelect
            value={age}
            onChange={handleChange}
            width="120px"
            borderRadius="25px"
            menuItems={menuItems}
            placeholder="categories"
          />
          <CustomDatePicker
            value={dueDate}
            label="Due Date"
            width="153px"
            borderRadius="25px"
            onChange={handleDateChange}
            endAdornmentIcon={<KeyboardArrowDownIcon />}
          />
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
      <AddTask open={open} toggleDrawer={toggleDrawer} />
    </div>
  );
};

export default FilterSection;
