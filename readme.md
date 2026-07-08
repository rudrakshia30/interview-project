# 🎯 AI Interview App

An AI-powered interview preparation platform that helps users practice role-based interviews, record their answers, and receive AI-generated feedback.

The app is designed to work step by step: users select a role, get interview questions, record answers, extract audio from video/audio responses, send the compressed audio to AI for analysis, and later receive a detailed performance report with weak areas, charts, and behaviour insights.

---

## 🚀 Project Status

✅ Version 1 completed: Role-based AI question generation  
🔄 Upcoming versions: Audio recording, video recording, audio extraction, Groq-based feedback, final report, charts, and behavioural analysis using OpenCV.

---

## ✨ Features

### ✅ Current Features

- Select interview role
- Select difficulty level
- Generate role-specific interview questions using AI
- Practice questions one by one
- Save interview session in local storage
- Continue session after page refresh
- Restart interview
- Choose a new role and start a fresh interview
- Clean and responsive frontend UI

---

### 🔮 Planned Features

- Record answer audio for each question
- Record answer video for each question
- Save original video for user download
- Extract compressed audio from recorded video
- Send smaller audio file to Groq for answer analysis
- Generate feedback for each answer
- Create final interview performance report
- Show weak topics and improvement areas
- Add charts and graphs for performance analysis
- Use OpenCV for behavioural analysis
- Analyze:
  - Eye contact
  - Face visibility
  - Confidence indicators
  - Nervousness indicators
  - Head movement
  - Attention level
  - Speaking behaviour

---

## 🧠 How the App Works

```text
User selects role and difficulty
        ↓
Frontend sends request to backend
        ↓
Backend sends prompt to Groq API
        ↓
Groq generates interview questions
        ↓
Frontend displays questions
        ↓
User answers each question
        ↓
User records audio/video answer
        ↓
Backend extracts compressed audio
        ↓
Audio is sent to Groq for analysis
        ↓
Groq returns feedback
        ↓
Final report is generated
        ↓
Charts and weak areas are displayed
```

---

## 🛠️ Detailed Tech Stack

### 🎨 Frontend

| Technology | Use |
|-----------|-----|
| React | Building the user interface |
| JavaScript | Frontend logic |
| HTML | Page structure |
| CSS | Styling and responsive design |
| Vite | React project setup and development server |
| Local Storage | Saving interview session without database |
| MediaRecorder API | Recording audio/video answers in browser |
| Blob API | Handling recorded media files |
| URL.createObjectURL | Creating downloadable video/audio links |
| Fetch API | Sending requests from frontend to backend |

---

### ⚙️ Backend

| Technology | Use |
|-----------|-----|
| Python | Backend programming language |
| FastAPI | Backend API framework |
| Uvicorn | Running FastAPI server |
| Pydantic | Request and response validation |
| Python-dotenv | Loading API keys from `.env` file |
| Groq SDK | Connecting backend with Groq API |
| Multipart/Form-Data | Uploading audio/video files to backend |

---

### 🤖 AI and Analysis

| Technology | Use |
|-----------|-----|
| Groq API | Generating questions and analyzing answers |
| LLaMA model through Groq | AI-based question generation and feedback |
| Speech-to-text model | Converting answer audio into text |
| Prompt Engineering | Creating structured feedback and reports |

---

### 🎙️ Audio and Video Processing

| Technology | Use |
|-----------|-----|
| MediaRecorder API | Recording answer video/audio in browser |
| FFmpeg | Extracting and compressing audio from video |
| MoviePy | Python-based video/audio processing |
| Pydub | Audio conversion and compression |
| WebM / MP4 | Video recording formats |
| WAV / MP3 / M4A | Audio formats for AI processing |
| Audio Compression | Reducing file size before sending to AI |

---

### 👁️ Behaviour Analysis

| Technology | Use |
|-----------|-----|
| OpenCV | Webcam frame processing |
| MediaPipe | Face landmark detection |
| Face Detection | Checking if face is visible |
| Eye Tracking | Estimating eye contact |
| Head Pose Estimation | Detecting head movement |
| Frame Analysis | Analyzing confidence and nervousness indicators |

---

### 📊 Reports and Dashboard

| Technology | Use |
|-----------|-----|
| Recharts | Showing charts and graphs |
| Chart.js | Alternative chart library |
| JSON | Storing structured feedback data |
| Local Storage | Saving final report locally |
| CSS Cards | Displaying score, weak areas, and feedback |

---

## 📁 Folder Structure

```text
interview/
│
├── backend/
│   │
│   ├── app/
│   │   ├── main.py
│   │   │
│   │   ├── routers/
│   │   │   ├── questions.py
│   │   │   ├── answers.py
│   │   │   └── media.py
│   │   │
│   │   ├── services/
│   │   │   ├── groq_service.py
│   │   │   ├── audio_service.py
│   │   │   ├── video_service.py
│   │   │   └── behaviour_service.py
│   │   │
│   │   └── models/
│   │       └── schemas.py
│   │
│   ├── uploads/
│   ├── processed_audio/
│   ├── .env
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── RoleSelector.jsx
│   │   │   ├── InterviewQuestions.jsx
│   │   │   ├── InterviewComplete.jsx
│   │   │   ├── AudioRecorder.jsx
│   │   │   ├── VideoRecorder.jsx
│   │   │   ├── FeedbackCard.jsx
│   │   │   └── ReportDashboard.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── App.css
│   │
│   ├── package.json
│   ├── index.html
│   └── README.md
│
├── README.md
└── .gitignore
```

---

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repository-name.git
```

```bash
cd your-repository-name
```

---

## 🖥️ Backend Setup

### 2. Go to Backend Folder

```bash
cd backend
```

### 3. Create Virtual Environment

```bash
python -m venv venv
```

### 4. Activate Virtual Environment

For Windows:

```bash
venv\Scripts\activate
```

For Mac/Linux:

```bash
source venv/bin/activate
```

### 5. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

### 6. Create `.env` File

Create a `.env` file inside the `backend` folder.

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

### 7. Run Backend Server

```bash
uvicorn app.main:app --reload
```

Backend will run on:

```text
http://127.0.0.1:8000
```

---

## 🌐 Frontend Setup

### 8. Open New Terminal and Go to Frontend Folder

```bash
cd frontend
```

### 9. Install Frontend Dependencies

```bash
npm install
```

### 10. Run Frontend

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

## 🔐 Environment Variables

The backend requires a Groq API key.

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

Do not upload the `.env` file to GitHub.

Add `.env` inside `.gitignore`:

```gitignore
.env
venv/
__pycache__/
uploads/
processed_audio/
node_modules/
dist/
```

---

## 📌 Version Roadmap

### ✅ Version 1: Question Generation

- User selects role
- User selects difficulty
- AI generates interview questions
- Questions are shown one by one
- Session is saved in local storage

---

### 🔄 Version 2: Audio Recording

- Record audio answer for each question
- Save audio temporarily
- Send audio to backend
- Prepare audio for AI analysis

---

### 🔄 Version 3: Video Recording and Audio Extraction

- Record video answer for each question
- Save original video for download
- Extract compressed audio from video
- Send smaller audio file to Groq
- Reduce upload size and processing cost

---

### 🔄 Version 4: AI Answer Feedback

- Convert answer audio to text
- Send transcript to Groq
- Get feedback for each answer
- Score answer quality
- Suggest better answer points

---

### 🔄 Version 5: Final Interview Report

- Generate complete interview summary
- Show score for each question
- Show weak topics
- Show strong topics
- Show improvement suggestions
- Display charts and graphs

---

### 🔄 Version 6: Behaviour Analysis

- Use webcam video for frame analysis
- Detect face using OpenCV
- Track eye contact
- Analyze head movement
- Estimate nervousness indicators
- Add confidence-related feedback

---

## 🎯 Main Goal

The main goal of this project is to create a complete AI interview preparation platform that helps users practice interviews in a realistic way.

Instead of only showing questions, the app will gradually support answer recording, AI feedback, performance reports, video download, and behaviour-based analysis.

---

## 📊 Future Dashboard Ideas

The final dashboard may include:

- Overall interview score
- Question-wise score
- Communication score
- Technical knowledge score
- Confidence score
- Weak topics
- Strong topics
- Suggested topics to revise
- Answer improvement tips
- Charts for performance comparison

---

## 🧪 Example Use Case

```text
Role: Frontend Developer
Difficulty: Beginner

AI generates questions like:

1. What is React?
2. What is the difference between props and state?
3. What is useState?
4. What is conditional rendering?
5. Explain the use of useEffect.

User records answers.

AI gives feedback like:

- Your answer explained the basic idea.
- You missed one important point.
- Try to give an example.
- Improve clarity and structure.
```

---

## 🧩 Why Local Storage?

This project currently uses local storage because:

- No login system is required
- No database setup is needed
- User data does not need to be stored permanently
- It keeps the project simple for initial versions
- It is easy to test and develop

---

## 📦 Important Dependencies

### Backend Dependencies

```txt
fastapi
uvicorn
python-dotenv
groq
pydantic
python-multipart
moviepy
pydub
opencv-python
mediapipe
```

---

### Frontend Dependencies

```txt
react
react-dom
vite
recharts
```

---

## 🧠 AI Feedback Plan

The AI feedback system will analyze answers based on:

- Relevance to the question
- Technical correctness
- Clarity of explanation
- Completeness of answer
- Communication quality
- Example usage
- Confidence in response
- Improvement suggestions

---

## 🎥 Video Processing Plan

The video recording feature will follow this flow:

```text
User records video answer
        ↓
Video is saved in browser
        ↓
User can download original video
        ↓
Video is uploaded to backend
        ↓
Backend extracts audio using FFmpeg/MoviePy
        ↓
Compressed audio is created
        ↓
Audio is sent to Groq
        ↓
Groq analyzes the answer
        ↓
Feedback is shown to user
```

---

## 👁️ Behaviour Analysis Plan

OpenCV will be used to analyze video frames.

Possible checks:

- Is the face visible?
- Is the user looking toward the camera?
- Is there too much head movement?
- Is the user frequently looking away?
- Is the user stable while answering?
- Are there signs of hesitation or nervousness?

This analysis will not be treated as a medical or emotional diagnosis. It will only be used as basic interview behaviour feedback.

---

## 📸 Screenshots

Add screenshots here after completing the UI.

```md
![Home Page](screenshots/home.png)
![Interview Page](screenshots/interview.png)
![Report Page](screenshots/report.png)
```

---

## 🚀 Future Improvements

- Add resume upload
- Generate questions based on resume
- Add role-specific question categories
- Add timer for each answer
- Add answer transcript
- Add downloadable PDF report
- Add better UI animations
- Add progress tracking
- Add mock interview mode
- Add retry answer option
- Add comparison between first and improved answer

---

## ⭐ Support

If you like this project, give it a star on GitHub.