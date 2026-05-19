'use client';

import { useState, useCallback, useEffect } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
}

/**
 * Debounced search input — waits for the user to stop typing before
 * calling onChange, preventing an API call on every keystroke.
 *
 * Local state `inputValue` drives the visible text immediately.
 * The debounced effect fires `onChange` after `debounceMs` of silence.
 */
const SearchBar = ({
  placeholder = 'Search...',
  value,
  onChange,
  debounceMs = 400,
}: SearchBarProps) => {
  const [inputValue, setInputValue] = useState(value);

  // Keep local state in sync if parent resets the value (e.g. on category change)
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Debounce: propagate to parent only after user pauses typing
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(inputValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [inputValue, debounceMs, onChange]);

  const handleClear = useCallback(() => {
    setInputValue('');
    onChange('');
  }, [onChange]);

  return (
    <TextField
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder={placeholder}
      size='small'
      fullWidth
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon fontSize='small' color='action' />
            </InputAdornment>
          ),
          endAdornment: inputValue ? (
            <InputAdornment position='end'>
              <IconButton size='small' onClick={handleClear} edge='end'>
                <ClearIcon fontSize='small' />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: 2,
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        },
      }}
    />
  );
};

export default SearchBar;
