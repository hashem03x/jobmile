import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  TextField,
  Button,
  Alert,
  Stack,
  Divider,
} from "@mui/material";
import { BASE_API } from "../../utils/api";
import { useAuth } from "../context/AuthContext";

export default function JobApplyPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [success, setSuccess] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);
  useEffect(() => {
    async function fetchJob() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${BASE_API}/jobs/${id}`);
        if (!res.ok) throw new Error("Failed to fetch job details");
        const data = await res.json();
        setJob(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Placeholder for submit logic
    setApplyLoading(true);
    try {
      await fetch(`${BASE_API}/jobs/${id}/apply`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cover_letter: coverLetter }),
      });
      setSuccess("Application submitted!");
    } catch (e) {
      // handle error
    } finally {
      setApplyLoading(false);
      setError("Failed to apply for this job, please try again later!");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f4f2ee",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, sm: 4 },
          maxWidth: 600,
          width: "100%",
          borderRadius: 4,
        }}
      >
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={200}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : job ? (
          <>
            <Typography variant="h5" fontWeight={700} color="primary" mb={1}>
              Apply for: {job.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" mb={2}>
              {job.company_name} &mdash; {job.location}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" mb={2}>
              <b>Job Description:</b> {job.description}
            </Typography>
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Cover Letter"
                  name="coverLetter"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  multiline
                  minRows={5}
                  fullWidth
                  required
                  placeholder="Write your cover letter here..."
                />
                {success && <Alert severity="success">{success}</Alert>}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{ fontWeight: 700 }}
                >
                  Submit Application
                </Button>
              </Stack>
            </form>
          </>
        ) : null}
      </Paper>
    </Box>
  );
}
