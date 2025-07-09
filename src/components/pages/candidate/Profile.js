import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Stack,
  Divider,
  Skeleton,
  Container,
  Grid,
  Button,
  Chip,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import { BASE_API } from '../../../utils/api';

function Profile() {
  const { userProfile: profile, userLoading: loading } = useUser();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const fileInputRef = useRef();
  const { token } = useAuth();
  const fullName = profile
    ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
    : "";
  const joinedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString()
    : "";

  const handleCVUpload = async (e) => {
    setUploadError("");
    setUploadSuccess("");
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setUploadError("Only PDF files are allowed.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      const res = await fetch(`${BASE_API}/upload-cv`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload CV");
      setUploadSuccess("CV uploaded successfully!");
      // Optionally, refresh profile info here
    } catch (err) {
      setUploadError(err.message || "Failed to upload CV");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        // background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          {loading || !profile ? (
            <>
              <Skeleton
                variant="circular"
                width={100}
                height={100}
                sx={{ mb: 2 }}
              />
              <Skeleton variant="text" width={200} height={36} sx={{ mb: 1 }} />
              <Skeleton variant="text" width={140} height={28} sx={{ mb: 2 }} />
            </>
          ) : (
            <>
              <Box
                sx={{
                  width: "100%",
                  background: "white",
                  padding: { xs: 2, sm: 3, md: 4 },
                  borderRadius: "16px",
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems={{ xs: "center", sm: "flex-start" }}
                  sx={{ mb: 3 }}
                >
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      fontSize: 40,
                      bgcolor: "#1976d2",
                    }}
                  >
                    {profile.first_name?.[0] || profile.email?.[0] || "U"}
                  </Avatar>
                  <Box textAlign={{ xs: "center", sm: "left" }}>
                    <Typography
                      variant="h5"
                      fontWeight={800}
                      color="black"
                      sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
                    >
                      {fullName}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      fontWeight={500}
                      color="black"
                      sx={{ fontSize: { xs: "1rem", sm: "1.2rem" } }}
                    >
                      {profile.current_title}
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ mb: 3, backgroundColor: "#f4f2ee" }} />

                <Grid container spacing={2}>
                  {/* Email */}
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <EmailIcon color="primary" />
                      {loading || !profile ? (
                        <Skeleton variant="text" width={160} height={28} />
                      ) : (
                        <Typography
                          variant="body1"
                          fontWeight={600}
                          sx={{ color: "#000" }}
                        >
                          {profile.email}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>

                  {/* Phone */}
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <PhoneIcon color="action" />
                      {loading || !profile ? (
                        <Skeleton variant="text" width={120} height={28} />
                      ) : (
                        <Typography
                          variant="body1"
                          fontWeight={600}
                          color="black"
                        >
                          {profile.phone}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>

                  {/* Location */}
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <LocationOnIcon color="action" />
                      {loading || !profile ? (
                        <Skeleton variant="text" width={120} height={28} />
                      ) : (
                        <Typography
                          variant="body1"
                          fontWeight={600}
                          color="#222"
                        >
                          {profile.location}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>

                  {/* Job Title */}
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <WorkIcon color="info" />
                      {loading || !profile ? (
                        <Skeleton variant="text" width={120} height={28} />
                      ) : (
                        <Typography
                          variant="body1"
                          fontWeight={600}
                          color="#222"
                        >
                          {profile.current_title}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>

                  {/* Experience */}
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <BusinessIcon color="secondary" />
                      {loading || !profile ? (
                        <Skeleton variant="text" width={120} height={28} />
                      ) : (
                        <Typography
                          variant="body1"
                          fontWeight={600}
                          color="#222"
                        >
                          {profile.years_experience} years experience
                        </Typography>
                      )}
                    </Stack>
                  </Grid>

                  {/* Joined Date */}
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <CalendarMonthIcon color="primary" />
                      {loading || !profile ? (
                        <Skeleton variant="text" width={120} height={28} />
                      ) : (
                        <Typography
                          variant="body1"
                          fontWeight={600}
                          color="#222"
                        >
                          Joined: {joinedDate}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>

                  {/* CV Download */}
                  {/* {profile?.cv_file_path && (
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<DownloadIcon />}
                        href={`${BASE_API}${profile.cv_file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          mt: 2,
                          fontWeight: 700,
                          textTransform: "none",
                          fontSize: { xs: "1rem", sm: "1.1rem" },
                        }}
                        fullWidth
                      >
                        Download CV
                      </Button>
                    </Grid>
                  )} */}

                  {/* Extracted Skills Section */}
                  {profile?.cv_file_path && profile?.extracted_skills && (
                    <Grid item xs={12}>
                      <Box mt={3}>
                        <Typography variant="h6" fontWeight={700} mb={1}>
                          Extracted Skills
                        </Typography>
                        {profile.extracted_skills.standardized?.length > 0 && (
                          <Box mb={1}>
                            <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                              Standardized Skills:
                            </Typography>
                            <Box display="flex" flexWrap="wrap" gap={1}>
                              {profile.extracted_skills.standardized.map((skill, idx) => (
                                <Chip key={"std-"+idx} label={skill} color="success" variant="outlined" />
                              ))}
                            </Box>
                          </Box>
                        )}
                        {profile.extracted_skills.raw?.length > 0 && (
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                              Raw Skills:
                            </Typography>
                            <Box display="flex" flexWrap="wrap" gap={1}>
                              {profile.extracted_skills.raw.map((skill, idx) => (
                                <Chip key={"raw-"+idx} label={skill} color="info" variant="outlined" />
                              ))}
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <input
                      type="file"
                      accept="application/pdf"
                      style={{ display: "none" }}
                      ref={fileInputRef}
                      onChange={handleCVUpload}
                    />
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<CloudUploadIcon />}
                      onClick={() =>
                        fileInputRef.current && fileInputRef.current.click()
                      }
                      disabled={uploading}
                      sx={{
                        mt: 2,
                        fontWeight: 700,
                        textTransform: "none",
                        fontSize: { xs: "1rem", sm: "1.1rem" },
                      }}
                      fullWidth
                    >
                      {uploading ? "Uploading..." : "Upload CV (PDF)"}
                    </Button>
                    {uploadError && (
                      <Typography color="error" mt={1}>
                        {uploadError}
                      </Typography>
                    )}
                    {uploadSuccess && (
                      <Typography color="success.main" mt={1}>
                        {uploadSuccess}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default Profile;
