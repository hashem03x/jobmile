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
    user === "candidate"
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
          "& .MuiDrawer-paper": { width: 240 },
        }}
      >
        <Box
          sx={{ width: 240 }}
          role="presentation"
          onClick={handleDrawerToggle}
          onKeyDown={handleDrawerToggle}
        >
          <List>
            {menuLinks.map((item) => (
              <ListItem
                button
                key={item.label}
                component={NavLink}
                to={item.to}
                onClick={item.click}
                sx={{
                  "&.active": {
                    backgroundColor: "#f4f2ee",
                    color: "#1976d2",
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
    </Box>
  );
}
