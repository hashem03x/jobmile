import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import BarChartIcon from "@mui/icons-material/BarChart";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { NavLink } from "react-router-dom";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext";

export default function AppMenu() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [profileImageError, setProfileImageError] = useState(false);
  const { logout, user } = useAuth();
  const { userProfile: profile } = useUser();

  const convertGCSUrlToPublicUrl = (gcsUrl) => {
    if (!gcsUrl) return null;
    
    // Convert gs:// URL to public HTTP URL
    if (gcsUrl.startsWith("gs://")) {
      const path = gcsUrl.replace("gs://", "");
      return `https://storage.googleapis.com/${path}`;
    }
    
    // If it's already an HTTP URL, return as is
    if (gcsUrl.startsWith("http://") || gcsUrl.startsWith("https://")) {
      return gcsUrl;
    }
    
    return null;
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };
  const menuLinks =
    user?.user_type === "candidate"
      ? [
          { label: "Home", to: "/candidate/home", icon: <HomeIcon /> },
          { label: "Jobs", to: "/candidate/jobs", icon: <WorkIcon /> },
          { 
            label: "Profile", 
            to: "/candidate/profile", 
            icon: (
              <Avatar
                src={profileImageError ? undefined : convertGCSUrlToPublicUrl(profile?.profile_picture_path)}
                onError={() => setProfileImageError(true)}
                sx={{
                  width: 20,
                  height: 20,
                  fontSize: "0.75rem",
                  border: "1px solid #1976d2",
                }}
              >
                {getInitials(profile?.first_name, profile?.last_name)}
              </Avatar>
            )
          },
          {
            label: "Logout",
            to: "/login",
            icon: <LogoutIcon />,
            click: () => logout(),
          },
        ]
      : [
          { label: "Home", to: "/company/home", icon: <HomeIcon /> },
          { label: "Stats", to: "/company/stats", icon: <BarChartIcon /> },
          { 
            label: "Profile", 
            to: "/company/profile", 
            icon: (
              <Avatar
                src={profileImageError ? undefined : convertGCSUrlToPublicUrl(profile?.profile_picture_path)}
                onError={() => setProfileImageError(true)}
                sx={{
                  width: 20,
                  height: 20,
                  fontSize: "0.75rem",
                  border: "1px solid #1976d2",
                }}
              >
                {getInitials(profile?.first_name, profile?.last_name)}
              </Avatar>
            )
          },
          {
            label: "Logout",
            to: "/login",
            icon: <LogoutIcon />,
            click: () => logout(),
          },
        ];
  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        sx={{ backgroundColor: "white", color: "black" }}
        position="static"
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, display: { xs: "block", md: "none" } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { sm: "block" } }}
          >
            Jobnile
          </Typography>
          
          
          {/* Desktop menu items */}
          <Box sx={{ display: { xs: "none", md: "flex" }, ml: 3, gap: 1 }}>
            {menuLinks.map((item) => (
              <Button
                key={item.label}
                component={NavLink}
                to={item.to}
                onClick={item.click}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "inherit",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: 10,
                  textAlign: "center",
                  px: 2,
                  gap: 0.5,
                  "&.active": {
                    color: "#1976d2",
                    backgroundColor: "#f4f2ee",
                  },
                }}
              >
                {item.icon}
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 260,
            height: "auto", 
            maxHeight: "80vh", 
            bgcolor: "#fff",
            boxShadow: 3,
            borderRadius: 2,
            overflowY: "auto",
            position: "fixed",
            top: "30%",
            transform: "translateY(-50%)",
          },
        }}
      >
        <Box
          sx={{ width: 260 }}
          role="presentation"
          onClick={handleDrawerToggle}
          onKeyDown={handleDrawerToggle}
        >
          {/* Profile Section in Drawer */}
          <Box sx={{ p: 3, textAlign: "center", borderBottom: "1px solid #e0e0e0" }}>
            <Avatar
              src={profileImageError ? undefined : convertGCSUrlToPublicUrl(profile?.profile_picture_path)}
              onError={() => setProfileImageError(true)}
              sx={{
                width: 60,
                height: 60,
                mx: "auto",
                mb: 2,
                border: "3px solid #1976d2",
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
              }}
            >
              {getInitials(profile?.first_name, profile?.last_name)}
            </Avatar>
            <Typography variant="h6" fontWeight={600} color="#1976d2" mb={0.5}>
              {profile ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() : "User"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {profile?.current_title || "Professional"}
            </Typography>
          </Box>
          
          <List sx={{ mt: 1 }}>
            {menuLinks.map((item) => (
              <ListItem
                key={item.label}
                component={NavLink}
                to={item.to}
                onClick={item.onClick}
                sx={{
                  py: 1.5,
                  px: 3,
                  borderRadius: 2,
                  color: "black",
                  transition: "background-color 0.2s",
                  "&:hover": {
                    backgroundColor: "#f9f9f9",
                  },
                  "&.active": {
                    backgroundColor: "#f4f2ee",
                    color: "primary.main",
                    fontWeight: "bold",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "black"}}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.95rem",
                    fontWeight: 500,
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
