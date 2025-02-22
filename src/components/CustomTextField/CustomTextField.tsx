import  { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

type CustomTextFieldProps = {
  type?: "text" | "date" | "multiline";
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  maxLength?: number;
  startAdornmentIcon?: React.ReactNode;
  endAdornmentIcon?: React.ReactNode;
  multiline?: boolean;
  rows?: number;
  width?: string;
  borderRadius?: string;
};

const CustomTextField = ({
  type = "text",
  value,
  onChange,
  label,
  maxLength,
  startAdornmentIcon,
  endAdornmentIcon,
  multiline = false,
  rows = 4,
  width = "100%",
  borderRadius = "24px",
}: CustomTextFieldProps) => {
  const [error, setError] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (multiline && maxLength && event.target.value.length > maxLength) {
      setError(true);
    } else {
      setError(false);
    }
    onChange(event);
  };

  return (
    <TextField
      fullWidth
      size="small"
      type={type}
      label={label}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      value={value}
      onChange={handleChange}
      error={error}
      helperText={error ? `Maximum ${maxLength} characters exceeded` : ""}
      sx={{
        width,
        '& .MuiOutlinedInput-root': {
          borderRadius: borderRadius,
          '& fieldset': {
            borderRadius: borderRadius,
          },
        },
      }}
      slotProps={{
        input: {
            
            startAdornment: startAdornmentIcon && (
                <InputAdornment position="start">
                  {startAdornmentIcon}
                </InputAdornment>
              ),
              endAdornment: endAdornmentIcon && (
                <InputAdornment position="end">
                  {endAdornmentIcon}
                </InputAdornment>
              ),
              
        },
      }}
    />
  );
};

export default CustomTextField;