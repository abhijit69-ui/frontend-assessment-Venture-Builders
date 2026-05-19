'use client';

import { useState, useCallback } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

// ── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({ username: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ── Validation ─────────────────────────────────────────────────────────────

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!form.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleChange = useCallback(
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear field error on change
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      setApiError(null);
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      setLoading(true);
      setApiError(null);

      try {
        const result = await signIn('credentials', {
          username: form.username.trim(),
          password: form.password,
          redirect: false,
        });

        if (result?.error) {
          setApiError('Invalid username or password. Please try again.');
        } else {
          router.push('/dashboard');
          router.refresh();
        }
      } catch {
        setApiError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [form, validate, router],
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
        p: 2,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        {/* ── Card Header ───────────────────────────────────────────────── */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            px: 4,
            py: 3.5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box
            sx={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: '50%',
              p: 1.5,
              display: 'flex',
            }}
          >
            <AdminPanelSettingsIcon sx={{ fontSize: 36, color: 'white' }} />
          </Box>
          <Typography variant='h5' sx={{ color: 'white', fontWeight: 700 }}>
            AdminPanel
          </Typography>
          <Typography variant='body2' sx={{ color: 'rgba(255,255,255,0.75)' }}>
            Sign in to your account
          </Typography>
        </Box>

        {/* ── Card Body ─────────────────────────────────────────────────── */}
        <CardContent sx={{ px: 4, py: 3.5 }}>
          {/* Demo credentials hint */}
          <Alert
            severity='info'
            sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.8rem' }}
          >
            Demo — username: <strong>emilys</strong> &nbsp;|&nbsp; password:{' '}
            <strong>emilyspass</strong>
          </Alert>

          {/* API error */}
          {apiError && (
            <Alert severity='error' sx={{ mb: 2.5, borderRadius: 2 }}>
              {apiError}
            </Alert>
          )}

          <Box
            component='form'
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
          >
            {/* Username */}
            <TextField
              label='Username'
              value={form.username}
              onChange={handleChange('username')}
              error={!!errors.username}
              helperText={errors.username}
              autoComplete='username'
              autoFocus
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <PersonOutlineOutlinedIcon
                        fontSize='small'
                        color='action'
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* Password */}
            <TextField
              label='Password'
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              autoComplete='current-password'
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LockOutlinedIcon fontSize='small' color='action' />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        edge='end'
                        size='small'
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                      >
                        {showPassword ? (
                          <VisibilityOff fontSize='small' />
                        ) : (
                          <Visibility fontSize='small' />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* Submit */}
            <Button
              type='submit'
              variant='contained'
              size='large'
              fullWidth
              disabled={loading}
              sx={{
                mt: 0.5,
                py: 1.4,
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: 'white' }} />
              ) : (
                'Sign In'
              )}
            </Button>
          </Box>

          <Divider sx={{ my: 2.5 }} />

          <Typography
            variant='caption'
            sx={{
              display: 'block',
              textAlign: 'center',
              color: 'text.disabled',
            }}
          >
            Powered by DummyJSON · Next.js 15 · MUI v9 · Zustand
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
