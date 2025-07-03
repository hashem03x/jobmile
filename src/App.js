import React, { useState, useEffect } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginSignup from "./components/pages/LoginSignup";
import PrivateRoute from "./components/routes/PrivateRoute";
import PublicRoute from "./components/routes/PublicRoute";
import CandidateDashboard from "./components/pages/dashboard/CandidateDashboard";
import CompanyDashboard from "./components/pages/dashboard/CompanyDashboard";
import { useAuth } from "./components/context/AuthContext";
import Profile from "./components/pages/Profile";
import Jobs from "./components/ui/Jobs";
import JobApplyPage from "./components/pages/JobApplyPage";

function App() {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1500);
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Box textAlign="center" color="white">
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Employment Matcher
          </Typography>
          <LinearProgress
            sx={{
              width: 200,
              height: 4,
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,0.2)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 2,
                background: "rgba(255,255,255,0.8)",
              },
            }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Default route: redirect based on auth status */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate
                to={
                  user?.type === "company"
                    ? "/dashboard/company"
                    : "/dashboard/candidate"
                }
                replace
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/signup" element={<LoginSignup />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard/candidate" element={<CandidateDashboard />} />
          <Route path="/dashboard/candidate/jobs" element={<CandidateDashboard />} />
          <Route path="/dashboard/company" element={<CompanyDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/job/:id/apply" element={<JobApplyPage />} />
        </Route>
        {/* Catch-all for 404s */}
        <Route
          path="*"
          element={
            <div style={{ padding: 40 }}>
              <h2>404 - Page Not Found</h2>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
