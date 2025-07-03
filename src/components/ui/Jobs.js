import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Drawer,
  Button,
  Skeleton,
  Stack,
  Divider,
  Chip,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  Slider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { BASE_API } from "../../utils/api";
import JobCard, { JobCardSkeleton } from "./JobCard";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import SearchIcon from "@mui/icons-material/Search";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];
const EXPERIENCE_LEVELS = [
  "Entry-Level",
  "Mid-Level",
  "Senior-Level",
  "Lead-Level",
];

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [jobDetailsLoading, setJobDetailsLoading] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [search, setSearch] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [location, setLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState([0, 100000]);
  const [salaryMinMax, setSalaryMinMax] = useState([0, 100000]);
  const { token } = useAuth();
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${BASE_API}/jobs`);
        const data = await response.json();
        setJobs(data);
        // Set salary min/max for slider
        if (data.length > 0) {
          const min = Math.min(...data.map((j) => j.salary_min || 0));
          const max = Math.max(...data.map((j) => j.salary_max || 0));
          setSalaryMinMax([min, max]);
          setSalaryRange([min, max]);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleShowDetails = (job) => {
    setSidebarOpen(true);
    setSelectedJobId(job.id);
    setJobDetails(null);
    setApplied(false);
    setJobDetailsLoading(true);
    fetch(`${BASE_API}/jobs/${job.id}`)
      .then((res) => res.json())
      .then((data) => {
        setJobDetails(data);
        setJobDetailsLoading(false);
      })
      .catch(() => setJobDetailsLoading(false));
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setSelectedJobId(null);
    setJobDetails(null);
    setApplied(false);
  };
  const navigate = useNavigate();
  const handleApply = async (jobId) => {
    navigate(`/job/${jobId}/apply`);
  };

  // Filtering logic
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.company_name.toLowerCase().includes(search.toLowerCase()) ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      (job.position &&
        job.position.toLowerCase().includes(search.toLowerCase()));
    const matchesEmployment = employmentType
      ? job.employment_type === employmentType
      : true;
    const matchesExperience = experienceLevel
      ? job.experience_level.toLowerCase() === experienceLevel
      : true;
    const matchesLocation = location
      ? job.location.toLowerCase().includes(location.toLowerCase())
      : true;
    const matchesSalary =
      job.salary_min >= salaryRange[0] && job.salary_max <= salaryRange[1];
    return (
      matchesSearch &&
      matchesEmployment &&
      matchesExperience &&
      matchesLocation &&
      matchesSalary
    );
  });

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} mb={3} color="#1976d2">
        Available Jobs
      </Typography>
      <Grid container spacing={3}>
        {/* Filters Sidebar */}
        <Grid item size={{ xs: 12, sm: 12, md: 3, lg: 3 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: "#fff",
              boxShadow: { md: 2 },
              mb: 3,
              minHeight: 320,
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={700}
              mb={2}
              color="#1976d2"
            >
              Filters
            </Typography>
            <TextField
              select
              fullWidth
              label="Employment Type"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              sx={{ mb: 2, bgcolor: "#fff", borderRadius: 2 }}
            >
              <MenuItem value="">All</MenuItem>
              {EMPLOYMENT_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Experience Level"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              sx={{ mb: 2, bgcolor: "#fff", borderRadius: 2 }}
            >
              <MenuItem value="">All</MenuItem>
              {EXPERIENCE_LEVELS.map((level) => (
                <MenuItem key={level} value={level.toLocaleLowerCase()}>
                  {level}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              sx={{ mb: 2, bgcolor: "#fff", borderRadius: 2 }}
            />
            <Box px={1}>
              <Typography variant="caption" color="text.secondary">
                Salary Range (EGP)
              </Typography>
              <Slider
                value={salaryRange}
                onChange={(_, val) => setSalaryRange(val)}
                valueLabelDisplay="auto"
                min={salaryMinMax[0]}
                max={salaryMinMax[1]}
                step={1000}
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>
        </Grid>
        {/* Main Jobs Grid */}
        <Grid item size={{ xs: 12, sm: 12, md: 9, lg: 9 }}>
          {/* Search Bar */}
          <Box mb={3}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by company, job name, or position"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                sx: { bgcolor: "#fff", borderRadius: 2, boxShadow: 1 },
              }}
            />
          </Box>
          {/* Jobs Grid */}
          <Box
            sx={{
              minHeight: 420,
              bgcolor: "#fff",
              borderRadius: 3,
              p: 2,
              boxShadow: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent:
                filteredJobs.length === 0 ? "center" : "flex-start",
              alignItems: "center",
            }}
          >
            {loading ? (
              <Grid container spacing={1} alignItems="flex-start">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Grid item key={i}>
                    <JobCardSkeleton />
                  </Grid>
                ))}
              </Grid>
            ) : filteredJobs.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8, width: "100%" }}>
                <SentimentDissatisfiedIcon
                  sx={{ fontSize: 60, color: "#bdbdbd", mb: 2 }}
                />
                <Typography
                  variant="h6"
                  color="text.secondary"
                  fontWeight={500}
                  mb={1}
                >
                  No jobs found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search or filter criteria.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2} alignItems="flex-start">
                {filteredJobs.map((job) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={job.id}>
                    <JobCard job={job} onShowDetails={handleShowDetails} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Grid>
      </Grid>

      <Drawer
        anchor="right"
        open={sidebarOpen}
        onClose={handleCloseSidebar}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 420, md: 480 },
            pb: 2,
            boxShadow: 6,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
          },
        }}
      >
        <Box
          sx={{
            p: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseSidebar}
            sx={{ position: "absolute", top: 12, right: 12, zIndex: 10 }}
          >
            <CloseIcon />
          </IconButton>
          {jobDetailsLoading || !jobDetails ? (
            <Box>
              <Skeleton
                variant="rectangular"
                width={120}
                height={32}
                sx={{ mb: 2, borderRadius: 2 }}
              />
              <Skeleton variant="text" width={200} height={32} sx={{ mb: 1 }} />
              <Skeleton variant="text" width={120} height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width={180} height={24} sx={{ mb: 2 }} />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={80}
                sx={{ mb: 2, borderRadius: 2 }}
              />
              <Skeleton
                variant="text"
                width="100%"
                height={24}
                sx={{ mb: 1 }}
              />
              <Skeleton variant="text" width="90%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" height={24} sx={{ mb: 2 }} />
              <Skeleton
                variant="rectangular"
                width={120}
                height={40}
                sx={{ borderRadius: 2 }}
              />
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" height="100%">
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <Avatar sx={{ bgcolor: "#1976d2", width: 48, height: 48 }}>
                  <BusinessIcon sx={{ color: "#fff" }} />
                </Avatar>
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight={800}
                    color="#1976d2"
                    mb={0.5}
                  >
                    {jobDetails.title}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    {jobDetails.company_name}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1} mb={2}>
                <Chip
                  icon={<LocationOnIcon />}
                  label={jobDetails.location}
                  size="small"
                />
                <Chip
                  icon={<WorkIcon />}
                  label={jobDetails.employment_type}
                  size="small"
                  color="secondary"
                />
                <Chip
                  icon={<AccessTimeIcon />}
                  label={jobDetails.experience_level}
                  size="small"
                  color="info"
                />
                <Chip
                  icon={<MonetizationOnIcon />}
                  label={`EGP ${jobDetails.salary_min} - ${jobDetails.salary_max}`}
                  size="small"
                  color="success"
                />
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Typography
                variant="subtitle2"
                fontWeight={700}
                color="text.secondary"
                mb={1}
              >
                Job Description
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: "pre-line",
                  mb: 2,
                  color: "#222",
                  fontSize: 15,
                  lineHeight: 1.7,
                }}
              >
                {jobDetails.description}
              </Typography>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                color="text.secondary"
                mb={1}
              >
                Requirements
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                mb={2}
                sx={{ fontSize: 14 }}
              >
                {jobDetails.requirements}
              </Typography>
              <Box flexGrow={1} />
              <Divider sx={{ my: 2 }} />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{
                  borderRadius: 2,
                  fontWeight: 700,
                  mt: 1,
                  py: 1.2,
                  fontSize: 18,
                  letterSpacing: 1,
                }}
                onClick={() => handleApply(jobDetails.id)}
                disabled={applyLoading || applied}
              >
                {applied
                  ? "Applied"
                  : applyLoading
                  ? "Applying..."
                  : "Apply Now"}
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </Box>
  );
}

export default Jobs;
