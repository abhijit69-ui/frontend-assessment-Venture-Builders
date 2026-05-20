'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
}

/**
 * Debounced search input.
 *
 * Core fix: `isUserTyping` ref gates whether the debounce effect fires onChange.
 * It is only set to true when the USER explicitly types or clears the input.
 *
 * This prevents two silent bugs:
 * 1. On mount: the debounce effect was firing onChange('') which triggered
 *    router.replace('/users'), wiping the ?page=N URL restored from history.
 * 2. On parent-driven value sync (initFromUrl, category change): the value
 *    sync effect was also triggering onChange via the debounce chain,
 *    causing duplicate API calls and URL overwrites.
 *
 * Rule: if the value change originated from the parent → isUserTyping = false
 *       → debounce does NOT fire onChange.
 *       If the value change came from the user → isUserTyping = true
 *       → debounce fires onChange after debounceMs.
 */
const SearchBar = ({
  placeholder = 'Search...',
  value,
  onChange,
  debounceMs = 400,
}: SearchBarProps) => {
  const [inputValue, setInputValue] = useState(value);
  const isUserTyping = useRef(false);

  // ── Sync from parent ─────────────────────────────────────────────────────
  // Triggered when the parent resets or updates the search value
  // (e.g. initFromUrl on mount, category change clearing search).
  // Marks the change as NOT from the user so the debounce below is skipped.
  useEffect(() => {
    isUserTyping.current = false;
    setInputValue(value);
  }, [value]);

  // ── Debounce ─────────────────────────────────────────────────────────────
  // Only fires onChange when the user is actually typing.
  // Parent-driven updates (isUserTyping = false) bail out immediately.
  useEffect(() => {
    if (!isUserTyping.current) return;

    const timer = setTimeout(() => {
      onChange(inputValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [inputValue, debounceMs, onChange]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    isUserTyping.current = true; // user is typing → allow debounce to fire
    setInputValue(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    isUserTyping.current = true; // user action → notify parent immediately
    setInputValue('');
    onChange('');
  }, [onChange]);

  return (
    <TextField
      value={inputValue}
      onChange={handleChange}
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
        '& .MuiOutlinedInput-root': { borderRadius: 2 },
      }}
    />
  );
};

export default SearchBar;
