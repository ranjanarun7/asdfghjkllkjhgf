export const analyzeFeedbackWithGemini = async (feedback) => {
  const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(feedback)
  });

  if (!res.ok) throw new Error("AI backend failure");

  return res.json();
};
