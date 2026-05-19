'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
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
  // Tracks when the value change came from the parent, not the user
  const isExternalUpdate = useRef(false);

  // Sync from parent (e.g. on category change) — mark as external
  useEffect(() => {
    if (value !== inputValue) {
      isExternalUpdate.current = true;
      setInputValue(value);
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounce — skip propagation if change was external
  useEffect(() => {
    if (isExternalUpdate.current) {
      isExternalUpdate.current = false;
      return; // ← don't call onChange, it's a parent-driven reset
    }
    const timer = setTimeout(() => onChange(inputValue), debounceMs);
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
