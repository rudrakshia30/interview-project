const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ||"http://127.0.0.1:8000").replace(/\/$/, "");

export async function generateQuestions({role,difficulty,questionCount}) {
  const response = await fetch(
    `${API_BASE_URL}/api/questions/generate`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        role,
        difficulty,
        question_count: questionCount
      })
    }
  );

  let data;

  try {
    data = await response.json();
  }
  catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.detail ||"Questions could not be generated.");
  }

  return data;
}

export async function processAnswerVideo({videoBlob,fileName,question,questionIndex}) {
  const formData = new FormData();

  formData.append("video",videoBlob,fileName);
  formData.append("question",question);
  formData.append("question_index",String(questionIndex));

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL|| "http://127.0.0.1:8000"}/api/video/process-answer`,
    {
      method: "POST",
      body: formData
    }
  );

  let result;

  try {
    
    result = await response.json();
  }

  catch {
    result = {};
  }

  if (!response.ok) {
    throw new Error(result.detail|| "The video could not be processed.");
  }

  return result;
}