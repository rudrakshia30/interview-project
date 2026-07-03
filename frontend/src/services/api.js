const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000"
).replace(/\/$/, "");

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