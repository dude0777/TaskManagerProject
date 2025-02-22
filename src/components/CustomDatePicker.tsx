import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';

interface CustomDatePickerProps {
  label?: string;
  onChange?: (date: Dayjs | null) => void;
  value?: Dayjs | null;
  width?: string;
  borderRadius?: string;
  endAdornmentIcon?: React.ReactNode;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label = 'Select Date',
  onChange,
  value,
  width = '100%',
  borderRadius = '4px',
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        onChange={onChange}
        value={value}
        format="DD/MM/YYYY"
        sx={{
          width: width,
          '& .MuiOutlinedInput-root': {
            borderRadius: borderRadius,
            padding: '0rem 0.9rem 0rem 0rem',
          
            fontSize: '0.855rem', 
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.875rem',
          },
          '& .MuiSvgIcon-root': {
            width: '1rem', 
            height: '1rem',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            top: '0px', 
            bottom: '6px', 
          },
         '& .css-16k49f7-MuiFormControl-root-MuiTextField-root .MuiOutlinedInput-root': {
            fontSize: '0.6rem', // Custom font size
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;