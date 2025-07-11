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
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import CloseIcon from "@mui/icons-material/Close";
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

function ApplicationsList({ onAddJob }) {
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
                  <Skeleton variant="text" width="60%" height={20} />
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

  return (
    <Box mb={4}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        mb={3}
        alignItems={{ sm: "center" }}
      >
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortBy}
            label="Sort by"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="score">Match Score</MenuItem>
            <MenuItem value="name">Name</MenuItem>
          </Select>
        </FormControl>
        <Autocomplete
          multiple
          options={allMatchedSkills}
          value={skillFilter}
          onChange={(_, newValue) => setSkillFilter(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Filter by skills" />
          )}
          sx={{ minWidth: 200 }}
        />
        <Button 
          variant="contained"
          color="primary" 
          aria-label="add" 
          onClick={onAddJob}
          startIcon={<AddIcon />}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
            fontSize: '0.95rem',
            textTransform: 'none',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
              transform: 'translateY(-1px)'
            },
            '&:active': {
              transform: 'translateY(0)',
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)'
            },
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          Post New Job
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {filteredApps.map((app) => (
          <Grid item xs={12} sm={6} md={4} key={app.id}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
              <Stack spacing={2}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {app.candidate_name}
                  </Typography>
                  <Chip
                    label={`${app.match_score.toFixed(1)}%`}
                    color="success"
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Applied for: {app.job_title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {app.candidate_email}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {app.matched_skills?.slice(0, 3).map((skill, idx) => (
                    <Chip
                      key={idx}
                      label={skill.cv_skill}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                  {app.matched_skills?.length > 3 && (
                    <Chip
                      label={`+${app.matched_skills.length - 3}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleOpenStatusDialog(app.id, app.status)}
                >
                  {app.status}
                </Button>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={statusDialog.open} onClose={handleCloseStatusDialog}>
        <DialogTitle>Update Application Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
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
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [extractingSkills, setExtractingSkills] = useState(false);
  const [extractionError, setExtractionError] = useState("");
  const [extractedSkillsData, setExtractedSkillsData] = useState({
    standardized: [],
    raw: [],
  });
  const { token } = useAuth();

  const handleOpen = () => {
    setOpen(true);
    setError("");
    setSuccess("");
    setExtractedSkills([]);
    setExtractionError("");
    setExtractedSkillsData({ standardized: [], raw: [] });
  };
  const handleClose = () => {
    setOpen(false);
    setJob(initialJob);
    setError("");
    setSuccess("");
    setExtractedSkills([]);
    setExtractionError("");
    setExtractedSkillsData({ standardized: [], raw: [] });
  };
  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleExtractSkills = async () => {
    if (!job.description.trim()) {
      setExtractionError("Please enter a job description first");
      return;
    }

    setExtractingSkills(true);
    setExtractionError("");
    try {
      const response = await fetch(`${BASE_API}/extract-job-skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          job_description: job.description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to extract skills");
      }

      const data = await response.json();
      setExtractedSkillsData(data);

      // Combine standardized and raw skills
      const allSkills = [...(data.standardized || []), ...(data.raw || [])];
      setExtractedSkills(allSkills);

      // Update requirements field with extracted skills
      const skillsText = allSkills.map((skill) => `• ${skill}`).join("\n");
      setJob((prev) => ({
        ...prev,
        requirements: prev.requirements
          ? `${prev.requirements}\n\nRequired Skills:\n${skillsText}`
          : `Required Skills:\n${skillsText}`,
      }));
    } catch (err) {
      setExtractionError(err.message || "Failed to extract skills");
    } finally {
      setExtractingSkills(false);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setExtractedSkills(
      extractedSkills.filter((skill) => skill !== skillToRemove)
    );

    // Update requirements field by removing the skill
    const updatedSkills = extractedSkills.filter(
      (skill) => skill !== skillToRemove
    );
    const skillsText = updatedSkills.map((skill) => `• ${skill}`).join("\n");

    // Remove the skills section from requirements and add updated skills
    const requirementsWithoutSkills = job.requirements.replace(
      /\n\nRequired Skills:\n[\s\S]*$/,
      ""
    );
    setJob((prev) => ({
      ...prev,
      requirements:
        requirementsWithoutSkills +
        (updatedSkills.length > 0 ? `\n\nRequired Skills:\n${skillsText}` : ""),
    }));
  };

  const handleAddSkill = (newSkill) => {
    if (newSkill.trim() && !extractedSkills.includes(newSkill.trim())) {
      const updatedSkills = [...extractedSkills, newSkill.trim()];
      setExtractedSkills(updatedSkills);

      // Update requirements field
      const skillsText = updatedSkills.map((skill) => `• ${skill}`).join("\n");
      const requirementsWithoutSkills = job.requirements.replace(
        /\n\nRequired Skills:\n[\s\S]*$/,
        ""
      );
      setJob((prev) => ({
        ...prev,
        requirements:
          requirementsWithoutSkills + `\n\nRequired Skills:\n${skillsText}`,
      }));
    }
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
          skills: extractedSkills,
        }),
      });
      if (!res.ok) throw new Error("Failed to post job");
      setSuccess("Job posted successfully!");
      setJob(initialJob);
      setExtractedSkills([]);
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
        <ApplicationsList onAddJob={handleOpen} />
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
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

              <Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <TextField
                    label="Description"
                    name="description"
                    value={job.description}
                    onChange={handleChange}
                    required
                    fullWidth
                    multiline
                    minRows={3}
                  />
                  <Tooltip title="Extract skills from description">
                    <IconButton
                      onClick={handleExtractSkills}
                      disabled={extractingSkills || !job.description.trim()}
                      color="primary"
                      sx={{ alignSelf: "flex-start", mt: 1 }}
                    >
                      {extractingSkills ? (
                        <CircularProgress size={20} />
                      ) : (
                        <AutoFixHighIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
                {extractionError && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {extractionError}
                  </Alert>
                )}
                {extractingSkills && (
                  <Alert severity="info" sx={{ mt: 1 }}>
                    Extracting skills from description...
                  </Alert>
                )}
              </Box>

              {/* Extracted Skills Section */}
              {extractedSkills.length > 0 && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 600 }}
                  >
                    Extracted Skills ({extractedSkills.length}):
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}
                  >
                    {extractedSkills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        onDelete={() => handleRemoveSkill(skill)}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                  <TextField
                    label="Add custom skill"
                    size="small"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill(e.target.value);
                        e.target.value = "";
                      }
                    }}
                    sx={{ width: 200 }}
                  />
                </Box>
              )}

              <TextField
                label="Requirements"
                name="requirements"
                value={job.requirements}
                onChange={handleChange}
                required
                fullWidth
                multiline
                minRows={4}
                placeholder="Enter job requirements and responsibilities..."
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
