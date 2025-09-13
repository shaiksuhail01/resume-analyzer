# Resume Analyzer

A web-based application that allows users to upload resumes in PDF format, analyze them for key details, and maintain a history of past uploads with options to compare resumes.

---

## 🌐 Live Demo

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge&logo=appveyor)](https://resume-analyzer-1-06qi.onrender.com)

**Click the badge above to open the fully deployed Resume Analyzer web application.**
---
## 📌 Objective  
The primary objective of this project is to design, build, and deploy a full-stack web application called **Resume Analyzer**.  
This application enables users to:  
- Upload resumes in **PDF format**.  
- Automatically extract key information.  
- Store results in a database.  
- Provide **AI-driven feedback** for improvement.  

---

## 📌 Scope  

The application consists of **two main functional areas**, represented as tabs in the UI:  

1. **Resume Analysis (Tab 1):**  
   - Upload a resume (PDF).  
   - Backend extracts structured data (contact info, skills, work experience, etc.).  
   - Stores data in PostgreSQL.  
   - Sends text to **Google Gemini LLM** for:  
     - Resume rating.  
     - Areas of improvement.  
     - Suggested skills for upskilling.  
   - Displays results in a clean UI.  

2. **Historical Viewer (Tab 2):**  
   - Shows a table of all previously uploaded resumes.  
   - Each row contains key details and a **Details** button.  
   - Opens a modal to view the **full analysis** of that resume.  

3. **Resume Comparison (Extra Feature):**  
   - Allows selecting multiple resumes.  
   - Displays **side-by-side comparisons** of skills, experiences, and ratings.  

---
## Features

- 📂 **Resume Upload**: Upload PDF resumes for instant processing.  
- 📊 **Resume Analysis**: Extracts candidate details, skills, and experiences.  
- 📜 **Past Resumes History**: View previously uploaded resumes in a clean history list.  
- 🔍 **Resume Details View**: Expand and see detailed analysis of each resume.  
- ⚖️ **Resume Comparison**: Select multiple resumes and compare side by side.  
- 🚨 **Alert Messages**: Friendly alerts for missing or invalid file uploads.  
- 🕒 **No History State**: Clean UI when no resumes have been uploaded yet.  

---

## 📁 Project Structure  

```bash
resume-analyzer/
│
├── backend/                  # Node.js + Express + PostgreSQL backend
│   ├── controllers/          # Business logic
│   ├── db/                   # PostgresSQL migration & schema
│   ├── routes/               # API routes
│   ├── services/             # PDF parsing + LLM integration
│   └── server.js             # Entry point
│
├── frontend/                 # React.js frontend
│   ├── public
|   ├── src
│   │   ├── components/       # UI Components
│   │   │   ├── ResumeUploader.js
│   │   │   ├── PastResumes.js
│   │   │   ├── FeatureShowcase.js
│   │   ├── App.js            # Root component
│   │   └── index.js          # Entry point
│   └── package.json
├── sample_data
├── screenshots
├── README.md                 # Documentation
```

---

## 🔄 Data Flow  

1. **Upload Resume**  
   - User uploads a **PDF** via frontend.  

2. **Backend Processing**  
   - API receives the file.  
   - Extracts **raw text** using `pdf-parse`.  

3. **LLM Analysis**  
   - Sends extracted text to **Google Gemini LLM**.  
   - Receives structured JSON with:  
     - Personal Details  
     - Work Experience, Education, Projects  
     - Skills (Technical + Soft Skills)  
     - AI Feedback (rating + improvement areas + upskilling suggestions).  

4. **Database Storage**  
   - JSON result is stored in **PostgreSQL**.  

5. **Frontend Display**  
   - Analysis results shown in UI.  
   - Past resumes listed in history tab.  
   - Comparison view available for selected resumes.  

---

## Tech Stack

- **Frontend**: React.js, Material-UI  
- **Backend**: Node.js, Express.js  
- **Database**: PostgreSQL  
- **API Style**: REST API
- **LLM Integration**:Google Gemini API via @google/generative-ai SDK
- **File Processing**: pdf-parse, custom resume parsing logic  
---
## How to Run Locally

1. Clone the repository:  
   ```bash
   git clone https://github.com/your-username/resume-analyzer.git
   cd resume-analyzer
   ```

2. Install dependencies:  
   ```bash
   npm install
   ```

3. Start the backend:  
   ```bash
   cd backend
   npm run dev
   ```

4. Start the frontend:  
   ```bash
   cd frontend
   npm start
   ```

---

## Future Enhancements

- ✅ AI-powered resume scoring  
- ✅ Export analysis reports (PDF/CSV)  
- ✅ Advanced search & filtering for past resumes  


