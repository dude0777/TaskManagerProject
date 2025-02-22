import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

type MenuItemType = {
  value: string | number;
  label: string;
};

type CustomSelectProps = {
  value: string | number;
  onChange: (event: SelectChangeEvent<string | number>) => void;
  width?: string;
  borderRadius?: string;
  menuItems: MenuItemType[];
  placeholder?: string;
  placeholderColor?: string;
};

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  width = '100%',
  borderRadius = '4px',
  menuItems,
  placeholder = 'Select an option',
  placeholderColor = 'text.secondary',
}) => {
  const selectedItemLabel = menuItems.find((item) => item.value === value)?.label;

  return (
    <FormControl
      sx={{
        margin: '0 !important', // Ensure no margin
        minWidth: 120,
        width,
      }}
    >
      <Select
        size="small"
        value={value}
        onChange={onChange}
        displayEmpty
        sx={{
          borderRadius,
          '& .MuiSelect-placeholder': {
            color: placeholderColor,
          },
        }}
        renderValue={(selected) => {
          if (!selected) {
            return <p>{placeholder}</p>;
          }
          return selectedItemLabel || selected;
        }}
      >
        {menuItems.map((item, index) => (
          <MenuItem key={index} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;
