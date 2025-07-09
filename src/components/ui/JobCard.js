import React from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Divider,
  Avatar,
  Skeleton,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

function formatSalary(salary_min, salary_max) {
  if (
    (salary_min == null || salary_min === "") &&
    (salary_max == null || salary_max === "")
  ) {
    return "Salary: Not specified";
  }
  if (salary_min == null || salary_min === "") {
    return `EGP ${salary_max}`;
  }
  if (salary_max == null || salary_max === "") {
    return `EGP ${salary_min}`;
  }
  return `EGP ${salary_min} - ${salary_max}`;
}

function JobCard({ job, saved, onSave, onShowDetails }) {
  const {
    company_name,
    title,
    location,
    employment_type,
    experience_level,
    salary_min,
    salary_max,
    description,
    is_active,
  } = job;

  return (
    <Box>
      <Stack
        display="flex"
        direction="row"
        alignItems="center"
        spacing={2}
        mb={1.5}
      >
        <Avatar
          sx={{
            bgcolor: "#1976d2",
            width: 44,
            height: 44,
            boxShadow: "0 2px 8px #1976d233",
          }}
        >
          <BusinessIcon sx={{ color: "#fff", fontSize: 28 }} />
        </Avatar>
        <Box>
          <Typography
            variant="h6"
            fontWeight={800}
            color="#1976d2"
            sx={{ letterSpacing: 0.5 }}
          >
            {title || <span style={{ color: "#aaa" }}>Untitled Job</span>}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            {company_name || (
              <span style={{ color: "#bbb" }}>Company not specified</span>
            )}
          </Typography>
        </Box>
        <Box flexGrow={1} />
      </Stack>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.5}
        mb={1.5}
        flexWrap="wrap"
      >
        {location && (
          <Chip
            icon={<LocationOnIcon />}
            label={location}
            size="small"
            sx={{ fontWeight: 600, bgcolor: "#e3f2fd", color: "#1976d2" }}
          />
        )}
        {employment_type && (
          <Chip
            icon={<WorkIcon />}
            label={employment_type}
            size="small"
            color="secondary"
            sx={{ fontWeight: 600 }}
          />
        )}
        {experience_level && (
          <Chip
            icon={<AccessTimeIcon />}
            label={experience_level}
            size="small"
            color="info"
            sx={{ fontWeight: 600 }}
          />
        )}
        <Chip
          icon={<MonetizationOnIcon />}
          label={formatSalary(salary_min, salary_max)}
          size="small"
          color="success"
          sx={{ fontWeight: 600 }}
        />
      </Stack>
      <Divider sx={{ my: 1.5 }} />
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: 2,
          minHeight: 48,
          maxHeight: 72,
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
        }}
      >
        {description && description.trim() ? (
          description.split("\n")[0]
        ) : (
          <span style={{ color: "#bbb" }}>No description provided.</span>
        )}
      </Typography>
      <Stack direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          sx={{
            borderRadius: 2.5,
            fontWeight: 700,
            px: 4,
            boxShadow: "0 2px 8px #1976d233",
          }}
          onClick={() => onShowDetails(job)}
          disabled={!is_active}
        >
          Show Details
        </Button>
      </Stack>
    </Box>
  );
}

export function JobCardSkeleton() {
  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 4,
        p: 3,
        mb: 3,
        boxShadow: "0 4px 24px 0 rgba(25, 118, 210, 0.08)",
        background: "#fff",
        position: "relative",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} mb={1}>
        <Skeleton variant="circular" width={48} height={48} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width={120} height={28} />
          <Skeleton variant="text" width={80} height={20} />
        </Box>
        <Skeleton variant="circular" width={36} height={36} />
      </Stack>
      <Stack direction="row" spacing={1} mb={1}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            width={90}
            height={32}
            sx={{ borderRadius: 2 }}
          />
        ))}
      </Stack>
      <Divider sx={{ my: 1 }} />
      <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />
      <Stack direction="row" justifyContent="flex-end">
        <Skeleton
          variant="rectangular"
          width={120}
          height={40}
          sx={{ borderRadius: 2 }}
        />
      </Stack>
    </Paper>
  );
}

export default JobCard;
