import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, CssBaseline, Badge, InputBase, Grid, Paper, Fab } from '@mui/material';
import { Business, Dashboard, PostAdd, People, Settings, Logout, Notifications, Search, CloudUpload } from '@mui/icons-material';

const drawerWidth = 260;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard /> },
  { text: 'Post Job', icon: <PostAdd /> },
  { text: 'Applicants', icon: <People /> },
  { text: 'Company Profile', icon: <Business /> },
  { text: 'Settings', icon: <Settings /> },
  { text: 'Logout', icon: <Logout />, color: 'error.main' },
];

export default function CompanyDashboard() {
  const [drawerOpen] = React.useState(true);
  const activeMenu = 'Dashboard'; // For demo, set Dashboard as active

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f3f6fb' }}>
      <CssBaseline />
      {/* Header */}
      <AppBar position="fixed" elevation={1} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: 'linear-gradient(90deg, #0077b5 60%, #005983 100%)', color: '#fff', boxShadow: 2 }}>
        <Toolbar sx={{ minHeight: 64 }}>
          <Business sx={{ fontSize: 32, mr: 2, color: '#fff' }} />
          <Typography variant="h5" fontWeight={900} sx={{ flexGrow: 0, letterSpacing: 1.5, color: '#fff', fontFamily: 'Montserrat, sans-serif', mr: 4 }}>
            EmpMatch
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', maxWidth: 400, mx: 2, background: '#f3f6fb', borderRadius: 2, px: 2, py: 0.5 }}>
            <Search sx={{ color: '#0077b5', mr: 1 }} />
            <InputBase placeholder="Search jobs, applicants..." sx={{ flex: 1, color: '#222' }} />
          </Box>
          <IconButton color="inherit" sx={{ ml: 2 }}>
            <Badge badgeContent={2} color="error">
              <Notifications sx={{ color: '#fff' }} />
            </Badge>
          </IconButton>
          <IconButton color="inherit" sx={{ ml: 2 }}>
            <Avatar sx={{ bgcolor: '#fff', color: '#0077b5', fontWeight: 700 }}>C</Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>
      {/* Side Menu */}
      <Drawer
        variant="permanent"
        open={drawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: '#fff',
            borderRight: '1.5px solid #e3e8ee',
            pt: 0,
          },
        }}
      >
        <Toolbar sx={{ minHeight: 64 }} />
        {/* Company Card */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3, borderBottom: '1px solid #e3e8ee', mb: 2 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: '#0077b5', fontWeight: 700, fontSize: 32, mb: 1 }}>C</Avatar>
          <Typography fontWeight={700} fontSize={18}>Acme Corp</Typography>
          <Typography color="text.secondary" fontSize={14}>Tech Company</Typography>
        </Box>
        <List sx={{ mt: 1 }}>
          {menuItems.map((item, idx) => (
            <ListItem button key={item.text} sx={{
              borderRadius: 2,
              mb: 0.5,
              color: item.color || (activeMenu === item.text ? '#0077b5' : '#222'),
              background: activeMenu === item.text ? '#e6f0fa' : 'transparent',
              fontWeight: activeMenu === item.text ? 700 : 500,
              '&:hover': { background: '#f3f6fb' }
            }}>
              <ListItemIcon sx={{ color: item.color || (activeMenu === item.text ? '#0077b5' : '#222') }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: activeMenu === item.text ? 700 : 500 }} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 4, mt: 8, background: '#f3f6fb', minHeight: '100vh' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3, boxShadow: '0 2px 12px #0077b522' }}>
              <Typography variant="h6" fontWeight={700} mb={2} color="#0077b5">
                Company Stats
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" color="text.secondary">Total Jobs Posted: 8</Typography>
              <Typography variant="body1" color="text.secondary">Active Applicants: 24</Typography>
              <Typography variant="body1" color="text.secondary">Interviews Scheduled: 5</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3, boxShadow: '0 2px 12px #0077b522' }}>
              <Typography variant="h6" fontWeight={700} mb={2} color="#0077b5">
                Recent Job Postings
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" color="text.secondary">- Frontend Developer</Typography>
              <Typography variant="body1" color="text.secondary">- Backend Engineer</Typography>
              <Typography variant="body1" color="text.secondary">- Product Manager</Typography>
            </Paper>
          </Grid>
        </Grid>
        {/* Floating Action Button */}
        <Fab color="primary" variant="extended" sx={{ position: 'fixed', bottom: 32, right: 32, boxShadow: 4, background: '#0077b5', color: '#fff', fontWeight: 700 }}>
          <CloudUpload sx={{ mr: 1 }} /> Post a Job
        </Fab>
      </Box>
    </Box>
  );
} 