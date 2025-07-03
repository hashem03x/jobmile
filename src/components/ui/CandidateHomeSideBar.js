import {
  Avatar,
  Box,
  Typography,
  Divider,
  Stack,
  Paper,
  Skeleton,
} from "@mui/material";
import React from "react";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useUser } from "../context/UserContext";

function CandidateHomeSideBar() {
  const { userProfile: profile, userLoading: loading } = useUser();
  const fullName = profile
    ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
    : "";

  return (
    <>
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          borderRadius: "18px",
          backgroundColor: "#fff",
          p: 2,
          overflow: "hidden",
          boxShadow: "0 4px 24px 0 rgba(25, 118, 210, 0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        {/* Banner/Cover */}
        <Box
          sx={{
            width: "100%",
            height: 80,
            background: "linear-gradient(90deg, #0077b5 60%, #005983 100%)",
            mb: 0,
            textAlign: "start",
          }}
        />
        {/* Avatar */}
        <Box textAlign="start" width="100%">
          {loading || !profile ? (
            <>
              <Skeleton
                variant="circular"
                width={64}
                height={64}
                sx={{ mb: 2, mt: -6 }}
              />
              <Skeleton variant="text" width={120} height={28} sx={{ mb: 1 }} />
              <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width={80} height={20} sx={{ mb: 1 }} />
            </>
          ) : (
            <>
              <Avatar sx={{ width: 64, height: 64, mb: 2, mt: -6 , justifySelf:"center"}}>
                {profile.first_name?.[0] || profile.email?.[0] || "U"}
              </Avatar>
              <Typography variant="h6" fontWeight={700} mb={0.5} align="left">
                {fullName}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                mb={0.5}
                align="left"
                sx={{ fontWeight: 500 }}
              >
                {profile.current_title}
              </Typography>
              <Stack direction="row" alignItems="left" spacing={1} mb={0.5}>
                <BusinessIcon fontSize="small" color="action" />
                <Typography
                  textAlign="left"
                  variant="body2"
                  color="text.secondary"
                >
                  {profile.company_name || "-"}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="left" spacing={1} mb={2}>
                <LocationOnIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {profile.location}
                </Typography>
              </Stack>
            </>
          )}
        </Box>

        <Divider sx={{ width: "80%", my: 1 }} />
        {/* Stats Section */}
      </Paper>
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          borderRadius: "18px",
          backgroundColor: "#fff",
          p: 2,
          overflow: "hidden",
          boxShadow: "0 4px 24px 0 rgba(25, 118, 210, 0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "80%", mb: 2, textAlign: "start" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            mb={1}
          >
            <Stack
              width="100%"
              direction="row"
              alignItems="center"
              textAlign="left"
              spacing={1}
            >
              <VisibilityIcon fontSize="small" />
              <Typography sx={{ fontSize: "12px" }}>Profile Viewers</Typography>
            </Stack>
            <Typography>
              {loading || !profile ? <Skeleton width={20} /> : 20}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <BookmarkIcon fontSize="small" />
              <Typography sx={{ fontSize: "12px" }}>Saved Jobs</Typography>
            </Stack>
            <Typography>
              {loading || !profile ? <Skeleton width={20} /> : 30}
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </>
  );
}

export default CandidateHomeSideBar;
