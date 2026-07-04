import { useState } from "react";
import RoleSelector from "./components/RoleSelector";
import InterviewQuestions from "./components/InterviewQuestions";
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
      return null;
    }

    return parsedSession;
  }

  catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }

}

function App() {
  const [session, setSession] = useState(readSavedSession);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function saveSession(nextSession) {
    setSession(nextSession);
    localStorage.setItem(STORAGE_KEY,JSON.stringify(nextSession));
  }

  async function handleStartInterview({role,difficulty,questionCount}) {
    setLoading(true);
    setError("");

    try {
      const result = await generateQuestions({
        role,
        difficulty,
        questionCount
      });

      const newSession = {
        role: result.role,
        difficulty: result.difficulty,
        questions: result.questions,
        currentQuestionIndex: 0,
        createdAt: new Date().toISOString()
      };

      saveSession(newSession);
    } catch (requestError) {
      setError(
        requestError.message ||
        "The interview could not be started."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleNextQuestion() {
    if (!session) {
      return;
    }

    const lastIndex =
      session.questions.length - 1;

    const nextIndex = Math.min(
      session.currentQuestionIndex + 1,
      lastIndex
    );

    saveSession({
      ...session,
      currentQuestionIndex: nextIndex
    });
  }

  function handleRestartInterview() {
    if (!session) {
      return;
    }

    const restartedSession = {
      ...session,
      currentQuestionIndex: 0
    };

    saveSession(restartedSession);
  }

  if (session) {
    return (
      <InterviewQuestions
        session={session}
        onNext={handleNextQuestion}
        onRestart={handleRestartInterview}
      />
    );
  }


  return (
    <RoleSelector
      onStartInterview={
        handleStartInterview
      }
      loading={loading}
      error={error}
    />
  );
}


export default App;