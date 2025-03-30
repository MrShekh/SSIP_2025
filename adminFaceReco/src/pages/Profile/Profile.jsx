import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Container,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  IconButton,
  Alert,
  CircularProgress,
  Stack,
  Divider
} from '@mui/material';
import {
  LocationOn,
  AccessTime,
  PhotoCamera,
  Save
} from '@mui/icons-material';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    state: user?.state || '',
    city: user?.city || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setSaveStatus({ type: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveStatus({ type: '', message: '' });

    try {
      const updatedUserData = {
        ...user,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        state: formData.state,
        city: formData.city,
      };

      await updateUser(updatedUserData);
      setSaveStatus({
        type: 'success',
        message: 'Profile updated successfully!'
      });
    } catch (error) {
      setSaveStatus({
        type: 'error',
        message: error.message || 'Failed to update profile. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 600 }}>
        Account
      </Typography>

      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Grid container>
          {/* Left Section - Avatar and Info */}
          <Grid item xs={12} md={4} lg={3} 
            sx={{ 
              borderRight: { md: 1 }, 
              borderBottom: { xs: 1, md: 0 }, 
              borderColor: 'divider',
              bgcolor: 'grey.50' 
            }}
          >
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                <Avatar
                  src={user?.avatar || '/default-avatar.jpg'}
                  alt="Profile"
                  sx={{
                    width: 120,
                    height: 120,
                    border: 3,
                    borderColor: 'primary.main',
                    boxShadow: 2
                  }}
                />
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="label"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'grey.100' }
                  }}
                >
                  <input hidden accept="image/*" type="file" />
                  <PhotoCamera />
                </IconButton>
              </Box>

              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                {user?.name || 'User Name'}
              </Typography>

              <Stack spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn fontSize="small" />
                  Los Angeles USA
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 0.5,
                    bgcolor: 'grey.100',
                    borderRadius: 5
                  }}
                >
                  <AccessTime fontSize="small" />
                  GTM-7
                </Typography>
              </Stack>
            </Box>
          </Grid>

          {/* Right Section - Form */}
          <Grid item xs={12} md={8} lg={9}>
            <Box sx={{ p: 4 }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 0.5 }}>
                  Profile
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  The information can be edited
                </Typography>
              </Box>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="First name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Last name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      type="email"
                      label="Email address"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>

                {saveStatus.message && (
                  <Alert 
                    severity={saveStatus.type} 
                    sx={{ mt: 3 }}
                  >
                    {saveStatus.message}
                  </Alert>
                )}

                <Divider sx={{ my: 4 }} />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : <Save />}
                    sx={{ 
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem'
                    }}
                  >
                    {isLoading ? 'Saving...' : 'Save details'}
                  </Button>
                </Box>
              </form>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;
