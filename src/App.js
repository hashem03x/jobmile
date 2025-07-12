import React, { useState, useEffect } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginSignup from "./components/pages/LoginSignup";
import PrivateRoute from "./components/routes/PrivateRoute";
import PublicRoute from "./components/routes/PublicRoute";
import CandidateDashboard from "./components/pages/candidate/CandidateDashboard";
import CompanyDashboard from "./components/pages/company/CompanyDashboard";
import { useAuth } from "./components/context/AuthContext";
import Profile from "./components/pages/candidate/Profile";
import Jobs from "./components/ui/Jobs";
import JobApplyPage from "./components/pages/candidate/JobApplyPage";
import Applications from "./components/pages/candidate/Applications";
import CompanyStats from "./components/pages/company/CompanyStats";
import CompanyProfile from "./components/pages/company/CompanyProfile";
import CompanyLayout from "./components/ui/CompanyLayout";

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
            Jobmile
          </Typography>
          <LinearProgress
            sx={{
              width: 200,
              margin:"auto",
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
                  user?.user_type === "company"
                    ? "/company/home"
                    : "/candidate/home"
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
        {/* Candidate routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/candidate">
            <Route path="home" element={<CandidateDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="applications" element={<Applications />} />
            <Route path="job/:id/apply" element={<JobApplyPage />} />
          </Route>
          {/* Company routes */}
          <Route path="/company">
            <Route path="home" element={
              <CompanyLayout>
                <CompanyDashboard />
              </CompanyLayout>
            } />
            <Route path="profile" element={
              <CompanyLayout>
                <CompanyProfile />
              </CompanyLayout>
            } />
            <Route path="stats" element={
              <CompanyLayout>
                <CompanyStats />
              </CompanyLayout>
            } />
          </Route>
        </Route>
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
