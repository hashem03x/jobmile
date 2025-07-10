import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
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
import React from "react";
import Button from "@mui/material/Button";
import { useAuth } from "../context/AuthContext";

export default function AppMenu() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const { logout, user } = useAuth();
  const menuLinks =
    user?.user_type === "candidate"
      ? [
          { label: "Home", to: "/candidate/home", icon: <HomeIcon /> },
          { label: "Jobs", to: "/candidate/jobs", icon: <WorkIcon /> },
          { label: "Profile", to: "/candidate/profile", icon: <PersonIcon /> },
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
          { label: "Profile", to: "/company/profile", icon: <PersonIcon /> },
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
            Jobsy
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
          <Divider />
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
