import React, { useState, useEffect } from "react";
import AppContainer from "../../ui/AppContainer";
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
  Typography,
  Paper,
  Chip,
  Box,
  Divider,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Autocomplete,
  Skeleton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../../context/AuthContext";
import { BASE_API } from "../../../utils/api";

const initialJob = {
  title: "",
  description: "",
  requirements: "",
  location: "",
  salary_min: "",
  salary_max: "",
  employment_type: "",
  experience_level: "",
};

function ApplicationsList() {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("score");
  const [skillFilter, setSkillFilter] = useState([]);
  const [statusDialog, setStatusDialog] = useState({
    open: false,
    appId: null,
    currentStatus: "",
    newStatus: "",
  });
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [statusSuccess, setStatusSuccess] = useState("");

  useEffect(() => {
    async function fetchApplications() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${BASE_API}/applications/company`, {
          headers: { authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch applications");
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        setError(err.message || "Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, [token]);

  // Collect all unique matched skills for filter options
  const allMatchedSkills = Array.from(
    new Set(
      applications.flatMap((app) =>
        (app.matched_skills || []).map((ms) => ms.cv_skill)
      )
    )
  );

  // Filtering and sorting
  let filteredApps = [...applications];
  if (skillFilter.length > 0) {
    filteredApps = filteredApps.filter(
      (app) =>
        app.matched_skills &&
        skillFilter.every((skill) =>
          app.matched_skills.some((ms) => ms.cv_skill === skill)
        )
    );
  }
  if (sortBy === "score") {
    filteredApps.sort((a, b) => b.match_score - a.match_score);
  } else if (sortBy === "name") {
    filteredApps.sort((a, b) =>
      a.candidate_name.localeCompare(b.candidate_name)
    );
  }

  // Status update logic
  const handleOpenStatusDialog = (appId, currentStatus) => {
    setStatusDialog({
      open: true,
      appId,
      currentStatus,
      newStatus: currentStatus,
    });
    setStatusError("");
    setStatusSuccess("");
  };
  const handleCloseStatusDialog = () => {
    setStatusDialog({
      open: false,
      appId: null,
      currentStatus: "",
      newStatus: "",
    });
    setStatusError("");
    setStatusSuccess("");
  };
  const handleStatusChange = (e) => {
    setStatusDialog((prev) => ({ ...prev, newStatus: e.target.value }));
  };
  const handleStatusUpdate = async () => {
    setStatusLoading(true);
    setStatusError("");
    setStatusSuccess("");
    try {
      const formBody = new URLSearchParams({
        status: statusDialog.newStatus,
      }).toString();

      const res = await fetch(
        `${BASE_API}applications/${statusDialog.appId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
          body: formBody,
        }
      );

      if (!res.ok) throw new Error("Failed to update status");

      setStatusSuccess("Status updated!");
      setApplications((apps) =>
        apps.map((app) =>
          app.id === statusDialog.appId
            ? { ...app, status: statusDialog.newStatus }
            : app
        )
      );
      setTimeout(handleCloseStatusDialog, 1000);
    } catch (err) {
      setStatusError(err.message || "Failed to update status");
    } finally {
      setStatusLoading(false);
    }
  };

  if (loading)
    return (
      <Box mb={4}>
        {applications.length}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          mb={3}
          alignItems={{ sm: "center" }}
        >
          <Skeleton
            variant="rectangular"
            width={180}
            height={40}
            sx={{ borderRadius: 1 }}
          />
          <Skeleton
            variant="rectangular"
            width={220}
            height={40}
            sx={{ borderRadius: 1 }}
          />
        </Stack>
        <Grid container spacing={3}>
          {[...Array(6)].map((_, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Paper
                elevation={2}
                sx={{ p: 3, borderRadius: 3, height: "100%" }}
              >
                <Stack spacing={2}>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton variant="text" width="40%" height={24} />
                  <Skeleton variant="text" width="80%" height={20} />
                  <Skeleton variant="rectangular" width="100%" height={60} />
                  <Divider sx={{ my: 1 }} />
                  <Skeleton variant="rectangular" width="100%" height={32} />
                  <Skeleton variant="rectangular" width="100%" height={32} />
                  <Skeleton variant="rectangular" width="100%" height={32} />
                  <Box mt={2} display="flex" justifyContent="flex-end">
                    <Skeleton variant="rectangular" width={100} height={36} />
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!applications.length)
    return (
      <Typography color="text.secondary" my={4}>
        No applications found.
      </Typography>
    );

  return (
    <Box mb={4}>
      <Typography variant="h5" fontWeight={700} mb={2} color="primary">
        {applications?.length == 1
          ? applications?.length + " Application"
          : applications?.length + " Applications"}
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        mb={3}
        alignItems={{ sm: "center" }}
      >
        <FormControl sx={{ minWidth: 180 }} size="small">
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="score">Highest Match Score</MenuItem>
            <MenuItem value="name">Candidate Name</MenuItem>
          </Select>
        </FormControl>
        <Autocomplete
          multiple
          options={allMatchedSkills}
          value={skillFilter}
          onChange={(_, newValue) => setSkillFilter(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Filter by Matched Skills"
              size="small"
            />
          )}
          sx={{ minWidth: 220, flex: 1 }}
        />
      </Stack>
      <Grid container spacing={3}>
        {filteredApps.map((app) => (
          <Grid item xs={12} sm={6} md={4} key={app.id}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Stack direction="column" spacing={2}>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {app.candidate_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {app.candidate_email}
                  </Typography>
                  <Typography variant="subtitle2" color="primary" mt={1}>
                    Job: {app.job_title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    <b>Status:</b> {app.status} | <b>Applied:</b>{" "}
                    {new Date(app.applied_at).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    <b>Match Score:</b> {app.match_score}%
                  </Typography>
                </Box>
                <Box mt={1}>
                  <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
                    Cover Letter:
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ whiteSpace: "pre-line" }}
                  >
                    {app.cover_letter}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Stack direction="column" spacing={1}>
                  <Box>
                    <Typography variant="subtitle2" color="success.main">
                      Matched Skills:
                    </Typography>
                    {app.matched_skills && app.matched_skills.length > 0 ? (
                      app.matched_skills.map((ms, idx) => (
                        <Chip
                          key={idx}
                          label={ms.cv_skill}
                          color="success"
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        None
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="warning.main">
                      Missing Skills:
                    </Typography>
                    {app.missing_skills && app.missing_skills.length > 0 ? (
                      app.missing_skills.map((skill, idx) => (
                        <Chip
                          key={idx}
                          label={skill}
                          color="warning"
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        None
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="info.main">
                      Extra Skills:
                    </Typography>
                    {app.extra_skills && app.extra_skills.length > 0 ? (
                      app.extra_skills.map((skill, idx) => (
                        <Chip
                          key={idx}
                          label={skill}
                          color="info"
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        None
                      </Typography>
                    )}
                  </Box>
                </Stack>
                <Box
                  mt={2}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Chip
                    label={`Status: ${app.status}`}
                    color={
                      app.status === "approved"
                        ? "success"
                        : app.status === "rejected"
                        ? "error"
                        : "warning"
                    }
                    variant="outlined"
                  />

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenStatusDialog(app.id, app.status)}
                  >
                    Update Status
                  </Button>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Dialog open={statusDialog.open} onClose={handleCloseStatusDialog}>
        <DialogTitle>Update Application Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusDialog.newStatus}
              label="Status"
              onChange={handleStatusChange}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
          {statusError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {statusError}
            </Alert>
          )}
          {statusSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {statusSuccess}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog} disabled={statusLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleStatusUpdate}
            variant="contained"
            disabled={
              statusLoading ||
              statusDialog.newStatus === statusDialog.currentStatus
            }
          >
            {statusLoading ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function CompanyDashboard() {
  const [open, setOpen] = useState(false);
  const [job, setJob] = useState(initialJob);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { token } = useAuth();

  const handleOpen = () => {
    setOpen(true);
    setError("");
    setSuccess("");
  };
  const handleClose = () => {
    setOpen(false);
    setJob(initialJob);
    setError("");
    setSuccess("");
  };
  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${BASE_API}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...job,
          salary_min: Number(job.salary_min),
          salary_max: Number(job.salary_max),
        }),
      });
      if (!res.ok) throw new Error("Failed to post job");
      setSuccess("Job posted successfully!");
      setJob(initialJob);
      setTimeout(() => setOpen(false), 1200);
    } catch (err) {
      setError(err.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContainer user="company">
      <Box mb={4}>
        <ApplicationsList />
      </Box>
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleOpen}
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 1200,
          fontWeight: 700,
        }}
      >
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Post a New Job</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                label="Title"
                name="title"
                value={job.title}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="Description"
                name="description"
                value={job.description}
                onChange={handleChange}
                required
                fullWidth
                multiline
                minRows={2}
              />
              <TextField
                label="Requirements"
                name="requirements"
                value={job.requirements}
                onChange={handleChange}
                required
                fullWidth
                multiline
                minRows={2}
              />
              <TextField
                label="Location"
                name="location"
                value={job.location}
                onChange={handleChange}
                required
                fullWidth
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Salary Min"
                  name="salary_min"
                  value={job.salary_min}
                  onChange={handleChange}
                  type="number"
                  required
                  fullWidth
                  inputProps={{ min: 0 }}
                />
                <TextField
                  label="Salary Max"
                  name="salary_max"
                  value={job.salary_max}
                  onChange={handleChange}
                  type="number"
                  required
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Stack>
              <TextField
                label="Employment Type"
                name="employment_type"
                value={job.employment_type}
                onChange={handleChange}
                required
                fullWidth
                placeholder="e.g. Full-time, Part-time, Contract"
              />
              <TextField
                label="Experience Level"
                name="experience_level"
                value={job.experience_level}
                onChange={handleChange}
                required
                fullWidth
                placeholder="e.g. Entry, Mid, Senior, Lead"
              />
              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Posting..." : "Post Job"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </AppContainer>
  );
}
