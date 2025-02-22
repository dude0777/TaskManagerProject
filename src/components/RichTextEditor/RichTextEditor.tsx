import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill's styles
import { Typography } from '@mui/material';

interface RichTextEditorProps {
  value?: string; // HTML content
  onChange?: (value: string) => void; // Callback to update parent state
  label?: string;
}

const RichTextEditor = ({ value = '', onChange, label }: RichTextEditorProps) => {
  const [editorValue, setEditorValue] = useState(value); // Internal state for ReactQuill
  const maxCharacters = 300;

  // Sync the value prop with the internal state
  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  const handleChange = (content: string) => {
    setEditorValue(content); // Update internal state
    if (onChange) {
      onChange(content); // Pass the updated HTML content to the parent
    }
  };

  // Custom toolbar with your icons
  const modules = {
    toolbar: [
      ['bold', 'italic'], // Bold and italic buttons
      [{ list: 'bullet' }, { list: 'ordered' }], // Bullet points and numbered lists
    ],
  };

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <Typography variant="body2" style={{ marginBottom: '8px', fontWeight: 500, color: '#56595c' }}>
          {label}
        </Typography>
      )}
      <ReactQuill
        value={editorValue} // Use internal state
        onChange={handleChange} // Call onChange when the content changes
        modules={modules}
        style={{
          border: '1px solid #ccc',
          borderRadius: '10px',
          backgroundColor: '#fff',
        }}
      />
      <Typography variant="caption" color="textSecondary" style={{ marginTop: '8px' }}>
        {editorValue.length}/{maxCharacters} characters
      </Typography>
    </div>
  );
};

export default RichTextEditor;