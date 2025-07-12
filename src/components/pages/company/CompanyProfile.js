import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  Button,
  Skeleton,
  Alert,
  Divider,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  Business,
  Email,
  Language,
  LocationOn,
  Work,
  Edit,
  Save,
  Cancel,
  CalendarToday,
  Verified,
  TrendingUp,
  People,
  Description,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { BASE_API } from "../../../utils/api";

function CompanyProfile() {
  const { token } = useAuth();
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    fetchCompanyProfile();
  }, [token]);

  const fetchCompanyProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${BASE_API}/profile/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch company profile");
      }

      const data = await response.json();
      setCompanyData(data);
      setEditData(data);
    } catch (err) {
      setError(err.message || "Failed to load company profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setEditData({ ...companyData });
    setSaveError("");
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditData({ ...companyData });
    setSaveError("");
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      setSaveError("");

      const response = await fetch(`${BASE_API}/profile/company`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error("Failed to update company profile");
      }

      const updatedData = await response.json();
      setCompanyData(updatedData);
      setEditMode(false);
    } catch (err) {
      setSaveError(err.message || "Failed to update profile");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCompanyInitials = (name) => {
    if (!name) return 'C';
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <Box p={{ xs: 2, sm: 3 }}>
        <Typography 
          variant="h4" 
          fontWeight={700} 
          mb={4} 
          color="#1976d2"
          sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}
        >
          Company Profile
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={12} md={10}>
            <Paper elevation={3} sx={{ 
              p: { xs: 2, sm: 3, md: 4 }, 
              borderRadius: 3 
            }}>
              <Stack spacing={3}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'center', sm: 'flex-start' }, 
                  gap: 2 
                }}>
                  <Skeleton 
                    variant="circular" 
                    width={{ xs: 80, sm: 100 }} 
                    height={{ xs: 80, sm: 100 }} 
                  />
                  <Box sx={{ flex: 1, width: '100%' }}>
                    <Skeleton variant="text" width="60%" height={40} />
                    <Skeleton variant="text" width="40%" height={24} />
                  </Box>
                </Box>
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="text" width="90%" height={20} />
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={2}>
            <Paper elevation={3} sx={{ 
              p: { xs: 2, sm: 3 }, 
              borderRadius: 3 
            }}>
              <Skeleton variant="text" width="50%" height={32} />
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="80%" height={20} />
              <Skeleton variant="text" width="60%" height={20} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={{ xs: 2, sm: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={fetchCompanyProfile}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box p={{ xs: 2, sm: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        gap: { xs: 2, sm: 0 },
        mb: 4 
      }}>
        <Typography 
          variant="h4" 
          fontWeight={700} 
          color="#1976d2"
          sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}
        >
          Company Profile
        </Typography>
        {!editMode ? (
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={handleEdit}
            sx={{ 
              borderRadius: 2,
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Edit Profile
          </Button>
        ) : (
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={handleCancel}
              disabled={saveLoading}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={saveLoading ? <CircularProgress size={20} /> : <Save />}
              onClick={handleSave}
              disabled={saveLoading}
              sx={{ borderRadius: 2 }}
            >
              {saveLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Stack>
        )}
      </Box>

      {saveError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {saveError}
        </Alert>
      )}

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Main Profile Card */}
        <Grid item xs={12} md={10}>
          <Paper elevation={3} sx={{ 
            p: { xs: 2, sm: 3, md: 4 }, 
            borderRadius: 3, 
            height: 'fit-content' 
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'flex-start' }, 
              gap: { xs: 2, sm: 3 }, 
              mb: 4,
              textAlign: { xs: 'center', sm: 'left' }
            }}>
              <Avatar
                sx={{
                  width: { xs: 80, sm: 100 },
                  height: { xs: 80, sm: 100 },
                  bgcolor: '#1976d2',
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                  fontWeight: 'bold',
                  boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
                }}
              >
                {getCompanyInitials(companyData.name)}
              </Avatar>
              <Box sx={{ flex: 1, width: '100%' }}>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Company Name"
                    value={editData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                ) : (
                  <Typography variant="h4" fontWeight={700} color="#1976d2" gutterBottom>
                    {companyData.name}
                  </Typography>
                )}
                
                {editMode ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    value={editData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {companyData.description}
                  </Typography>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Company Details */}
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' }, 
                  gap: { xs: 1, sm: 2 }, 
                  mb: 2 
                }}>
                  <Email color="primary" sx={{ mt: { xs: 0.5, sm: 0 } }} />
                  <Box sx={{ flex: 1, width: '100%' }}>
                    <Typography variant="caption" color="text.secondary">
                      Email Address
                    </Typography>
                    {editMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={editData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    ) : (
                      <Typography variant="body2" fontWeight={500}>
                        {companyData.email}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' }, 
                  gap: { xs: 1, sm: 2 }, 
                  mb: 2 
                }}>
                  <LocationOn color="primary" sx={{ mt: { xs: 0.5, sm: 0 } }} />
                  <Box sx={{ flex: 1, width: '100%' }}>
                    <Typography variant="caption" color="text.secondary">
                      Location
                    </Typography>
                    {editMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={editData.location || ''}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                      />
                    ) : (
                      <Typography variant="body2" fontWeight={500}>
                        {companyData.location}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' }, 
                  gap: { xs: 1, sm: 2 }, 
                  mb: 2 
                }}>
                  <Work color="primary" sx={{ mt: { xs: 0.5, sm: 0 } }} />
                  <Box sx={{ flex: 1, width: '100%' }}>
                    <Typography variant="caption" color="text.secondary">
                      Industry
                    </Typography>
                    {editMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={editData.industry || ''}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                      />
                    ) : (
                      <Typography variant="body2" fontWeight={500}>
                        {companyData.industry}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' }, 
                  gap: { xs: 1, sm: 2 }, 
                  mb: 2 
                }}>
                  <Language color="primary" sx={{ mt: { xs: 0.5, sm: 0 } }} />
                  <Box sx={{ flex: 1, width: '100%' }}>
                    <Typography variant="caption" color="text.secondary">
                      Website
                    </Typography>
                    {editMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={editData.website || ''}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                      />
                    ) : (
                      <Typography variant="body2" fontWeight={500}>
                        <a 
                          href={companyData.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: '#1976d2', textDecoration: 'none' }}
                        >
                          {companyData.website}
                        </a>
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Sidebar Stats */}
        <Grid item xs={12} md={2}>
          <Stack spacing={{ xs: 2, sm: 3 }}>
            {/* Company Stats */}
            <Paper elevation={3} sx={{ 
              p: { xs: 2, sm: 3 }, 
              borderRadius: 3 
            }}>
              <Typography 
                variant="h6" 
                fontWeight={600} 
                mb={3} 
                color="#1976d2"
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                Company Information
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'row', sm: 'row' },
                alignItems: 'center', 
                gap: 2, 
                mb: 2 
              }}>
                <CalendarToday color="primary" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Member Since
                  </Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight={500}
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  >
                    {formatDate(companyData.created_at)}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Quick Actions */}
            <Paper elevation={3} sx={{ 
              p: { xs: 2, sm: 3 }, 
              borderRadius: 3 
            }}>
              <Typography 
                variant="h6" 
                fontWeight={600} 
                mb={3} 
                color="#1976d2"
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                Quick Actions
              </Typography>
              
              <Stack spacing={2}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Description />}
                  sx={{ 
                    borderRadius: 2,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    py: { xs: 1, sm: 1.5 }
                  }}
                >
                  View Job Postings
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<People />}
                  sx={{ 
                    borderRadius: 2,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    py: { xs: 1, sm: 1.5 }
                  }}
                >
                  Manage Applications
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<TrendingUp />}
                  sx={{ 
                    borderRadius: 2,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    py: { xs: 1, sm: 1.5 }
                  }}
                >
                  View Analytics
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CompanyProfile; 