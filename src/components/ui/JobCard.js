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
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", sm: "90%", md: "800px" }, // Responsive max width
        mx: "auto", 
        borderRadius: 4,
        p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
        mb: { xs: 2, sm: 3 },
        boxShadow: "0 4px 24px 0 rgba(25, 118, 210, 0.08)",
        background: is_active ? "#fff" : "#f5f5f5",
        opacity: is_active ? 1 : 0.7,
        position: "relative",
        transition: "box-shadow 0.2s",
        "&:hover": {
          boxShadow: "0 8px 32px 0 rgba(25, 118, 210, 0.16)",
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} mb={1}>
        <Avatar sx={{ bgcolor: "#1976d2", width: 48, height: 48 }}>
          <BusinessIcon sx={{ color: "#fff" }} />
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight={700} color="#1976d2">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            {company_name}
          </Typography>
        </Box>
        <Box flexGrow={1} />
        {/* <Tooltip title={saved ? "Remove from saved" : "Save job"}>
          <IconButton onClick={onSave} color={saved ? "primary" : "default"}>
            {saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
        </Tooltip> */}
      </Stack>
      <Stack direction="row" spacing={1} mb={1}>
        <Chip
          icon={<LocationOnIcon />}
          label={location}
          size="small"
          sx={{ fontWeight: 600 }}
        />
        <Chip
          icon={<WorkIcon />}
          label={employment_type}
          size="small"
          color="secondary"
          sx={{ fontWeight: 600 }}
        />
        <Chip
          icon={<AccessTimeIcon />}
          label={experience_level}
          size="small"
          color="info"
          sx={{ fontWeight: 600 }}
        />
        <Chip
          icon={<MonetizationOnIcon />}
          label={`EGP ${salary_min} - ${salary_max}`}
          size="small"
          color="success"
          sx={{ fontWeight: 600 }}
        />
      </Stack>
      <Divider sx={{ my: 1 }} />
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
        {description.split("\n")[0]}
      </Typography>
      <Stack direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2, fontWeight: 700, px: 4 }}
          onClick={() => onShowDetails(job)}
          disabled={!is_active}
        >
          Show Details
        </Button>
      </Stack>
    </Paper>
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
