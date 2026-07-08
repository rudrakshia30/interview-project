import { useState,useRef,useEffect } from "react";
import RoleSelector from "./components/RoleSelector";
import InterviewQuestions from "./components/InterviewQuestions";
import InterviewComplete from "./components/InterviewComplete";
import { generateQuestions } from "./services/api";
import "./App.css";

const STORAGE_KEY = "interview_v1_session";

function readSavedSession() {
  try {
    const savedSession = localStorage.getItem(STORAGE_KEY);

    if (!savedSession) {
      return null;
    }

    const parsedSession = JSON.parse(savedSession);

    if (!Array.isArray(parsedSession.questions) || parsedSession.questions.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return {
      ...parsedSession,
      currentQuestionIndex: parsedSession.currentQuestionIndex || 0,
      isComplete: Boolean(parsedSession.isComplete)
    };
  }

  catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function revokeRecordingUrls(recordings) {
  Object.values(recordings).forEach((recording) => {
    if (recording?.videoUrl) {
      URL.revokeObjectURL(recording.videoUrl);
    }
  });
}

function App() {
  const [session, setSession] = useState(readSavedSession);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recordings, setRecordings] = useState({});
  const recordingsRef = useRef({});

  useEffect(() => {
    return () => {
      revokeRecordingUrls(recordingsRef.current);
    };
  }, []);

  function saveSession(nextSession) {
    setSession(nextSession);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
  }

  function clearRecordings() {
    revokeRecordingUrls(recordingsRef.current);
    recordingsRef.current = {};
    setRecordings({});
  }

  function handleRecordingChange(questionIndex,nextRecording) {
    setRecordings((currentRecordings) => {
      const previousRecording = currentRecordings[questionIndex];

      if (previousRecording?.videoUrl && previousRecording.videoUrl !== nextRecording?.videoUrl) {
        URL.revokeObjectURL(previousRecording.videoUrl);
      }

      const nextRecordings = {...currentRecordings};

      if (nextRecording) {
        nextRecordings[questionIndex] = nextRecording;
      }

      else {
        delete nextRecordings[questionIndex];
      }

      recordingsRef.current = nextRecordings;
      return nextRecordings;
    });
  }

  async function handleStartInterview({ role, difficulty, questionCount }) {
    setLoading(true);
    setError("");

    try {
      const result = await generateQuestions({ role, difficulty, questionCount });

      clearRecordings();

      const newSession = {
        role: result.role,
        difficulty: result.difficulty,
        questions: result.questions,
        currentQuestionIndex: 0,
        isComplete: false,
        createdAt: new Date().toISOString()
      };

      saveSession(newSession);
    }

    catch (requestError) {
      setError(requestError.message ||"The interview could not be started.");
    }

    finally {
      setLoading(false);
    }
  }

  function handleNextQuestion() {
    if (!session) {
      return;
    }

    const lastIndex = session.questions.length - 1;
    const isLastQuestion = session.currentQuestionIndex === lastIndex;

    if (isLastQuestion) {
      saveSession({...session,isComplete: true});
      return;
    }

    saveSession({
      ...session,
      currentQuestionIndex: session.currentQuestionIndex + 1,
      isComplete: false
    });
  }

  function handleRestartInterview() {
    if (!session) {
      return;
    }

    clearRecordings();

    const restartedSession = {
      ...session,
      currentQuestionIndex: 0,
      isComplete: false
    };

    saveSession(restartedSession);
  }

  function handleChooseNewRole() {
    clearRecordings();
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
    setError("");
  }

  if (session?.isComplete) {
    return (
      <InterviewComplete
        session={session}
        recordings={recordings}
        onRestart={handleRestartInterview}
      />
    );
  }

  if (session) {
    return (
      <InterviewQuestions
        session={session}
        recordings={recordings}
        onRecordingChange={handleRecordingChange}
        onNext={handleNextQuestion}
        onRestart={handleRestartInterview}
        onChooseNewRole={handleChooseNewRole}
      />
    );
  }

  return (
    <RoleSelector
      onStartInterview={handleStartInterview}
      loading={loading}
      error={error}
    />
  );
}

export default App;