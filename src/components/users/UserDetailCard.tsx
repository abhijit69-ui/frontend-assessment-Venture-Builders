'use client';

import { memo } from 'react';
import NextLink from 'next/link';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import CakeIcon from '@mui/icons-material/Cake';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import type { User } from '@/types';

// ── Helper: labelled info row ─────────────────────────────────────────────────

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoRow = memo(({ icon, label, value }: InfoRowProps) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
    <Box sx={{ color: 'text.disabled', mt: 0.2, flexShrink: 0 }}>{icon}</Box>
    <Box>
      <Typography
        variant='caption'
        sx={{ color: 'text.secondary', display: 'block' }}
      >
        {label}
      </Typography>
      <Typography variant='body2' sx={{ fontWeight: 500 }}>
        {value || '—'}
      </Typography>
    </Box>
  </Box>
));
InfoRow.displayName = 'InfoRow';

// ── Helper: section heading ───────────────────────────────────────────────────

const SectionTitle = ({ children }: { children: string }) => (
  <Typography
    variant='overline'
    sx={{
      color: 'text.disabled',
      fontWeight: 700,
      letterSpacing: 1,
      mb: 1.5,
      display: 'block',
    }}
  >
    {children}
  </Typography>
);

// ── Main component ────────────────────────────────────────────────────────────

interface UserDetailCardProps {
  user: User;
}

/**
 * Full user profile layout — organised into sections:
 * Profile header · Personal info · Contact · Company · Address
 */
const UserDetailCard = memo(({ user }: UserDetailCardProps) => {
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <Box>
      {/* Back link */}
      <Button
        component={NextLink}
        href='/users'
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3, color: 'text.secondary', fontWeight: 500 }}
      >
        Back to Users
      </Button>

      <Grid container spacing={3}>
        {/* ── Left column: avatar + summary ─────────────────────────────── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                py: 4,
              }}
            >
              <Avatar
                src={user.image}
                alt={fullName}
                sx={{ width: 110, height: 110, fontSize: '2.5rem' }}
              />

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant='h6'>{fullName}</Typography>
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                  @{user.username}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                <Chip
                  label={user.role}
                  size='small'
                  sx={{
                    backgroundColor: '#dbeafe',
                    color: '#1d4ed8',
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label={
                    user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
                  }
                  size='small'
                  sx={{
                    backgroundColor:
                      user.gender === 'male' ? '#dbeafe' : '#fce7f3',
                    color: user.gender === 'male' ? '#1d4ed8' : '#be185d',
                    fontWeight: 600,
                  }}
                />
              </Box>

              <Divider sx={{ width: '100%' }} />

              {/* Quick stats */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 2,
                  width: '100%',
                }}
              >
                {[
                  { label: 'Age', value: String(user.age) },
                  { label: 'Blood Group', value: user.bloodGroup },
                  { label: 'Height', value: `${user.height} cm` },
                  { label: 'Weight', value: `${user.weight} kg` },
                ].map(({ label, value }) => (
                  <Box key={label} sx={{ textAlign: 'center' }}>
                    <Typography variant='h6' sx={{ fontWeight: 700 }}>
                      {value}
                    </Typography>
                    <Typography
                      variant='caption'
                      sx={{ color: 'text.secondary' }}
                    >
                      {label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Right column: details ─────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Personal */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <SectionTitle>Personal Information</SectionTitle>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <InfoRow
                    icon={<CakeIcon fontSize='small' />}
                    label='Date of Birth'
                    value={new Date(user.birthDate).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      },
                    )}
                  />
                  <InfoRow
                    icon={<FingerprintIcon fontSize='small' />}
                    label='Hair'
                    value={`${user.hair.color} · ${user.hair.type}`}
                  />
                  <InfoRow
                    icon={<FingerprintIcon fontSize='small' />}
                    label='Eye Color'
                    value={user.eyeColor}
                  />
                  <InfoRow
                    icon={<SchoolIcon fontSize='small' />}
                    label='University'
                    value={user.university}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <SectionTitle>Contact</SectionTitle>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <InfoRow
                    icon={<EmailIcon fontSize='small' />}
                    label='Email'
                    value={user.email}
                  />
                  <InfoRow
                    icon={<PhoneIcon fontSize='small' />}
                    label='Phone'
                    value={user.phone}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Company */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <SectionTitle>Company</SectionTitle>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <InfoRow
                    icon={<BusinessIcon fontSize='small' />}
                    label='Company'
                    value={user.company.name}
                  />
                  <InfoRow
                    icon={<BusinessIcon fontSize='small' />}
                    label='Department'
                    value={user.company.department}
                  />
                  <InfoRow
                    icon={<BusinessIcon fontSize='small' />}
                    label='Job Title'
                    value={user.company.title}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Address */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <SectionTitle>Address</SectionTitle>
                <InfoRow
                  icon={<LocationOnIcon fontSize='small' />}
                  label='Full Address'
                  value={`${user.address.address}, ${user.address.city}, ${user.address.state}, ${user.address.country} ${user.address.postalCode}`}
                />
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
});

UserDetailCard.displayName = 'UserDetailCard';
export default UserDetailCard;
