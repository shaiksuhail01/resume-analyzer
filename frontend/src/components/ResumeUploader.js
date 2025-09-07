import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
} from '@mui/material';
import { CloudUpload, Star, TipsAndUpdates } from '@mui/icons-material';

const ResumeUploader = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showInline, setShowInline] = useState(false); // 👈 new state

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Select a PDF file');
    const fd = new FormData();
    fd.append('resume', file);
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/resumes/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data.analysis);
      setShowInline(false); // initially show modal, not inline
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'success';
    if (rating >= 2) return 'warning';
    return 'error';
  };

  // ✅ Extracted reusable result UI
  const AnalysisContent = ({ data }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Basic Info */}

   <Card variant="outlined" sx={{ borderLeft: 4, borderColor: 'primary.main', bgcolor: 'grey.50' }}>
      
        <CardContent>
          <Typography variant="h6" gutterBottom>Basic Information</Typography>
          <Typography><strong>Name:</strong> {data.name}</Typography>
          <Typography><strong>Email:</strong> {data.email}</Typography>
          <Typography sx={{ mt: 1 }}><strong>Summary:</strong> {data.summary}</Typography>
        </CardContent>
      </Card>

      {/* Rating */}
      <Card variant="outlined" sx={{ borderLeft: 4, borderColor: 'warning.main' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Star color="warning" />
            <Typography variant="h6">Resume Rating</Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Chip
            label={`${data.resume_rating}/10`}
            color={getRatingColor(data.resume_rating)}
            sx={{ fontWeight: 'bold' }}
          />
        </CardContent>
      </Card>

      {/* Improvements */}
      <Card variant="outlined" sx={{ borderLeft: 4, borderColor: 'error.main' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Improvements</Typography>
          <Typography>{data.improvement_areas}</Typography>
        </CardContent>
      </Card>

      {/* Upskill Suggestions */}
      {data.upskill_suggestions?.length > 0 && (
        <Card variant="outlined" sx={{ borderLeft: 4, borderColor: 'success.main' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TipsAndUpdates color="success" />
              <Typography variant="h6">Upskill Suggestions</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {data.upskill_suggestions.map((skill, idx) => (
                <Chip key={idx} label={skill} color="primary" variant="outlined" />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );

  return (
    <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3, bgcolor: 'white' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Upload Your Resume
        </Typography>

        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
        >
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUpload />}
            sx={{ borderRadius: 2 }}
          >
            {file ? file.name : 'Select PDF'}
            <input
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Upload & Analyze'}
          </Button>
        </Box>

        {!result && (
          <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
            Upload your resume to get an instant analysis with improvement areas.
          </Alert>
        )}

        {/* Modal - show only first time */}
        <Dialog
          open={!!result && !showInline}
          onClose={() => setShowInline(true)} // 👈 switch to inline after closing
          maxWidth="md"
          fullWidth
        >
         <DialogTitle sx={{ fontWeight: 'bold', bgcolor: 'primary.light', color: 'white' }}>
            Resume Analysis Result
          </DialogTitle>
         <DialogContent dividers sx={{ bgcolor: 'grey.50' }}>

            {result && <AnalysisContent data={result} />}
          </DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
            <Button onClick={() => setShowInline(true)} variant="contained">
              Close
            </Button>
          </Box>
        </Dialog>

        {/* Inline result (after closing modal) */}
        {result && showInline && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Resume Analysis
            </Typography>
            <AnalysisContent data={result} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeUploader;
