import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Skeleton,
  Alert,
  Stack,
  CardContent,
  CardActions,
  Divider,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
} from "@mui/material";
import {
  Work,
  Business,
  Schedule,
  TrendingUp,
  Visibility,
  ArrowBack,
  CheckCircle,
  Pending,
  Cancel,
  Error,
  FilterList,
  Clear,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { BASE_API } from "../../../utils/api";
import { useNavigate } from "react-router-dom";

function Applications() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter states
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Initialize filtered applications with all applications
  useEffect(() => {
    if (applications.length > 0 && filteredApplications.length === 0) {
      setFilteredApplications(applications);
    }
  }, [applications]);

  useEffect(() => {
    fetchApplications();
  }, [token]);

  // Apply filters whenever applications or filter values change
  useEffect(() => {
    applyFilters();
  }, [applications, statusFilter, dateFilter]);

  const applyFilters = () => {
    let filtered = [...applications];

    // Filter by status
    if (statusFilter && statusFilter.trim() !== "") {
      filtered = filtered.filter(
        (app) => app.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Filter by date
    if (dateFilter && dateFilter.trim() !== "") {
      const filterDate = new Date(dateFilter);
      filterDate.setHours(0, 0, 0, 0);

      filtered = filtered.filter((app) => {
        const appDate = new Date(app.applied_at);
        appDate.setHours(0, 0, 0, 0);
        return appDate.getTime() === filterDate.getTime();
      });
    }

    console.log("Filtering:", {
      total: applications.length,
      statusFilter,
      dateFilter,
      filtered: filtered.length,
    });

    setFilteredApplications(filtered);
  };

  const clearFilters = () => {
    setStatusFilter("");
    setDateFilter("");
  };

  const getUniqueStatuses = () => {
    const statuses = applications.map((app) => app.status).filter(Boolean);
    return [...new Set(statuses)];
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${BASE_API}applications/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }

      const data = await response.json();
      console.log("Fetched applications:", data);
      setApplications(data);
    } catch (err) {
      setError(err.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
      case "approved":
        return "success";
      case "pending":
      case "under_review":
      case "reviewing":
        return "warning";
      case "rejected":
      case "declined":
        return "error";
      case "withdrawn":
        return "default";
      default:
        return "info";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
      case "approved":
        return <CheckCircle />;
      case "pending":
      case "under_review":
      case "reviewing":
        return <Pending />;
      case "rejected":
      case "declined":
        return <Cancel />;
      case "withdrawn":
        return <Error />;
      default:
        return <Pending />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMatchScoreColor = (score) => {
    const numScore = score || 0;
    if (numScore >= 80) return "success";
    if (numScore >= 60) return "warning";
    return "error";
  };

  if (loading) {
    return (
      <Box p={{ xs: 2, sm: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 4,
          }}
        >
          <IconButton
            onClick={() => navigate("/candidate/profile")}
            sx={{ color: "#1976d2" }}
          >
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h4"
            fontWeight={700}
            color="#1976d2"
            sx={{ fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
          >
            My Applications
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Stack spacing={2}>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton variant="text" width="40%" height={24} />
                  <Skeleton variant="text" width="80%" height={20} />
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Skeleton variant="rectangular" width={80} height={32} />
                    <Skeleton variant="rectangular" width={80} height={32} />
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={{ xs: 2, sm: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 4,
          }}
        >
          <IconButton
            onClick={() => navigate("/candidate/profile")}
            sx={{ color: "#1976d2" }}
          >
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h4"
            fontWeight={700}
            color="#1976d2"
            sx={{ fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
          >
            My Applications
          </Typography>
        </Box>

        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={fetchApplications}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box p={{ xs: 2, sm: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: { xs: 1, sm: 2 },
          mb: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            width: "100%",
          }}
        >
          <IconButton
            onClick={() => navigate("/candidate/profile")}
            sx={{ color: "#1976d2" }}
          >
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h4"
            fontWeight={700}
            color="#1976d2"
            sx={{
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.125rem" },
              flex: 1,
            }}
          >
            My Applications
          </Typography>
        </Box>
      </Box>

      {applications.length === 0 ? (
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3, md: 4, lg: 6 },
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Work
              sx={{
                fontSize: { xs: 40, sm: 60 },
                color: "#bdbdbd",
                mb: 2,
              }}
            />
            <Typography
              variant="h6"
              color="text.secondary"
              fontWeight={500}
              mb={1}
              sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              No applications yet
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              mb={3}
              sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
            >
              Start applying to jobs to see your applications here.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/candidate/jobs")}
              sx={{
                borderRadius: 2,
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
              }}
            >
              Browse Jobs
            </Button>
          </Box>
        </Paper>
      ) : (
        <>
          {/* Filters Section */}
          <Paper elevation={2} sx={{ mb: 3, borderRadius: 3 }}>
            <Accordion
              expanded={showFilters}
              onChange={() => setShowFilters(!showFilters)}
              sx={{
                "&:before": { display: "none" },
                boxShadow: "none",
              }}
            >
              <AccordionSummary
                expandIcon={<FilterList />}
                sx={{
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1.5, sm: 2 },
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: { xs: 1, sm: 2 },
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <FilterList color="primary" />
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      color="#1976d2"
                      sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                    >
                      Filters
                    </Typography>
                  </Box>
                  {(statusFilter || dateFilter) && (
                    <Chip
                      label="Active"
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ px: { xs: 2, sm: 3 }, pb: 3 }}>
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  {/* Status Filter */}
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={statusFilter}
                        label="Status"
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <MenuItem value="">All Statuses</MenuItem>
                        {getUniqueStatuses().map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Date Filter */}
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      label="Date Applied"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  {/* Clear Filters */}
                  <Grid item xs={12} sm={6} md={2}>
                    <Button
                      variant="outlined"
                      startIcon={<Clear />}
                      onClick={clearFilters}
                      fullWidth
                      sx={{
                        borderRadius: 2,
                        height: { xs: 36, sm: 40 },
                        mt: { xs: 0, sm: 1 },
                      }}
                    >
                      Clear
                    </Button>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Paper>

          {/* Results Summary */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              mb: 3,
              gap: { xs: 1, sm: 2 },
            }}
          >
            <Typography
              variant="h6"
              color="text.secondary"
              fontWeight={500}
              sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              {filteredApplications.length} of {applications.length} application
              {filteredApplications.length !== 1 ? "s" : ""} shown
            </Typography>

            {(statusFilter || dateFilter) && (
              <Chip
                label={`${
                  applications.length - filteredApplications.length
                } filtered out`}
                color="info"
                variant="outlined"
                size="small"
              />
            )}
          </Box>

          <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
            {filteredApplications.map((application) => (
              <Grid item xs={12} sm={6} md={4} key={application.id}>
                <Paper
                  elevation={3}
                  sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: { xs: "none", sm: "translateY(-2px)" },
                      boxShadow: { xs: 3, sm: 6 },
                    },
                  }}
                >
                  <CardContent sx={{ flex: 1, p: 0 }}>
                    <Stack spacing={{ xs: 1.5, sm: 2 }}>
                      {/* Job Title */}
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="#1976d2"
                          sx={{
                            fontSize: {
                              xs: "0.9rem",
                              sm: "1rem",
                              md: "1.1rem",
                            },
                            mb: 0.5,
                            lineHeight: { xs: 1.2, sm: 1.4 },
                          }}
                        >
                          {application.job_title}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Business fontSize="small" color="action" />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                          >
                            {application.company_name}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider />

                      {/* Application Details */}
                      <Stack spacing={{ xs: 1, sm: 1.5 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Schedule fontSize="small" color="action" />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                          >
                            Applied: {formatDate(application.applied_at)}
                          </Typography>
                        </Box>

                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <TrendingUp fontSize="small" color="action" />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                          >
                            Match Score:
                          </Typography>
                          <Chip
                            label={`${application.match_score || 0}%`}
                            color={getMatchScoreColor(application.match_score)}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: { xs: "0.6rem", sm: "0.7rem" },
                              height: { xs: 20, sm: 24 },
                            }}
                          />
                        </Box>
                      </Stack>

                      <Divider />

                      {/* Status */}
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {getStatusIcon(application.status)}
                        <Typography
                          variant="body2"
                          fontWeight={500}
                          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                        >
                          Status:
                        </Typography>
                        <Chip
                          label={application.status}
                          color={getStatusColor(application.status)}
                          size="small"
                          sx={{
                            textTransform: "capitalize",
                            fontSize: { xs: "0.65rem", sm: "0.75rem" },
                            height: { xs: 20, sm: 24 },
                          }}
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* No Results Message */}
          {filteredApplications.length === 0 && applications.length > 0 && (
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                borderRadius: 3,
                textAlign: "center",
                mt: 3,
              }}
            >
              <Box>
                <FilterList
                  sx={{
                    fontSize: { xs: 40, sm: 60 },
                    color: "#bdbdbd",
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h6"
                  color="text.secondary"
                  fontWeight={500}
                  mb={1}
                  sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                >
                  No applications match your filters
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  mb={3}
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                >
                  Try adjusting your filter criteria to see more results.
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={clearFilters}
                  sx={{
                    borderRadius: 2,
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  }}
                >
                  Clear All Filters
                </Button>
              </Box>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
}

export default Applications;
