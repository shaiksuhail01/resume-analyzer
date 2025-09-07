const analysisService = require('../services/analysisService');
const pool = require('../db');
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { buffer, originalname } = req.file;
    const analysis = await analysisService.analyzeResume(buffer);
    const q = `INSERT INTO resumes (file_name, name, email, phone, linkedin_url, portfolio_url, summary, work_experience, education, technical_skills, soft_skills, projects, certifications, resume_rating, improvement_areas, upskill_suggestions) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`;
    const values = [
      originalname,
      analysis.name,
      analysis.email,
      analysis.phone,
      analysis.linkedin_url,
      analysis.portfolio_url,
      analysis.summary,
      JSON.stringify(analysis.work_experience || []),
      JSON.stringify(analysis.education || []),
      JSON.stringify(analysis.technical_skills || []),
      JSON.stringify(analysis.soft_skills || []),
      JSON.stringify(analysis.projects || []),
      JSON.stringify(analysis.certifications || []),
      analysis.resume_rating || null,
      analysis.improvement_areas || null,
      JSON.stringify(analysis.upskill_suggestions || [])
    ];
    const result = await pool.query(q, values);
    res.json({ analysis: analysis, dbRecord: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
exports.getAllResumes = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, file_name, name, email, resume_rating, uploaded_at FROM resumes ORDER BY uploaded_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
exports.getResumeById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query('SELECT * FROM resumes WHERE id = $1', [id]);
    if (!result.rowCount) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
