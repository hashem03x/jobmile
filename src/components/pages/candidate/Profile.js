import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  Button,
  Skeleton,
  Alert,
  Divider,
  TextField,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  Email,
  Phone,
  LocationOn,
  Work,
  Business,
  CalendarToday,
  Edit,
  Save,
  Cancel,
  Verified,
  TrendingUp,
  Description,
  CloudUpload,
  Download,
} from "@mui/icons-material";
import { useUser } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";
import { BASE_API } from "../../../utils/api";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { userProfile: profile, userLoading: loading } = useUser();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [uploadingPictures, setUploadingPictures] = useState(false);
  const [pictureUploadError, setPictureUploadError] = useState("");
  const [pictureUploadSuccess, setPictureUploadSuccess] = useState("");
  const [profileImageError, setProfileImageError] = useState(false);
  const fileInputRef = useRef();
  const profilePictureInputRef = useRef();
  const backgroundPictureInputRef = useRef();

  useEffect(() => {
    if (profile) {
      setEditData(profile);
      setProfileImageError(false); // Reset image error when profile changes
    }
  }, [profile]);

  const handleEdit = () => {
    setEditMode(true);
    setEditData({ ...profile });
    setSaveError("");
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditData({ ...profile });
    setSaveError("");
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      setSaveError("");

      const response = await fetch(`${BASE_API}/profile/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedData = await response.json();

      setEditMode(false);
      window.location.reload(); // Temporary solution to refresh data
    } catch (err) {
      setSaveError(err.message || "Failed to update profile");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

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
      window.location.reload(); // Refresh to show updated skills
    } catch (err) {
      setUploadError(err.message || "Failed to upload CV");
    } finally {
      setUploading(false);
    }
  };

  const handlePictureUpload = async (e, pictureType) => {
    setPictureUploadError("");
    setPictureUploadSuccess("");
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setPictureUploadError("Only image files are allowed.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setPictureUploadError("File size must be less than 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append(pictureType, file);

    setUploadingPictures(true);
    try {
      const response = await fetch(`${BASE_API}/profile/upload-pictures`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to upload ${pictureType}`);
      }

      const data = await response.json();
      console.log(`${pictureType} upload successful:`, data);
      setPictureUploadSuccess(
        `${
          pictureType === "profile_picture"
            ? "Profile picture"
            : "Background picture"
        } uploaded successfully!`
      );

      // Refresh the page to show updated pictures
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error(`Failed to upload ${pictureType}:`, err);
      setPictureUploadError(err.message || `Failed to upload ${pictureType}`);
    } finally {
      setUploadingPictures(false);
    }
  };

  const downloadCV = async () => {
    try {
      console.log("Initiating CV download...");

      const response = await fetch(`${BASE_API}download-cv`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response status:", response.status);
      console.log("Response status text:", response.statusText);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Download failed with status:", response.status);
        console.error("Error response:", errorData);

        let errorMessage = "Failed to download CV.";

        switch (response.status) {
          case 401:
            errorMessage = "Unauthorized. Please log in again.";
            break;
          case 403:
            errorMessage =
              "Access denied. You don't have permission to download this CV.";
            break;
          case 404:
            errorMessage = "CV not found. Please upload a CV first.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = `Download failed (Status: ${response.status}). Please try again.`;
        }

        alert(errorMessage);
        return;
      }

      const data = await response.json();
      console.log("Download successful. Response data:", data);

      // Check if the response contains file data or download URL
      if (data.download_url) {
        console.log("Download URL received:", data.download_url);
        // Handle file download if URL is provided
        window.open(data.download_url, "_blank");
      } else if (data.message) {
        console.log("Success message:", data.message);
        alert(data.message || "CV downloaded successfully!");
      } else {
        console.log("Download completed successfully");
        alert("CV downloaded successfully!");
      }
    } catch (error) {
      console.error("Network or parsing error during CV download:", error);
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      alert("Network error. Please check your connection and try again.");
    }
  };

  if (loading) {
    return (
      <Box p={{ xs: 2, sm: 3 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          mb={4}
          color="#1976d2"
          sx={{ fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
        >
          Candidate Profile
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={12} md={10}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                borderRadius: 3,
              }}
            >
              <Stack spacing={3}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "center", sm: "flex-start" },
                    gap: 2,
                  }}
                >
                  <Skeleton
                    variant="circular"
                    width={{ xs: 80, sm: 100 }}
                    height={{ xs: 80, sm: 100 }}
                  />
                  <Box sx={{ flex: 1, width: "100%" }}>
                    <Skeleton variant="text" width="60%" height={40} />
                    <Skeleton variant="text" width="40%" height={24} />
                  </Box>
                </Box>
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="text" width="90%" height={20} />
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={2}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
              }}
            >
              <Skeleton variant="text" width="50%" height={32} />
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="80%" height={20} />
              <Skeleton variant="text" width="60%" height={20} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box p={{ xs: 2, sm: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load profile data
        </Alert>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
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
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: { xs: 2, sm: 0 },
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          color="#1976d2"
          sx={{ fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
        >
          Candidate Profile
        </Typography>
        {!editMode ? (
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={handleEdit}
            sx={{
              borderRadius: 2,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Edit Profile
          </Button>
        ) : (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={handleCancel}
              disabled={saveLoading}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={
                saveLoading ? <CircularProgress size={20} /> : <Save />
              }
              onClick={handleSave}
              disabled={saveLoading}
              sx={{ borderRadius: 2 }}
            >
              {saveLoading ? "Saving..." : "Save Changes"}
            </Button>
          </Stack>
        )}
      </Box>

      {saveError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {saveError}
        </Alert>
      )}

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Main Profile Card */}
        <Grid item xs={12} md={10}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 3,
              height: "fit-content",
              position: "relative",
              overflow: "hidden",
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
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  zIndex: 0,
                },
              }),
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "center", sm: "flex-start" },
                gap: { xs: 2, sm: 3 },
                mb: 4,
                textAlign: { xs: "center", sm: "left" },
                position: "relative",
                zIndex: 1,
              }}
            >
              <Avatar
                src={
                  profileImageError
                    ? undefined
                    : convertGCSUrlToPublicUrl(profile?.profile_picture_path)
                }
                onError={() => setProfileImageError(true)}
                sx={{
                  width: { xs: 80, sm: 100 },
                  height: { xs: 80, sm: 100 },
                  bgcolor: "#1976d2",
                  fontSize: { xs: "1.5rem", sm: "2rem" },
                  fontWeight: "bold",
                  boxShadow: "0 4px 20px rgba(25, 118, 210, 0.3)",
                  border: "3px solid white",
                }}
              >
                {getInitials(profile.first_name, profile.last_name)}
              </Avatar>
              <Box sx={{ flex: 1, width: "100%" }}>
                {editMode ? (
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={editData.first_name || ""}
                      onChange={(e) =>
                        handleInputChange("first_name", e.target.value)
                      }
                    />
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={editData.last_name || ""}
                      onChange={(e) =>
                        handleInputChange("last_name", e.target.value)
                      }
                    />
                    <TextField
                      fullWidth
                      label="Current Title"
                      value={editData.current_title || ""}
                      onChange={(e) =>
                        handleInputChange("current_title", e.target.value)
                      }
                    />
                  </Stack>
                ) : (
                  <>
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      color="#1976d2"
                      gutterBottom
                    >
                      {`${profile.first_name || ""} ${
                        profile.last_name || ""
                      }`.trim() || "Candidate"}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {profile.current_title || "Professional"}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>

            {/* Picture Upload Section */}
            {editMode && (
              <Box sx={{ mb: 3, position: "relative", zIndex: 1 }}>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  mb={2}
                  color="#1976d2"
                >
                  Profile Pictures
                </Typography>

                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Profile Picture
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={
                        uploadingPictures ? (
                          <CircularProgress size={20} />
                        ) : (
                          <CloudUpload />
                        )
                      }
                      onClick={() => profilePictureInputRef.current?.click()}
                      disabled={uploadingPictures}
                      sx={{ borderRadius: 2, mb: 1 }}
                    >
                      {uploadingPictures
                        ? "Uploading..."
                        : "Upload Profile Picture"}
                    </Button>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Recommended: Square image, max 5MB
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Background Picture
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={
                        uploadingPictures ? (
                          <CircularProgress size={20} />
                        ) : (
                          <CloudUpload />
                        )
                      }
                      onClick={() => backgroundPictureInputRef.current?.click()}
                      disabled={uploadingPictures}
                      sx={{ borderRadius: 2, mb: 1 }}
                    >
                      {uploadingPictures
                        ? "Uploading..."
                        : "Upload Background Picture"}
                    </Button>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Recommended: Landscape image, max 5MB
                    </Typography>
                  </Box>

                  {pictureUploadError && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {pictureUploadError}
                    </Alert>
                  )}
                  {pictureUploadSuccess && (
                    <Alert severity="success" sx={{ mt: 1 }}>
                      {pictureUploadSuccess}
                    </Alert>
                  )}
                </Stack>

                {/* Hidden file inputs */}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={profilePictureInputRef}
                  onChange={(e) => handlePictureUpload(e, "profile_picture")}
                />
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={backgroundPictureInputRef}
                  onChange={(e) => handlePictureUpload(e, "background_picture")}
                />
              </Box>
            )}

            <Divider sx={{ my: 3, position: "relative", zIndex: 1 }} />

            {/* Candidate Details */}
            <Grid
              container
              spacing={{ xs: 2, sm: 3 }}
              sx={{ position: "relative", zIndex: 1 }}
            >
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: { xs: 1, sm: 2 },
                    mb: 2,
                  }}
                >
                  <Email color="primary" sx={{ mt: { xs: 0.5, sm: 0 } }} />
                  <Box sx={{ flex: 1, width: "100%" }}>
                    <Typography variant="caption" color="text.secondary">
                      Email Address
                    </Typography>
                    {editMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={editData.email || ""}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    ) : (
                      <Typography variant="body2" fontWeight={500}>
                        {profile.email}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: { xs: 1, sm: 2 },
                    mb: 2,
                  }}
                >
                  <Phone color="primary" sx={{ mt: { xs: 0.5, sm: 0 } }} />
                  <Box sx={{ flex: 1, width: "100%" }}>
                    <Typography variant="caption" color="text.secondary">
                      Phone Number
                    </Typography>
                    {editMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={editData.phone || ""}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                    ) : (
                      <Typography variant="body2" fontWeight={500}>
                        {profile.phone || "Not provided"}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: { xs: 1, sm: 2 },
                    mb: 2,
                  }}
                >
                  <LocationOn color="primary" sx={{ mt: { xs: 0.5, sm: 0 } }} />
                  <Box sx={{ flex: 1, width: "100%" }}>
                    <Typography variant="caption" color="text.secondary">
                      Location
                    </Typography>
                    {editMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={editData.location || ""}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                      />
                    ) : (
                      <Typography variant="body2" fontWeight={500}>
                        {profile.location || "Not specified"}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: { xs: 1, sm: 2 },
                    mb: 2,
                  }}
                >
                  <Work color="primary" sx={{ mt: { xs: 0.5, sm: 0 } }} />
                  <Box sx={{ flex: 1, width: "100%" }}>
                    <Typography variant="caption" color="text.secondary">
                      Current Company
                    </Typography>
                    {editMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={editData.company_name || ""}
                        onChange={(e) =>
                          handleInputChange("company_name", e.target.value)
                        }
                      />
                    ) : (
                      <Typography variant="body2" fontWeight={500}>
                        {profile.company_name || "Not specified"}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: { xs: 1, sm: 2 },
                    mb: 2,
                  }}
                >
                  <Business color="primary" sx={{ mt: { xs: 0.5, sm: 0 } }} />
                  <Box sx={{ flex: 1, width: "100%" }}>
                    <Typography variant="caption" color="text.secondary">
                      Years of Experience
                    </Typography>
                    {editMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        value={editData.years_experience || ""}
                        onChange={(e) =>
                          handleInputChange("years_experience", e.target.value)
                        }
                      />
                    ) : (
                      <Typography variant="body2" fontWeight={500}>
                        {profile.years_experience || 0} years
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Skills Section */}
            {profile?.extracted_skills && (
              <>
                <Divider sx={{ my: 3, position: "relative", zIndex: 1 }} />
                <Typography
                  variant="h6"
                  fontWeight={600}
                  mb={2}
                  color="#1976d2"
                  sx={{ position: "relative", zIndex: 1 }}
                >
                  Skills
                </Typography>
                {profile.extracted_skills.standardized?.length > 0 && (
                  <Box mb={2} sx={{ position: "relative", zIndex: 1 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      mb={1}
                    >
                      Standardized Skills:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {profile.extracted_skills.standardized.map(
                        (skill, idx) => (
                          <Chip
                            key={`std-${idx}`}
                            label={skill}
                            color="success"
                            variant="outlined"
                            size="small"
                          />
                        )
                      )}
                    </Box>
                  </Box>
                )}
                {profile.extracted_skills.raw?.length > 0 && (
                  <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      mb={1}
                    >
                      Raw Skills:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {profile.extracted_skills.raw.map((skill, idx) => (
                        <Chip
                          key={`raw-${idx}`}
                          label={skill}
                          color="info"
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </>
            )}

            {/* CV Upload Section */}
            <Divider sx={{ my: 3, position: "relative", zIndex: 1 }} />
            <Typography
              variant="h6"
              fontWeight={600}
              mb={2}
              color="#1976d2"
              sx={{ position: "relative", zIndex: 1 }}
            >
              CV Management
            </Typography>

            <Stack spacing={2} sx={{ position: "relative", zIndex: 1 }}>
              {profile?.cv_file_path && (
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => downloadCV()}
                  rel="noopener noreferrer"
                  sx={{ borderRadius: 2 }}
                >
                  Download Current CV
                </Button>
              )}

              <input
                type="file"
                accept="application/pdf"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleCVUpload}
              />
              <Button
                variant="contained"
                startIcon={
                  uploading ? <CircularProgress size={20} /> : <CloudUpload />
                }
                onClick={() =>
                  fileInputRef.current && fileInputRef.current.click()
                }
                disabled={uploading}
                sx={{ borderRadius: 2 }}
              >
                {uploading ? "Uploading..." : "Upload New CV (PDF)"}
              </Button>

              {uploadError && <Alert severity="error">{uploadError}</Alert>}
              {uploadSuccess && (
                <Alert severity="success">{uploadSuccess}</Alert>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Sidebar Stats */}
        <Grid item xs={12} md={2}>
          <Stack spacing={{ xs: 2, sm: 3 }}>
            {/* Candidate Stats */}
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                mb={3}
                color="#1976d2"
                sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
              >
                Profile Information
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "row", sm: "row" },
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                }}
              >
                <CalendarToday color="primary" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Member Since
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                  >
                    {formatDate(profile.created_at)}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Quick Actions */}
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                mb={3}
                color="#1976d2"
                sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
              >
                Quick Actions
              </Typography>

              <Stack spacing={2}>
                <Button
                  onClick={() => navigate("/candidate/jobs")}
                  variant="outlined"
                  fullWidth
                  startIcon={<Description />}
                  sx={{
                    borderRadius: 2,
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                    py: { xs: 1, sm: 1.5 },
                  }}
                >
                  View Jobs
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<TrendingUp />}
                  onClick={() => navigate("/candidate/applications")}
                  sx={{
                    borderRadius: 2,
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                    py: { xs: 1, sm: 1.5 },
                  }}
                >
                  View Applications
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Profile;
