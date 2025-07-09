import React, { useEffect, useState } from "react";
import { BASE_API } from "../../../utils/api";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Skeleton,
  Alert,
  IconButton,
  Tooltip,
  Divider,
  Paper,
  Modal,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  CircularProgress,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Fab,
} from "@mui/material";
import {
  Work as WorkIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Close as CloseIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { Container } from "react-bootstrap";

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

function CompanyStats() {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [candidatesError, setCandidatesError] = useState(null);

  // Add Job Modal State
  const [addJobOpen, setAddJobOpen] = useState(false);
  const [job, setJob] = useState(initialJob);
  const [jobLoading, setJobLoading] = useState(false);
  const [jobError, setJobError] = useState("");
  const [jobSuccess, setJobSuccess] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${BASE_API}/company/jobs`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError("Failed to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token]);

  const fetchTopCandidates = async (jobId) => {
    try {
      setCandidatesLoading(true);
      setCandidatesError(null);
      const response = await fetch(`${BASE_API}/jobs/${jobId}/top-candidates`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch candidates");
      }
      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setCandidatesError("Failed to load candidates. Please try again.");
    } finally {
      setCandidatesLoading(false);
    }
  };

  const handleShowMore = (job) => {
    setSelectedJob(job);
    setModalOpen(true);
    fetchTopCandidates(job.id);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedJob(null);
    setCandidates([]);
    setCandidatesError(null);
  };

  // Add Job Modal Handlers
  const handleAddJobOpen = () => {
    setAddJobOpen(true);
    setJobError("");
    setJobSuccess("");
  };

  const handleAddJobClose = () => {
    setAddJobOpen(false);
    setJob(initialJob);
    setJobError("");
    setJobSuccess("");
  };

  const handleJobChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setJobLoading(true);
    setJobError("");
    setJobSuccess("");
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
      setJobSuccess("Job posted successfully!");
      setJob(initialJob);

      // Refresh jobs list
      const refreshResponse = await fetch(`${BASE_API}/company/jobs`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        setJobs(refreshData);
      }

      setTimeout(() => setAddJobOpen(false), 1200);
    } catch (err) {
      setJobError(err.message || "Failed to post job");
    } finally {
      setJobLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "paused":
        return "warning";
      case "closed":
        return "error";
      default:
        return "default";
    }
  };

  const formatSalary = (min, max) => {
    if (min && max) {
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    } else if (min) {
      return `$${min.toLocaleString()}+`;
    } else if (max) {
      return `Up to $${max.toLocaleString()}`;
    }
    return "Salary not specified";
  };

  const JobCardSkeleton = () => (
    <Card sx={{ mb: 2, p: 2 }}>
      <CardContent>
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Skeleton variant="rectangular" width={80} height={32} />
          <Skeleton variant="rectangular" width={80} height={32} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Skeleton variant="text" width="30%" height={20} />
          <Skeleton variant="text" width="20%" height={20} />
        </Box>
      </CardContent>
    </Card>
  );

  const JobCard = ({ job }) => (
    <Card
      sx={{
        mb: 2,
        p: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        },
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "primary.main", mb: 1 }}
            >
              {job.title}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <BusinessIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {job.company_name || "Your Company"}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={job.is_active ? "Active" : "Inactive"}
            color={job.is_active ? "success" : "error"}
            size="small"
            sx={{ fontWeight: 500 }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <LocationIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              {job.location || "Remote"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <MoneyIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              {formatSalary(job.salary_min, job.salary_max)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
          <Chip label={job.employment_type} size="small" variant="outlined" />
          <Chip label={job.experience_level} size="small" variant="outlined" />
          <Chip
            label={`${job.application_count} applications`}
            size="small"
            color="primary"
            variant="filled"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {job.description?.substring(0, 150)}...
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ScheduleIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                Posted {formatDate(job.created_at)}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleShowMore(job)}
              sx={{ textTransform: "none" }}
            >
              Top Candidates
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const CandidateModal = () => (
    <Modal
      open={modalOpen}
      onClose={handleCloseModal}
      aria-labelledby="candidates-modal-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        sx={{
          width: "90%",
          maxWidth: 900,
          maxHeight: "90vh",
          overflow: "auto",
          p: 3,
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              Top Candidates for {selectedJob?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedJob?.company_name} • {selectedJob?.location}
            </Typography>
          </Box>
          <IconButton onClick={handleCloseModal} size="large">
            <CloseIcon />
          </IconButton>
        </Box>

        {candidatesLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : candidatesError ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {candidatesError}
          </Alert>
        ) : candidates.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <PersonIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No candidates yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Candidates will appear here as they apply to your job posting
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {candidates.map((candidate, index) => (
              <ListItem
                key={candidate.id || index}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  mb: 2,
                  p: 2,
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    {candidate.candidate_name?.[0] ||
                      candidate.candidate_email?.[0] ||
                      "C"}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {candidate.candidate_name}
                      </Typography>
                      {candidate.match_score && (
                        <Chip
                          label={`${candidate.match_score.toFixed(1)}% match`}
                          color="success"
                          size="small"
                          icon={<StarIcon />}
                        />
                      )}
                      <Chip
                        label={candidate.status}
                        color={
                          candidate.status === "approved" ? "success" : "error"
                        }
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Applied for: {candidate.job_title}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <EmailIcon sx={{ fontSize: 16 }} />
                          <Typography variant="body2">
                            {candidate.candidate_email}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <ScheduleIcon sx={{ fontSize: 16 }} />
                          <Typography variant="body2">
                            Applied {formatDate(candidate.applied_at)}
                          </Typography>
                        </Box>
                      </Box>

                      {candidate.cover_letter && (
                        <Box sx={{ mb: 2 }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 500, mb: 0.5 }}
                          >
                            Cover Letter:
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontStyle: "italic" }}
                          >
                            "{candidate.cover_letter}"
                          </Typography>
                        </Box>
                      )}

                      {/* Matched Skills */}
                      {candidate.matched_skills &&
                        candidate.matched_skills.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500, mb: 1 }}
                            >
                              Matched Skills ({candidate.matched_skills.length}
                              ):
                            </Typography>
                            <Box
                              sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
                            >
                              {candidate.matched_skills
                                .slice(0, 6)
                                .map((skill, idx) => (
                                  <Tooltip
                                    key={idx}
                                    title={`${skill.cv_skill} → ${
                                      skill.job_skill
                                    } (${(skill.similarity * 100).toFixed(
                                      1
                                    )}% match)`}
                                  >
                                    <Chip
                                      label={`${skill.cv_skill} (${(
                                        skill.similarity * 100
                                      ).toFixed(0)}%)`}
                                      size="small"
                                      color="success"
                                      variant="outlined"
                                      sx={{ fontSize: "0.75rem" }}
                                    />
                                  </Tooltip>
                                ))}
                              {candidate.matched_skills.length > 6 && (
                                <Chip
                                  label={`+${
                                    candidate.matched_skills.length - 6
                                  } more`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: "0.75rem" }}
                                />
                              )}
                            </Box>
                          </Box>
                        )}

                      {/* Missing Skills */}
                      {candidate.missing_skills &&
                        candidate.missing_skills.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                mb: 1,
                                color: "error.main",
                              }}
                            >
                              Missing Skills ({candidate.missing_skills.length}
                              ):
                            </Typography>
                            <Box
                              sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
                            >
                              {candidate.missing_skills.map((skill, idx) => (
                                <Chip
                                  key={idx}
                                  label={skill}
                                  size="small"
                                  color="error"
                                  variant="outlined"
                                  sx={{ fontSize: "0.75rem" }}
                                />
                              ))}
                            </Box>
                          </Box>
                        )}

                      {/* Extra Skills */}
                      {candidate.extra_skills &&
                        candidate.extra_skills.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                mb: 1,
                                color: "info.main",
                              }}
                            >
                              Additional Skills ({candidate.extra_skills.length}
                              ):
                            </Typography>
                            <Box
                              sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
                            >
                              {candidate.extra_skills
                                .slice(0, 4)
                                .map((skill, idx) => (
                                  <Chip
                                    key={idx}
                                    label={skill}
                                    size="small"
                                    color="info"
                                    variant="outlined"
                                    sx={{ fontSize: "0.75rem" }}
                                  />
                                ))}
                              {candidate.extra_skills.length > 4 && (
                                <Chip
                                  label={`+${
                                    candidate.extra_skills.length - 4
                                  } more`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: "0.75rem" }}
                                />
                              )}
                            </Box>
                          </Box>
                        )}
                    </Box>
                  }
                />
                <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
                  <a
                    href={`mailto:${candidate.candidate_email}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ textTransform: "none" }}
                      startIcon={<EmailIcon />}
                    >
                      Contact
                    </Button>
                  </a>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Modal>
  );

  return (
    <Container>
      <Box sx={{ py: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "primary.main", mb: 1 }}
            >
              Company Statistics
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and monitor your posted job opportunities
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddJobOpen}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Post New Job
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Stats Cards */}
          <Grid item xs={12} md={3}>
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
              }}
            >
              <WorkIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {loading ? <Skeleton width="60%" /> : jobs.length}
              </Typography>
              <Typography variant="body2">Total Jobs Posted</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                background: "white",
                color: "black",
              }}
            >
              <ScheduleIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {loading ? (
                  <Skeleton width="60%" />
                ) : (
                  jobs.filter((job) => job.is_active).length
                )}
              </Typography>
              <Typography variant="body2">Active Jobs</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                background: "white",
                color: "black",
              }}
            >
              <BusinessIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {loading ? (
                  <Skeleton width="60%" />
                ) : (
                  jobs.filter((job) => !job.is_active).length
                )}
              </Typography>
              <Typography variant="body2">Inactive Jobs</Typography>
            </Paper>
          </Grid>

          {/* Jobs List */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Posted Jobs
                </Typography>
                <Chip
                  label={`${jobs.length} total`}
                  color="primary"
                  size="small"
                />
              </Box>

              {loading ? (
                <Box>
                  {[1, 2, 3].map((index) => (
                    <JobCardSkeleton key={index} />
                  ))}
                </Box>
              ) : error ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              ) : jobs.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <WorkIcon
                    sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                  />
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    No jobs posted yet
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Start by posting your first job opportunity
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddJobOpen}
                  >
                    Post Your First Job
                  </Button>
                </Box>
              ) : (
                <Box>
                  {jobs.map((job, index) => (
                    <JobCard key={job.id || index} job={job} />
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <CandidateModal />

      {/* Add Job Dialog */}
      <Dialog
        open={addJobOpen}
        onClose={handleAddJobClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Post a New Job</DialogTitle>
        <form onSubmit={handleJobSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                label="Title"
                name="title"
                value={job.title}
                onChange={handleJobChange}
                required
                fullWidth
              />
              <TextField
                label="Description"
                name="description"
                value={job.description}
                onChange={handleJobChange}
                required
                fullWidth
                multiline
                minRows={2}
              />
              <TextField
                label="Requirements"
                name="requirements"
                value={job.requirements}
                onChange={handleJobChange}
                required
                fullWidth
                multiline
                minRows={2}
              />
              <TextField
                label="Location"
                name="location"
                value={job.location}
                onChange={handleJobChange}
                required
                fullWidth
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Salary Min"
                  name="salary_min"
                  value={job.salary_min}
                  onChange={handleJobChange}
                  type="number"
                  required
                  fullWidth
                  inputProps={{ min: 0 }}
                />
                <TextField
                  label="Salary Max"
                  name="salary_max"
                  value={job.salary_max}
                  onChange={handleJobChange}
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
                onChange={handleJobChange}
                required
                fullWidth
                placeholder="e.g. Full-time, Part-time, Contract"
              />
              <TextField
                label="Experience Level"
                name="experience_level"
                value={job.experience_level}
                onChange={handleJobChange}
                required
                fullWidth
                placeholder="e.g. Entry, Mid, Senior, Lead"
              />
              {jobError && <Alert severity="error">{jobError}</Alert>}
              {jobSuccess && <Alert severity="success">{jobSuccess}</Alert>}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddJobClose} disabled={jobLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={jobLoading}>
              {jobLoading ? "Posting..." : "Post Job"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}

export default CompanyStats;
