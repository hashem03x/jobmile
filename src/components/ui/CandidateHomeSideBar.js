import {
  Avatar,
  Box,
  Typography,
  Divider,
  Stack,
  Paper,
  Skeleton,
} from "@mui/material";
import React, { useState } from "react";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useUser } from "../context/UserContext";

function CandidateHomeSideBar() {
  const { userProfile: profile, userLoading: loading } = useUser();
  const [profileImageError, setProfileImageError] = useState(false);

  const fullName = profile
    ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
    : "";

  const convertGCSUrlToPublicUrl = (gcsUrl) => {
    if (!gcsUrl) return null;

    // Convert gs:// URL to public HTTP URL
    // Format: gs://bucket-name/path/to/file
    // Convert to: https://storage.googleapis.com/bucket-name/path/to/file
    if (gcsUrl.startsWith("gs://")) {
      const path = gcsUrl.replace("gs://", "");
      console.log(`https://storage.googleapis.com/${path}`);
      return `https://storage.googleapis.com/${path}`;
    }

    // If it's already an HTTP URL, return as is
    if (gcsUrl.startsWith("http://") || gcsUrl.startsWith("https://")) {
      return gcsUrl;
    }

    return null;
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  return (
    <>
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          borderRadius: "24px",
          backgroundColor: "#fff",
          p: 3,
          overflow: "hidden",
          boxShadow: "0 8px 32px 0 rgba(25, 118, 210, 0.12)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "16px",
          position: "relative",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 12px 40px 0 rgba(25, 118, 210, 0.16)",
          },
          ...(profile?.background_picture_path && {
            backgroundImage: `url(${convertGCSUrlToPublicUrl(
              profile.background_picture_path
            )})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)",
              zIndex: 0,
            },
          }),
        }}
      >
        {/* Banner/Cover */}
        <Box
          sx={{
            width: "100%",
            height: 100,
            background: profile?.background_picture_path
              ? "transparent"
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            mb: 0,
            textAlign: "start",
            position: "relative",
            zIndex: 1,
            borderRadius: "16px 16px 0 0",
            ...(profile?.background_picture_path && {
              background:
                "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
            }),
          }}
        />
        {/* Avatar */}
        <Box
          textAlign="start"
          width="100%"
          sx={{ position: "relative", zIndex: 1 }}
        >
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
              <Avatar
                src={
                  profileImageError
                    ? undefined
                    : convertGCSUrlToPublicUrl(profile?.profile_picture_path)
                }
                onError={() => setProfileImageError(true)}
                sx={{
                  width: 80,
                  height: 80,
                  mb: 3,
                  mt: -10,
                  justifySelf: "center",
                  border: "4px solid white",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
                  },
                }}
              >
                {getInitials(profile.first_name, profile.last_name)}
              </Avatar>
              <Typography
                variant="h6"
                fontWeight={700}
                mb={0.5}
                align="left"
                sx={{ position: "relative", zIndex: 1 }}
              >
                {fullName}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                mb={0.5}
                align="left"
                sx={{ fontWeight: 500, position: "relative", zIndex: 1 }}
              >
                {profile.current_title}
              </Typography>
              <Stack
                direction="row"
                alignItems="left"
                spacing={1}
                mb={0.5}
                sx={{ position: "relative", zIndex: 1 }}
              >
                <BusinessIcon fontSize="small" color="action" />
                <Typography
                  textAlign="left"
                  variant="body2"
                  color="text.secondary"
                >
                  {profile.company_name || "-"}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                alignItems="left"
                spacing={1}
                mb={2}
                sx={{ position: "relative", zIndex: 1 }}
              >
                <LocationOnIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {profile.location}
                </Typography>
              </Stack>
            </>
          )}
        </Box>
      </Paper>
    </>
  );
}

export default CandidateHomeSideBar;
